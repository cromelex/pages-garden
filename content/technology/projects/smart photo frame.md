---
publish: true
title: Smart Photo Wall Panel
created: 2025-06-13
modified: 2025-06-13
tags:
  - immich
  - homeassistant
---
# Smart Photo Wall Panel

## Intro
For the last 3 years I'd been using a refurbished Fire 10 tablet as a wall panel in my hallway. I found it was quite handy to have quick access to my Home Assistant dashboard, displaying information like the Weather, calendar entries, and approximate drive time to those calendar event locations, while also having a easy way to control the smart features in our house (blinds, lights, etc).

The battery only lasted for a few days, but I couldn't be bothered to spend the time and effort to wire it in more permanently - I relied on a magnetic mount in order to have an easy way to remove it for charging.

Eventually, a couple of weeks ago the tablet died entirely, and wouldn't even power up anymore.

A bit over year ago I bought a couple of Arzopa smart photo frames running Frameo, which we gifted to our daughter's great grandparents. We wanted something simple and easy to use, and my sister already had a photo frame running Frameo which apparently worked quite well. I realised they ran Android, but wasn't sure how easy it would be to sideload a different app. I thought it might well be a way to *upgrade* the Fire10 wall-mounted tablet for something that looks a bit nicer.

That idea was left in the back burner until the Fire10 tablet died.  
## Arzopa P156W 15.6 inch photo frame

By mere chance, the week after the tablet died, someone posted on [r/homeassistant](https://www.reddit.com/r/homeassistant) about their success in sideloading apps on the 15.6 inch Arzopa P156W smart photo frame. 
**photinus** provided a nicely presented [guide on their GitHub](https://github.com/photinus/HomeAssistant-Misc/blob/master/Arzopa.md), detailing the whole process.

I went ahead and ordered one the same day!

The screen is nice and bright, and although the frame itself is quite slow, it is just *bearable* enough in that it is still usable. The frame is relatively inexpensive, being regularly on sale at a decent discount, be it on Amazon, Aliexpress, or Arzopa's own website.

I won't reproduce the guide in full, and instead just point you towards **photinus**'s  [guide again](https://github.com/photinus/HomeAssistant-Misc/blob/master/Arzopa.md). 
There isn't a lot to it: 
1. Enable "Beta Mode" in the frame's settings
2. Enable ADB over USB and connect to your PC.
3. Disable the Frameo app, and install the required APKs
4. Enabled the updated System Webview

## The plan
My initial plan was to use [FullyKiosk](https://www.fully-kiosk.com/) to display an Home Assistant dashboard, and to use some sort of automation within Home Assistant to have it present photos by default.

However, when I was searching for some inspiration on how to do that, I came upon [Immich Kiosk](https://immichkiosk.app/). Immich Kiosk runs on a Docker container and allows you to easily display your photos from [[../../tags/immich|Immich]] in a really nicely presented UI, with the option to show a clock, date, weather and/or specific metadata from each photo.

## The Solution
FullyKiosk has the option to display a screensaver, which can be specific URL.
When you tap the screen, it immediately takes you to the default page.

This made the whole process much simpler. It was as easy as setting up FullyKiosk to point at the Home Assistant dashboard, and setting the screensaver to the Immich Kiosk URL!

From within Home Assistant I am able to use the FullyKiosk integration to turn off the screen when the room is empty. When there is someone in the room, it will display my Immich photos from a curated album. Meanwhile, the Home Assistant dashboard and controls are always a single tap away!

## Next steps
All that is left is hiding the power cable so it isn't dangling on the wall. When I have a bit of time I will probably try to route it within the wall so as to make it completely invisible, as I believe that would make the photo frame look much better.

