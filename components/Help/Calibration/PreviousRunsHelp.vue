<template>
  <div class="_help-page">
    <div class="_help-title">Calibration - Calibration Runs Tab</div>
    <div class="_help-subtitle">Displays a list of users calibration jobs</div>
    <p class="text-center" style="color:#cc5500;font-size:0.8em;">
      WARNING: Clicking the browser refresh button takes you to the Calibration Runs tab.
    </p>

    <table class="_help-table">
      <thead>
        <tr>
          <th>Item</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="td1">New Button</td>
          <td class="td2">Starts a new calibration setup.</td>
        </tr>
        <tr>
          <td class="td1">&nbsp;</td>
          <td class="td2">&nbsp;</td>
        </tr>
        <tr>
          <td class="td1">Headwater Basin Gage Filter</td>
          <td class="td2" style="vertical-align:top;">Show only those jobs associated with the selected Gage ID</td>
        </tr>
        <tr>
          <td class="td1">&nbsp;</td>
          <td class="td2">&nbsp;</td>
        </tr>
        <tr>
          <td class="td1">Double Click</td>
          <td class="td2">Loads the selected calibration job. User will be taken to the Run/Status tab. (Same as right
            click/Open)</td>
        </tr>
        <tr>
          <td class="td1">&nbsp;</td>
          <td class="td2">&nbsp;</td>
        </tr>
        <tr>
          <td class="td1">Statuses</td>
          <td class="td2"><strong>Description</strong></td>
        </tr>
        <tr>
          <td class="td1" style="font-weight:normal;">Saved</td>
          <td class="td2">Calibration setup has begun, but not yet completed.</td>
        </tr>
        <tr>
          <td class="td1" style="font-weight:normal;">Ready</td>
          <td class="td2">Calibration setup complete, but not run. The word Calibration may be present.</td>
        </tr>
        <tr>
          <td class="td1" style="font-weight:normal;">Running</td>
          <td class="td2">When Running is in the status, indicates the Calibration/Validation phase currently running.
          </td>
        </tr>
        <tr>
          <td class="td1" style="font-weight:normal;">Done</td>
          <td class="td2">Calibration job completed without any errors.</td>
        </tr>
        <tr>
          <td class="td1" style="font-weight:normal;">Failed</td>
          <td class="td2">Calibration job failed.</td>
        </tr>
        <tr>
          <td class="td1" style="font-weight:normal;">Cancelled</td>
          <td class="td2">Calibration job cancelled by user.</td>
        </tr>
        <tr>
          <td class="td1" style="font-weight:normal;">Server Error</td>
          <td class="td2">The server had an error before the job finished.</td>
        </tr>
      </tbody>
    </table>
    <hr />
    <table class="_help-table">
      <thead>
        <tr>
          <th>Menu Item</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="td1">Right Click</td>
          <td class="td2"><strong>Provides a context menu with the following options</strong></td>
        </tr>
        <tr>
          <td class="td1" style="font-weight:normal;">Open<br /></td>
          <td class="td2">Loads the selected calibration job. User will be taken to the Run/Status tab.</td>
        </tr>
        <tr>
          <td class="td1" style="font-weight:normal;">Clone</td>
          <td class="td2">Use the data from the selected calibration job as a baseline for a new calibration that
            will be added at the top of the table. User will remain on this page.</td>
        </tr>
        <tr>
          <td class="td1" style="font-weight:normal;">Delete</td>
          <td class="td2">Delete the selected calibration job and all it's associated validation jobs. User will remain
            on this page.</td>
        </tr>
      </tbody>
    </table>
    <hr class="mt-3" style="height: 2px; background-color: black" />
    <div class="mt-3 text-center font-bold text-xl">Table Color Coding</div>
    <p class="font-bold">The leftmost column is color coded by the status of the job</p>
    <table class="ml-28 w-auto">
      <thead>
        <tr class="text-left">
          <th>&nbsp;</th>
          <th>&nbsp;&nbsp;</th>
          <th>Color</th>
          <th>&nbsp;&nbsp;</th>
          <th>Job Status</th>
        </tr>
      </thead>
      <tbody>
        <tr class="leading-8">
          <td style="background-color: green" class="pr-1">&nbsp;</td>
          <td>&nbsp;</td>
          <td>Green</td>
          <td>&nbsp;</td>
          <td>Ready</td>
        </tr>
        <tr class="leading-8">
          <td style="background-color: yellow" class="pr-1">&nbsp;</td>
          <td>&nbsp;</td>
          <td>Yellow</td>
          <td>&nbsp;</td>
          <td>Saved</td>
        </tr>
        <tr class="leading-8">
          <td style="background-color: blue" class="pr-1">&nbsp;</td>
          <td>&nbsp;</td>
          <td>Blue</td>
          <td>&nbsp;</td>
          <td>Done</td>
        </tr>
        <tr class="leading-8">
          <td style="background-color: orange" class="pr-1">&nbsp;</td>
          <td>&nbsp;</td>
          <td>Orange</td>
          <td>&nbsp;</td>
          <td>Cancelled</td>
        </tr>
        <tr class="leading-8">
          <td style="background-color: red" class="pr-1">&nbsp;</td>
          <td>&nbsp;</td>
          <td>Red</td>
          <td>&nbsp;</td>
          <td>Failed</td>
        </tr>
        <tr class="leading-8">
          <td style="background-color: green" class="pr-1">&nbsp;</td>
          <td>&nbsp;</td>
          <td>Flashing Green</td>
          <td>&nbsp;</td>
          <td>Running</td>
        </tr>
      </tbody>
    </table>

    <hr class="mt-3" style="height: 2px; background-color: black" />

    <div class="mt-3 text-center font-bold text-xl">Job Filter</div>
    <p class="text-center">
      Calibration Job Filters allows the user to display only those jobs that meet certain criteria.
    </p>
    <div class="ml-8 mt-3">
      <div class="font-bold">Filters are applied in this manner:</div>
      <ul class="mt-4">
        <li>The base collection of jobs is determined by the value of the Headwater Basic Gage dropdown, which allows
          the job list
          to be filtered for a specific gage, or "All" to display all jobs returned by the server.
        </li>
        <li>After the job list is optionally filtered by Headwater Basic Gage, one or more Status selections can be made
          to further filter the job list.
          If there are no Status items selected, the filter will be bypassed.
        </li>
        <li>Lastly, if no Modules are slected, no further jobs will be filtered from the list, but the user may select
          one or more Modules to further filter the job list.
        </li>
      </ul>
    </div>
    <div class="ml-8 mt-3">
      <h2>Archived Jobs</h2>
      <p>If the <strong>Include Archived</strong> checkbox is checked then the job list will include any and all jobs
        that have been archived.</p>
      <p>To archive a job, right click on an un-archived job and select "Archive". </p>
      <p>If a job has been previousl archived, you can right click and choose "Un-archive".</p>
    </div>

  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

._help-table .td1 {
  width: auto;
}

p {
  margin-left: 50px;
}
</style>
