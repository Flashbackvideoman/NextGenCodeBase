<template>
  <div class="_help-page">
    <div class="_help-title">Forecast - Setup Forecast Tab</div>
    <p id="help-subtitle" class="_help-subtitle">
      Select the type of forecast to run. Greyed out rows in the table are not yet available from the GUI. Use the ngenCERF CLI to run those cycles.
    </p>
    <p class="text-center" style="color:#cc5500;font-size:0.8em;">
      WARNING: Clicking the browser refresh button takes you to the Calibration Runs tab.
    </p>
    <hr class="mt-2 mb-4" />
    <p class="text-center">
      Once the forecast cycle is selected, click on the Next button to review and run the forecast.
    </p>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

.helpfile-ul {
  list-style-type:disc !important;
}

._help-table .td1 {
  width: 300px;
}
</style>
