<template>
  <header
    class="sticky z-40 top-0 bg-background/80 backdrop-blur-lg border-b border-border"
  >
    <div class="container flex h-14 max-w-screen-2xl items-center">
      <div class="flex">
        <a href="/" class="flex items-center gap-2">
          <LogoIcon class="size-6" :fontControlled="false" />
          <span class="font-bold text-foreground"> Oliflix </span>
        </a>
      </div>

      <div
        class="flex flex-1 items-center justify-between space-x-2 md:justify-end"
      >
        <Button as-child>
          <a href="https://ko-fi.com/oliflix" target="_blank">Leave a Tip :)</a>
        </Button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import LogoIcon from "@/assets/images/oliflix-icon.svg";
import { Button } from "@/components/ui/button";
</script>
