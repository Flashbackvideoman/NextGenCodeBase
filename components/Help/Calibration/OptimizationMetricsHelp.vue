<template>
  <div class="_help-page">
    <div class="_help-title">Calibration - Optimization/Metrics Tab</div>
    <div class="_help-subtitle">This tab provides the user the ability to select the optimization algorithm, the
      objective function, the calibration stop criteria, the plot generation frequency and additional metrics to calculate. By default, the ngen-cal
      program does not calculate the Categorical Metrics, POD, CSI, and FAR or the Event Based Metrics, PKBIAS, PKTE, and EVBIAS but the user can opt to calculate these.</div>
    <p class="text-center" style="color:#cc5500;font-size:0.8em;">
      WARNING: Clicking the browser refresh button takes you to the Calibration Runs tab.
    </p>
    <p style="margin-left: 40px; margin-top:20px;font-size:0.9em; line-height: 20px;">
      <strong>NOTE:</strong> <em>The Previous and Next buttons on each of the tabs are meant to guide the user through a calibration setup,
        starting at the Headwater Basin Gage tab. The user can also simply click a tab or a link in the Progress area to go to that specific setup tab.</em>
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
          <td class="td1">Optimization Algorithm</td>
          <td class="td2">Select from the dropdown which optimization algorithm to use for the calibration. Once one is
            selected any required algorithm parameters will be populated in the Parameter table. </td>
        </tr>
        <tr>
          <td class="td1">Algorithm Parameters</td>
          <td class="td2">The parameter name is provided. The user must provide the value.</td>
        </tr>
        <tr>
          <td class="td1">Calibration Stop Criteria</td>
          <td class="td2">The number of iterations for each worker to execute while performing calibration. DDS has one
            worker, but both GWO and PSO have 20 workers.
          </td>
        </tr>
        <tr>
          <td class="td1">Objective Function</td>
          <td class="td2">
            Select a metric to use as the objective function during calibration. Note that all metric
            in the table below are appropriate to use as an objective function. (MFDC, FBIAS, NSWwt)<br />
            If a Categorical metric (POD, CSI, FAR) is selected, the user must provide the Flow Threshold.<br />
            If an Event based metric (PKBIAS, PKTE, EVBIAS) is selected, the user must provide the Peak Flow Threshold.
          </td>
        </tr>
        <tr>
          <td class="td1">Calculate Categorical Metrics</td>
          <td class="td2">If a Categorical metric (POD, CSI, FAR) is not selected as the objective function, 
            the user can select this checkbox to have the program also calculate the Categorical Metrics. The 
            Flow Threshold must be entered by the user.
          </td>
        </tr>
        <tr>
          <td class="td1">Calculate Event Based Metrics</td>
          <td class="td2">If an Event Based metric (PKBIAS, PKTE, EVBIAS) is not selected as the objective function, the user can select
            this checkbox to have the program also calculate the Event Based Metrics.
            The Peak Flow Threshold must be entered by the user.
          </td>
        </tr>
        <tr>
          <td class="td1">Save Button</td>
          <td class="td2">Save data from the tab. Partial saves are allowed.</td>
        </tr>
        <tr>
          <td class="td1">Prev Button</td>
          <td class="td2">Move to the Tuning Controls Tab. If there is any unsaved data, the user will first be prompted
            to save.</td>
        </tr>
        <tr>
          <td class="td1">Next Button</td>
          <td class="td2">Move to the Status/Run Tab. If there is any unsaved data, the user will first be prompted
            to save.</td>
        </tr>
      </tbody>
    </table>
    <div class="mt-4">
      <p style="text-align: center;font-weight: bold;">Metric Definitions</p>
      <img class="mx-auto" width="90%" :src="image1" alt="" />
    </div>
  </div>
</template>

<script setup lang="ts">
import image1 from "@/assets/styles/img/OptimizationMetricsTable.png"
</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";
</style>
