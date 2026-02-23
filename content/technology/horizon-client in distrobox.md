---
publish: true
title: Running Omnissa / VMware Horizon Client on distrobox
created: 2025-05-06
modified: 2026-02-23
tags:
  - distrobox
  - steamdeck
  - bazzite
  - aurora/bluefin
---
# Running the Omnissa / VMware Horizon Client in distrobox

> [!note] 
> - The below guide is based on an original post by [Fyksen](https://fyksen.me/), which is currently no longer available on their page.   
> - The VMware Horizon client has since been updated and renamed as Omnissa Horizon Client, following a rebrand of the VMware End-User Computing business.  
> - I've decided to publish this updated guide when the existing app version stopped working, and I had to figure out how to install the updated client.

## Intro
Last year, when I [[Giving up on Windows|gave up on Windows]], there were a few apps which I could not replace, and had to make sure I could get them working in Linux. The VMWare Horizon client was one such app. At the time, I did not have a company issued laptop, and as such relied on the Omnissa/VMware Horizon Client (as an employer provided solution) to be able to work remotely. I also wanted to be able to install it on my Steamdeck, as I gave up on carrying my laptop and wanted to have the ability to use the Steamdeck as a backup.  
After a lot of trial and error, I eventually managed to find a guide that helped me in getting it to work. The solution uses [distrobox](https://github.com/89luca89/distrobox), which allows us to install the Omnissa Horizon Client on the Steam Deck, Fedora Atomic and Universal Blue images, without it breaking on image updates.

## What is Distrobox?
Distrobox allows you to use any Linux distribution inside your terminal. It creates containers using either podman or docker to create containers for running command-line applications. This means you can install packages that might otherwise be difficult to install on immutable operating systems like Fedora Atomic or SteamOS.  

## Installation Methods
There are 2 main ways of managing a distrobox, and installing the client. If you are comfortable with the terminal, you can do all of it via command line. Alternatively, there is a nice GUI for distrobox called [BoxBuddy](https://github.com/Dvlv/BoxBuddyRS) that makes it really easy to handle part of the process via a graphical interface. 

### Method 1: Terminal Command-line Installation
```shell
# Create distrobox Arch container
distrobox create arch --image quay.io/toolbx/arch-toolbox:latest -Y
distrobox enter arch

# Install yay
sudo pacman -S --needed git base-devel && git clone https://aur.archlinux.org/yay.git && cd yay && makepkg -si --noconfirm
yay -Y --gendb

# Install VMware dependencies, and the VMware client from AUR using yay
sudo pacman -S libpulse libxkbfile --noconfirm
yay -S omnissa-horizon-client --noconfirm

# Create desktop shortcut for VMware-view
distrobox-export --app horizon-client

# Exit out of distrobox
exit
```

#### Fixing the Timezone Issue
Once you have exported the Omnissa Horizon Client desktop shortcut, you need to update the exec flags to include the timezone, as otherwise you will see a mismatch within the client. In my case, I am using `TZ=Europe/Dublin`.
```shell
-n arch --additional-flags '--env TZ=Europe/Dublin' -- horizon-client %u
```

### Method 2: BoxBuddy GUI Installation
#### 1. Create a new distrobox container:
- Install and open BoxBuddy, click on the + sign to create a new distrobox.
- Name the container and choose `arch - quay.io/toolbx/arch-toolbox:latest` as the image.
- Create the container
![[attachments/horizon-client in distrobox-1067x600.webp|Create the distrobox in BoxBuddy|800]]

#### 2. Install the required packages:
- Once the container is up and running, click *Open Terminal*
![[./attachments/horizon-client in distrobox-953x581.webp|The distrobox within BoxBuddy|800]]

- In the terminal, we need to install `yay`, the required dependencies for the `omnissa-horizon-client` and finally the `omnissa-horizon-client` itself. When it finishes you can close the terminal.
```shell
# Install yay
sudo pacman -S --needed git base-devel && git clone https://aur.archlinux.org/yay.git && cd yay && makepkg -si --noconfirm
yay -Y --gendb

# Install VMware dependencies, and the VMware client from AUR using yay
sudo pacman -S libpulse libxkbfile --noconfirm
yay -S omnissa-horizon-client --noconfirm
```

#### 3. Add the application to your system menu:
- In BoxBuddy, click on *View Applications*. You can then click *Add to Menu*. It will then show on your "Start" menu.
- On the "Start" Menu, right-click and edit application. You can then update the command-line arguments to include the timezone, as otherwise you will see a mismatch within the client. 

```shell
-n arch --additional-flags '--env TZ=Europe/Dublin' -- horizon-client %u
```

![[./attachments/horizon-client in distrobox-1090x640.webp|The edit application menu in KDE|800]]

## Browser based SSO login
A reader contacted me after facing an issue, where the Horizon client needs to open a browser window to actually handle the login.
We figured out that if you install a browser in the same distrobox container, export it, and *potentially* set it as default browser on the host, then the browser window will open and allow you to login. 
This seems to have worked for him (Thanks Richard for the feedback!).
Hopefully this will be useful for anyone else facing the same issue.

## Usage and Benefits
You can then start and use the horizon-client app directly from the start menu, like any other app. It will persist across images updates, ie if your Steamdeck or Fedora Atomic / Universal Blue image is updated, the distrobox container and app shortcuts will remain unaffected.