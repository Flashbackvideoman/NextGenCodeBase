<template>
  <div id="Messages">
    <div class="">
      <h2 class="mt-5" :aria-label="'Setup - Calibration Job ID' + userCalibrationRunData?.calibration_run_id"
        :title="'Setup - Calibration Job ID' + userCalibrationRunData?.calibration_run_id">{{ componentProps.title }} {{
          userCalibrationRunData?.calibration_run_id ? userCalibrationRunData.calibration_run_id : '' }}</h2>

      <div class=" grid grid-cols-2 gap=1 text-sm mt-4">
        <div class="col-span-1">
          <div v-if="calData?.gage?.gage_id" :aria-label="'Gage ' + calData?.gage?.gage_id"
            :title="'Gage ' + calData?.gage?.gage_id"><span class="font-medium">Gage:</span>
            {{ calData?.gage?.gage_id }}</div>

            <div v-if="calData?.num_catchments" :aria-label="'Catchments ' + calData?.num_catchments"
            :title="'Gage ' + calData?.num_catchments"><span class="font-medium">Catchments:</span>
            {{ calData?.num_catchments }}</div>

          <div v-if="calData?.forcing_source" :aria-label="'Forcing Data ' + calData?.forcing_source"
            :title="'Forcing Data ' + calData?.forcing_source"><span class="font-medium">Forcing Data:</span>
            {{ calData?.forcing_source }}
          </div>
          <div v-if="calData?.observational_source" :aria-label="'Observational Data ' + calData?.observational_source"
            :title="'Observational Data ' + calData?.observational_source"><span class="font-medium">Observational
              Data:</span> {{
                calData?.observational_source }}
          </div>

        </div>

        <div class="col-span-1">
          <div v-if="calData?.gage?.station_name" :aria-label="'Station Name ' + calData?.gage?.station_name"
            :title="'Station Name ' + calData?.gage?.station_name">
            <span class="font-medium">{{ calData?.gage?.station_name }}</span>
          </div>
        </div>
      </div>
      <div class="line-spacer">&nbsp;</div>
      <div class="grid grid-cols=1 gap=1 text-sm">
        <div class="col-span-1">
          <div v-if="calData?.formulation_name" :aria-label="'Formulation Name ' + calData?.formulation_name"
            :title="'Formulation Name ' + calData?.formulation_name"><span class="font-medium">Formulation Name:</span>
            {{
              calData?.formulation_name }}
          </div>
          <div v-if="calData?.modules?.length" :aria-label="'Modules ' + getModuleList()"
            :title="'Modules ' + getModuleList()"><span class="font-medium">Modules:
            </span>{{ getModuleList() }}</div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap=1 text-sm text-left mt-2">
        <div class="col-span-1">
          <div v-if="calData?.calibration_times?.simulation_start_time" class="font-medium">Calibration Run</div>
          <div v-if="calData?.calibration_times?.simulation_start_time"
            :aria-label="'Calibration Sim Start ' + formatDate(calData?.calibration_times?.simulation_start_time)"
            :title="'Calibration Sim Start ' + formatDate(calData?.calibration_times?.simulation_start_time)"><span
              class="font-medium">Sim Start:</span>
            <div class="datePos">
              {{ formatDate(calData?.calibration_times?.simulation_start_time) }}</div>
          </div>
          <div v-if="calData?.calibration_times?.simulation_end_time"
            :aria-label="'Calibration Sim End ' + formatDate(calData?.calibration_times?.simulation_end_time)"
            :title="'Calibration Sim End ' + formatDate(calData?.calibration_times?.simulation_end_time)"><span
              class="font-medium">Sim End:</span>
            <div class="datePos">
              {{ formatDate(calData?.calibration_times?.simulation_end_time) }}</div>
          </div>
          <div v-if="calData?.calibration_times?.calibration_start_time"
            :aria-label="'Calibration Cal Start  ' + formatDate(calData?.calibration_times?.calibration_start_time)"
            :title="'Calibration Cal Start ' + formatDate(calData?.calibration_times?.calibration_start_time)"><span
              class="font-medium">Calib Start:</span>
            <div class="datePos">
              {{ formatDate(calData?.calibration_times?.calibration_start_time) }}</div>
          </div>
          <div v-if="calData?.calibration_times?.calibration_end_time"
            :aria-label="'Calibration Cal End' + formatDate(calData?.calibration_times?.calibration_end_time)"
            :title="'Calibration Cal End ' + formatDate(calData?.calibration_times?.calibration_end_time)"><span
              class="font-medium">Calib End:</span>
            <div class="datePos">
              {{ formatDate(calData?.calibration_times?.calibration_end_time) }}</div>
          </div>
          <div class="line-spacer">&nbsp;</div>
          <div v-if="calData?.optimization"><span class="font-medium"
              :aria-label="'Optimization Algorithm ' + calData?.optimization"
              :title="'Optimization Algorithm ' + calData?.optimization">Optimization Algorithm:</span>
            {{ calData?.optimization }}</div>
          <div v-if="calData?.objective_function" :aria-label="'Objective Function ' + calData?.objective_function"
            :title="'Objective Function ' + calData?.objective_function"><span class="font-medium">Objective
              Function:</span>
            {{ calData?.objective_function }}</div>
          <div v-if="calData?.save_plot_iteration_frequency"
            :aria-label="'Plot Generation Frequency ' + calData?.save_plot_iteration_frequency"
            :title="'Plot Generation Frequency ' + calData?.save_plot_iteration_frequency"><span
            class="font-medium">Plot Generation Frequency:</span>
          {{ calData?.save_plot_iteration_frequency }}</div>
        </div>
        <div class="col-span-1">
          <div v-if="calData?.validation_times?.simulation_start_time"><span class="font-medium">Validation Run</span>
          </div>
          <div v-if="calData?.validation_times?.simulation_start_time"
            :aria-label="'Validation Sim Start ' + formatDate(calData?.validation_times?.simulation_start_time)"
            :title="'Validation Sim Start ' + formatDate(calData?.validation_times?.simulation_start_time)"><span
              class="font-medium">Sim Start:</span>
            <div class="datePos">
              {{ formatDate(calData?.validation_times?.simulation_start_time) }}</div>
          </div>
          <div v-if="calData?.validation_times?.simulation_end_time"
            :aria-label="'Validation Sim End ' + formatDate(calData?.validation_times?.simulation_end_time)"
            :title="'Validation Sim End ' + formatDate(calData?.validation_times?.simulation_end_time)"><span
              class="font-medium">Sim End:</span>
            <div class="datePos">
              {{ formatDate(calData?.validation_times?.simulation_end_time) }}</div>
          </div>
          <div v-if="calData?.validation_times?.validation_start_time"
            :aria-label="'Validation Val Start ' + formatDate(calData?.validation_times?.validation_start_time)"
            :title="'Validation Val Start ' + formatDate(calData?.validation_times?.validation_start_time)"><span
              class="font-medium">Val Start:</span>
            <div class="datePos">
              {{ formatDate(calData?.validation_times?.validation_start_time) }}</div>
          </div>
          <div v-if="calData?.validation_times?.validation_end_time"
            :aria-label="'Validation Val End ' + formatDate(calData?.validation_times?.validation_end_time)"
            :title="'Validation Val End ' + formatDate(calData?.validation_times?.validation_end_time)"><span
              class="font-medium">Val End:</span>
            <div class="datePos">
              {{ formatDate(calData?.validation_times?.validation_end_time) }}</div>
          </div>
          <div class="line-spacer">&nbsp;</div>
          <div v-if="userSelectedCalibrationTuningParameters && userSelectedCalibrationTuningParameters.length > 0"
            :aria-label="'Tuning Parameters ' + userSelectedCalibrationTuningParameters.length"
            :title="'Tuning Parameters ' + userSelectedCalibrationTuningParameters.length">
            <span class="font-medium">Tuning Parameters:</span>
            {{ userSelectedCalibrationTuningParameters.length }}
          </div>
          <div v-if="calData?.stop_criteria"><span class="font-medium"
              :aria-label="'Calibration Stop Criteria ' + calData?.stop_criteria"
              :title="'Calibration Stop Criteria ' + calData?.stop_criteria">Calibration Stop Criteria:</span>
            {{ calData?.stop_criteria }}</div>
        </div>
        <div class="line-spacer">&nbsp;</div>
	      <div class="col-span-2">
          <div v-if="resultsPathname"
            :aria-label="'Results Pathname ' + resultsPathname"
            :title="'Results Pathname ' + resultsPathname"><span class="font-medium">
              Results Pathname:</span>
            {{ resultsPathname }}</div>
        </div>
        <div class="col-span-2">&nbsp;</div>
      </div>
    </div>
  </div>

