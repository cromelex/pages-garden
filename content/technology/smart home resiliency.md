---
publish: true
title: Smart Home Resiliency
created: 2025-08-04
modified: 2025-08-04
tags:
  - homeassistant
  - esphome
---
# Smart Home Resiliency


> [!info] This note was prompted by a question that I read over the weekend - What was my biggest Home Assistant related failure? I decided to expand on the thought, and provide a bit of detail on how I have made my smart home more resilient.

## When smart goes stupid: learning from chaos
I've been running [[../tags/homeassistant| Home Assistant]] since 2021, and my biggest failure wasn't technical - it was human. When my daughter was born, I learned that smart homes need to account for chaos, not just convenience.

Picture this: 2 AM, holding a colicky baby who's been crying for hours, desperately pacing around the house trying to get her to sleep. The motion sensor triggers, and suddenly the hallway lights come on - even at 1% brightness, it's enough to fully wake a baby you've spent hours getting drowsy. Or worse, a brief power outage at 3 AM causing the bedroom lights to default to "on" when power returns, immediately waking both baby and exhausted parents.
These scenarios were never considered when I set up my automations. I had optimised for normal life, not for the [[../fatherhood/index|chaos of early parenthood]]. The failure taught me that smart homes must be resilient by design, not just clever.

My solution was building multiple layers of fail-safes: Home Assistant now has a physical kill switch (a relay that can shut down the entire system), ESPHome devices revert to "dumb" mode when disconnected, and Zigbee-bound buttons beside the bed work even if the coordinator fails. Everything operates offline-first, and every automation has a manual override.

Below are some examples of how I did this.
## The kill switch
Starting with the nuclear option - if automations go haywire, there needs to be a simple and straightforward way to shut everything down.

The solution is plain and simple: pulling the plug.

This is the only thing I had to make sure my partner is aware of, when dealing with the physical part of Home Assistant. While most of the hardware (NAS, router, network switches, mini server) is *hidden* away from site in the office or utility room, I have chosen to keep Home Assistant on a dedicated machine (currently a N100 mini-PC running HAOS - the Home Assistant Operating System), and it sits in the living room, in a cabinet under the tv.  

If things go wrong, the house can be made *dumb* again by turning off power to that box. This day hasn't happened yet, thankfully.

## Motion lights override
How did I "solve" for the hallway motion light override? The motion sensor is Zigbee, and integrated in Home Assistant, rather than being on the light itself. As such, it was possible to find a workaround: if the physical light switch is toggled, I temporarily disable the motion light automation (using `automation.turn_off`) for one hour, and then restore it.

## Smart switches with fallback mode
The core problem with smart lights is the fundamental trade-off: you need constant power for the smart features, but you also need physical switches that always work. Most solutions force you to choose one or the other.
### The smart light problem
I use IKEA Zigbee light bulbs throughout the house for their colour temperature control and mesh networking abilities. But this creates an obvious problem:

- Standard dumb switch: cut power = no smart control possible;
- Smart switch: Home Assistant down = switch does nothing.

Neither solution works when you desperately need light at 3 AM and your smart home has decided to have a breakdown.

### The ESPHome solution
The answer is switches that are smart enough to detect when they're _not_ connected to your smart home, then automatically fall back to basic relay operation. This is where ESPHome becomes really useful.  

I'm using Shelly Plus 1 PM and Plus 2 PM relays, flashed with ESPHome to allow this *smarter* logic. Here's how it works:

1. Normal operation: Switch sends `light.toggle` commands to Home Assistant;
2. Fallback mode: Can't reach Home Assistant API? Toggle the physical relay instead;
3. Power-cut protection: Bedroom switches start "off" to prevent 3 AM wake-ups, then restore automatically if it's daytime (via automation).

The result? Light switches that work exactly as people expect them to, whether your smart home is online or having an existential crisis.

### Technical Implementation

The ESPHome configuration handles the fail-over logic automatically. The key is using the `wifi.connected` and `api.connected` conditions to determine which mode to operate in:

