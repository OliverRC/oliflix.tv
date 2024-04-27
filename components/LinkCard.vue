<template>
  <div
    class="p-6 border border-border rounded-md hover:ring-1 hover:ring-foreground hover:border-foreground transition-all duration-200"
  >
    <div class="space-y-2">
      <div class="flex gap-x-3">
        <Avatar>
          <AvatarImage
            :src="link.logo"
            :alt="link.name"
          />
          <AvatarFallback>P</AvatarFallback>
        </Avatar>
        <div class="flex flex-col">
          <a :href="link.url" class="font-semibold text-foreground">{{
            link.name
          }}</a>
          <a :href="link.url" class="text-muted-foreground text-sm">{{
            link.url
          }}</a>
        </div>
      </div>
      <Badge variant="secondary">{{ link.type }}</Badge>
      <p class="text-xs text-muted-foreground">
        {{ link.description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import type { Link } from "@/types";

defineProps<{
  link: Link;
}>();
</script>
