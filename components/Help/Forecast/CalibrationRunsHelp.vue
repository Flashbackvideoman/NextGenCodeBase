<template>
  <div class="_help-page">
    <div class="_help-title">Evaluation - Calibration Runs Tab</div>
    <p id="help-subtitle" class="_help-subtitle">
      Displays table of calibration runs with some basic details. User selects one of the runs in the list to
      use as the basis for a forecast run.
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
          <td colspan="2" style="padding-left:80px;"><strong>Right click provides a context menu with some of the following options:</strong></td>
        </tr>
        <tr>
          <td class="td1">Run New Forecast</td>
          <td class="td2">Run a new foreast using this calibration as the basis for the job.</td>
        </tr>
        <tr>
          <td class="td1">View Calibration Details</td>
          <td class="td2">View more details about the calibration job than what is shown in the table.</td>
        </tr>
        <tr>
          <td class="td1">Delete Calibration Job</td>
          <td class="td2">Delete the selected calibration job and all it's associated validation jobs. User will remain on this page.</td>
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
