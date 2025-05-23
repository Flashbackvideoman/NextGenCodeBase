<template>
  <div class="_help-page">
    <div class="_help-title">Evaluation - Run/Status Tab</div>
    <div class="_help-subtitle">This tab provides the ability to run a validation on the selected iteration.</div>
    <p class="text-center" style="color:#cc5500;font-size:0.8em;">
      WARNING: Clicking the browser refresh button takes you to the Calibration Runs tab.
    </p>

    <table class="_help-table" aria-label="Evaluation Run/Status Help Table">
      <thead>
        <tr>
          <th>Item</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="td1">Submit Time</td>
          <td class="td2">Date/Time the job was submitted to run.
          </td>
        </tr>
        <tr>
          <td class="td1">Elapsed Time</td>
          <td class="td2">Time elapsed since the job was submitted. Time is in days, HH:MM:SS</td>
        </tr>
        <tr>
          <td class="td1">Iteration</td>
          <td class="td2">Iteration number selected for the validation run.</td>
        </tr>
        <tr>
          <td class="td1">Status</td>
          <td class="td2">Job status.</td>
        </tr>
        <tr>
          <td class="td1">&nbsp;</td>
          <td class="td2">&nbsp;</td>
        </tr>

        <tr>
          <td class="td1">Run Button</td>
          <td class="td2">Start the Validation.</td>
        </tr>
        <tr>
          <td class="td1">Cancel Button</td>
          <td class="td2">Stop/cancel the validation before it has completed. Appears only when a job is running.</td>
        </tr>
        <tr>
          <td class="td1">Go To Evaluation Button</td>
          <td class="td2">View details about the validation run, including plots, plot data, performance metrics and
            logs. Appears once the job is done.</td>
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
</style>
