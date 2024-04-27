<template>
  <div class="mt-10">
    <ContentDoc v-slot="{ doc }">
      <article>
        <div class="border-b border-border py-4">
          <h1
            class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground"
          >
            {{ doc.title }}
          </h1>
          <p class="text-muted-foreground mt-4 text-lg">{{ doc.description }}</p>
          <p class="text-muted-foreground/50 mt-2 text-sm">{{ formatDate(doc.date) }}</p>
        </div>
        <div class="prose prose-shadcn mt-6 mx-auto max-w-4xl">
          <ContentRenderer :value="doc" />
        </div>
      </article>
    </ContentDoc>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from "@/lib/utils";
</script>
