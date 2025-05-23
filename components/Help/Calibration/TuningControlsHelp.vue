<template>
  <div class="_help-page">
    <div class="_help-title">ngenCERF Calibration Workflow - Tuning Controls Tab</div>
    <div class="_help-subtitle">
        This tab provides the user the ability to select the time periods to run the calibration, 
        the time periods for an automatic validation based on the best set of parameters 
        determined during the calibration process, the output variable to calibrate and which module parameters for 
        the selected formulation to tune during calibration.
    </div>
    <p class="text-center" style="color:orange;font-size:0.8em;">
      WARNING: Clicking the browser refresh button logs you out of ngenCERF, usually on your next action.
    </p>
    <p style="margin-left: 40px; margin-top:20px;font-size:0.9em; line-height: 20px;">
      <strong>NOTE:</strong> <em>The Previous and Next buttons on each of the tabs are meant to guide the user through a calibration setup,
        starting at the Headwater Basin Gage tab. The user can also simply click a tab or a link in the Progress area to go to that specific setup tab.</em>
    </p>
    <br />
    <hr>
    <div style="margin-left: 75px; margin-top:20px;">
      <p><strong>General Rules:</strong></p>
    <div style="margin-left: 10px;">
      <ul style="list-style-type: disc;margin-left: 20px;">
        <li>The observational and forcing data must have been selected or uploaded in order to select Time Controls.</li>
        <li>The formulation must have been chosen to select the Output Variable to Calibrate and Tuning Parameters.</li>
      </ul>
    </div>
    <br />
    <p><strong>Time Control Rules:</strong></p>
    <div style="margin-left: 10px;">
      <ul style="list-style-type: disc;margin-left: 20px;">
        <li>Calibration Start and End times must be within the Calibration Simulation Start and End times.</li>
        <li>Validation Start and End times must be within the Validation Simulation Start and End times.</li>
        <li>Calibration Start and End Times cannot overlap Validation Start and End times.</li>
        <li>Validation Simulation times must encompass both the Calibration and the Validation times.</li>
        <li>Times are hourly and must be specified to the top of the hour (hh:00).</li>
      </ul>
    </div>
    <br />
    <p><strong>Example:</strong></p>
    <span><strong>Calibration Times:</strong></span>
    <div style="margin-left: 10px;">
      <ul style="list-style-type: disc;margin-left: 20px;">
        <li>Simulation Start: 2015-10-01 00:00</li>
        <li>Calibration Start: 2016-10-01 00:00</li>
        <li>Simulation End: 2017-09-30 23:00</li>
        <li>Calibration End: 2017-09-30 23:00</li>
      </ul>
    </div>
    <br />
    <span><strong>Validation Times:</strong></span>
    <div style="margin-left: 10px;">
      <ul style="list-style-type: disc;margin-left: 20px;">
      <li>Simulation Start: 2016-10-01 00:00</li>
      <li>Validation Start: 2019-10-30 00:00</li>
      <li>Simulation End: 2020-09-30 23:00</li>
      <li>Validation End: 2020-09-30 23:00</li>
      </ul>
    </div>
  </div>
  <br />
  <hr>
  <br />
  <p style="line-height:20px;"> 
    <b>IMPORTANT:</b> <em>When manually entering data, the <b>Enter</b> key must be hit otherwise data 
      in that field will be discarded.</em>
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
          <td class="td1">Entering Times</td>
          <td class="td2">Times are UTC.<br >
            Times can be selected using the date picker or entered manually.<br />
            Manual Format: YYYY-MM-DD HH:MM<br />
            Cut and paste can be used.<br />
          </td>
        </tr>
        <tr>
          <td class="td1">&nbsp;</td>
          <td class="td2">&nbsp;</td>
        </tr>
        <tr>
          <td class="td1">Range</td>
          <td class="td2">Non-editable field displaying the available time range for running calibration and validation.
            This is determined by the time ranges available in the forcing and observational data selected in the
            Headwater Basin Gage tab. All time controls are constrained by this range.</td>
        </tr>
        <tr>
          <td class="td1">Calibration Time Controls</td>
          <td class="td2">The user selects four times to run the calibration. The Simulation Start and End times reflect
            the period of time to perform the entire run. The Calibration Start and End times reflect the period of time to
            actually calibrate using the tuning parameters. This allows for a “warm-up” period prior to performing the
            calibration.</td>
        </tr>
        <tr>
          <td class="td1">Validation Time Controls</td>
          <td class="td2">Same rules as the Calibration Time Controls except the Validation time range is further constrained
            in that it cannot overalap the Calibration time range.
          </td>
        </tr>
        <tr>
          <td class="td1">Output Variable to Calibrate</td>
          <td class="td2">Dropdown field to select the output variable to calibratte based on the chosen formulation.
          </td>
        </tr>
        <tr>
          <td class="td1">Calibration Tuning Parameters</td>
          <td class="td2">Either upload from a file or select from the available calibration parameters based on the
            formulation chosen.</td>
        </tr>
        
        <tr>
          <td class="td1">Load Parameters Button</td>
          <td class="td2">Click this to upload calibration tuning parameters from text file.
            If a parameter in the table is also in the updloaded file,
            the value from the file will overwrite the table value. Any parameters in the file that are not
            available for the fomulation will be discarded and a warning message displayed.
          </td>
        </tr>
        <tr>
          <td class="td1">Calibratable Parameters</td>
          <td class="td2">Dropdown field of calibration parameters based on the formulation.</td>
        </tr>
        <tr>
          <td class="td1">Add Button</td>
          <td class="td2">Click this to add the selected parameter to the Paraemter Table. Any data provided 
            by Enterprise Data Services will be added as well.
            The user must ensure all values for this parameter are entered in the table. 
          </td>
        </tr>
        <tr>
          <td class="td1">Parameter Table</td>
          <td class="td2">Editable list of the calibration parameters chosen. The source for these entries can be from the Name
            dropdown or uploaded from a file. Minimum, maximum and initial values must be provided.</td>
        </tr>
        <tr>
          <td class="td1">Clear Link</td>
          <td class="td2">Clear all entries in the parameters table.</td>
        </tr>
        <tr>
          <td class="td1">Save Button</td>
          <td class="td2">Save data from the tab. Partial saves are allowed.</td>
        </tr>
        <tr>
          <td class="td1">Next Button</td>
          <td class="td2">Move to the Optimization / Metrics Tab. If there is any unsaved data, the user will first be prompted
            to save.</td>
        </tr>
        <tr>
          <td class="td1">Prev Button</td>
          <td class="td2">Move to the Formulation Tab. If there is any unsaved data, the user will first be prompted to
            save.</td>
        </tr>
        <tr>
          <td class="td1">&nbsp;</td>
          <td class="td2">&nbsp;</td>
        </tr>
        <tr>
          <td class="td1"><strong>ERRORS</strong></td>
          <td class="td2"></td>
        </tr>
        <tr>
          <td class="td1"><strong>Calibration Tuning Controls disabled</strong></td>
          <td class="td2">Either the observation data, the forcing data or both have not yet been
            selected. Go to the Headwater Basin Gage tab and make sure this data has selected, uploded if Upload
            selected, and saved.
          </td>
        </tr>
        <tr>
          <td class="td1"><strong>Parameters disabled</strong></td>
          <td class="td2">The Formulation has not been chosen. Go to the Formulation tab and select the formulation.
          </td>
        </tr>
        <tr>
          <td class="td1"><strong>No data in parameter file</strong></td>
          <td class="td2">The file may not exit, be empty, missing a require column or data.
          </td>
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
