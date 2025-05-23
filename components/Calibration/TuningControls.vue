<template>
  <div id="TuningControls" class="">
    <div class="mt-3 mb-2">
      <div v-if="rangeDateFrom && rangeDateTo" class="text-left mt-1 text-xl c-blue-primary1 font-bold" id="RangeDates"
        :aria-label="'Range is from ' + format(rangeDateFrom) + ' to ' + format(rangeDateTo)"
        :title="'Range is from ' + format(rangeDateFrom) + ' to ' + format(rangeDateTo)">
        RANGE: {{ format(rangeDateFrom) }} GMT to {{ format(rangeDateTo) }} GMT
      </div>
    </div>
    <div class="grid grid-cols-2">

      <div class="col-span-2">
        <div id="BoxLeft" class="text-left">
          <div id="BoxTopLeft" class="pt-2">
            <span class="tabTitles font-bold" aria-label="Calibration Time Controls, All times entered must be in GMT"
              title="Calibration Time Controls, All times entered must be in GMT">Calibration Time
              Controls <span class="font-normal"><small>(* All
                  times entered must be in GMT)</small></span></span>
          </div>
          <div id="BoxBottomLeft" class="pt-2">
            <div class="timeBlocks datepicker-wrapper w-[695px]" @click="handleCalibrationTimeControlsClick">

              <table class="table-auto border-collapse ml-0">
                <tbody>
                  <tr>
                    <th scope="row" class="w-1/6">
                      <label for="SimulationStart" class="whitespace-nowrap">Simulation Start</label>
                    </th>
                    <td class="text-left w-2/6" style="position: relative;">
                      <VueDatePicker id="SimulationStart" class="datePickers dp__theme_dark" v-model="simStartTime"
                        time-picker-inline text-input utc='preserve' format="yyyy-MM-dd HH:00"
                        @update:model-value="handleSimStartUpdate" aria-label="Calibration Time Simulation Start"
                        title="Calibration Time Simulation Start"
                        :disabled="!isTimeRangeSet() || !isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)" />
                    </td>
                    <th scope="row" class="pl-6 w-1/6">
                      <label for="SimulationEnd" class="whitespace-nowrap">Simulation End</label>
                    </th>
                    <td class="text-left w-2/6" style="position: relative;">
                      <VueDatePicker id="SimulationEnd" class="datePickers dp__theme_dark" v-model="simEndTime"
                        time-picker-inline text-input utc='preserve' format="yyyy-MM-dd HH:00"
                        @update:model-value="handleSimEndUpdate" aria-label="Calibration Time Simulation End"
                        title="Calibration Time Simulation End"
                        :disabled="!isTimeRangeSet() || !isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)" />
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" class="w-1/6">
                      <label for="CalibrationStart" class="whitespace-nowrap">Calibration Start</label>
                    </th>
                    <td class="text-left w-2/6" style="position: relative;">
                      <VueDatePicker id="CalibrationStart" class="datePickers dp__theme_dark" v-model="calStartTime"
                        time-picker-inline text-input utc='preserve' format="yyyy-MM-dd HH:00"
                        @update:model-value="handleCalStartUpdate" aria-label="Calibration Time Calibration Start"
                        title="Calibration Time Calibration Start"
                        :disabled="!isTimeRangeSet() || !isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)" />
                    </td>
                    <th scope="row" class="pl-6 w-1/6">
                      <label for="CalibrationEnd" class="whitespace-nowrap">Calibration End</label>
                    </th>
                    <td class="text-left w-2/6" style="position: relative;">
                      <VueDatePicker id="CalibrationEnd" class="datePickers dp__theme_dark" v-model="calEndTime"
                        time-picker-inline text-input utc='preserve' format="yyyy-MM-dd HH:00"
                        @update:model-value="handleCalEndUpdate" aria-label="Calibration Time Calibration End"
                        title="Calibration Time Calibration End"
                        :disabled="!isTimeRangeSet() || !isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)" />
                    </td>
                  </tr>
                </tbody>
              </table>

            </div>
          </div>

          <div id="BoxTopRight" class="pt-4">
            <label for="CheckTheBox" class="inline">Automatic Validation Time Controls</label>
          </div>
          <div id="BoxBottomRight" class="pt-0 ml-0">
            <div v-if="!automatic_validation" class="tabTitles">
              Check the box above to enable Automatic Validation
            </div>

            <div v-else>
              <div class="timeBlocks datepicker-wrapper w-[695px]" @click="handleCalibrationTimeControlsClick">
                <table class="table-auto border-collapse ml-0">
                  <tbody>
                    <tr>
                      <th scope="row" class="w-1/6">
                        <label for="ValSimulationStart" class="whitespace-nowrap">Simulation Start </label>
                      </th>
                      <td class="text-left w-2/6" style="position: relative;">
                        <VueDatePicker id="ValSimulationStart" class="datePickers dp__theme_dark"
                          v-model="avSimStartTime" time-picker-inline text-input utc='preserve'
                          format="yyyy-MM-dd HH:00" @update:model-value="handleAvSimStartUpdate"
                          aria-label="Automatic Validation Time Simulation Start"
                          title="Automatic Validation Time Simulation Start"
                          :disabled="!isTimeRangeSet() || !isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)" />
                      </td>
                      <th scope="row" class="pl-6 w-1/6">
                        <label for="ValSimulationEnd" class="whitespace-nowrap">Simulation End </label>
                      </th>
                      <td class="text-left w-2/6" style="position: relative;">
                        <VueDatePicker id="ValSimulationEnd" class="datePickers dp__theme_dark" v-model="avSimEndTime"
                          time-picker-inline text-input utc='preserve' format="yyyy-MM-dd HH:00"
                          @update:model-value="handleAvSimEndUpdate"
                          aria-label="Automatic Validation Time Simulation End"
                          title="Automatic Validation Time Simulation End"
                          :disabled="!isTimeRangeSet() || !isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)" />
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" class="w-1/6">
                        <label for="ValidationStart" class="whitespace-nowrap">Validation Start </label>
                      </th>
                      <td class="text-left w-2/6" style="position: relative;">
                        <VueDatePicker id="ValidationStart" class="datePickers dp__theme_dark" v-model="avCalStartTime"
                          time-picker-inline text-input utc='preserve' format="yyyy-MM-dd HH:00"
                          @update:model-value="handleAvCalStartUpdate"
                          aria-label="VAutomatic Validation Time alidation Start"
                          title="Automatic Validation Time Validation Start"
                          :disabled="!isTimeRangeSet() || !isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)" />
                      </td>
                      <th scope="row" class="pl-6 w-1/6">
                        <label for="ValidationEnd" class="whitespace-nowrap">Validation End </label>
                      </th>
                      <td class="text-left w-2/6" style="position: relative;">
                        <VueDatePicker id="ValidationEnd" class="datePickers dp__theme_dark" v-model="avCalEndTime"
                          time-picker-inline text-input utc='preserve' format="yyyy-MM-dd HH:00"
                          @update:model-value="handleAvCalEndUpdate"
                          aria-label="Automatic Validation Time Validation End"
                          title="Automatic Validation Time Validation End"
                          :disabled="!isTimeRangeSet() || !isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>


  <div class="pr-2">

    <div class="text-left">
      <div class="grid grid-cols-2 pb-3">

        <div class="col-span-2">&nbsp;</div>
        <div class="col-span-2 mt-5 mb-3 hr"></div>
        <div class="col-span-2">

          <div class="mb-2 font-bold mt-2">Calibration Tuning Parameters</div>
          <div id="UploadParams" class=" inline ml-3" style="position: relative;" @click="triggerFileInput">
            <input type="file" ref="fileInput" class="hidden" @change="handleFileUpload" />
            <Button class="ngenButtonDiv-alt"
              :disabled="!isFormulationDataSaved() || !isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)"
              aria-label="Load Parameters File optional" title="Load Parameters File optional">
              Load Parameters File (optional)</Button>
            <div v-if="!isFormulationDataSaved()" class="overlay"></div>
          </div>
        </div>

        <div class="col-span-1 mt-2">
          <div class="text-left mt-2">
            <div class="font-bold">Calibratable Parameters</div>
            <Select id="ParamName" class="varInputs mt-1" v-model="selectedParameter"
              :disabled="!isFormulationDataSaved() || !isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)"
              :options="calibrationTuningParameters" optionLabel="output" optionValue="output"
              aria-label="Select Calibratable Parameters" title="Select Calibratable Parameters">
              <template #option="slotProps">
                <div>{{ slotProps.option.name }} &nbsp; ({{ slotProps.option.module }})</div>
              </template>
            </Select>
            <div id="UploadParams" class="inline ml-3" @click="addCalibrationTuningParameter">
              <Button class="ngenButtonDiv-alt" aria-label="Add Selected Calibratable Parameter Button"
                title="Add Selected Calibratable Parameter Button"
                :disabled="!isFormulationDataSaved() || !isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)">Add</Button>
            </div>
          </div>

        </div>

        <div class="col-span-1 mt-2 relative">
          <Button class="c-blue font-normal underline absolute bottom-[-5px] right-3 text-lg"
            @click="clearUserSelectedCalibrationTuningParameters()" aria-label="Clear Calibratable Parameters"
            title="Clear Calibratable Parameters"
            :disabled="!isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)">Clear</Button>
        </div>

      </div>
    </div>

    <div id="TuningDataList" class="mt-2 mb-10 overflow-auto max-h-[200px]" style="position: relative;">

      <ContextMenu :pt="{ root: { id: 'tuning-context-menu' } }" class="bg-white" ref="tuningContextMenu"
        :model="cmTuningParameterData"></ContextMenu>
      <DataTable :value="userSelectedCalibrationTuningParameters" scrollable scroll-height="200px"
        v-model:selection="selectedTuningParameterData" selectionMode="single" contextMenu
        v-model:contextMenuSelection="selectedTuningParameterData" @rowContextmenu="onRowContextMenu"
        :rowClass="rowClass" :rowStyle="rowStyle">

        <!-- parameter column, uneditable -->
        <Column field="parameter" header="Parameter" sortable>
          <template #body="slotProps">
            <span style="background-color: lightgrey; padding: 4px; display: block;"
              :aria-label="'Parameter name is ' + slotProps.data.name"
              :title="'Parameter name is' + slotProps.data.name">
              {{ slotProps.data.name }} </span>
          </template>
        </Column>

        <!-- module column, uneditable -->
        <Column field="module" header="Module" sortable>
          <template #body="slotProps">
            <span style="background-color: lightgrey; padding: 4px; display: inline-block; white-space: nowrap;"
              :aria-label="'Module name is ' + slotProps.data.module"
              :title="'Module name is ' + slotProps.data.module">
              {{ slotProps.data.module }}
            </span>
          </template>
        </Column>

        <!-- min column, editable -->
        <Column field="min" header="Min" sortable>
          <template #body="slotProps">
            <input type="text" v-model="slotProps.data.minimum"
              @input="updateCalibrationTuningParameter(slotProps.index, 'minimum', $event)" style="width: 100%;"
              :aria-label="'Minimum value is ' + slotProps.data.minimum"
              :title="'Minimum value is ' + slotProps.data.minimum" />
          </template>
        </Column>

        <!-- max column, editable -->
        <Column field="max" header="Max" sortable>
          <template #body="slotProps">
            <input type="text" v-model="slotProps.data.maximum"
              @input="updateCalibrationTuningParameter(slotProps.index, 'maximum', $event)" style="width: 100%;"
              :aria-label="'Maximum value is ' + slotProps.data.maximum"
              :title="'Maximum value is ' + slotProps.data.maximum" />
          </template>
        </Column>

        <!-- initValue column, editable -->
        <Column field="initValue" header="Initial Value" sortable>
          <template #body="slotProps">
            <input type="text" v-model="slotProps.data.initial_value"
              @input="updateCalibrationTuningParameter(slotProps.index, 'initial_value', $event)" style="width: 100%;"
              slotProps.data.maximum :aria-label="'Initial value is ' + slotProps.data.initial_value"
              :title="'Initial value is ' + slotProps.data.initial_value" />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>

  <div class="grid grid-rows-1 mt-8 ActionButtonsBox" id="Tuningbuttons">
    <div id="TuningBottomButtons" class="grid grid-cols-8">
      <span v-if="userCalibrationRunData && isCalibrationJobStatusSavedOrReady(userCalibrationRunData.status)">
        <div class="col-span-1 mr-6 h-8" @click="saveTuningData()">
          <Button class="font-normal ngenButtonDiv-green" title="Save" aria-label="Save Button">
            Save
          </Button>
        </div>
      </span>
      <span v-else>
        <div class="col-span-1 mr-6 h-8 whitespace-nowrap">
          Run on {{ formatDateForRunOnString(submitTimeDate as Date) }}
        </div>
      </span>

      <span v-if="userCalibrationRunData && isCalibrationJobStatusSavedOrReady(userCalibrationRunData.status)">
        <div class="col-span-1 mr-3">
          <!--<Button class="c-blue font-normal text-xl underline pt-1" title="Revert Button" @click="resetTuningData()"
            aria-label="Revert Button">Revert</Button>-->
        </div>
      </span>

      <span v-else>
        <div class="col-span-1 mr-3">&nbsp;</div>
      </span>

      <div class="col-span-4">&nbsp;</div>
      <div class="col-span-1">
        <Button class="ngenButtonDiv ml-6 font-normal h-8 float-right" title="Previous Tab Button"
          aria-label="Previous Tab Button" @click="goPrevTab()">Prev</Button>
      </div>
      <div class="col-span-1 mr-4">
        <Button class="ngenButtonDiv ml-6 font-normal h-8" title="Next Tab Button" aria-label="Next Tab Button"
          @click="goNextTab()">Next</Button>
      </div>

    </div>
  </div>
  <DynamicDialog />
  <div class="waitgif" v-if="isLoading || tuningStore_data_loading">
    <img alt="Please wait..." src="@/assets/styles/img/wait.gif" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";

