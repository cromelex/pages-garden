---
publish: true
title: External access with Tailscale
created: 2025-05-12
modified: 2025-06-16
tags:
  - self-hosting
  - tailscale
---
# External access made simple and secure with Tailscale

## What is Tailscale
[Tailscale](https://tailscale.com) is a nifty VPN tool, based on Wireguard, that allows you to set up safe, zero-config, no-fuss connections between your devices. It's super easy to deploy, and it handles all the network shenanigans for you, making it an often recommended tool in the self-hosted community.
Tailscale's free plan allows up to 3 users and up to 100 devices, which is more than enough for most people doing any sort of homelab setups.
It really is almost entirely fool proof, and I'd strongly recommend it's use for anyone wanting to have access to their homelab from outside their local network, as it is an easy and free way to do it.
It can also be used to allow someone like a family member to access a service you are hosting locally. 

## How to use Tailscale
[Tailscale](https://tailscale.com/) is ideal if you only need external access on an occasional basis.
- You install it, on the host or as a container;
- You also install it on the device you want to access from (say, your laptop or your phone);
- You turn it on, it connects;
- You are auto*magically* connected to your home devices, and it all works.

You can use the device names with the tailnet to access them via your browser, such as `device.tailnet1234.ts.net`.  You can even use the Tailscale IP address in public DNS entries - they will only resolve for devices which are connected to your Tailscale network.
If you [advertise subnet routes](https://tailscale.com/kb/1019/subnets#advertise-subnet-routes) to your [[HTTPS with Caddy|reverse proxy (Caddy)]] host, you can even use the same internal IP DNS entries to access the services as you would when connecting from home.

If you want to secure it further, you can use [[Tailscale ACLs|access control rules]] to limit what each user or device can access on the other devices in your Tailscale network.

## What about other options?
If there is any self-hosted service that you need to access on a regular or even daily basis, and by more than one person (say, your partner or family members), and said people can't or do not want to use the Tailscale VPN application, you can look at other options, such as using a [[cloudflare tunnel|Cloudflared tunnel.]]