---
publish: true
title: Backup Strategy
created: 2025-12-01
modified: 2025-12-01
tags:
  - self-hosting
---
# My Backup Strategy

## The Cloud is just someone else's computer
It is easy to think that once something is backed up to the cloud, it is safe. It is not. Not if you are a "free" customer, [and not even if you are a big corporate.](https://arstechnica.com/gadgets/2024/05/google-cloud-explains-how-it-accidentally-deleted-a-customer-account/)

That is why you should **always** have backups.

At the same time, local backups are not enough. Your house could burn or get flooded, your toddler might decide to play with your backup drives. And there are always other risks such as ransomware.

## Understanding the 3-2-1 Backup Strategy

### The Basic 3-2-1 Rule

The 3-2-1 backup strategy is straightforward: keep multiple copies of your data in different places. Here's a practical example - you back up your home computer to an external hard drive and sync both to cloud storage. You've now got a 3-2-1 backup:

- **Three** copies of your data: one on your computer, one on your hard drive, and one in the cloud
- **Two** different storage types: your computer's internal drive and the external hard drive (plus the cloud makes three)
- **One** copy off-site: the cloud copy is physically somewhere else

### Enhanced Protection: The 3-2-1-1 Approach

The 3-2-1-1 strategy adds one more layer - an air-gapped backup. This means:

- Maintain at least three copies of your data
- Store data on at least two different types of storage media
- Keep one copy off-site
- Keep one copy completely offline or air-gapped (unplugged from everything, ideally in a safe)

That last bit is crucial. Ransomware can spread across networks and encrypt any backup it can reach. An unplugged drive sitting in a drawer? Completely safe from that threat.

## What I do

1. I keep all my data in network volumes on my NAS (which can only be accessed locally or via VPN). The system automatically takes and keeps a number snapshots of this data (daily, weekly, monthly, and yearly).
2. Every couple of weeks, I plug in an external SSD into my desktop. It triggers a `rsync` job that copies all my media and documents into it. This is then unplugged and stored "offline". 
3. 3 times per week I run a backup from my NAS to Backblaze B2 using [Backrest](https://github.com/garethgeorge/backrest). This runs `restic` under the hood. It creates encrypted backups, with versioning. My retention policy is fairly aggressive: 7 daily, 4 weekly, 6 monthly, and 10 yearly. I'd rather pay a bit extra for storage than risk losing files I only notice are missing after months or a year.
4. Out of some *healthy* paranoia, I am currently setting up a spare RaspberryPi4 with an external SSD at a relative's place, in an entirely different country, and plan to keep an extra copy of my photos there. This backup will be versioned and encrypted with Backrest. Access is via VPN. 

```mermaid
graph TB
    NAS[NAS<br/>(Snapshots)]
    
    SSD[External SSD<br/>(Offline / air-gapped)]
    B2[Backblaze B2<br/>(Encrypted)]
    PI[Remote Pi<br/>(Off-site)]
    
    NAS --> SSD
    NAS --> B2
    NAS --> PI
```

## Final Thoughts

This setup might seem excessive, but each layer addresses a specific failure mode I've either experienced or heard about from others. The NAS handles accidental deletions, the offline drive protects against ransomware, the cloud backup guards against local disasters, and the remote Pi adds geographical redundancy.

You don't need to copy this exactly. The 3-2-1 principle matters more than the specific tools. Start with what fits your budget and technical comfort level. An imperfect backup strategy you actually use beats a perfect one that never gets implemented.

Test your backups occasionally. Verify you can actually restore files. A backup is only as good as your ability to recover from it when things go wrong - and eventually, something will go wrong.