---
publish: true
title: Adding a CO2 sensor to the NFC Jukebox
created: 2024-12-31
modified: 2025-03-24
tags:
  - esphome
  - homeassistant
alias:
  - "Projects/add-CO2-to-jukebox"
  - "projects/add-CO2-to-jukebox"
---
# Adding a CO2 sensor to the NFC Jukebox

I've previously put together a [[CO2 sensor]] and a [[NFC jukebox]], as separate small projects using ESPHome and integrating with my Home Assistant. 

Initially, I had separate USB cables running to each device. While this worked, I wanted a cleaner setup, especially since both devices were in the same room.
I looked for a Y-type cable, so I could have one less cable dangling, but managed to find a neater and more efficient solution.

I ordered a [M5stack Grove Hub](https://docs.m5stack.com/en/unit/hub) (for about 4 EUR), plugged it into the ESP32, and plugged both sensors into the HUB. After this, all I had to do was edit my code so has to have both sensors handled by the same ESP32.

As far as I understand it, the reason this works is that both sensors use different I2C addresses, as can be seen in the ESPHome .yaml. The NFC reader uses `address: 0x28`, whereas the CO2 sensor uses `address: 0x62`.


![[attachments/Add CO2 to Jukebox-CO2 and NFC-1930x2564.webp|A M5Stack SD40 CO2 sensor and the RFID2 NFC reader connected to a M5Stack Grove HUB, all connected to the M5Stack Atom Lite ESP32|500]]

## Updating the .yaml code

All it took was modifying the [[NFC jukebox#The NFC bit|original .yaml from the NFC Jukebox]], adding in the block for the CO2 Sensor, and then flash it OTA (wirelessly):

```yaml
# CO2 Sensor
sensor:
  - platform: scd4x
    id: scd40
    automatic_self_calibration: False
    co2:
      name: "CO2"
      id: co2
      accuracy_decimals: 1
    temperature:
      name: "Temperature"
      id: temperature
      accuracy_decimals: 2
    humidity:
      name: "Humidity"
      id: humidity
      accuracy_decimals: 1
    address: 0x62
    update_interval: 10s
  - platform: template
    name: "VPD"
    icon: "mdi:gauge"
    id: gr2_ace_vpd
    lambda: |-
          return (((100 - id(humidity).state) / 100) * (0.6108 * 2.718281828459045 * (17.27 * ((id(temperature).state)) / (((id(temperature).state)) + 237.3))));
    update_interval: 10s
    unit_of_measurement: kPa
    accuracy_decimals: 2
    filters:
      - filter_out: nan
  - platform: uptime
    name: Uptime
```


## Full .yaml for Atom Lite ESP32 with RFID2 + SD40 CO2 sensor

```yaml
substitutions:
  name: m5stack-rfid-co2
  friendly_name: M5Stack RFID Tag Reader with CO2
  
esphome:
  name: ${name}
  friendly_name: ${friendly_name}

esp32:
  board: m5stack-atom
  framework:
    type: arduino

# Enable logging
logger:

# Enable Home Assistant API
api:
  encryption:
    key: "randomlygeneratedkey"

ota:
  - platform: esphome
    password: !secret ota_password

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

  # Enable fallback hotspot (captive portal) in case wifi connection fails
  ap:
    ssid: "m5stack-rfid-co2 Fallback Hotspot"
    password: "randompassword"

# RFID Reader Sensor
external_components:
  - source:
      type: git
      url: https://github.com/chill-Division/M5Stack-ESPHome/
      ref: main
    components: mfrc522_i2c

# The I2C mapping for the Atom Lite
i2c:
  sda: 26
  scl: 32
  scan: true
  id: bus_1
  
# RFID Reader Sensor
rc522_i2c:
  address: 0x28
  on_tag:
    then:
      - homeassistant.tag_scanned: !lambda 'return x;'

# CO2 Sensor
sensor:
  - platform: scd4x
    id: scd40
    automatic_self_calibration: False
    co2:
      name: "CO2"
      id: co2
      accuracy_decimals: 1
    temperature:
      name: "Temperature"
      id: temperature
      accuracy_decimals: 2
    humidity:
      name: "Humidity"
      id: humidity
      accuracy_decimals: 1
    address: 0x62
    update_interval: 10s
  - platform: template
    name: "VPD"
    icon: "mdi:gauge"
    id: gr2_ace_vpd
    lambda: |-
          return (((100 - id(humidity).state) / 100) * (0.6108 * 2.718281828459045 * (17.27 * ((id(temperature).state)) / (((id(temperature).state)) + 237.3))));
    update_interval: 10s
    unit_of_measurement: kPa
    accuracy_decimals: 2
    filters:
      - filter_out: nan
  - platform: uptime
    name: Uptime

text_sensor:
  - platform: version
    hide_timestamp: true
    name: "${friendly_name} ESPHome Version"
    entity_category: diagnostic
  - platform: wifi_info
    ip_address:
      name: "${friendly_name} IP Address"
      icon: mdi:wifi
      entity_category: diagnostic
    ssid:
      name: "${friendly_name} Connected SSID"
      icon: mdi:wifi-strength-2
      entity_category: diagnostic      
```

This is literally all it takes. 
The same ESP32 can now take the information from both sensors simultaneously.  
If I ever want to expand on this project, I could easily integrate additional sensors by using the remaining slot in the Hub.