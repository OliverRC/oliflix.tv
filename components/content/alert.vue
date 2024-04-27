<template>
  <Alert>
    <slot />
  </Alert>
</template>

<script setup lang="ts">
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
</script>
