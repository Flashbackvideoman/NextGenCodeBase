<template>
  <div class="_help-page">
    <div class="_help-title" id="help-title">Calibration Headwater Basin Gage Tab</div>
    <div class="_help-subtitle">Select the calibration gage for a headwater basin, along with the 
      source for the Forcing Data, Observational Data and GeoPackage. User may upload their own files.
    </div>
    <p class="text-center" style="color:#cc5500;font-size:0.8em;">
      WARNING: Clicking the browser refresh button takes you to the Calibration Runs tab.
    </p>

    <p style="margin-left: 40px; margin-top:20px;font-size:0.9em; line-height: 20px;">
      <strong>NOTE:</strong> <em>The Previous and Next buttons on each of the tabs are meant to guide the user through a calibration setup,
        starting at the Headwater Basin Gage tab. The user can also simply click a tab or a link in the Progress area to go to that specific setup tab.</em>
    </p>

    <table class="_help-table" aria-describedby="help-title">   
      <tbody>
        <tr>
          <th scope="row" class="td1">Domain</th>
          <td class="td2">Pull down to select the domain of interest. Choices are CONUS, Alaska, Hawaii and Puerto
            Rico/US Virgin Islands. This is optional.</td>
        </tr>
        <tr>
          <th scope="row" class="td1">Gage</th>
          <td class="td2">Pull down to select a calibration gage. If a domain has been selected, only gages
            from that domain will be avaialbe. Typing in this field shows predictive choices.
            User must select the choice from the list. Required if Upload is selected for Forcing Data, 
            Observational Data or the GeoPackage.
          </td>
        </tr>
        <tr>
          <th scope="row" class="td1">Forcing</th>
          <td class="td2">Pull down to select Forcing data source for the selected gage. 
            Either AORC or Upload to upload from local computer. <br />
            <br />
            Upload allows the user to specify their own csv file containing hourly time-series details of forcing data.
            <strong><em>A gage must have already been selected to upload a file.</em></strong><br />
            <br />
            There must be one forcing file per catchment in the headwater basin for the selected gage and they
            must be in the following format, with the 1st line being the header identifying the following fields:<br />
            Time, LWDOWN, PFC, Q2D, RAINRATE, SWDOWN, T2D, U2D, V2D<br />
            <br>
            Example:<span style="font-size:0.9em;"> <em>(Clicking on image makes it larger in a new tab.)</em></span><br />
            <a :href=image1 target="_blank"><img :src=image1 alt="" /></a><br />
            <img :src=image2 width="90%" class="mb-2" alt="" />
          </td>
        </tr>
        <tr>
          <th scope="row" class="td1">Observational</th>
          <td class="td2">Pull down to select Observational Data source for the selected gage. 
            Either Data Services for Enterprise Data Services or Upload to upload from local computer.<br />
            <br />
            Upload allows the user to specify their own csv file hourly time-series details of observed gage streamflow data.
            <strong><em>A gage must have already been selected to upload a file.</em></strong><br />
            <br />
            This file must be in the following format, with the the 1st line being the header
            identifying the following fields:<br />
            <br />
            <span class="italic">dateTime, q_cms</span><br />
            Example:<br />
            <img :src=image3 alt="" /><br />
          </td>
        </tr>
        <tr>
          <th scope="row" class="td1">GeoPackage</th>
          <td class="td2">Pull down to select the source for the selected gage GeoPackage file. Either Data Services for Enterprise
            Data Services or Upload to upload from local computer.<br />
            <br />
            Upload allows the user to specify their own .gpkg file. 
            <strong><em>A gage must have already been selected to upload a file.</em></strong>
          </td>
        </tr>
        <tr>
          <td class="td1">&nbsp;</td>
          <td class="td2">&nbsp;</td>
        </tr>
        <tr>
          <th scope="row" class="td1">Save Button:</th>
          <td class="td2">Save data from the tab. Partial saves are allowed.</td>
        </tr>
        <tr>
          <th scope="row" class="td1">Revert Button</th>
          <td class="td2">If the saved gage ID is changed, the Revert button will appear. When
            clicked it will undo the change, reverting to the saved gage ID.</td>
        </tr>
        <tr>
          <th scope="row" class="td1">Next Button:</th>
          <td class="td2">Move to the Formulation Tab. If there is any unsaved data, the user will first be prompted to save.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import image1 from "@/assets/styles/img/forcingexample.png"
import image2 from "@/assets/styles/img/calworkhelp.png"
import image3 from "@/assets/styles/img/observationalexample.png"
</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

._help-table .td1 {
  width: 150px;
}
</style>
