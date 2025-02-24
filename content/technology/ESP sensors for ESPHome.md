---
publish: true
title: ESP sensors for ESPHome
tags:
  - esphome
  - homeassistant
created: 2024-11-29
modified: 2024-11-29
---
# ESP sensors for ESPHome
Over the last few years, as part of my effort to make my house *smart* using Home Assistant, I have ended up buying a few ESP devices to serve multiple purposes.

Some of those I bought ready-made, like the [Adonno NFC Tag Reader](https://adonno.com/tagreader/), or the Shelly smart relays (which I have flashed with ESPHome for additional functionality). I have also bought a few [M5Stack Atom Lite ESP32](https://docs.m5stack.switch-science.com/en/core/ATOM%20Lite) units, because they are cheap and they were a really easy way to try [ESPresense](https://espresense.com/) to track room presence (based on our phones) and also to track my cats.

![[attachments/M5Stack ESP32 sensors for ESPHome-m5stack atom lite-5472x3648.webp|The tiny M5Stack Atom Lite ESP32 unit|500]] 

ESP32s are extremely flexible devices, and with a bit of soldering you can use them for almost any purpose.
However, if you are like me, that might be a bit beyond my skill set.
I learned that M5Stack also sell a number of ready made sensors that can be easily plugged into their ESP32 devices without any soldering, using UART cables.

As with so many things ESPHome, someone has already done all of the hard-work.
*Chill-Division* has documented and shared template .yaml configs to allow anyone to use a number of different M5Stack devices with ESPHome in his [M5Stack-ESPHome](https://github.com/Chill-Division/M5Stack-ESPHome) repo.

I have done a couple of mini-projects with these:

- [[../projects/NFC jukebox|A NFC enabled jukebox for my daughter]]
- [[../projects/CO2 sensor|A cheap CO2 sensor to help monitor air quality in our home]]