---
title: Why I Finally Gave Up on Windows
publish: true
created: 2025-01-04
modified: 2025-01-05
tags:
  - foss
  - bazzite
  - windows
---

# Why I Finally Gave Up on Windows for Good

With Windows 10 reaching end of life last October, I have now finally stopped using Windows on all my personal computers. [^1]

Despite having used Windows all my life, this turned out to be neither a big nor a dramatic change.

## Microsoft is shit
Microsoft has been following the trend of *enshitification*, continuously working to make their products worse while trying to extract as much money and data as possible from their clients.  
In my opinion, this has really peaked with Windows 11, and I've found it quite frustrating how Windows Update kept trying to push and even trick me into "upgrading" to the latest version, while still telling me that not all functionality would necessarily be available yet. 
Microsoft has been relentless. My partner, who is completely passive in terms of updating her system or apps (she never, ever, ever runs a manual update on her PC or her phone), ended up having her laptop automatically "upgraded" to Windows 11 a couple of years ago - the system has broke twice since, forcing me to do a full reinstall each time.

## Why Windows became irrelevant 
Over the last few years, I noticed that more and more of the apps I used were moving from desktop to web-based. This became even more evident when I started replacing some of them with self-hosted services.
At one point, on my personal laptop, the only apps that I was using daily were a web browser and the cloud VM client I used for work. Sure, there were a couple more utilities (Tailscale, Google Drive, etc), but none of these were Windows exclusive, and plenty of them being Electron apps (basically web apps wrapped into a desktop app).
The only thing that still required Windows to run was video games.

## The turning point
Just under 2 years ago I bought a Steam Deck. The Steam Deck is an handheld "console", running a specific flavour of Linux, which is technically a PC (and can be used as such).

The real change came from how Valve and their partners developed Proton. Proton is essentially a compatibility layer that allows you to run Windows apps (namely, games) directly on Linux.
It is all set up and enabled by default. You launch your game and it *just works*.

If you put the Steam Deck in "desktop mode", it boots into a KDE graphic interface (not unlike Windows), and from there you can use *Discover*, which is essentially an app store, allowing you to find and install apps for whatever you need. 

And it *just works* - something Windows used to be known for: user-friendliness.

## Linux that *just works*
At one point last year I decided to buy a MiniPC to serve both as a host for my self-hosting projects, and also to serve as my day to day PC in my home office.
A friend recommended [Bluefin](https://projectbluefin.io/) as a potential choice of OS, on the basis that it was a straightforward option, being maintenance free and image based (which makes it difficult for anyone to accidently break the OS). Everything auto updates, and when you reboot, the OS will start with the new image (while keeping all your user data safe).
I looked into it, and found there was a new*ish* variation of it called [Aurora](https://getaurora.dev/). Aurora is essentially the same thing as Bluefin under the hood, but with a different top layer of paint - KDE Plasma instead of GNOME for the graphic environment.

As mentioned above, the Steam Deck runs KDE Plasma in desktop mode. For simplicity, I decided to go with Aurora in order to use the same KDE Plasma across my devices.

7 or 8 months later and here we are - everything *just works*, I only need to reboot the machine once a week for the OS updates to install, and everything is automatically kept up to date, without any nagging notifications.

## The holdout
My gaming PC hasn't seen almost any use since my daughter was born. Nevertheless, it is still there, and in the rare occasion it does get used, it is mostly as a host, allowing me to stream games at higher settings to my Steam Deck (while minimising battery usage and fan noise on the handheld).
It ran Windows 10, and I was happy to keep it that way, until it reached End of Life. Software vulnerabilities are everywhere, and keeping a device without security updates is a **bad** idea. So it was either Windows 11, or some flavour of Linux. It was only natural that I tried [Bazzite](https://bazzite.gg/), the popular, gaming focused variant of Aurora/Bluefin.

I have always heard that NVIDIA was [particularly terrible with Linux](https://www.theverge.com/2012/6/17/3092829/linus-torvalds-fuck-you-nvidia).

However, it turns out that things have been developing particularly well lately, to the point that, by November 2024, I read that for NVIDIA GPUs, Linux had finally reached gaming parity with Windows, meaning that everything works, and you can use the full functionality of your GPU. Variable Refresh Rates (VRR), High Dynamic Range (HDR), and NVIDIA's proprietary image upscaling (DLSS), all of it works.

## Bazzite we go
In December, as the holidays approached, I had a day with a bit of free time. 
Following the instructions on [Bazzite's](https://bazzite.gg/) website, I downloaded the `bazzite-nvidia-open` image, loaded it into an external SSD, plugged it into my desktop, and booted from it.  
All it took was 20 minutes. Everything gets installed, and once it restarts, a wizard guides you over installing a few optionals. Tick a couple of boxes to install the optional bits (or not), give it another couple of minutes, and the machine was ready to go.  No need to opt out of Teams, Office, One Drive, nor any of the other privacy invading *crap*.

Again, everything *just works* out of the box. I downloaded a few *Windows* games via Steam, launched them, and everything was working as expected (better than expected?)[^2].

Seriously, it took me longer to write this than it took to get Bazzite installed and running!

Do yourself a favour, and give up on Windows too. It's easier than dealing with the *enshitification* Microsoft puts you through.


[^1]: My corporate-issued laptop uses Windows 11, but it functions only as a thin client for a cloud VM running Windows 10. I use this VM for my day-to-day work, something entirely at the discretion of my employer. When working from home, I use a containerised VM client, running from my Linux desktop.
[^2]: Even Wake On Lan works better. With Windows, I could never get it to work from a Shutdown status. With Bazzite, WOL works even if the machine is Shutdown (as opposed to only working when hibernated or suspended with Windows).