import VueDatePicker from "@vuepic/vue-datepicker";
import { DateTime } from "luxon";
import Select from "primevue/select";
import { useToast } from "primevue/usetoast";
import { useDialog } from "primevue/usedialog";

import type { GeneralErrorResponse, ValidationErrorObject, NonFieldError } from "@/composables/NextGenModel"

import type { DatePickerProps } from "primevue/datepicker";
import type { ToastMessageOptions } from "primevue/toast";
import { ToastTimeout } from "@/composables/NextgenEnums";

import { generalStore } from "@/stores/common/GeneralStore";
import { useFormulationStore } from "~/stores/calibration/FormulationStore";
import { useRunStatusStore } from "@/stores/calibration/RunStatusStore";
import { useTuningStore } from "@/stores/calibration/TuningStore";
import { useUserDataStore } from "@/stores/common/UserDataStore";

import { isCalibrationJobStatusSavedOrReady, isValidDateTime, isNotNullOrUndefined } from "@/utils/CommonHelpers";
import { formatISOStringOrDateToYYYYMMDDHHMM } from "@/utils/TimeHelpers";
import { makeProtectedApiCall } from '@/composables/UserAuth';
import { useBackendConfig } from "@/composables/UseBackendConfig";
import { ifEDSErrorsExist } from "@/utils/TuningControlsHelpers";
import { formatDateForRunOnString } from "@/utils/TimeHelpers";
import { hilightTab } from '@/composables/TabHilight';