</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';

import { useUserDataStore } from '@/stores/common/UserDataStore';
import { useTuningStore } from "@/stores/calibration/TuningStore";
import { useRunStatusStore } from '@/stores/calibration/RunStatusStore';

import { formatISOStringOrDateToYYYYMMDDHHMM } from '@/utils/TimeHelpers';

const { userCalibrationRunData } = storeToRefs(useUserDataStore());
const calData = ref(userCalibrationRunData);
const { userSelectedCalibrationTuningParameters } = storeToRefs(useTuningStore());
const { resultsPathname } = storeToRefs(useRunStatusStore());

const componentProps = withDefaults(defineProps<{
  title?: string
}>(), {
  title: () => 'Setup - Calibration Job ID '
}
);

const getModuleList = () => {
  let modules = "";
  calData.value?.modules.forEach(element => {
    modules += element;
    if (calData.value?.modules[calData.value?.modules.length - 1] !== element) {
      modules += ", ";
    }
  });
  return modules;
};

const formatDate = (d: any) => {
  if ((d instanceof Date)) {
    console.log('Date');
  } else {
    return formatISOStringOrDateToYYYYMMDDHHMM(d);
  }
};

</script>

<style lang="scss" scoped>
#Messages {
  padding: 0 15px;
  font-size: 1.2em;
}

div {
  line-height: 1.5em;
}

.datePos {
  float: right;
  margin-right: 50px;
}

.line-spacer {
  line-height: 1em;
}
</style>
