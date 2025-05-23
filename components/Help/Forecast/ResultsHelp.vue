<template>
  <div class="_help-page">
    <div class="_help-title">Forecast - Results Tab</div>
    <p id="help-subtitle" class="_help-subtitle">
      Displays results for the selected forecast run.
    </p>
    <p class="text-center" style="color:#cc5500;font-size:0.8em;">
      WARNING: Clicking the browser refresh button takes you to the Calibration Runs tab.
    </p>
    <hr class="mt-2 mb-4" />
    <table class="_help-table" aria-describedby="help-subtitle">
      <thead>
        <tr>
          <th class="td1">Item</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="td1">Calibration Job ID</td>
          <td class="td2">Calibration Job ID use as the basis for this forecast.</td>
        </tr>
        <tr>
          <td class="td1">Forecast Job ID</td>
          <td class="td2">This forecast job ID.</td>
        </tr>
        <tr>
          <td class="td1">Results Pathname</td>
          <td class="td2">Location on the file system containing all data pertaining to this job.</td>
        </tr>
        <tr>
          <td class="td1">Cycle</td>
          <td class="td2">Type of Forecast cycle ran for this job.</td>
        </tr>
        <tr>
          <td class="td1">Graph</td>
          <td class="td2">Forecasted stream flow.</td>
        </tr>
      </tbody>
    </table>
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