import MoveNextPrevDialog from "../Common/MoveNextPrevDialog.vue";



const dialog = useDialog();
const nextPrevDialogOpened = ref<boolean>(false);

const format = formatISOStringOrDateToYYYYMMDDHHMM;

const { addToastRecord } = generalStore();
const { isLoading } = storeToRefs(generalStore());

const { calibrationJobId } = storeToRefs(generalStore());
const { ngencerfBaseUrl } = useBackendConfig();
const userDataStore = useUserDataStore();
const tuningStore = useTuningStore();
const { submitTimeDate } = storeToRefs(useRunStatusStore());

const {
  formulationNameInput,
  selectedModuleValues,
  slothParameterInputs
} = storeToRefs(useFormulationStore());

const { getAccessToken } = userDataStore;
const { userCalibrationRunData } = storeToRefs(userDataStore);
const { loadTuningTabStaticData, saveTuningTabData } = tuningStore;
const {
  tuningStore_data_loading,
  loadTuningTabData,
  simStartTime,
  simEndTime,
  calStartTime,
  calEndTime,
  calibrationTuningParameters,
  userSelectedCalibrationTuningParameters,
  automatic_validation,
  avSimStartTime,
  avSimEndTime,
  avCalStartTime,
  avCalEndTime,
  rangeDateFrom,
  rangeDateTo,
  saveTuningTabRequestBody
} = storeToRefs(tuningStore);

const toast = useToast();
const selectedParameter = ref<any>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const isInitialSetupDone = ref(false);
const selectedTuningParameterData = ref();
const tuningContextMenu = ref();

const cmTuningParameterData = ref([
  { label: 'Delete', icon: 'pi pi-fw-times', command: () => deleteCalibrationTuningParameter(selectedTuningParameterData) }
]);

const onRowContextMenu = (event: any) => {
  tuningContextMenu.value.show(event.originalEvent);
};

let mainLeftAreaElement: HTMLElement | null = null;
let dataTableElement: HTMLElement | null = null;

onMounted(async () => {
  hilightTab(CalibrationTabs.tab_tuningControls);

  toast.removeAllGroups();

  mainLeftAreaElement = document.getElementById("MainLeftDataArea") as HTMLElement;
  if (mainLeftAreaElement) { mainLeftAreaElement.scrollTo(0, 0); }

  // Check to see if there is a job. If not, don't initialize this tab!
  if (calibrationJobId.value) {

    if (!userSelectedCalibrationTuningParameters.value.length) {
      selectedTuningParameterData.value = null;
    }

    // if Tuning Tab static data is not loaded, fetch it
    await loadTuningTabStaticData();
    tuningStore_data_loading.value = false;

    // check if EDS errors exist
    const edsErrorMessage = loadTuningTabData.value ? ifEDSErrorsExist(loadTuningTabData.value._data) : '';
    if (edsErrorMessage) {
      const tMsg: ToastMessageOptions = { severity: 'error', summary: 'EDS Error', detail: edsErrorMessage };
      toast.add(tMsg); addToastRecord(tMsg);
    }

    // set calibration times
    if (userCalibrationRunData?.value?.calibration_times) {
      const { simulation_start_time, simulation_end_time, calibration_start_time, calibration_end_time } = userCalibrationRunData.value.calibration_times;

      // set calibration times only if they are not already set
      // if a user purposely removes all times, they will be reset to the default values. Is that what we want?
      if (!isValidDateTime(simStartTime.value) && !isValidDateTime(simEndTime.value) && !isValidDateTime(calStartTime.value) && !isValidDateTime(calEndTime.value)) {
        simStartTime.value = DateTime.fromISO(simulation_start_time, { zone: 'utc' });
        simEndTime.value = DateTime.fromISO(simulation_end_time, { zone: 'utc' });
        calStartTime.value = DateTime.fromISO(calibration_start_time, { zone: 'utc' });
        calEndTime.value = DateTime.fromISO(calibration_end_time, { zone: 'utc' });
      }
    };

    // set automatic validation times
    if (userCalibrationRunData?.value?.validation_times) {
      const { simulation_start_time, simulation_end_time, validation_start_time, validation_end_time } = userCalibrationRunData.value.validation_times;

      // set automatic validation times only if they are not already set
      // if a user purposely removes all times, they will be reset to the default values. Is that what we want?
      if (!isValidDateTime(avSimStartTime.value) && !isValidDateTime(avSimEndTime.value) && !isValidDateTime(avCalStartTime.value) && !isValidDateTime(avCalEndTime.value)) {
        avSimStartTime.value = DateTime.fromISO(simulation_start_time, { zone: 'utc' });
        avSimEndTime.value = DateTime.fromISO(simulation_end_time, { zone: 'utc' });
        avCalStartTime.value = DateTime.fromISO(validation_start_time, { zone: 'utc' });
        avCalEndTime.value = DateTime.fromISO(validation_end_time, { zone: 'utc' });
      }
    };

    isInitialSetupDone.value = true; // set to true after initial setup
  } else {
    const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'No Calibration Job ID', detail: 'No calibration job ID found. Please go back to the Calibration Runs tab and select a job.' };
    toast.add(tMsg); addToastRecord(tMsg);
  }

  isLoading.value = false;
});

