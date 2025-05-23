<template>
  <div class="_help-page">
    <div class="_help-title">Evaluation - Calibration Runs Tab</div>
    <p id="help-subtitle" class="_help-subtitle">
      Displays table of calibration run with some basic details. User selects one of the runs in the list to
      evaluate. If the run has multiple validation runs, the user will be provided a list of the associated validation
      runs to select from.
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
          <td class="td1">Evaluate</td>
          <td class="td2">If only one validation run has been performed selecting this will take the user to the Evaluate tab to view calibration and validation results.</td>
        </tr>
        <tr>
          <td class="td1">New Validation Run</td>
          <td class="td2">Since only the control, last and best iteration runs data are saved, use this to generate data for a different iteration from the calibration run.</td>
        </tr>
        <tr>
          <td class="td1">Select Validation Run</td>
          <td class="td2">If more than one validation has been done, the user will be taken to a table to select the validation job to evaluate.</td>
        </tr>
        <tr>
          <td class="td1">View Valdiation Run Status</td>
          <td class="td2">View the status of the validation run.</td>
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
