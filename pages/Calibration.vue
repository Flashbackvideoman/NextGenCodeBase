<!-- Calibration.vue -->
<template>
  <client-only>
    <NextgenLayout>
      <slot />
    </NextgenLayout>
  </client-only>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import NextgenLayout from "@/layouts/CalibrationLayout.vue";

import { generalStore } from "~/stores/common/GeneralStore";
const { popupActive } = storeToRefs(generalStore());

onMounted(() => {
  popupActive.value = false;
  nextTick(() => {
    const allTabs = document.getElementsByClassName("tabs");
    const e = allTabs[CalibrationTabs.tab_calibrationRuns] as HTMLElement;
    if (e) { e.click(); }
  });
});

</script>