/**
 * Check if time_range is set
 * @returns boolean
 */
const isTimeRangeSet = (): boolean => {
  const timeRange = userCalibrationRunData?.value?.time_range;

  if (timeRange && Object.keys(timeRange).length > 0) {
    return true;
  } else {
    return false;
  }
};

/**
 * Check if formulation data has been saved
 * @returns boolean
 */
const isFormulationDataSaved = (): boolean => {
  if (formulationNameInput.value === "" && selectedModuleValues?.value.length === 0 && slothParameterInputs?.value.length === 0) {
    return false;
  } else {
    return true;
  }
};

const handleCalibrationTimeControlsClick = (event: Event) => {
  if (!isTimeRangeSet()) {
    event.preventDefault(); // Prevent any default action if time_range is not set
    const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Calibration Tuning Controls are disabled', detail: 'You cannot interact with time controls because Forcing and Observational data is not set.' };
    toast.add(tMsg); addToastRecord(tMsg);
  }
};

const handleSimStartUpdate = (value: any) => {
  if (typeof value === 'string') {
    simStartTime.value = DateTime.fromISO(value, { zone: 'utc' });
  }
};

const handleSimEndUpdate = (value: any) => {
  if (typeof value === 'string') {
    simEndTime.value = DateTime.fromISO(value, { zone: 'utc' });
  }
};

const handleCalStartUpdate = (value: any) => {
  if (typeof value === 'string') {
    calStartTime.value = DateTime.fromISO(value, { zone: 'utc' });
  }
};

const handleCalEndUpdate = (value: any) => {
  if (typeof value === 'string') {
    calEndTime.value = DateTime.fromISO(value, { zone: 'utc' });
  }
};

const handleAvSimStartUpdate = (value: any) => {
  if (typeof value === 'string') {
    avSimStartTime.value = DateTime.fromISO(value, { zone: 'utc' });
  }
};

const handleAvSimEndUpdate = (value: any) => {
  if (typeof value === 'string') {
    avSimEndTime.value = DateTime.fromISO(value, { zone: 'utc' });
  }
};

const handleAvCalStartUpdate = (value: any) => {
  if (typeof value === 'string') {
    avCalStartTime.value = DateTime.fromISO(value, { zone: 'utc' });
  }
};

const handleAvCalEndUpdate = (value: any) => {
  if (typeof value === 'string') {
    avCalEndTime.value = DateTime.fromISO(value, { zone: 'utc' });
  }
};


// watch for changes to simStartTime. If simStartTime is set, set calStartTime to one year after simStartTime if not already set
watch(simStartTime, () => {
  if ((!calStartTime.value || !isValidDateTime(calStartTime.value)) && simStartTime.value && isValidDateTime(simStartTime.value)) {
    calStartTime.value = simStartTime.value.plus({ years: 1 }); // set calStartTime to one year after simStartTime
  }
  else if ((!calStartTime.value || !isValidDateTime(calStartTime.value)) && simStartTime.value && typeof simStartTime.value === 'string') {
    // the simStartTime binding might call this watch function when it is a string.
    const simStartDateTime = DateTime.fromISO(simStartTime.value, { zone: 'utc' });
    calStartTime.value = simStartDateTime.value.plus({ years: 1 });
  }
});

// watch for changes to simEndTime. If simEndTime is set, set calEndTime to be the same as simEndTime if not already set
watch(simEndTime, () => {
  if ((!calEndTime.value || !isValidDateTime(calEndTime.value)) && simEndTime.value && isValidDateTime(simEndTime.value)) {
    calEndTime.value = simEndTime.value;
  }
  else if ((!calEndTime.value || !isValidDateTime(calEndTime.value)) && simEndTime.value && typeof simEndTime.value === 'string') {
    const simEndDateTime = DateTime.fromISO(simEndTime.value, { zone: 'utc' });
    calEndTime.value = simEndDateTime.value;
  }
});

// watch for changes to avSimStartTime. If avSimStartTime is set, set avCalStartTime to one year after avSimStartTime if not already set
watch(avSimStartTime, () => {
  if ((!avCalStartTime.value || !isValidDateTime(avCalStartTime.value)) && avSimStartTime.value && isValidDateTime(avSimStartTime.value)) {
    avCalStartTime.value = avSimStartTime.value.plus({ years: 1 });
  }
  else if ((!avCalStartTime.value || !isValidDateTime(avCalStartTime.value)) && avSimStartTime.value && typeof avSimStartTime.value === 'string') {
    const avSimStartDateTime = DateTime.fromISO(avSimStartTime.value, { zone: 'utc' });
    avCalStartTime.value = avSimStartDateTime.value.plus({ years: 1 });
  }
});

// watch for changes to avSimEndTime. If avSimEndTime is set, set avCalEndTime to be the same as avSimEndTime if not already set
watch(avSimEndTime, () => {
  if ((!avCalEndTime.value || !isValidDateTime(avCalEndTime.value)) && avSimEndTime.value && isValidDateTime(avSimEndTime.value)) {
    avCalEndTime.value = avSimEndTime.value;
  }
  else if ((!avCalEndTime.value || !isValidDateTime(avCalEndTime.value)) && avSimEndTime.value && typeof avSimEndTime.value === 'string') {
    const avSimEndDateTime = DateTime.fromISO(avSimEndTime.value, { zone: 'utc' });
    avCalEndTime.value = avSimEndDateTime.value;
  }
});

/**
 * Trigger file input dialog
 */
const triggerFileInput = () => {
  if (fileInput.value) {
    if (fileInput.value.value) {
      fileInput.value.value = '';
    }
    fileInput.value.click();
  }
};

/**
 * Handle parameter file upload
 * @param event
 */
