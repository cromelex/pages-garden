---
publish: true
title: Unifi Protect with Home Assistant
created: 2026-03-10
modified: 2026-03-10
tags:
  - unifi
  - homeassistant
---
# Unifi Protect with Home Assistant

## Upgrading from Eufy
Recently I upgraded from a Eufy Doorbell and set of security cameras.
The cameras worked *fine*, but I found the doorbell notifications were quite slow, and that made it kind of pointless. These camera's couldn't really be integrated properly with Home Assistant (at least not in a useful way). 
In addition to this, there were some [concerns](https://arstechnica.com/gadgets/2023/02/ankers-eufy-admits-problems-with-unencrypted-video-access-pledges-overhaul/) with Eufy's [security](https://arstechnica.com/gadgets/2022/12/eufy-publicly-acknowledges-some-parts-of-its-no-clouds-controversy/). For this reason alone, replacing them had been on my plans, but only now did I have the opportunity to do this.

After upgrading my home network to Unifi equipment, I decided to with Unifi cameras and doorbell as well. I don't necessarily think these are the best value, but the overall feedback is that they work well and that they can easily be integrated with Home Assistant.  There's a few steps that need to be followed but yes, I can agree that they do indeed work really well with Home Assistant.

I know there are cheaper options, and [Frigate](https://github.com/blakeblackshear/frigate) can be used for detection etc with great success, but honestly, I just wanted a more straightforward solution that would just work. As much as I enjoy spending time on this *hobby*, I didn't really want to spend more time than necessary on this.

## Hardware
I decided to go with the following:
- Unifi Doorbell Lite
- Unifi G6 Turret Camera - covering my driveway/front of the house)
- Unifi G5 Turret Ultra Camera - covering the small back garden

All of these are PoE powered. I had no pre-existing cabling in most of the house, so I hired a professional to do the install. I could *probably* have managed to do it myself, but paying some money is definitely worth to avoid having to climb on a long ladder to install the cameras outside a two-storey house.

## Integrating with Home Assistant

### Initial Setup
There's a few steps that need to be followed, but the Home Assistant documentation for [Unifi Protect is quite extensive](https://www.home-assistant.io/integrations/unifiprotect/). You need to create a local user and create an API Key, but once you input that in Home Assistant, everything shows up automatically. 
To use the thumbnails and videos from the endpoints within Home Assistant, you need to retrieve the `nvr_id`. The [details on how to retrieve it](https://www.home-assistant.io/integrations/unifiprotect/#views) can be a bit confusing, but if you play a Unifi Protect video from *within* the Home Assistant Media browser you can retrieve it from the URL. 

### Notifications

#### What  I get notified about
There are 3 main things I am using notifications for:
- [[#Doorbell ringing]];
- [[#People approaching entrance]]
- [[#Backyard animal and people detection]].

#### How I get notified
As for what devices I get notifications for, I use the [Home Assistant Companion App](https://companion.home-assistant.io/) to get notifications on our Android phones; [Notifications for Android TV](https://www.home-assistant.io/integrations/nfandroidtv/) for our TV, and, recently, I have started using [QuickBars for Home Assistant](https://quickbars.app/) (the author of QuickBars recently [open-sourced the code](https://github.com/Trooped/QuickBars). It works really well, and it even supports *picture-in-picture* notifications with live camera feeds!).  
Below I share the code for my automations using all three notification methods.

##### Doorbell ringing
If the doorbell is pressed, I need to know. Thumbnail gets sent to the phones, PiP live stream is shown on the TV (if it is being used) and the speakers downstairs play a message. Straightforward enough.

> [!code]- Doorbell Ring Notification automation code
> 
> ```yaml
> alias: Doorbell Ring Notification
> description: Send notification with image when doorbell rings
> triggers:
>   - trigger: state
>     entity_id: event.doorbell_ring
>     attribute: event_id
> conditions:
>   - condition: template
>     value_template: "{{ trigger.from_state.state != 'unavailable' }}"
>   - condition: template
>     value_template: >-
>       {{ (now() - as_datetime(states('event.doorbell_ring'))).total_seconds() <
>       600 }}
> actions:
>   - action: camera.snapshot # We manually take a snapshot as using the thumbnail directly doesn't work for for Notifications for AndroidTV. It's used on the notifications below where you see "snapshot"
>     target:
>       entity_id: camera.doorbell
>     data:
>       filename: "{{ snapshot_path }}"
>   - data:
>       title: Doorbell
>       message: Someone is at the door.
>       data:
>         image: "{{ event_thumbnail }}"
>         priority: high
>         ttl: 0
>         timeout: 3600
>     action: notify.all_phones # This is a notification group with all our phones.
>   - data:
>       title: Doorbell
>       message: Someone is at the door.
>     action: notify.html5
>   - data:
>       title: Doorbell
>       message: Someone is at the door.
>       data:
>         image:
>           url: http://homeassistant.local:8123{{ snapshot_url }} # Replace with your Home Assistant URl, keep the portion in brackets
>         duration: 10
>         position: bottom-right
>         transparency: 0%
>     action: notify.sonytv # This is my SonyTV using "Notifications for Android TV"
>     enabled: false
>   - choose:
>       - conditions:
>           - condition: time
>             after: "08:00:00"
>             before: "20:00:00"
>         sequence:
>           - action: tts.cloud_say
>             metadata: {}
>             data:
>               entity_id: media_player.kitchen_display
>               message: Someone has rang the doorbell.
>           - action: tts.cloud_say
>             metadata: {}
>             data:
>               entity_id: media_player.living_room_speaker
>               message: Someone has rang the doorbell.
>   - action: script.quickbars_display_doorbell_pip # This triggers the Quickbars for Home Assistant script. The script was just created by using the blueprint available in the Quickbars guide site.
>     metadata: {}
>     data: {}
>     enabled: true
> mode: single
> variables:
>   nvr_id: ABC12345 # Use the correct NVR ID for your Unifi Protect integration
>   event_id: "{{ state_attr('event.doorbell_ring', 'event_id') }}"
>   event_thumbnail: /api/unifiprotect/thumbnail/{{ nvr_id }}/{{ event_id }}
>   snapshot_path: /config/www/tmp/doorbell_snapshot.jpg
>   snapshot_url: /local/tmp/doorbell_snapshot.jpg
> ```
> 

##### People approaching entrance
This one might be a bit less obvious. I noticed that some delivery companies would knock on the door but ignore the doorbell. [^1]

I created a line crossing trigger within the Unifi Protect app. Unfortunately, this doesn't  get exposed as a sensor to Home Assistant. You can however create a notification in Home Assistant to trigger a webhook. All it takes is creating a webhook automation trigger in Home Assistant and using that as the target. This works locally too. You can include the thumbnail and use it for the automation as well.

> [!code]- Entrance Line Crossing automation code
> ```yaml
> alias: Entrance Line Crossing
> description: ""
> triggers:
>   - trigger: webhook
>     allowed_methods:
>       - POST
>     local_only: true
>     webhook_id: "abcxyz123" # The webhoo_id generated by Home Assistant
> conditions: # If I have just gone outside, or am loading the car etc, I don't want the notification to keep triggering. So I check the state of my door sensors.
>   - condition: state
>     entity_id: binary_sensor.kitchen_door_contact
>     state:
>       - "off"
>     for:
>       hours: 0
>       minutes: 10
>       seconds: 0
>   - condition: state
>     entity_id: binary_sensor.front_door_contact
>     state:
>       - "off"
>     for:
>       hours: 0
>       minutes: 10
>       seconds: 0
> actions:
>   - action: notify.all_phones
>     data:
>       message: Someone is approaching the front door.
>       data:
>         image: "{{ event_thumbnail }}"
>         priority: high
>         ttl: 0
>         timeout: 600 # The notification auto dismisses after 10 minutes.
>       title: Entrance
>   - action: notify.html5
>     data:
>       title: Entrance
>       message: Someone is approaching the front door.
>   - action: script.quickbars_display_doorbell_thumbnail # This triggers the Quickbars for Home Assistant script. The script was just created by using the blueprint available in the Quickbars guide site.
>     data:
>       event_id: "{{ event_id }}"
>       nvr_id: "{{ nvr_id }}"
> variables:
>   nvr_id: ABC12345 # Use the correct NVR ID for your Unifi Protect integration
>   event_id: "{{ trigger.json.alarm.triggers[0].eventId }}"
>   event_thumbnail: /api/unifiprotect/thumbnail/{{ nvr_id }}/{{ event_id }}
> mode: single
> 
> ```

##### Backyard animal and people detection 
My backyard is enclosed, so if someone is detected there during the night or when we are out, that generates a notification.

Finally, if an animal is detected, I get notified. This has two main purposes.
Sometimes one of [[../misc/my cats|my cats]] escapes, and this lets me know if she is trying to get back in.  
The other scenario is where a neighbour's cat visits. [[../misc/my cats#Poppy|Poppy]] goes absolutely mental when she sees this orange cat, to the point where she ends up attacking our other cat. Having a notification with the thumbnail allows me or my partner to manage the situation before things escalate.

> [!code]- Backyard Camera Detection Notifications automation code
> 
> ```yaml
> alias: Back Camera Detection Notifications
> description: >-
>   Send notifications with snapshots for person/animal detection based on alarm
>   state
> triggers:
>   - trigger: state
>     entity_id: binary_sensor.back_animal_detected
>     from: "off"
>     to: "on"
>     id: animal
>   - trigger: state
>     entity_id: binary_sensor.back_person_detected
>     from: "off"
>     to: "on"
>     id: person
> conditions:
>   - condition: or
>     conditions:
>       - condition: and
>         conditions:
>           - condition: trigger
>             id: animal
>           - condition: state
>             entity_id: alarm_control_panel.alarmo
>             state: armed_home
>       - condition: and
>         conditions:
>           - condition: trigger
>             id: person
>           - condition: or # for person triggers, I only want them to happen if my alarm is marked as "Night" or "Away"
>             conditions:
>               - condition: state
>                 entity_id: alarm_control_panel.alarmo
>                 state: armed_night
>               - condition: state
>                 entity_id: alarm_control_panel.alarmo
>                 state: armed_away
> actions:
>   - action: camera.snapshot
>     target:
>       entity_id: camera.back
>     data:
>       filename: "{{ snapshot_path }}"
>   - choose:
>       - conditions:
>           - condition: trigger
>             id: animal
>         sequence:
>           - data:
>               title: Animal Detected
>               message: Animal detected in back garden
>               data:
>                 image: "{{ snapshot_url }}"
>                 priority: high
>                 timeout: 900
>             action: notify.all_phones
>           - data:
>               title: Animal Detected
>               message: Animal detected in back garden
>               data:
>                 image: http://homeassistant.local:8123{{ snapshot_url }} # Replace with your Home Assistant URl, keep the portion in brackets
>             action: notify.html5
>           - data:
>               title: Animal Detected
>               message: Animal detected in back garden
>               data:
>                 image:
>                   url: http://homeassistant.local:8123{{ snapshot_url }} # Replace with your Home Assistant URl, keep the portion in brackets
>                 duration: 10
>                 position: bottom-right
>                 transparency: 0%
>             action: notify.sonytv
>           - delay:
>               hours: 0
>               minutes: 30 # this delay is here so that I don't get notified more than once every 30 minutes.
>               seconds: 0
>               milliseconds: 0
>       - conditions:
>           - condition: trigger
>             id: person
>         sequence:
>           - data:
>               title: Person Detected
>               message: Person detected in back garden during the night.
>               data:
>                 image: "{{ snapshot_url }}"
>                 priority: high
>             action: notify.all_phones
>           - delay:
>               hours: 0
>               minutes: 30 # this delay is here so that I don't get notified more than once every 30 minutes.
>               seconds: 0
>               milliseconds: 0
> mode: single
> variables:
>   snapshot_path: /config/www/tmp/back_camera_snapshot.jpg
>   snapshot_url: /local/tmp/back_camera_snapshot.jpg
> 
> ```
> 


## Final Thoughts

The switch from Eufy was straightforward, and the result is a setup that genuinely does what I wanted: reliable notifications, fast enough to be useful, with proper Home Assistant integration that doesn't require workarounds or third-party hacks.

Was it cheap? No. Unifi hardware carries a premium, and adding professional installation on top makes it harder to justify purely on cost. But the reliability has been there from day one, and the integration with the rest of my Unifi network makes the whole thing feel cohesive rather than bolted together.

The automation logic is functional, but there is room to make it smarter. Right now the conditions are fairly blunt - time windows, door sensor states, alarm modes. Longer term I'd like to tighten those up, reducing false positives further without missing anything genuinely worth knowing about.

If you're already in the Unifi ecosystem and want cameras that integrate cleanly with Home Assistant without a lot of fuss, this setup is hard to argue against.

[^1]: Don't ask me why. I don't think it is a case of the *not* noticing the doorbell. The first time it happened with a damaged package, and I thought that had been intentional. However, over the last month it seems that at least one DPD driver consistently ignores the doorbell. It could be as simple as them noticing I have a toddler in the house, and not wanting to wake them up in case of a nap. I have seen neighbours with warnings on the door asking couriers *not* to ring for that reason.
