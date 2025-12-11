---
publish: true
title: Using NextDNS with Unifi
created: 2025-12-11
modified: 2025-12-11
tags:
  - unifi
---
# Using NextDNS with Unifi

Most of the instructions I have found, including [NextDNS](https://nextdns.io)' own, were old and outdated. They all seemed to imply you needed to install the NextDNS CLI on the Unifi Gateway.

Luckily I found a [post](https://help.nextdns.io/t/q6ykb3f?r=p8yk98n) with a much easier solution.

> Just wanted to note that there's no need to be installing NextDNS in the CLI or anything special.
> 
> Simply go to your NextDNS account > Setup > Router and scroll down to DNSCrypt. Copy the server name (NextDNS-yourid) and stamp (sdns://...) and paste them into the Unifi Encrypted DNS settings in Settings > CyberSecure > Protection.

That's it, that is all it takes. Every device with DNS assigned by the Unifi Gateway will have the requests sent via DNS-over-HTTPS.

## NextDNS
I've been using NextDNS for quite a few years, and even upgraded to the paid plan in 2022, to allow me to add my family under the same plan, instead of creating separate *free* accounts.  
I know a lot of people prefer to self-host their own using Pi-Hole or Adguard locally, however, NextDNS works on all my devices, even the phones, regardless of my location or without having the expose a DNS server.
On top of that, in every test I have done online, NextDNS consistently came up on top on the list of the quickest DNS providers - they are likely using a datacenter close to my home in Ireland, and that means I get both speed and ad-blocking on all my devices just by using it as a DNS provider.  

Not everything needs to be self-hosted. The convenience is well worth the cost, in this instance.