const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0]; // get the first file we see
  let errorMessage = '';
  let invalidParameters: any[] = [];
  if (file) {
    try {
      const formData = new FormData();
      formData.append('user_parameter_file', file);
      formData.append('calibration_run_id', String(calibrationJobId.value));

      const response: any = await makeProtectedApiCall<any>(
        `${ngencerfBaseUrl}/calibration/upload_user_parameters/`,
        {
          method: 'POST',
          mode: 'cors',
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
          },
          body: formData,
        });
      if (response.error && response.error === TokenExpired) {
        alert("Your session had timed out");
        navigateTo('login');
      } else if (response?._data.user_parameter_file) {
        // Populate the Parameter table with the data from user-uploaded file
        response._data?.user_parameter_file?.forEach((param: any) => {
          if (
            isNotNullOrUndefined(param.param) &&
            isNotNullOrUndefined(param.min) &&
            isNotNullOrUndefined(param.max) &&
            isNotNullOrUndefined(param.init) &&
            isNotNullOrUndefined(param.model)) {
            // check if parameter is in the calibrationTuningParameters list and that the module name matches, which is the list of calibratable parameters
            const isParameterInCalibratableList = calibrationTuningParameters?.value?.some((paramData: any) => paramData.name === param.param && paramData.module === param.model);

            // if parameter is not in the list of calibratable parameters, add it to the list of invalid parameters
            if (!isParameterInCalibratableList) {
              invalidParameters.push(param.param);
            }

            // check if parameter is already in the table
            const isParameterAlreadyInTable = userSelectedCalibrationTuningParameters?.value?.some((paramData: any) => paramData.name === param.param);

            // if parameter we are adding is already in the table, delete the parameter from the table so we can override it
            if (isParameterAlreadyInTable) {
              userSelectedCalibrationTuningParameters.value = userSelectedCalibrationTuningParameters?.value?.filter((paramData: any) => paramData.name !== param.param);
            }

            // add parameter to the table if it is in the list of calibratable parameters
            if (isParameterInCalibratableList) {
              userSelectedCalibrationTuningParameters?.value?.push({
                name: param.param,
                minimum: param.min,
                maximum: param.max,
                initial_value: param.init,
                module: param.model, // module?
              });
            }
          } else {
            errorMessage = response._data?.message;
            const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Invalid data in parameter file', detail: errorMessage };
            toast.add(tMsg); addToastRecord(tMsg);
          }
        });

        // scroll to the bottom of the page and table
        scrollToBottom();

        if (invalidParameters.length > 0) {
          const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Invalid parameters in parameter file', detail: `The following parameters in the uploaded file were not imported because they are not calibratable:\n ${invalidParameters.join(', ')}` };
          toast.add(tMsg); addToastRecord(tMsg);
        }
      } else {
        const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'No data in parameter file' };
        toast.add(tMsg); addToastRecord(tMsg);
      }
    } catch (error) {
      const tMsg: ToastMessageOptions = { severity: 'error', summary: 'File upload failed' };
      toast.add(tMsg); addToastRecord(tMsg);
      console.error('File upload failed:', error);
    }
  } else {
    const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'No file selected' };
    toast.add(tMsg); addToastRecord(tMsg);
    console.error('No file selected');
  }
};

/**
 * Add selected calibration tuning parameter to the table when Add / Update button is clicked
 */
const addCalibrationTuningParameter = () => {
  const parameter = calibrationTuningParameters?.value?.find(param => param.output === selectedParameter.value);
  const isParameterAlreadyInTable = userSelectedCalibrationTuningParameters?.value?.find(param => param.name === parameter.name);

  // add parameter to table if it is not already in the table
  if (!isParameterAlreadyInTable && parameter) {
    userSelectedCalibrationTuningParameters?.value?.push({
      name: parameter.name,
      minimum: parameter.minimum,
      maximum: parameter.maximum,
      initial_value: parameter.initial_value,
      module: parameter.module,
    });
  }

  // scroll to the bottom of the page and table
  scrollToBottom();
};

/**
 * Scroll page and table to the bottom
 */
