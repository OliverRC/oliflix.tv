<template>
  <header class="sticky z-40 top-0 bg-background/80 backdrop-blur-lg border-b border-border">
    <div class="container flex h-14 max-w-screen-2xl items-center">
      <div class="mr-4 md:mr-1 hidden md:flex">
        <a href="/" class="mr-4 md:mr-2 lg:mr-6 flex items-center lg:space-x1 xl:space-x-2">
          <LogoIcon class="size-8" />
          <span class="font-bold text-foreground"> Oliflix </span>
        </a>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import LogoIcon from "@/assets/images/oliflix-icon.svg";
</script>
