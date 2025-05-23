<template>
  <div class="_help-page">
    <div class="_help-title">Forecast - Status/Run Tab</div>
    <div class="_help-subtitle">This tab provides the ability to run the forecast. First the real-time forcing data will be generated,
      which can take several minutes. Once the forcing data is ready the forecast will automatically start.
    </div>
    <p class="text-center" style="color:#cc5500;font-size:0.8em;">
      WARNING: Clicking the browser refresh button takes you to the Calibration Runs tab.
    </p>
 
    <table class="_help-table" aria-label="Forecast Run/Status Help Table">
      <thead>
        <tr>
          <th>Item</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="td1">Calibration Job ID</td>
          <td class="td2">Calibration Job ID as the basis for the forecast run.</td>
        </tr>
        <tr>
          <td class="td1">Forecast Job ID</td>
          <td class="td2">This Forecast Job ID.</td>
        </tr>
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
          <td class="td1">Results Pathname</td>
          <td class="td2">Location on the file system containing all data pertaining to this job.</td>
        </tr>
        <tr>
          <td class="td1">Status</td>
          <td class="td2">
            Ready - Click Run to start.<br />
            Forcing Download Running<br />
            Forecast Running<br />
            Done
          </td>
        </tr>
        <tr>
          <td class="td1">&nbsp;</td>
          <td class="td2">&nbsp;</td>
        </tr>

        <tr>
          <td class="td1">Run Button</td>
          <td class="td2">Start the Forecast.</td>
        </tr>
        <tr>
          <td class="td1">Cancel Button</td>
          <td class="td2">Stop/cancel the forecast process before it has completed. Appears only when a job is running.</td>
        </tr>
        <tr>
          <td class="td1">View Results Button</td>
          <td class="td2">View results of the forecast. Appears once the job is done.</td>
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