const scrollToBottom = () => {
  // grab main left area and data table elements and scroll to bottom
  // using nextTick to ensure elements are up to date before scrolling
  nextTick(() => {
    mainLeftAreaElement = document.getElementById("MainLeftDataArea") as HTMLElement;
    dataTableElement = document.querySelector(".p-datatable-table-container") as HTMLElement;

    if (mainLeftAreaElement) {
      mainLeftAreaElement.scrollTo({
        top: mainLeftAreaElement.scrollHeight,
        behavior: 'smooth'
      });
    }

    if (dataTableElement) {
      dataTableElement.scrollTo({
        top: dataTableElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  });
};

/**
 * Update Calibration Tuning Parameter with new value
 * @param index The index of the item being updated
 * @param field The field ('min', 'max', or 'initValue') being updated
 * @param value The new value entered by the user
 */
const updateCalibrationTuningParameter = (index: number, field: string, ev: Event) => {
  const valEv = ev.target as HTMLInputElement;
  const value = valEv?.value;
  // update userSelectedCalibrationTuningParameters with the new value
  userSelectedCalibrationTuningParameters.value[index][field] = value;

  // update calibrationTuningParameters with the new value
  const parameter = calibrationTuningParameters?.value?.find(param => param.name === userSelectedCalibrationTuningParameters.value[index].name);
  if (parameter) {
    if (field === 'minimum') {
      parameter.minimum = value;
    } else if (field === 'maximum') {
      parameter.maximum = value;
    } else if (field === 'initial_value') {
      parameter.initial_value = value;
    }
  }
};

/**
 * Delete Calibration Tuning Parameter from the table
 */
const deleteCalibrationTuningParameter = (selectedTuningParameterData: any) => {
  userSelectedCalibrationTuningParameters.value = userSelectedCalibrationTuningParameters.value.filter((param: any) => param.name !== selectedTuningParameterData.value.name);
};

/**
 * Clear userSelectedCalibrationTuningParameters
 */
const clearUserSelectedCalibrationTuningParameters = () => {
  userSelectedCalibrationTuningParameters.value = [];
  selectedTuningParameterData.value = null;
};

/**
 * Handle automatic validation checkbox change
 */
const AutoValChecked = () => {
  const ele = <HTMLInputElement>document.getElementById("CheckTheBox");
  automatic_validation.value = ele.checked as boolean;
};

/**
 * Validate and build save_tuning_tab request body. Return false if validation fails
 * @returns booleanvalidateAndBuildRequestBody
 */
const validateAndBuildRequestBody = (): boolean => {
  saveTuningTabRequestBody.value.calibration_run_id = calibrationJobId.value;

  if (areCalibrationTimesSet()) {
    if (areCalibrationTimesValidated()) {
      saveTuningTabRequestBody.value.calibration_times = {
        simulation_start_time: simStartTime.value,
        simulation_end_time: simEndTime.value,
        calibration_start_time: calStartTime.value,
        calibration_end_time: calEndTime.value
      };
    }
  }
  if (areValidationTimesSet()) {
    if (areValidationTimesValidated()) {
      saveTuningTabRequestBody.value.validation_times = {
        simulation_start_time: avSimStartTime.value,
        simulation_end_time: avSimEndTime.value,
        validation_start_time: avCalStartTime.value,
        validation_end_time: avCalEndTime.value
      };
    }
  }

  saveTuningTabRequestBody.value.automatic_validation = automatic_validation.value;

  if (areTuningParametersSet()) {
    saveTuningTabRequestBody.value.parameters = userSelectedCalibrationTuningParameters.value;
  }

  if (Object.keys(saveTuningTabRequestBody.value).length === 0) {
    const tMsg: ToastMessageOptions = { severity: 'error', summary: 'No data to save', detail: 'No valid data has been entered to save' };
    toast.add(tMsg); addToastRecord(tMsg);
    return false;
  }

  return true;
};

/**
 * Check if all calibration times are set
 * @returns boolean
 */
const areCalibrationTimesSet = (): boolean => {
  return simStartTime.value && simEndTime.value && calStartTime.value && calEndTime.value;
};

/**
 * Check if all validation times are set
 * @returns boolean
 */
const areValidationTimesSet = (): boolean => {
  return avSimStartTime.value && avSimEndTime.value && avCalStartTime.value && avCalEndTime.value;
};

/**
 * Validate calibration_times
 * @returns boolean
 */
const areCalibrationTimesValidated = (): boolean => {
  // check if time_range is not set
  if (!rangeDateFrom.value || !rangeDateTo.value) {
    const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Unable to Save', detail: 'time_range must be set' };
    toast.add(tMsg); addToastRecord(tMsg);
    return false;
  }

  // check if all calibration_times are not valid
  if (!isValidDateTime(simStartTime.value) && !isValidDateTime(simEndTime.value) && !isValidDateTime(calStartTime.value) && !isValidDateTime(calEndTime.value)) {
    return false;
  }

  // convert times to Date objects
  const rangeStartDate = new Date(rangeDateFrom.value);
  const rangeEndDate = new Date(rangeDateTo.value);
  const simStartDate = simStartTime.value.toJSDate();
  const simEndDate = simEndTime.value.toJSDate();
  const calStartDate = calStartTime.value.toJSDate();
  const calEndDate = calEndTime.value.toJSDate();

  // check if time_range and calibration_times are null after converted to Date objects
  if (!rangeStartDate || !rangeEndDate || !simStartDate || !simEndDate || !calStartDate || !calEndDate) {
    const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Unable to Save', detail: 'time_range and/or calibration_times cannot be converted to Date objects' };
    toast.add(tMsg); addToastRecord(tMsg);
    return false;
  }

  // set conditions to check if calibration_times are not within time_range
  const isSimStartWithinRange = simStartDate >= rangeStartDate && simStartDate <= rangeEndDate;
  const isSimEndWithinRange = simEndDate >= rangeStartDate && simEndDate <= rangeEndDate;
  const isCalStartWithinRange = calStartDate >= rangeStartDate && calStartDate <= rangeEndDate;
  const isCalEndWithinRange = calEndDate >= rangeStartDate && calEndDate <= rangeEndDate;

  // check if calibration_times are not within time_range
  if (!isSimStartWithinRange || !isSimEndWithinRange || !isCalStartWithinRange || !isCalEndWithinRange) {
    const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Time out of range', detail: 'calibrationtimes must be within time_range. Was not saved.' };
    toast.add(tMsg); addToastRecord(tMsg);
    return false;
  }

  // check if simulation_end_time is not after simulation_start_time
  if (simStartDate >= simEndDate) {
    const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Simulation time problem', detail: 'simulation_end_time must be after simulation_start_time. Was not saved.' };
    toast.add(tMsg); addToastRecord(tMsg);
    return false;
  }

  // check if calibration_start_time is not within simulation_start_time and simulation_end_time
  if (calStartDate <= simStartDate || calStartDate > simEndDate) {
    const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Time range problem', detail: 'calibration_start_time must be within simulation_start_time and simulation_end_time. Was not saved.' };
    toast.add(tMsg); addToastRecord(tMsg);
    return false;
  }

  // check if calibration_end_time is not after calibration_start_time and within simulation_end_time
  if (calEndDate <= calStartDate || calEndDate > simEndDate) {
    const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Time range problem', detail: 'calibration_end_time must be after calibration_start_time and within simulation_end_time. Was not saved.' };
    toast.add(tMsg); addToastRecord(tMsg);
    return false;
  }

  return true;
};

/**
 * Validate validation_times
 * @returns boolean
 */
const areValidationTimesValidated = (): boolean => {
  // check if automatic_validation is not enabled
  if (!automatic_validation.value) {
    return true;
  }

  // check if all validation_times are not valid
  if (!isValidDateTime(avSimStartTime.value) && !isValidDateTime(avSimEndTime.value) && !isValidDateTime(avCalStartTime.value) && !isValidDateTime(avCalEndTime.value)) {
    return false;
  }

  // convert times to Date objects
  const avSimStartDate = avSimStartTime.value.toJSDate();
  const avSimEndDate = avSimEndTime.value.toJSDate();
  const avCalStartDate = avCalStartTime.value.toJSDate();
  const avCalEndDate = avCalEndTime.value.toJSDate();
  const rangeStartDate = new Date(rangeDateFrom.value);
  const rangeEndDate = new Date(rangeDateTo.value);

  // check if Date objects are valid
  if (!avSimStartDate || !avSimEndDate || !avCalStartDate || !avCalEndDate || !rangeStartDate || !rangeEndDate) {
    const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Unable to Save', detail: 'time_range and/or validation_times cannot be converted to Date objects for validation' };
    toast.add(tMsg); addToastRecord(tMsg);
    return false;
  }

  // if calibration_times are set, check if:
  // - validation simulation times do not encompass both calibration and validation times
  // - calibration times and validation times  do not overlap
  if ((isValidDateTime(simStartTime.value) && isValidDateTime(simEndTime.value) && isValidDateTime(calStartTime.value) && isValidDateTime(calEndTime.value))) {
    // convert times to Date objects. simEndTime is the latest time within calibration_times
    const simStartDate = simStartTime.value.toJSDate();
    const simEndDate = simEndTime.value.toJSDate();
    const calStartDate = calStartTime.value.toJSDate();
    const calEndDate = calEndTime.value.toJSDate();

    // set conditions to check if validation simulation times do not encompass both calibration and validation times
    const isAvSimStartAfterCalStart = avSimStartDate > calStartDate;
    const isAvSimEndBeforeCalEnd = avSimEndDate < calEndDate;
    const isAvSimStartAfterAvCalStart = avSimStartDate > avCalStartDate;
    const isAvSimEndBeforeAvCalEnd = avSimEndDate < avCalEndDate;

    // check if validation simulation times do not encompass both calibration and validation times
    if (isAvSimStartAfterCalStart || isAvSimEndBeforeCalEnd || isAvSimStartAfterAvCalStart || isAvSimEndBeforeAvCalEnd) {
      const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Unable to Save', detail: 'Validation Simulation times must encompass both Calibration and Validation times' };
      toast.add(tMsg); addToastRecord(tMsg);
      return false;
    }

    // set conditions to check if calibration times and validation times overlap
    const isAvCalStartBeforeOrEqualToCalEnd = avCalStartDate <= calEndDate;
    const isAvCalEndAfterOrEqualToCalStart = avCalEndDate >= calStartDate;

    // check if calibration times and validation times overlap
    if (isAvCalStartBeforeOrEqualToCalEnd && isAvCalEndAfterOrEqualToCalStart) {
      const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Overlapping Times', detail: 'Calibration and Validation times must not overlap' };
      toast.add(tMsg); addToastRecord(tMsg);
      return false;
    }
  }

  // check if avSimEndDate is not after avSimStartDate
  if (avSimStartDate >= avSimEndDate) {
    const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Time error', detail: 'Validation Simulation End must be after Simulation Start' };
    toast.add(tMsg); addToastRecord(tMsg);
    return false;
  }

  // check if avCalStartDate is not within avSimStartDate and avSimEndDate
  if (avCalStartDate < avSimStartDate || avCalStartDate > avSimEndDate) {
    const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Time error', detail: 'Validation Calibration Start must be within Simulation Start and End' };
    toast.add(tMsg); addToastRecord(tMsg);
    return false;
  }

  // check if avCalEndDate is not after avCalStartDate and not less than avSimEndDate
  if (avCalEndDate <= avCalStartDate || avCalEndDate > avSimEndDate) {
    const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Time error', detail: 'Validation Calibration End must be after Validation Calibration Start and less than or equal to Validation Simulation End' };
    toast.add(tMsg); addToastRecord(tMsg);
    return false;
  }

  return true;
};

/**
 * Check if tuning parameters are set
 * @returns boolean
 */
const areTuningParametersSet = (): boolean => {
  // check if no Calibration Tuning Parameters have been added 
  // TODO: add more parameter validation checks here. e.g. check if min < max, etc.
  if (
    userSelectedCalibrationTuningParameters.value &&
    userSelectedCalibrationTuningParameters.value.length > 0
  ) {
    return true;
  }

  return false;
};

/**
  * Save Tuning Tab data
  */
const saveTuningData = () => {
  // handle saving Tuning Tab data
  toast.removeAllGroups();
  tuningStore_data_loading.value = true;
  const handleSaveTuningTab = async () => {
    const saveTuningTabResponse = await saveTuningTabData();
    if (saveTuningTabResponse?.ok) {
      const tMsg: ToastMessageOptions = {
        severity: 'success', summary: `Success`,
        detail: "Saved Tuning data",
        life: ToastTimeout.timeout3000
      };
      toast.add(tMsg); addToastRecord(tMsg);
      updateJobData();
      tuningStore_data_loading.value = false;
    } else {
      tuningStore_data_loading.value = false;

      if (saveTuningTabResponse._data && saveTuningTabResponse._data.response_type) {
        if (saveTuningTabResponse._data.response_type === "validation_error") {
          if (saveTuningTabResponse._data.validation_errors) {
            if (saveTuningTabResponse._data.validation_errors && saveTuningTabResponse._data.validation_errors.parameters) {
              saveTuningTabResponse._data.validation_errors.parameters.forEach((err: GeneralErrorResponse) => {
                if (Object.keys(err).length) {
                  (err as any as NonFieldError).non_field_errors.forEach(er => {
                    const tMsg: ToastMessageOptions = {
                      severity: 'error',
                      summary: `Error Saving Tuning Data`,
                      detail: er,
                      life: ToastTimeout.timeout10000,
                    };
                    toast.add(tMsg); addToastRecord(tMsg);
                  });
                }
              });
            }
          }
        }
      } else {
        const errorMessage = saveTuningTabResponse?._data.message;
        const tMsg: ToastMessageOptions = {
          severity: 'error',
          summary: `Error Saving Tuning Data`,
          detail: errorMessage,
          life: ToastTimeout.timeout10000,
        };
        toast.add(tMsg); addToastRecord(tMsg);
      }
    }
  };

  const updateJobData = () => {
    if (userCalibrationRunData.value) {
      userCalibrationRunData.value.automatic_validation = saveTuningTabRequestBody.value.automatic_validation;
      // saveTuningTabRequestBody.value.calibration_times are in Luxon DateTime format. Calling toISO() to convert to string
      if (saveTuningTabRequestBody.value.calibration_times && Object.keys(saveTuningTabRequestBody.value.calibration_times).length) {
        userCalibrationRunData.value.calibration_times = {
          calibration_start_time: saveTuningTabRequestBody.value.calibration_times.calibration_start_time.toISO(),
          calibration_end_time: saveTuningTabRequestBody.value.calibration_times.calibration_end_time.toISO(),
          simulation_start_time: saveTuningTabRequestBody.value.calibration_times.simulation_start_time.toISO(),
          simulation_end_time: saveTuningTabRequestBody.value.calibration_times.simulation_end_time.toISO()
        }
      }
      // saveTuningTabRequestBody.value.validation_times are in Luxon DateTime format. Calling toISO() to convert to string

      if (saveTuningTabRequestBody.value.validation_times && Object.keys(saveTuningTabRequestBody.value.validation_times).length) {
        userCalibrationRunData.value.validation_times = {
          validation_start_time: saveTuningTabRequestBody.value.validation_times.validation_start_time.toISO(),
          validation_end_time: saveTuningTabRequestBody.value.validation_times.validation_end_time.toISO(),
          simulation_start_time: saveTuningTabRequestBody.value.validation_times.simulation_start_time.toISO(),
          simulation_end_time: saveTuningTabRequestBody.value.validation_times.simulation_end_time.toISO()
        }
      }

      if (saveTuningTabRequestBody.value.output_variable_to_calibrate) {
        userCalibrationRunData.value.output_variable_to_calibrate = saveTuningTabRequestBody.value.output_variable_to_calibrate;
      }
      userCalibrationRunData.value.parameters = userSelectedCalibrationTuningParameters.value;
      userCalibrationRunData.value.parameters_selected = userSelectedCalibrationTuningParameters.value.length > 0;
    }
  };

  if (!isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.value?.status)) {
    const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Unable to Save', detail: 'Update of a job already run is not allowed. Please clone to make any changes for a new calibration' };
    toast.add(tMsg); addToastRecord(tMsg);
  } else {
    // check if Tuning Tab data is validated before saving
    if (validateAndBuildRequestBody()) {
      handleSaveTuningTab();
    }
  }
};

/**
 * git stat Tuning Tab data
 */
const resetTuningData = () => {
  // hardResetTuningStore(); // disable for now
};

const validateTab = () => {
  /* Check the DateTimes */
  let error = false;
  let text = [];
  if (compareTimeEntries(userCalibrationRunData?.value?.calibration_times?.simulation_start_time || '', simStartTime.value)) {
    error = true;
    text.push("Simulation Start has changed");
  }
  if (compareTimeEntries(userCalibrationRunData?.value?.calibration_times?.simulation_end_time || '', simEndTime.value)) {
    error = true;
    text.push("Simulation End has changed");
  }
  if (compareTimeEntries(userCalibrationRunData?.value?.calibration_times?.calibration_start_time || '', calStartTime.value)) {
    error = true;
    text.push("Calibration Start has changed");
  }
  if (compareTimeEntries(userCalibrationRunData?.value?.calibration_times?.calibration_end_time || '', calEndTime.value)) {
    error = true;
    text.push("Calibration End has changed");
  }
  if (compareTimeEntries(userCalibrationRunData?.value?.validation_times?.simulation_start_time || '', avSimStartTime.value)) {
    error = true;
    text.push("Simulation Start has changed");
  }
  if (compareTimeEntries(userCalibrationRunData?.value?.validation_times?.simulation_end_time || '', avSimEndTime.value)) {
    error = true;
    text.push("Simulation End has changed");
  }
  if (compareTimeEntries(userCalibrationRunData?.value?.validation_times?.validation_start_time || '', avCalStartTime.value)) {
    error = true;
    text.push("Validation Start has changed");
  }
  if (compareTimeEntries(userCalibrationRunData?.value?.validation_times?.validation_end_time || '', avCalEndTime.value)) {
    error = true;
    text.push("Validation End has changed");
  }

  return { error: error, text: text }
}

const compareTimeEntries = (txtDT: string, dT: Date) => {
  const dateProps = dT as DatePickerProps;
  if (!txtDT && dateProps.invalid) {
    return false;
  }
  if (txtDT && dateProps.invalid) {
    return true;
  }
  return new Date(dT).getTime() !== new Date(txtDT).getTime();
}

const restorePage = async () => {
  // set calibration times
  if (userCalibrationRunData?.value?.calibration_times) {
    const { simulation_start_time, simulation_end_time, calibration_start_time, calibration_end_time } = userCalibrationRunData.value.calibration_times;
    simStartTime.value = DateTime.fromISO(simulation_start_time, { zone: 'utc' });
    simEndTime.value = DateTime.fromISO(simulation_end_time, { zone: 'utc' });
    calStartTime.value = DateTime.fromISO(calibration_start_time, { zone: 'utc' });
    calEndTime.value = DateTime.fromISO(calibration_end_time, { zone: 'utc' });
  };

  // set automatic validation times
  if (userCalibrationRunData?.value?.validation_times) {
    const { simulation_start_time, simulation_end_time, validation_start_time, validation_end_time } = userCalibrationRunData.value.validation_times;
    avSimStartTime.value = DateTime.fromISO(simulation_start_time, { zone: 'utc' });
    avSimEndTime.value = DateTime.fromISO(simulation_end_time, { zone: 'utc' });
    avCalStartTime.value = DateTime.fromISO(validation_start_time, { zone: 'utc' });
    avCalEndTime.value = DateTime.fromISO(validation_end_time, { zone: 'utc' });
  };


}

const gotoNext = () => {
  const tabs = document.getElementsByClassName("tabs");
  const e = <HTMLElement>tabs[CalibrationTabs.tab_optimizationMetrics];
  e.click();
}

const gotoPrev = () => {
  const tabs = document.getElementsByClassName("tabs");
  const e = <HTMLElement>tabs[CalibrationTabs.tab_formulation];
  e.click();
};

const goNextTab = () => {
  const errors = validateTab();
  if (errors.error) {
    showPrevNextDialog(errors.text, true);
  } else {
    gotoNext();
  }
};

const goPrevTab = () => {
  const errors = validateTab();
  if (errors.error) {
    showPrevNextDialog(errors.text, false);
  } else {
    gotoPrev();
  }
};

const showPrevNextDialog = (body: string[], next: boolean) => {
  if (!nextPrevDialogOpened.value) {
    dialog.open(MoveNextPrevDialog, {
      props: {
        header: "Unsaved changes!",
        style: {
          width: 'auto',
        },
        modal: true,
      },
      data: {
        body: body,
        direction: next
      },
      onClose: (opt) => {
        nextPrevDialogOpened.value = false;
        handleNextPrevDialogClose(opt);
      },

    })
    nextPrevDialogOpened.value = true
  }
}

const handleNextPrevDialogClose = (opt: any) => {
  if (opt.data && opt.data.moveToNextResponse) {
    restorePage();
    if (opt.data.goNext) {
      gotoNext();
    } else {
      gotoPrev();
    }
  }
  if (opt.type && opt.type === 'dialog-close') {
    return;
  }
}

const rowClass = () => {
  return [{ "pointer-events-none": !isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.value?.status) }];
}

const rowStyle = () => {
  let t = !isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.value?.status);
  return {
    color: t ? "grey" : 'black',
    backgroundColor: t ? '#f0f0f0' : ''
  }
}

</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

#OutVar {
  width: 600px;
}

#AddUpdateBtn {
  height: 40px;
}

.mup30 {
  margin-top: -140px;
}

.timeBlocks {
  font-size: 0.8em;
}

.datePickers {
  width: 230px;
  display: inline-block;
  text-align: center;
}

.mmiInputs {
  width: 100px;
}

.varInputs {
  width: 400px;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0);
  cursor: not-allowed;
  z-index: 10;
}

.p-select-width {
  width: 100%;
}
</style>