> [!code]- ESPHome sample code for the Shelly Plus 1PM, with fallback to *dumb* mode (based on [this](https://devices.esphome.io/devices/Shelly-Plus-1PM) original)
> ```yaml
> esphome:
>   name: shelly-plus-1pm-bedroom
>   platformio_options:
>     board_build.f_cpu: 160000000L
>   on_boot:
>     priority: 600
>     then:
>       - switch.turn_off: "relay_1"
>       
> substitutions:
>   device_name: "Shelly Plus 1PM Bedroom Switch"
>   friendly_name: "Shelly Plus 1PM Bedroom Switch"  
>   # Higher value gives lower watt readout
>   current_res: "0.001"
>   # Lower value gives lower voltage readout
>   voltage_div: "1925"
>   bulb_name_1: "light.bedroom_light"
> 
> esp32:
>   board: esp32doit-devkit-v1
>   framework:
>     type: esp-idf
>     sdkconfig_options:
>       CONFIG_FREERTOS_UNICORE: y
>       CONFIG_ESP32_DEFAULT_CPU_FREQ_160: y
>       CONFIG_ESP32_DEFAULT_CPU_FREQ_MHZ: "160"
> 
> wifi:
>   ssid: !secret wifi_ssid
>   password: !secret wifi_password
> 
> logger:
> 
> api:
>   encryption:
>     key: <generated_key>
>     
> ota:
>   - platform: esphome
>     password: !secret ota_password
> 
> time:
>   - platform: homeassistant
> 
> output:
>   - platform: gpio
>     id: "relay_output_1"
>     pin: GPIO26
> 
> switch:
>   - platform: output
>     id: "relay_1"
>     name: "${device_name} Relay"
>     output: "relay_output_1"
>     restore_mode: RESTORE_DEFAULT_OFF # on power restore, the relay is turned off
> 
> # home assistant bulb to switch
> text_sensor:
>   - platform: homeassistant
>     id: 'ha_bulb_1'
>     entity_id: "${bulb_name_1}"
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
>     ssid:
>       name: "${friendly_name} Connected SSID"
>       icon: mdi:wifi-strength-2
>       entity_category: diagnostic    
> 
> binary_sensor:
>   - platform: gpio
>     name: "${device_name} Switch"
>     pin: GPIO4
>     # small delay to prevent debouncing
>     filters:
>       - delayed_on_off: 50ms
>     # config for state change of input button
>     on_state:
>         then:
>           - if:
>               condition:
>                 and:
>                   - wifi.connected:
>                   - api.connected:
>                   - switch.is_on: "relay_1"
>                   - lambda: 'return (id(ha_bulb_1).state == "on" || id(ha_bulb_1).state == "off");'
>               # toggle smart light if wifi and api are connected and relay is on
>               then:
>                 - homeassistant.service:
>                     service: light.toggle
>                     data:
>                       entity_id: "${bulb_name_1}"
>               else:
>                 - switch.toggle: "relay_1" # else, toggle relay directly
> 
> sensor:
>   - platform: ntc
>     sensor: temp_resistance_reading
>     name: "${device_name} Temperature"
>     unit_of_measurement: "°C"
>     accuracy_decimals: 1
>     icon: "mdi:thermometer"
>     calibration:
>       b_constant: 3350
>       reference_resistance: 10kOhm
>       reference_temperature: 298.15K
>     on_value_range:
>       - above: "80.0"
>         then:
>           - switch.turn_off: "relay_1"
>   - platform: resistance
>     id: temp_resistance_reading
>     sensor: temp_analog_reading
>     configuration: DOWNSTREAM
>     resistor: 6kOhm
>   - platform: adc
>     id: temp_analog_reading
>     pin: GPIO32
>     attenuation: 11db
> 
>   - platform: adc
>     name: "${device_name} Relay Supply Voltage"
>     pin: GPIO33
>     attenuation: 11db
>     filters:
>       - multiply: 8
> 
>   - platform: hlw8012
>     model: BL0937
>     sel_pin:
>       number: GPIO23
>       inverted: true
>     cf_pin: GPIO5
>     cf1_pin: GPIO18
>     current_resistor: ${current_res}
>     voltage_divider: ${voltage_div}
>     current:
>       name: "${device_name} Current"
>       unit_of_measurement: A
>       accuracy_decimals: 3
>       icon: mdi:flash-outline
>     voltage:
>       name: "${device_name} Voltage"
>       unit_of_measurement: V
>       accuracy_decimals: 1
>       icon: mdi:flash-outline
>     power:
>       name: "${device_name} Power"
>       unit_of_measurement: W
>       id: power
>       icon: mdi:flash-outline
>       on_value_range:
>         - above: "3600"
>           then:
>             - switch.turn_off: "relay_1"
>     change_mode_every: 2
>     update_interval: 10s
>   - platform: total_daily_energy
>     name: "${device_name} Daily energy consumed"
>     power_id: power
>     filters:
>         - multiply: 0.001
>     unit_of_measurement: kWh
>     icon: mdi:clock-alert
> 
> status_led:
>   pin:
>     number: GPIO0
>     inverted: true
> ```
> 

## Conclusion

The biggest lesson? Technology should fade into the background and just work, especially during life's most stressful moments. Smart homes should make hard times easier, not add another point of failure when you can least afford it.