---
publish: true
title: Colour ePaper Dashboard
created: 2025-11-12
modified: 2025-12-03
tags:
  - esphome
  - homeassistant
---
# ReTerminal E1002 colour ePaper Dashboard


> [!info] Disclaimer
> Seeedstudio reached out to me on the Home Assistant community forums, on the back of some posts I did related to the [[epaper dashboard|E-paper dashboard]], and gave me the opportunity to try their new ReTerminal E1002 colour ePaper display, providing me with a free unit.  
> All the opinions shared below regarding the unit are my own. There are no affiliate links nor do I get any commission from anything. 


Seeedstudio have recently released their [ReTerminal E1002 full colour epaper](https://www.seeedstudio.com/reTerminal-E1002-p-6533.html) displays. These are a further iteration of the previous [[epaper dashboard#The seeedstudio XIAO 7.5'' ePaper panel|XIAO 7.5" ePaper panel]], featuring an upgraded enclosure, ESP32 (a S3 instead of the previous C3), and, more importantly, the new Spectra 6 7.3" full colour ePaper display. This is still epaper, meaning you can get some very decent battery duration - we're talking weeks rather than days, as you would with a traditional display.

![[attachments/colour epaper dashboard image-1434x1080.webp|The E1002 colour epaper display with a colour photo being displayed.|800]]

One downside of the colour epaper display is that it has a very long refresh time. It will take around 15 seconds for the screen to update, with some jarring flashing on the screen. The information I display on these dashboards is rather static, so I am only updating it once per hour.

The unit does have a hole for wall mounting, and 3 buttons which you can map at your will. With ESPHome, you can even use them to trigger actions on your Home Assistant instance. I have chosen to use them simply as navigation between multiple dashboard pages.

![[./attachments/colour epaper dashboard-1434x1080.webp|The E1002 colour epaper displaying an Home Assistant dashboard.|800]]

## A wall dashboard that blends in
My use case for this device is to use it as a display for a Home Assistant dashboard, showing relevant information at a glance, while integrating neatly with the existing decor. The size means it still fits inside an IKEA frame, if you prefer to wall-mount it more discreetly. ~~It does not completely fill the frame, but if you use the frame's passepartout it will mask the difference.~~ If you can align it properly, it can actually be made to fit perfectly, without gaps. 
In my case, I am using the mounting whole on the E1002, and then placed a bit of sponge on top of the unit, which holds it at the exact height. I have used the metal clips on the frame itself to provide additional hold on the sides, making sure it stays perfectly centered.

![[./attachments/colour epaper dashboard-2303x1080.webp|The Xiao 7.5" monochrome epaper on the left vs the E1002 colour epaper on the right. Both are shown inside a Ikea photo frame.|800]]

That is my case. I prefer my home *not* to look smart, and prefer for things to be automated rather than having to interact with my smart home via a dashboard. However, there are plenty of scenarios where I want to have access to information *at a glance*. That is why I like having a dashboard in the main hallway showing information such as the weather, calendar appointments, range on our EVs, or the driving time estimate to work/the next calendar appointment.
I have a [[smart photo frame]] in my kitchen, which also allows me to display and interact with Home Assistant, and the same principle applies. It shows photos until you tap the screen and that's when the dashboard is displayed. It's an entirely different kind of device, with a different purpose.

## The Puppet add-on for Home Assistant

Similarly to what I did previously with my [[epaper dashboard]], I am using the [Puppet add-on](https://github.com/balloob/home-assistant-addons/blob/main/puppet/README.md) to grab a Home Assistant screenshot with the correct resolution and colour settings, and then retrieve it with ESPHome.

Puppet was recently updated[^1] to add support for dithering and presets for displays such as this Spectra6 display, as well as adding a web UI that can be used to configure the URL with the different available options and seeing a preview. You can select the different settings and choose which dashboard to screenshot. If you are not entirely happy with the results, you can further try different dithering settings, or adding a theme.

To get the image automatically sized and adapted for the ReTerminal E1002, append `?device=seeed-reterminal-e1002` at the end of the image URL from Puppet. In this example, I pass the `&theme=Graphite+Light` as an additional argument:

```
http://homeassistant.local:10000/lovelace/0?device=seeed-reterminal-e1002&theme=Graphite+Light
```

This can also be configured via the web UI, you can select the device and it should give you a preview and the URL to copy.

## Integrating with ESPHome and Home Assistant
You can refer to the [Seeedstudio wiki](https://wiki.seeedstudio.com/reterminal_e10xx_with_esphome/#getting-started) for examples of basic configuration and different functionalities.
I have chosen to do something a bit more complex here, to really make the best use of the device.

For this example, I have set up the dashboard to load 4 different pages (`home`, `energy`, `plants` and `wallpaper`) from my `eink-e1002` dashboard. 

### Home Assistant helper and automation
I have created a `input_select` helper in Home Assistant, named `input_select.reterminal_e1002_page_selector`, with possible values `home`, `energy`, `plants` and `wallpaper`, ie matching the pages on the dashboard.
The ESPHome code will still work without it - it will just default to the `home` page, and you can then navigate through the pages using the buttons on the device.
The idea is to allow me to dynamically choose what should be displayed depending on context. 

Here is my sample automation, and what it does:
- If any plant is in state "problem", display the Plants Dashboard page;
- If time between 9.30am and 1pm, and current and forecasted solar energy production is high, display Energy Dashboard page;
- If there are any calendar.family events today (based on a helper), display Home Dashboard page;
- If nobody is home, display Wallpaper Dashboard page;
- If Battery is under 5%, send Notification;
- Else, Default, Display Wallpaper Dashboard page.

In my case, for the wallpaper dashboard page, I am using a single picture card, and using [Immich Kiosk](https://immichkiosk.app/) to generate the URL that returns photos from our personal [[../../tags/immich|Immich]] photo library.

> [!note]- Automation .yaml code
> 
> I use the "delay" as a weighting. The more important pages to display have a larger delay so that they override the less important ones.
> ```yaml
> alias: ReTerminal E1002 dashboard page selector
> description: ""
> triggers:
>   - trigger: time_pattern
>     minutes: /30
> conditions: []
> actions:
>   - choose:
>       - alias: If any plant is in state "problem", display the Plants Dashboard page
>         conditions:
>           - condition: or
>             conditions:
>               - condition: state
>                 entity_id: plant.butterfly_palm
>                 state:
>                   - problem
>               - condition: state
>                 entity_id: plant.dracaena
>                 state:
>                   - problem
>               - condition: state
>                 entity_id: plant.olive
>                 state:
>                   - problem
>               - condition: state
>                 entity_id: plant.fishbone_cactus
>                 state:
>                   - problem
>               - condition: state
>                 entity_id: plant.fishbone_cactus_kitchen
>                 state:
>                   - problem
>               - condition: state
>                 entity_id: plant.fishbone_cactus_office
>                 state:
>                   - problem
>               - condition: state
>                 entity_id: plant.mistletoe_cactus
>                 state:
>                   - problem
>               - condition: state
>                 entity_id: plant.peperomia
>                 state:
>                   - problem
>               - condition: state
>                 entity_id: plant.peperomia_santorini
>                 state:
>                   - problem
>         sequence:
>           - action: input_select.select_option
>             metadata: {}
>             data:
>               option: plants
>             target:
>               entity_id: input_select.reterminal_e1002_page_selector
>       - alias: >-
>           If time between 9.30am and 1pm, and current and forecasted solar
>           energy production is high, display Energy Dashboard page
>         conditions:
>           - condition: time
>             after: "09:30:00"
>             before: "13:00:00"
>             weekday:
>               - sat
>               - fri
>               - thu
>               - wed
>               - tue
>               - mon
>           - condition: numeric_state
>             entity_id: sensor.energy_next_hour
>             above: 1.5
>           - condition: numeric_state
>             entity_id: sensor.grid_export_power
>             above: 1500
>         sequence:
>           - delay:
>               hours: 0
>               minutes: 0
>               seconds: 1
>               milliseconds: 0
>           - action: input_select.select_option
>             metadata: {}
>             data:
>               option: energy
>             target:
>               entity_id: input_select.reterminal_e1002_page_selector
>       - conditions:
>           - condition: state
>             entity_id: sensor.next_calendar_family_event_date
>             state:
>               - "0"
>         sequence:
>           - delay:
>               hours: 0
>               minutes: 0
>               seconds: 3
>               milliseconds: 0
>           - action: input_select.select_option
>             metadata: {}
>             data:
>               option: home
>             target:
>               entity_id: input_select.reterminal_e1002_page_selector
>         alias: >-
>           If there are any calendar.family events today, display Home Dashboard
>           page
>       - alias: If nobody is home, display Wallpaper Dashboard page
>         conditions:
>           - condition: state
>             entity_id: zone.home
>             state:
>               - "0"
>         sequence:
>           - delay:
>               hours: 0
>               minutes: 0
>               seconds: 5
>               milliseconds: 0
>           - action: input_select.select_option
>             metadata: {}
>             data:
>               option: wallpaper
>             target:
>               entity_id: input_select.reterminal_e1002_page_selector
>       - alias: If Battery is under 5%, send Notification
>         conditions:
>           - condition: numeric_state
>             entity_id: sensor.e1002_battery_level
>             below: 5
>           - condition: sun
>             before: sunset
>             after: sunrise
>         sequence:
>           - action: notify.html5
>             data:
>               message: The ReTerminal E1002 battery is under 5%. Please recharge soon.
>               title: ReTerminal Low Battery
>     default:
>       - alias: Display default Wallpaper Dashboard page
>         action: input_select.select_option
>         metadata: {}
>         data:
>           option: wallpaper
>         target:
>           entity_id: input_select.reterminal_e1002_page_selector
> mode: single
> ```
> 

### ESPHome Code and functionality

- This uses the native Esphome component for the [color epaper](https://esphome.io/components/display/epaper_spi/ );
- 3 buttons on top (page navigation  back/forward + refresh / deep sleep interrupt);
- Deep sleep after 90s, for longer battery life - the device wakes up every hour, displaying the page set by `input_select.reterminal_e1002_page_selector` (or `home`, by default). It will display the `wallpaper` page during the night, with a longer deep sleep between 10pm and 6am. Using any of the buttons resets the deep_sleep timer.
- Led light on the side, stays on (green) when the device is awake.
- Battery voltage and % monitoring, reported into Home Assistant at each 90 seconds (the wake up interval)
- Temperature and humidity sensor built in, reported into Home Assistant.

I wrote *most* of this code, based on the Seeedstudio's wiki and ESPHome's documentation, but I used a LLM to assist me with the lambdas part of the code - I don't code for a living, and I can't figure that out myself.

> [!NOTE]- My ESPHome.yaml code, based on ESPHome 2025.11.X
> 
> ```yaml
>  substitutions:
>   name: e1002
>   friendly_name: "reTerminal E1002"
> 
> esphome:
>   name: ${name}
>   friendly_name: ${friendly_name}
>   on_boot:
>     - priority: 600
>       then:
>         - output.turn_on: bsp_sd_enable
>         - output.turn_on: bsp_battery_enable
>         - delay: 200ms
>         - component.update: battery_voltage
>         - component.update: battery_level
>         - light.turn_on: onboard_led
>     - priority: -100
>       then:
>         - delay: 5s
>         - script.execute: handle_wakeup
>         - script.execute: reset_sleep_timer
> 
> esp32:
>   board: seeed_xiao_esp32s3
>   framework:
>     type: esp-idf
> 
> psram:
>   mode: octal
>   speed: 80MHz
> 
> logger:
>   hardware_uart: UART0 # Required to report logs over USB
> 
> api:
>   encryption:
>     key: "your_random_encryption_key"
> 
> ota:
>   - platform: esphome
>     password: !secret ota_password
> 
> wifi:
>   ssid: !secret wifi_ssid
>   password: !secret wifi_password
> 
> deep_sleep:
>   id: deep_sleep_1
>   wakeup_pin: GPIO3
>   wakeup_pin_mode: INVERT_WAKEUP
> 
> spi:
>   clk_pin: GPIO7
>   mosi_pin: GPIO9
> i2c:
>   scl: GPIO20
>   sda: GPIO19
> 
> globals:
>   - id: page_index
>     type: int
>     restore_value: true
>     initial_value: '0'
>   - id: sleep_timer_seconds
>     type: int
>     restore_value: false
>     initial_value: '0'
> 
> sensor:
>   - platform: sht4x
>     temperature:
>       name: "Temperature"
>       id: temp_sensor
>     humidity:
>       name: "Relative Humidity"
>       id: hum_sensor
>     update_interval: 90s
>   - platform: adc
>     pin: GPIO1
>     name: "Battery Voltage"
>     id: battery_voltage
>     update_interval: 90s
>     attenuation: 12db
>     filters:
>       - multiply: 2.0
>     on_value:
>       then:
>         - component.update: battery_level
>   - platform: template
>     name: "Battery Level"
>     id: battery_level
>     unit_of_measurement: "%"
>     icon: "mdi:battery"
>     device_class: battery
>     state_class: measurement
>     lambda: 'return id(battery_voltage).state;'
>     update_interval: never
>     filters:
>       - calibrate_linear:
>           - 4.15 -> 100.0
>           - 3.96 -> 90.0
>           - 3.91 -> 80.0
>           - 3.85 -> 70.0
>           - 3.80 -> 60.0
>           - 3.75 -> 50.0
>           - 3.68 -> 40.0
>           - 3.58 -> 30.0
>           - 3.49 -> 20.0
>           - 3.41 -> 10.0
>           - 3.30 -> 5.0
>           - 3.27 -> 0.0
>       - clamp:
>           min_value: 0
>           max_value: 100
> 
> output:
>   - platform: gpio
>     pin: GPIO6
>     id: bsp_led
>     inverted: true
>   - platform: gpio
>     pin: GPIO16
>     id: bsp_sd_enable
>   - platform: gpio
>     pin: GPIO21
>     id: bsp_battery_enable
> 
> light:
>   - platform: binary
>     name: "Onboard LED"
>     output: bsp_led
>     id: onboard_led
>     internal: true
> 
> time:
>   - platform: homeassistant
>     id: homeassistant_time
>     timezone: "Europe/Dublin"
> 
> text_sensor:
>   - platform: homeassistant
>     id: ha_page_selector
>     entity_id: input_select.reterminal_e1002_page_selector
>     internal: true
>   - platform: version
>     hide_timestamp: true
>     name: "${friendly_name} ESPHome Version"
>     entity_category: diagnostic
>   - platform: wifi_info
>     ip_address:
>       name: "${friendly_name} IP Address"
>       icon: mdi:wifi
>       entity_category: diagnostic
>       id: sensorip
>     ssid:
>       name: "${friendly_name} Connected SSID"
>       icon: mdi:wifi-strength-2
>       entity_category: diagnostic
>       id: sensorssid
> 
> interval:
>   - interval: 1s
>     then:
>       - lambda: |-
>           id(sleep_timer_seconds)++;
>           if (id(sleep_timer_seconds) % 30 == 0) {
>             ESP_LOGI("sleep_timer", "Timer at %d seconds", id(sleep_timer_seconds));
>           }
>           if (id(sleep_timer_seconds) >= 90) {
>             ESP_LOGI("sleep_timer", "90 seconds elapsed, checking time and entering sleep");
>             id(check_time_and_sleep).execute();
>           }
> 
> binary_sensor:
>   - platform: gpio
>     pin:
>       number: GPIO4
>       mode: INPUT_PULLUP
>       inverted: true
>     id: right
>     name: "Right"
>     internal: true
>     on_press:
>       then:
>         - script.execute: reset_sleep_timer
>         - lambda: |-
>             id(page_index) = (id(page_index) + 1) % 4;
>         - if:
>             condition:
>               lambda: 'return id(page_index) == 0;'
>             then:
>               - component.update: dashboard_image_home
>         - if:
>             condition:
>               lambda: 'return id(page_index) == 1;'
>             then:
>               - component.update: dashboard_image_energy
>         - if:
>             condition:
>               lambda: 'return id(page_index) == 2;'
>             then:
>               - component.update: dashboard_image_plants
>         - if:
>             condition:
>               lambda: 'return id(page_index) == 3;'
>             then:
>               - component.update: dashboard_image_wallpaper
> 
>   - platform: gpio
>     pin:
>       number: GPIO5
>       mode: INPUT_PULLUP
>       inverted: true
>     id: left
>     name: "Left"
>     internal: true
>     on_press:
>       then:
>         - script.execute: reset_sleep_timer
>         - lambda: |-
>             id(page_index) = (id(page_index) - 1 + 4) % 4;
>         - if:
>             condition:
>               lambda: 'return id(page_index) == 0;'
>             then:
>               - component.update: dashboard_image_home
>         - if:
>             condition:
>               lambda: 'return id(page_index) == 1;'
>             then:
>               - component.update: dashboard_image_energy
>         - if:
>             condition:
>               lambda: 'return id(page_index) == 2;'
>             then:
>               - component.update: dashboard_image_plants
>         - if:
>             condition:
>               lambda: 'return id(page_index) == 3;'
>             then:
>               - component.update: dashboard_image_wallpaper
> 
> http_request:
>   verify_ssl: false
>   timeout: 10s
>   watchdog_timeout: 15s
> 
> script:
>   - id: reset_sleep_timer
>     mode: queued
>     then:
>       - lambda: |-
>           ESP_LOGI("sleep_timer", "Timer reset to 0");
>           id(sleep_timer_seconds) = 0;
> 
>   - id: handle_wakeup
>     mode: single
>     then:
>       - lambda: |-
>           auto wakeup_cause = esp_sleep_get_wakeup_cause();
>           ESP_LOGI("wakeup", "Wakeup cause: %d (0=undefined, 2=ext0/GPIO, 4=timer)", wakeup_cause);
> 
>           if (wakeup_cause == ESP_SLEEP_WAKEUP_EXT0) {
>             ESP_LOGI("wakeup", "GPIO3 wakeup - will refresh current page (index: %d)", id(page_index));
>           } else {
>             ESP_LOGI("wakeup", "Timer/normal boot - checking HA page selector");
> 
>             if (id(ha_page_selector).has_state()) {
>               std::string page_selection = id(ha_page_selector).state;
>               ESP_LOGI("wakeup", "HA selector value: %s", page_selection.c_str());
> 
>               if (page_selection == "home") {
>                 id(page_index) = 0;
>               } else if (page_selection == "energy") {
>                 id(page_index) = 1;
>               } else if (page_selection == "plants") {
>                 id(page_index) = 2;
>               } else if (page_selection == "wallpaper") {
>                 id(page_index) = 3;
>               } else {
>                 ESP_LOGW("wakeup", "Unknown selector value, defaulting to home");
>                 id(page_index) = 0;
>               }
>             } else {
>               ESP_LOGW("wakeup", "HA selector not available, defaulting to home");
>               id(page_index) = 0;
>             }
>           }
> 
>           ESP_LOGI("wakeup", "Page index set to: %d, will trigger update", id(page_index));
>       - delay: 200ms
>       - lambda: |-
>           ESP_LOGI("wakeup", "Executing component update for page: %d", id(page_index));
>           switch(id(page_index)) {
>             case 0:
>               ESP_LOGI("wakeup", "Updating dashboard_image_home");
>               id(dashboard_image_home).update();
>               break;
>             case 1:
>               ESP_LOGI("wakeup", "Updating dashboard_image_energy");
>               id(dashboard_image_energy).update();
>               break;
>             case 2:
>               ESP_LOGI("wakeup", "Updating dashboard_image_plants");
>               id(dashboard_image_plants).update();
>               break;
>             case 3:
>               ESP_LOGI("wakeup", "Updating dashboard_image_wallpaper");
>               id(dashboard_image_wallpaper).update();
>               break;
>             default:
>               ESP_LOGW("wakeup", "Invalid page index %d, updating home", id(page_index));
>               id(dashboard_image_home).update();
>           }
> 
>   - id: check_time_and_sleep
>     mode: single
>     then:
>       - lambda: |-
>           auto time = id(homeassistant_time).now();
>           if (!time.is_valid()) {
>             ESP_LOGW("sleep_script", "Time not available, sleeping for 30 minutes");
>             id(onboard_led).turn_off();
>             id(deep_sleep_1).set_sleep_duration(30 * 60 * 1000);
>             id(deep_sleep_1).begin_sleep();
>             return;
>           }
> 
>           int hour = time.hour;
>           int minute = time.minute;
>           ESP_LOGI("sleep_script", "Current time: %02d:%02d", hour, minute);
> 
>           if (hour >= 22 || hour < 6) {
>             ESP_LOGI("sleep_script", "Night time (22:00-06:00), switching to wallpaper page");
>             id(page_index) = 3;
>           }
>       - if:
>           condition:
>             lambda: |-
>               auto time = id(homeassistant_time).now();
>               int hour = time.hour;
>               return (hour >= 22 || hour < 6);
>           then:
>             - component.update: dashboard_image_wallpaper
>             - delay: 30s
>             - lambda: |-
>                 auto time = id(homeassistant_time).now();
>                 int hour = time.hour;
>                 int minute = time.minute;
> 
>                 int minutes_until_6am;
>                 if (hour >= 22) {
>                   minutes_until_6am = ((24 - hour) * 60 - minute) + (6 * 60);
>                 } else {
>                   minutes_until_6am = (6 - hour) * 60 - minute;
>                 }
> 
>                 ESP_LOGI("sleep_script", "Sleeping for %d minutes until 6am", minutes_until_6am);
>                 id(onboard_led).turn_off();
>                 id(deep_sleep_1).set_sleep_duration(minutes_until_6am * 60 * 1000);
>                 id(deep_sleep_1).begin_sleep();
>           else:
>             - lambda: |-
>                 ESP_LOGI("sleep_script", "Day time (06:00-22:00), sleeping for 60 minutes");
>                 id(onboard_led).turn_off();
>                 id(deep_sleep_1).set_sleep_duration(60 * 60 * 1000);
>                 id(deep_sleep_1).begin_sleep();
> 
> online_image:
>   - id: dashboard_image_home
>     format: PNG
>     type: RGB565
>     buffer_size: 65536
>     url: http://homeassistant.local:10000/eink-e1002/home?device=seeed-reterminal-e1002&theme=Graphite+Light
>     update_interval: never
>     on_download_finished:
>       - delay: 100ms
>       - component.update: epaper_display
> 
>   - id: dashboard_image_energy
>     format: PNG
>     type: RGB565
>     buffer_size: 65536
>     url: http://homeassistant.local:10000/eink-e1002/energy?device=seeed-reterminal-e1002&theme=Graphite+Light
>     update_interval: never
>     on_download_finished:
>       - delay: 100ms
>       - component.update: epaper_display
> 
>   - id: dashboard_image_plants
>     format: PNG
>     type: RGB565
>     buffer_size: 65536
>     url: http://homeassistant.local:10000/eink-e1002/plants?device=seeed-reterminal-e1002&theme=Graphite+Light
>     update_interval: never
>     on_download_finished:
>       - delay: 100ms
>       - component.update: epaper_display
> 
>   - id: dashboard_image_wallpaper
>     format: PNG
>     type: RGB565
>     buffer_size: 65536
>     url: http://homeassistant.local:10000/eink-e1002/wallpaper?device=seeed-reterminal-e1002&theme=Graphite+Light
>     update_interval: never
>     on_download_finished:
>       - delay: 100ms
>       - component.update: epaper_display
> 
> display:
>   - platform: epaper_spi
>     id: epaper_display
>     model: Seeed-reTerminal-E1002
>     update_interval: never
>     lambda: |-
>       if (id(page_index) == 0) {
>         it.image(0, 0, id(dashboard_image_home));
>       } else if (id(page_index) == 1) {
>         it.image(0, 0, id(dashboard_image_energy));
>       } else if (id(page_index) == 2) {
>         it.image(0, 0, id(dashboard_image_plants));
>       } else if (id(page_index) == 3) {
>         it.image(0, 0, id(dashboard_image_wallpaper));
>       }
> 
>  ```

This code has been updated for ESPHome 2025.11.X, and that would be the minimum version required. This version implemented a new display model, `model: Seeed-reTerminal-E1002`, which automatically sets all the required pins for the display to work on this device, so I have removed all the extra lines from the code.

[Full code for ESPHome, Automation and Dashboard on GitHub](https://github.com/cromelex/e1002-esphome-dashboard)

## The Result

A picture can be worth a thousand words, so that's why I decided to show you how this look on our wall. The epaper is the photo on the bottom left (the only unblurred one). The epaper blends in superbly when showing a photo, rather than a dashboard. This meets my goal. Whenever the context demands it, the automation driven by Home Assistant will display the dashboard page that will give me the information that I need in that moment.

![[./attachments/colour epaper dashboard-1620x1080.webp|Spot the epaper. A photo being displayed in the epaper blends in really well with regular framed photo prints.|800]]

[^1]: The new functionality is available since version 2.4.0 of the Puppet add-on.
