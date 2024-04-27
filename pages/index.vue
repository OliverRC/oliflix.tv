<template>
  <div class="text-foreground space-y-6">
    <div class="flex flex-col items-center p-4 sm:p-10 gap-3">
      <LogoText class="h-16" :fontControlled="false" />
      <div class="text-2xl md:text-5xl sm:text-3xl font-extrabold">
        <span
          class="bg-clip-text text-transparent bg-gradient-to-br from-rose-500 via-purple-500 to-indigo-600"
          >Lights, camera ... binge!</span
        >
      </div>
    </div>
    <div class="grid md:grid-cols-3 gap-3 md:gap-5">
      <LinkCard v-for="link in links" :key="link.name" :link="link" />
    </div>

    <h2
      class="scroll-m-20 border-b border-border pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
    >
      Posts
    </h2>
    <ContentList path="/posts">
      <template #default="{ list }">
        <template v-for="post in list" :key="post._path">
          <div class="border border-border rounded-md p-6 space-y-1 hover:ring-1 hover:ring-foreground hover:border-foreground transition-all duration-200">
            <a :href="post._path" class="flex">
              <h2 class="text-foreground font-semibold truncate flex items-center gap-1.5 text-lg">{{ post.title }}</h2>
              <span class="ml-auto text-muted-foreground text-sm">{{
                // a nicely formatted date
                post.date
              }}
              </span>
            </a>
          
            <p class="text-muted-foreground">{{ post.description }}</p>
          </div>
        </template>
      </template>
      <template #not-found>
        <p class="text-muted-foreground">No posts at this time</p>
      </template>
    </ContentList>
  </div>
</template>

<script setup lang="ts">
import LogoText from "@/assets/images/oliflix-text.svg";
import type { Link } from "@/types";

const links: Link[] = [
  {
    name: "Plex",
    url: "https://app.plex.tv/desktop",
    logo: "/plex-icon.svg",
    type: "User App",
    description: "Where you watch stuff!",
  },
  {
    name: "Overseerr",
    url: "https://overseerr.oliflix.tv",
    logo: "/overseerr-icon.svg",
    type: "User App",
    description: "Where you request stuff!",
  },
  {
    name: "Radarr",
    url: "https://radarr.oliflix.tv",
    logo: "/radarr-icon.svg",
    type: "Admin App",
    description: "Manages movie stuff!",
  },
  {
    name: "Sonarr",
    url: "https://sonarr.oliflix.tv",
    logo: "/sonarr-icon.svg",
    type: "Admin App",
    description: "Manages series/tv/anime stuff!",
  },
  {
    name: "NZBGet",
    url: "https://nzbget.oliflix.tv",
    logo: "/nzbget-icon.png",
    type: "Admin App",
    description: "For downloading stuff!",
  },
  {
    name: "Tautalli",
    url: "https://tautulli.oliflix.tv",
    logo: "/tautulli-icon.png",
    type: "Admin App",
    description: "Monitoring plex server stuff!",
  },
];
</script>
