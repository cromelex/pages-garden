---
publish: true
title: My First Pull Request
created: 2024-11-11
modified: 2024-11-11
tags:
  - foss
aliases:
  - Technology/first-pull-request
---
# My First Open Source Pull Request

## An annoying bug
For years I have relied on open source software to make my life easier.
One such tool has a very simple, but important function - it lets my smart home know if I am on a work call, or a video call from my computer.
When working from home, and especially considering there's a toddler in the house, it's quite handy having the ability to let other people in the house know, and preventing interruptions.
Recently, I was facing a particular bug where my microphone kept being identified as On. I raised an issue with bug details on the project's GitHub repo, and eventually the developer made a new release that worked, until it suddenly got stuck as On again. 

I ended up looking through the code and, to my surprise, despite having no prior coding experience beyond YAML and Jinja templates from Home Assistant, I found the Python code quite readable.
I was able to identify what was causing the false positive, and by googling[^1] the python syntax I realised a simple one-line code change could resolve the issue.

I tested it on my computer and it worked!

## Gitting Things Done
The vast majority of these open source projects are done by people who are volunteering their time and knowledge, for free. 

While I have used open source software for years, I had never contributed code to any project. I have opened bug reports in the past, but those are somewhat self-serving, in the sense that I was just trying to get whatever issue I was facing fixed.

I had previously heard quite a bit about **git** as a fantastic tool for version control, and had some curiosity, but not enough to try it out just for the sake of it. 

After a couple of days, I thought, "*Why not?*" and decided to give it a go and try **git** - while at the same time put that code fix through, as a contribution to the project.

I followed a couple of tutorials, tried it out in a test repo and a bit later I was able to successfully open a pull request on the project's repo. The owner was then able to review and merge the request and... *voilà!* My code is now part of this project, and once the next version is released, anyone else facing the same scenario will be able to have their microphone usage being detected correctly.

![[attachments/first-pull-request-commit-2000x510.webp|The modified line of code|800]] 


## A Small Step, A Big Impact
It is a very, very tiny contribution.
Nevertheless, it felt great and extremely satisfying to be able to figure out the issue by myself, fix it, and to be able to give something back to the open source community.
Due to my non tech background, opportunities might be limited. Still, I hope I will have the chance to do it again!

Don't underestimate the impact of small contributions. Start by reporting a bug, improving documentation, or even just asking questions.



[^1]: I currently use [DuckDuckGo](https://duckduckgo.com) as my default search engine, and have done so for the last couple of years, in an attempt to give a bit less of my personal information to Google.