<template>
  <div>
    <AppHeader />
      <slot />
    <AppFooter />
  </div>
</template>
<script setup lang="ts">
import AppFooter from "@/components/Common/AppFooter.vue";
import AppHeader from "@/components/Common/AppHeader.vue";

</script>