---
publish: true
title: Smart Litterbox
created: 2026-05-22
modified: 2026-05-22
tags:
  - cats
  - homeassistant
---
# Smart Litterbox

A few months ago, after a neighbour told me about his success using a smart litterbox, I was persuaded to give one a try.

> [!info] I bought and paid for the Open-X myself, and the below is based on my own experience using it over the last 4 months.

## Catlink Open-X

![[./attachments/smart litterbox-3173x2806.webp|The Open-x in white|800]]
### Features
My cats have always been quite picky, and never used any type of covered litterbox. 
I did a quick search and found a cheap, open top model, and a follow up quick search told me there was a custom integration for Home Assistant too.
Maybe more important, the consumables (bags) aren't too specific, and I wouldn't need to buy anything proprietary. Additionally, it is easy to disassemble, and you can just wash the relevant parts.
So I went ahead and ordered the [Catlink Open-X](https://catlinkeu.com/products/catlink-open-x-open-top-self-cleaning-cat-litter-box).

One of the nicer features, in my opinion, is the ability to track multiple cats, based on weight. In my experience, there is always a lean cat, and a fat cat, and the weight difference makes it easy to differentiate. The app itself stores separate histories per cat, as well as their weight.

### Litter Compatibility
I've been told that most smart litterboxes require the use of bentonite litter. I've tried mineral based litters in the past, but found they created too much dust, and my cats were both sneezing and ending up covered in dust themselves. With black cats, this was particularly noticeable.
The Open-X supports "mixed" litter, although your results might vary.
We had been using Cat's Best Original wood based litter for years, but it wasn't perfect as it sometimes stuck to the liner. After a few different attempts we've now settled on using [Cat's Best Smart Pellets](https://www.catsbest.eu/product/cats-best-smart-pellets/)[^1].

## Home Assistant Integration
The [Home Assistant integration](https://github.com/hasscc/catlink) is a bit rough, but it works perfectly, and it seems to expose all the same data-points as the app, and it even allows you to send manual commands (e.g., run a clean job in the litterbox). Each cat gets exposed as a separate *device* under the integration, allowing you to monitor stats separately.

Overall, there isn't much of a need to do anything *manually* (that's the whole point of a smart litterbox), but for the sake of health monitoring I created a notification that warns me in case any of the cats uses the litterbox more than 5 times in a day. 

![[./attachments/smart litterbox-1505x1320.webp|The Catlink Integration device info for my cat Stout|800]]
## Health Monitoring in Practice
That automation proved relevant this week
The smart litterbox helped me notice that [[../misc/my cats#Poppy|Poppy]] had a urinary tract infection, much sooner than I would have realised by myself.
This allowed us to ring our vet and start treatment sooner. 
Considering how expensive veterinary care is, the litterbox might have just paid for itself by allowing us to avoid further complications.

[^1]: There are two different versions with pellets, a "Universal", and the "Smart". Smart is the one you want, as they are much smaller sized pellets.
