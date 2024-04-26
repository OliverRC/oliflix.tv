<template>
  <div>
    <div class="flex flex-col items-center p-4 sm:p-10 gap-3">
      <LogoText class="h-16" :fontControlled="false"/>
      <div class="text-2xl md:text-5xl sm:text-3xl font-extrabold">
        <span
          class="bg-clip-text text-transparent bg-gradient-to-br from-rose-500 via-purple-500 to-indigo-600"
          >Lights, camera ... binge!</span
        >
      </div>
    </div>
    <div class="grid  md:grid-cols-3 gap-3 md:gap-5 mt-12">
      <LinkCard v-for="link in links" :key="link.name" :link="link" />
    </div>
  </div>
</template>

<script setup lang="ts">
import LogoText from "@/assets/images/oliflix-text.svg";
import type { Link } from "@/types";

const links: Link[] = [
  {
    name: "Plex",
    url: "https://app.plex.tv/desktop",
    logo: "/plex-logo.svg",
    type: "User App",
    description: "Where you watch stuff!",
  },
  {
    name: "Overseerr",
    url: "https://overseerr.oliflix.tv",
    logo: "/overseerr-logo.svg",
    type: "User App",
    description: "Where you request stuff!",
  },
  {
    name: "Radarr",
    url: "https://radarr.oliflix.tv",
    logo: "/radarr-logo.png",
    type: "Admin App",
    description: "Manages movie stuff!",
  },
  {
    name: "Sonarr",
    url: "https://sonarr.oliflix.tv",
    logo: "/sonarr-logo.svg",
    type: "Admin App",
    description: "Manages series/tv/anime stuff!",
  },
  {
    name: "NZBGet",
    url: "https://nzbget.oliflix.tv",
    logo: "/tautulli-logo.svg",
    type: "Admin App",
    description: "For downloading stuff!",
  },
  {
    name: "Tautalli",
    url: "https://tautulli.oliflix.tv",
    logo: "/tautulli-logo.svg",
    type: "Admin App",
    description: "Monitoring plex server stuff!",
  },
];
</script>
