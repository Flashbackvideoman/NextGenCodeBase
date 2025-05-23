<template>
  <table id="CalibrationProgressTable" class="progressTable prevent-select">
    <tbody>
      <tr>
        <td><i v-if="userCalibrationRunData?.gage?.gage_id"
            :class="(userCalibrationRunData?.gage?.gage_id) ? 'checkMark' : ''" class="pi pi-check font-bold"></i></td>
        <td data-tab="2" title="Headwater Basin Gage" aria-label="Headwater Basin Gage"
          @click="tabClicked">
          Headwater Basin Gage</td>
      </tr>
      <tr>
        <td><i v-if="userCalibrationRunData?.external_data_status?.forcing"
            :class="userCalibrationRunData?.external_data_status?.forcing ? 'checkMark' : ''"
            class="pi pi-check font-bold"></i></td>
        <td data-tab="2" title="Forcing" aria-label="Forcing" @click="tabClicked">Forcing</td>
      </tr>
      <tr>
        <td><i v-if="userCalibrationRunData?.external_data_status?.observational"
            :class="userCalibrationRunData?.external_data_status?.observational ? 'checkMark' : ''"
            class="pi pi-check font-bold"></i></td>
        <td data-tab="2" title="Observational" aria-label="Observational" @click="tabClicked">Observational</td>
      </tr>
      <tr>
        <td><i v-if="userCalibrationRunData?.external_data_status?.geopackage"
            :class="userCalibrationRunData?.external_data_status?.geopackage ? 'checkMark' : ''"
            class="pi pi-check font-bold"></i></td>
        <td data-tab="2" title="Geopackage" aria-label="Geopackage" @click="tabClicked">Geopackage</td>
      </tr>
      <tr>
        <td><i v-if="userCalibrationRunData?.formulation_name && userCalibrationRunData?.modules.length"
            :class="userCalibrationRunData?.formulation_name && userCalibrationRunData?.modules.length ? 'checkMark' : ''"
            class="pi pi-check font-bold"></i></td>
        <td data-tab="3" title="Formulation" aria-label="Formulation" @click="tabClicked">Formulation</td>
      </tr>
      <tr>
        <td><i v-if="checkStartEndTimeValues()" class="pi pi-check font-bold checkMark"></i></td>
        <td data-tab="4" title="Start and End Times" aria-label="Start and End Times"
          @click="tabClicked">
          Start and End Times</td>
      </tr>
      <tr>
        <td><i v-if="userCalibrationRunData?.parameters_selected" class="pi pi-check font-bold checkMark"></i></td>
        <td data-tab="4" title="Tuning Parameters" aria-label="Tuning Parameters"
          @click="tabClicked">Tuning Parameters</td>
      </tr>
      <tr>
        <td><i v-if="userCalibrationRunData?.optimization" class="pi pi-check font-bold checkMark"></i></td>
        <td data-tab="5" title="Optimization Algorithm"
          aria-label="Optimization Algorithm" @click="tabClicked">Optimization Algorithm</td>
      </tr>
      <tr>
        <td><i v-if="userCalibrationRunData?.objective_function" class="pi pi-check font-bold checkMark"></i></td>
        <td data-tab="5" title="Objective Function" aria-label="Objective Function"
          @click="tabClicked">
          Objective Function</td>
      </tr>
      <tr>
        <td><i v-if="userCalibrationRunData?.stop_criteria" class="pi pi-check font-bold checkMark"></i></td>
        <td data-tab="5" title="Calibration Stop Criteria"
          aria-label="Calibration Stop Criteria" @click="tabClicked">Calibration Stop Criteria</td>
      </tr>
      <tr>
        <td><i v-if="userCalibrationRunData?.save_plot_iteration_frequency" class="pi pi-check font-bold checkMark"></i>
        </td>
        <td data-tab="5" title="Metrics and Plot Interval"
          aria-label="Metrics and Plot Interval" @click="tabClicked">Metrics / Plot Interval</td>
      </tr>
    </tbody>
  </table>

</template>

<script lang="ts" setup>
 
import { useUserDataStore } from "@/stores/common/UserDataStore";
import { generalStore } from "@/stores/common/GeneralStore";

const { getCalibrationTabIndex, getMenuIndex } = generalStore();
const { userCalibrationRunData } = storeToRefs(useUserDataStore());

const currentCalibrationTab = ref(getCalibrationTabIndex());

const emit = defineEmits(["tabNumber"]);

const checkStartEndTimeValues = () => {
  return (
    userCalibrationRunData.value?.calibration_times &&
    userCalibrationRunData.value?.calibration_times.calibration_end_time &&
    userCalibrationRunData.value?.calibration_times.calibration_start_time &&
    userCalibrationRunData.value?.calibration_times.simulation_end_time &&
    userCalibrationRunData.value?.calibration_times.simulation_start_time &&
    userCalibrationRunData.value?.validation_times.simulation_end_time &&
    userCalibrationRunData.value?.validation_times.simulation_start_time &&
    userCalibrationRunData.value?.validation_times.validation_end_time &&
    userCalibrationRunData.value?.validation_times.validation_start_time
  )
}

const tabClicked = (event: Event) => {
  event.preventDefault();
  const ele = event.currentTarget as HTMLElement;
  const allTabs = document.getElementsByClassName("tabs");
  const tabNum = Number(ele.getAttribute("data-tab")) - 1;
  const e = allTabs[tabNum] as HTMLElement;
  e.click();

  // Send the selected tab info to the active tab set with emit
  if (getMenuIndex() === 2) {
    currentCalibrationTab.value = Number(ele.getAttribute("data-tab"));
    emit("tabNumber", currentCalibrationTab.value);
  }
}
</script>
