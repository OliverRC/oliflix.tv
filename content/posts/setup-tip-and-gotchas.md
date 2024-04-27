---
title: 'Setup Tips & Gotchas'
description: 'Some tips to make Plex work great and a few gotchas to watch out for'
date: 2024-04-27
---

# Setup

The main thing to make sure that is correctly configure in Plex is Direct Play and or Direct Stream. This will ensure that the server is not transcoding the media on the fly and will save on CPU usage.

#### What is Transcoding?

Transcoding is the process of converting media from one format to another. This is done when the client device cannot play the media in its original format. This is a CPU intensive process and unfortunately OliFlix likely will no be able to perform this in real time which will lead to buffering and paused playback.

### Plex Settings

In Plex on whatever device you are using. Go to 'Settings' -> 'Video' (or similar).
Look for any settings that say "Remote Streaming Quality" or "Local Streaming Quality" and set them to "Original/Maximum".

# Gotchas

## MiBox S

I have noticed that the support for HD / uncompressed audio formats is not great. I've noticed that with movies that contain these like (TrueHD Atmos etc) the player opens but doesn't play, it seems "paused". 

The easiest way is to go to the audio icon and chose a different audio stream and this normally resolves the issue.

## Web Players

These almost ALL don't support all the formats and often will transcode. Most of the time this is not an issue and the server can handle the audio transcoding but it's something to be aware of.