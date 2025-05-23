<template>
  <div class="_help-page">
    <div class="_help-title">Landing Page</div>
    <p style="line-height:20px;">
      The app is setup in 4 Workflows: Calibration, Evaluation, Forecast and Verification (aka Reforcast). If a workflow is greyed out,
      it means it is not yet available.
    </p>
    <div style="margin-top: 20px; margin-left:40px;">
      <ul style="list-style-type: disc;">
        <li> Click on the Calibration button to setup a new Calibration or view previous job or run a calibration.</li>
        <li> Click on the Evaluation button to evaluate previously run calibration jobs.</li>
        <li> Click on the Forecast button to run a forecast based off of the best paraemeters from previously run calibration job, or to view a previously run forecast job.</li>
      </ul>
    </div>
    <br />
    <p style="text-align:center;line-height:20px;">
      Displays some calibration status such as the number of running jobs, if any, as well as any calibration jobs in setup but not yet run.
    </p>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

._help-table .td1 {
  width: 200px;
}
</style>
