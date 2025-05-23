<template>
  <Transition name="slide-fade">
    <div id="MessagesGroupWindow" v-if="showMessagesGroup">
      <div class="text-right sticky top-0">
        <img title="Close" aria-label="Close" src="@/assets/styles/img/xclose.png" width="40"
          class="absolute cursor-pointer right-0 boxed mt-1 mr-1" @click="toggleMessagesGroup" alt="Close" />
      </div>
      <MessagesGroup />
    </div>
  </Transition>
  <div id="EvaluatePage">
    <div class="pl-6 pr-2 pt-2">
      <div class="flex mt-3">
        <div class="w-1/2">
          <label for="DisplayOptions" class="pr-2 pt-3">Display </label>
          <div class="inline-block w-2/3">
            <Select id="DisplayOptions" class="p-select" v-model="selectedPlotName" :options="plotList"
              optionLabel="name" optionValue="name" :disabled="!plotList">
            </Select>
          </div>

          <div class="layout__table mt-2" style="width:100%">
            <div class="layout__row">
              <div class="text-left text-nowrap" style="font-size:0.9em;">
                <label for="calibrationJobId">Calibration Job ID </label>
                {{ calibrationJobId }}<br />
                <label for="calibrationJobId">Gage </label>
                {{ calData?.gage?.gage_id }}
              </div>
              <div class="text-left pl-3 text-nowrap" style="font-size:0.9em;">
                <label for="validationJobId">Validation Job ID </label>
                {{ evaluateValidationRunId }}<br />
                <label for="validationJobId">Station Name </label>
                {{ calData?.gage?.station_name }}
              </div>
            </div>
          </div>
        </div>
        <div>
          <div v-if="selectedPlotName && gridDisplayOptions.includes(selectedPlotName)" class="p-2 relative overflow-visible">
            <div class="grid grid-cols-3 gap-4">
              <div class="text-nowrap text-right font-bold">
                Select Date 
              </div>
              <div class="text-nowrap">
                <VueDatePicker v-model="selectedSweDateTime" class="dp__theme_dark" text-input format="yyyy-MM-dd"
                  @update:model-value="convertSelectedSweDateStringToDateTimeObject" :enable-time-picker="false"
                  :min-date="minSweDateTime.toISO()" :max-date="maxSweDateTime.toISO()" :teleport="true" utc='preserve' /> 
              </div>
              <div class="text-nowrap">
                <Button class="font-normal ngenButtonDiv-green ml-auto text-nowrap" label="Get Spatial Plots"
                  aria-label="Get Spatial Plots" @click="getSpatialPlots" />
              </div>
              <div class="text-sm font-semibold col-span-3 text-nowrap text-center">
                <p class="font-bold">
                  {{ getSweTimeRange() }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="pl-4 ml-auto text-nowrap">
          <span id="NewButton" class="ngenButtonDiv-alt bg-blue4"><button id="NewValidationBtn"
              @click="gotoSelectAlternateIteration">New Validation</button></span>
          <br />
          <a v-if="userCalibrationRunData" href="#" class="inline-block p-1 c-blue underline mt-1"
            @click="toggleMessagesGroup">
            Show Calibration Details</a>
          <br />
          <span v-if="selectedPlotName && gridDisplayOptions.includes(selectedPlotName) && !showPlotGraph">
            <a v-if="selectedPlotHasTimeseries" href="#" class="p-1 c-blue underline mt-1" 
              @click="togglePlotGraph">Show SWE Time Series</a>
          </span>
          <span v-if="!(selectedPlotName && gridDisplayOptions.includes(selectedPlotName))">
            <a v-if="selectedPlotHasTimeseries" href="#" class="p-1 c-blue underline mt-1" 
              @click="togglePlotGraph">
              <span v-if="!showPlotGraph">Show </span> 
              <span v-else>Hide </span> 
              Interactive Time Series
            </a>
          </span>
        </div>
      </div>
    </div>
    <div v-if="!(selectedPlotName && gridDisplayOptions.includes(selectedPlotName)) && !showPlotGraph"
      :class="{ 'grid grid-cols-2': !expandPlotTable }">
      <div class="text-center" v-if="!expandPlotTable">
        <div id="GraphArea" class="p-2" v-if="selectedPlotName && selectedPlotFileUrl">
          <img :src="selectedPlotFileUrl" :alt="selectedPlotName" />
        </div>
      </div>
      <div>

        <div class="text-center"
          v-if="plotTableErrorMessage !== '' && selectedSupplementalTable === 0 && selectedLogCategory == ''">
          <div class="grid place-items-center" style="height: 45vh;">
            <div>
              {{ plotTableErrorMessage }}
            </div>
          </div>
        </div>

        <div id="PlotTableArea" class="p-2" v-if="plotTableData.length > 0">
          <a v-if="!expandPlotTable && plotTableColumns.length > 5" href="#" class="p-1 c-blue font-bold underline mt-1"
            @click="toggleExpandPlotTable">
            &lt; Expand Plot Table (Hide Graph)</a>
          <a v-if="expandPlotTable" href="#" class="p-1 c-blue font-bold underline mt-1" @click="toggleExpandPlotTable">
            Reduce Plot Table (Show Graph) &gt;</a>
          <div v-if="plotTableList && plotTableList.length > 1">
            <label for="PlotTableOptions" class="pr-2 pt-3">Select Simulation Time Period Data Table </label>
            <Select id="PlotTableOptions" class="p-select" v-model="selectedPlotTable" :options="plotTableList"
              optionLabel="name" optionValue="name">
            </Select>
          </div>
          <div class="pt-6 pb-2">
            <div v-if="plotTableData.length > 0 && plotTableTotalSize > 0" class="pagination-box">
              <div class="pagination-rows">Rows {{ plotTableStartRow }} to {{ plotTableEndRow }} of {{
                plotTableTotalSize }}</div>
              <Paging v-model:currentPage="plotTableCurrentPage" :totalPages=plotTableTotalPages />
            </div>
            <DataTable id="plotTableHTML" :value="plotTableData" fixedHeader=true scrollable scroll-height="500px"
              :multi-sort="true">
              <Column v-for="col of plotTableColumns" :key="col.value" :field="col.value" :header="col.header"
                :sortable="plotTableTotalPages === 1" :pt="ptColumn"></Column>
            </DataTable>
          </div>
        </div>
      </div>
    </div>
    <div class="flex mt-2" v-if="showPlotGraph && plotGraphData">
      <div id="PlotGraphArea" ref="plotGraphArea" v-if="!plotGraphCheckboxesEmpty()">
        <div id="PlotGraphSVG" ref="plotGraphSVG" class="flex flex-row justify-center"></div>
        <div id="PlotGraphSliderContainer" class="flex flex-row justify-center" :class="plotGraphSliderCursor">
          <div id="PlotGraphSlider" ref="plotGraphSlider" @mousedown="sliderDragStart" @mousemove="sliderDragChange"
            @mouseup="sliderDragEnd" @mouseleave="sliderDragCancel">
            <div id="PlotGraphSliderBox" ref="plotGraphSliderBox"></div>
          </div>
        </div>
        <div id="PlotGraphSliderDateRange">
          <div class="flex flex-row justify-center">
            {{ formatDateString(plotGraphDateRange.start) }} - {{ formatDateString(plotGraphDateRange.end) }}
          </div>
        </div>
        <div id="PlotGraphSliderHelp">
          <div class="flex flex-row justify-center">
            {{ plotGraphSliderHelpDisplay }}
          </div>
        </div>
      </div>
      <div id="PlotGraphControls">
        <a v-if="showPlotGraph" href="#" class="inline-block p-1 c-blue underline mt-1 pb-2"
          @click="toggleCustomizePlot">
          Customize Viewer
        </a>
        <div v-if="plotGraphLines.length > 0">
          <div v-for="item in plotGraphLines" :key="item.id">
            <input v-if="plotGraphLines.length > 1" type="checkbox" :id="`plotGraphCheckbox-${item.id}`"
              v-model="item.checked" @change="drawInteractivePlot(); drawInteractiveSlider();" class="align-top">
            <label :for="`plotGraphCheckbox-${item.id}`" :style="`color: ${item.color}`">{{ item.name }}</label>
          </div>
        </div>
        <div v-if="plotGraphCheckboxesEmpty()">
          Check at least one box to generate an interactive plot.
        </div>
        <div id="CustomizePlotWindow" v-if="showCustomizePlot">
          <div class="text-right sticky top-0">
            <img title="Close" aria-label="Close" src="@/assets/styles/img/xclose.png" width="40"
              class="absolute cursor-pointer right-0 boxed mt-1 mr-1" @click="toggleCustomizePlot" alt="Close" />
          </div>
          <h2 class="mt-5" aria-label="Customize Viewer" title="Customize Viewer">
            Customize Viewer
          </h2>
          <div v-if="plotGraphLines.length > 0">
            <div v-for="item in plotGraphLines" :key="item.id" class="text-nowrap">
              <div>
                <label :for="`plotGraphColor-${item.id}`" :style="`color: ${item.color}`">{{ item.name }}</label>
              </div>
              <Select class="select150" :id="`plotGraphColor-${item.id}`" v-model="item.color"
                :options="plotGraphColorList" optionLabel="name" optionValue="name" @change="drawInteractivePlot">
              </Select>
              <Select class="select150" :id="`plotGraphSymbol-${item.id}`" v-model="item.symbol"
                :options="plotGraphSymbolList" optionLabel="name" optionValue="name" @change="drawInteractivePlot">
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="SupplementalTableArea" v-if="selectedSupplementalTable">
      <div id="SupplementalTableArea" class="p-2">
        <div v-if="iterationMetricsData && selectedSupplementalTable === 1">
          <DataTable :value="iterationMetricsData" scrollable scroll-height="500px" fixedHeader=true :multi-sort="true">
            <Column v-for="(col, colIndex) in iterationMetricsColumns" :key="colIndex" :header="col.header"
              :field="col.field" sortable></Column>
          </DataTable>
        </div>
        <div v-if="iterationParamsData && selectedSupplementalTable === 2">
          <DataTable :value="iterationParamsData" scrollable scroll-height="500px" fixedHeader=true :multi-sort="true">
            <Column v-for="(col, colIndex) in iterationParamsColumns" :key="colIndex" :header="col.header"
              :field="col.field" sortable></Column>
          </DataTable>
        </div>
        <div v-if="performanceMetricsData && performanceMetricsData.length > 0 && selectedSupplementalTable === 3">
          <DataTable :value="performanceMetricsData" fixedHeader=true>
            <Column v-for="(col, colIndex) in performanceMetricsColumns" :key="colIndex" :header="col.header"
              :field="col.field"></Column>
          </DataTable>
        </div>
      </div>
    </div>
    <div id="LogDisplayArea" class="p-2"
      v-if="selectedLogCategory != '' && selectedLogList && selectedLogList.length > 0">
      <div class="pl-4">
        <div v-if="selectedLogList.length > 1">
          <label for="selectedLogOptions" class="pr-2 pt-3">Select {{ capitalCase(selectedLogCategory) }} Log</label>
          <Select id="selectedLogOptions" class="p-select" v-model="selectedLogName" :options="selectedLogList"
            optionLabel="name" optionValue="name">
          </Select>
        </div>
        <div v-if="selectedLogList.length === 1" style="font-size: 0.9em;"><b
            style="width:160px; display:inline-block;">Log File Name</b> {{ selectedLogName }}</div>

        <div class="flex justify-end" style="margin-top:-23px;">
          <div class="ml-auto">
            <div>Rows {{ selectedLogStartRow }} to {{ selectedLogEndRow }} of {{ selectedLogTotalSize }}</div>
            <Paging v-model:currentPage="selectedLogCurrentPage" :totalPages=selectedLogTotalPages />
          </div>
        </div>

        <div id="selectedLogDisplay" class="p-2 gray-border mt-2 h-600 overflow-scroll">
          <div v-html="selectedLogDisplay" class="whitespace-nowrap"></div>
        </div>
      </div>
    </div>

    <!-- Grid Data -->
    <div v-if="selectedPlotName && gridDisplayOptions.includes(selectedPlotName) && !showPlotGraph"
      class="p-4 min-h-screen overflow-visible">
      <div class="grid grid-cols-3 gap-4 mt-4 p-2">
        <div class="flex flex-col items-center p-2">
          <h1 class="text-xl font-bold">SNODAS</h1>
          <div class="flex items-center justify-center space-x-2 p-2 w-full">
            <RadioButton v-model="selectedGridType" inputId="gridType1" value="gridded" name="gridType" />
            <label for="gridType1">Gridded</label>
            <RadioButton v-model="selectedGridType" inputId="gridType2" value="catchment" name="gridType" />
            <label for="gridType2">Catchment Means</label>
          </div>
          <p v-if="selectedGridType === 'gridded'" class="text-[12px] text-gray-600 text-center">Snow Water Equivalent
            (SWE) - Raw Values</p>
          <p v-if="selectedGridType === 'catchment'" class="text-[12px] text-gray-600 text-center">Snow Water Equivalent
            (SWE) - Catchment Means</p>
          <div>
            <div v-if="selectedGridType === 'gridded' && selectedSnodasRawMapUrl" id="GraphArea" class="p-2">
              <img :src="selectedSnodasRawMapUrl" alt="Selected SNODAS" />
            </div>
            <div v-if="selectedGridType === 'catchment' && selectedSnodasLumpedMapUrl" id="GraphArea" class="p-2">
              <img :src="selectedSnodasLumpedMapUrl" alt="Selected SNODAS" />
            </div>
          </div>
        </div>
        <div class="flex flex-col items-center p-2">
          <h1 class="text-xl font-bold">Simulated</h1>
          <p class="text-[12px] text-gray-600 mt-9">Snow Water Equivalent (SWE) - Catchment Means</p>
          <div v-if="selectedSnodasSimMapUrl" id="GraphArea" class="p-2">
            <img :src="selectedSnodasSimMapUrl" alt="Selected SNODAS" />
          </div>
        </div>
      </div>
    </div>

  </div>
  <div class="waitgif" v-if="isEvaluationLoading">
    <img alt="Please wait..." src="@/assets/styles/img/wait.gif" />
  </div>
</template>

<script setup lang="ts">
import { nextTick } from 'vue';
import { useToast } from 'primevue/usetoast';
import VueDatePicker from "@vuepic/vue-datepicker";
import { DateTime } from "luxon";


import type { DynamicObject } from "@/composables/NextGenModel";
import type { ToastMessageOptions } from "primevue/toast";
import { ToastTimeout } from "@/composables/NextgenEnums";
import { formatISOStringOrDateToYYYYMMDD } from "@/utils/TimeHelpers";
import { isValidDate, isValidDateTime } from "@/utils/CommonHelpers";

import { generalStore } from '@/stores/common/GeneralStore';
import { useRunStatusStore } from '@/stores/calibration/RunStatusStore';
import { useEvaluationSupplementalDataStore } from '@/stores/evaluation/EvaluationSupplementalDataStore';
import { useUserDataStore } from '@/stores/common/UserDataStore';

import MessagesGroup from "../Common/MessagesGroup.vue";
import Paging from "../Common/Paging.vue";

import { hilightTab } from '@/composables/TabHilight';

import * as Plot from "@observablehq/plot";

const runStatusStore = useRunStatusStore();
const EvaluationSupplementalDataStore = useEvaluationSupplementalDataStore();
const userDataStore = useUserDataStore();
const toast = useToast();

const showMessagesGroup = ref<Boolean>(false);

const { calibrationJobId, evaluateValidationRunId } = storeToRefs(generalStore());
const { addToastRecord } = generalStore();

const ptColumn = ref({
  columnHeaderContent: { style: { "justify-content": "center" } },
  bodyCell: { style: { "text-align": "right", "padding-right": "10px !important" } }
});


const {
  plotList,
  plotNames,
  selectedPlotName,
  selectedPlotFilename,
  selectedPlotFileUrl,
  simulatedSources,
  gridTypes,
  selectedGridType,
  sweStartDateTime,
  minSweDateTime,
  sweEndDateTime,
  maxSweDateTime,
  selectedSweDateTime,
  selectedSnodasLumpedMapUrl,
  selectedSnodasRawMapUrl,
  selectedSnodasSimMapUrl,
  sweTimeSeriesData,
  isEvaluationLoading
} = storeToRefs(EvaluationSupplementalDataStore);

const { userCalibrationRunData } = storeToRefs(userDataStore);
const calData = ref(userCalibrationRunData);
const { fetchUserCalibrationRunData } = userDataStore;
const {
  loadRunStatusStore,
  queryGetPlotNames,
  queryGetPlot,
} = runStatusStore;
const {
  setSweStartDateTime,
  setSweEndDateTime,
  getSweTimeRange,
  queryGetIterations,
  queryGetPerformanceMetrics,
  queryGetLogNames,
  queryGetLogData,
  loadSweImages,
  queryGetSWETimeseriesData
} = EvaluationSupplementalDataStore;

const expandPlotTable = ref<Boolean>(false);
const plotTables = ref<DynamicObject>({});
const plotTableList = ref<any[]>([]);
const selectedPlotTable = ref<string>('');
const plotTableData = ref<any[]>([]);
const plotTableColumns = ref<any[]>([]);
const plotTableTotalSize = ref<number>(0);
const plotTablePageSize = ref<number>(100);
const plotTableCurrentPage = ref<number>(1);
const plotTableTotalPages = ref<number>(1);
const plotTableStartRow = ref<number>(1);
const plotTableEndRow = ref<number>(plotTablePageSize.value);
const plotTableErrorMessage = ref<string>('');
const selectedPlotHasTimeseries = ref<Boolean>(false);
const plotGraphArea = ref(null);
const plotGraphSVG = ref(null);
const plotGraphDataRaw = ref<any[]>([]);
const plotGraphData = ref<any[]>([]);
const plotGraphOptions = ref<DynamicObject>({});
const plotGraphLines = ref<any[]>([]);
const plotGraphDateLimits = ref<DynamicObject>({});
const plotGraphDateRange = ref<DynamicObject>({});
const plotGraphSlider = ref(null);
const plotGraphSliderData = ref<any[]>([]);
const plotGraphSliderOptions = ref<DynamicObject>({});
const plotGraphSliderBox = ref(null);
const plotGraphSliderCursor = ref<string>('cursor-grab');
const plotGraphSliderHelpDisplay = ref<string>('');
const sliderBoxPosition = ref<DynamicObject>({});
const sliderDragPosition = ref<DynamicObject>({});
const sliderDragType = ref<string>('');
const showPlotGraph = ref<Boolean>(false);
const showCustomizePlot = ref<Boolean>(false);
const selectedSupplementalTable = ref<number>(0);
const iterations = ref<APIResponse>({});
const iterationMetricsData = ref<any[]>([]);
const iterationMetricsColumns = ref<any[]>([]);
const iterationParamsData = ref<any[]>([]);
const iterationParamsColumns = ref<any[]>([]);
const performanceMetrics = ref<APIResponse>({});
const performanceMetricsData = ref<any[]>([]);
const performanceMetricsColumns = ref<any[]>([{ header: 'Metric', field: 'metric' }]);
const logs = ref<APIResponse>({});
const logDataPageSize = ref<number>(1000);
const logLists = ref<DynamicObject>({});
const selectedLogCategory = ref<string>('');
const selectedLogList = ref<any[]>([]);
const selectedLogName = ref<string>('');
const selectedLogDisplay = ref<string>('');
const selectedLogTotalSize = ref<number>(0);
const selectedLogCurrentPage = ref<number>(1);
const selectedLogTotalPages = ref<number>(1);
const selectedLogStartRow = ref<number>(1);
const selectedLogEndRow = ref<number>(logDataPageSize.value);
const supplementalTableOptions = [];
/* const supplementalTableOptions = [
  'Iteration Metrics Table',
  'Iteration Parameters Table',
  'Performance Metrics Table'
] */
const plotGraphColors = ['grey', 'blue', 'gold', 'green', 'teal', 'black', 'orange', 'pink', 'purple', 'red', 'yellow'];
const plotGraphColorList = [];
for (let c = 0; c < plotGraphColors.toSorted().length; c++) {
  plotGraphColorList.push({ name: plotGraphColors.toSorted()[c] });
}
const plotGraphSymbols = ['line', 'circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye'];
const plotGraphSymbolList = [];
for (let s = 0; s < plotGraphSymbols.toSorted().length; s++) {
  plotGraphSymbolList.push({ name: plotGraphSymbols.toSorted()[s] });
}
const plotGraphSliderHelpText = [
  'Click and drag within the slider to change the date range.',
  'Drag left or right to change the Start Date.',
  'Drag left or right to change the End Date.',
  'Drag left or right to move the Start and End Dates.',
  'Click inside the highlighted date range or on its edges to make changes.'
]
const gridDisplayOptions = [
  "Snow Water Equivalent",
]

onMounted(() => {
  isEvaluationLoading.value = true;
  nextTick(async () => {
    hilightTab(EvaluationTabs.tab_evaluate);

    // make sure page loads with no plots/tables selected
    selectedPlotName.value = null;
    selectedPlotFilename.value = null;
    selectedPlotFileUrl.value = null;
    selectedPlotHasTimeseries.value = false;
    selectedSupplementalTable.value = 0;

    // Load Run Status Store to load resultsPathname
    await loadRunStatusStore();

    if (!userCalibrationRunData.value) {
      await fetchUserCalibrationRunData();
    }

    // Get Plot Names
    //if (!plotNames?.value?._data?.plot_names || !plotNames?.value?._data?.plot_names.length) {
    plotNames.value = await queryGetPlotNames();
    //}

    if (plotNames.value?._data?.plot_names) {
      // setting plotList will populate the dropdown
      plotList.value = plotNames?.value?._data?.plot_names;
    } else {
      toast.removeAllGroups();
      const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Warning', detail: 'Error getting Plot Names' };
      toast.add(tMsg); addToastRecord(tMsg);
    }

    // add grid display options to the dropdown if not added already
    gridDisplayOptions.forEach(option => {
      if (!plotList.value.some(item => item.name === option)) {
        plotList.value.push({ name: option, description: '' });
      }
    });

    // Add Supplemental Table Options to the dropdown
    for (let t = 0; t < supplementalTableOptions.length; t++) {
      if (!plotList.value.some(item => item.name === supplementalTableOptions[t])) {
        plotList.value.push({ name: supplementalTableOptions[t], description: '' });
      }
    }

    // Get Names of ALL Logs
    if (!logs.value?._data || !logs.value?._data?.length) {
      logs.value = await queryGetLogNames(
        (evaluateValidationRunId.value) ? evaluateValidationRunId.value : 0 // validation_run_id
      );
      for (let l = 0; l < logs.value?._data?.log_names.length; l++) {
        Object.keys(logs.value?._data?.log_names[l]).forEach(key => {
          let logList = [];
          for (let n = 0; n < logs.value?._data?.log_names[l][key].length; n++) {
            logList.push({ 'name': logs.value?._data?.log_names[l][key][n] });
          }
          logLists.value[key] = logList;
        });
      }

      // Add Log Options to the dropdown
      Object.keys(logLists.value).forEach(key => {
        let optionName = capitalCase(key) + ' Logs';
        if (!plotList.value.some(item => item.name === optionName)) {
          plotList.value.push({ name: optionName, description: '' });
        }
      });
    }
  })
  isEvaluationLoading.value = false;
});

// Handle selectedPlotName changes
watch(selectedPlotName, async () => {
  // is the selected option a plot or iteration table?
  if (selectedPlotName.value && supplementalTableOptions.includes(selectedPlotName.value)) {
    selectedPlotFilename.value = null;
    selectedPlotFileUrl.value = null;
    selectedPlotHasTimeseries.value = false;
    plotGraphData.value = [];
    plotGraphLines.value = [];
    sliderBoxPosition.value = {};
    selectedSupplementalTable.value = supplementalTableOptions.indexOf(selectedPlotName.value) + 1;
    if (selectedSupplementalTable.value === 1) {
      // Get Iteration Data
      if (!iterations.value?._data || !iterations.value?._data?.length) {
        iterations.value = await queryGetIterations();
      }

      // set up array for iterationMetricsData
      iterationMetricsData.value = [];
      iterationMetricsColumns.value = [{ header: 'Iteration', field: 'iteration' }];
      if (iterations.value?._data?.iteration_data) {
        for (let i = 0; i < iterations.value?._data?.iteration_data?.length; i++) {
          const iterationMetricsRecord: DynamicObject = {};
          iterationMetricsRecord['iteration'] = iterations.value?._data?.iteration_data[i].iteration_num;
          for (let m = 0; m < iterations.value?._data?.iteration_data[i].metrics.length; m++) {
            let metric_name = iterations.value?._data?.iteration_data[i].metrics[m].metric_name;
            iterationMetricsRecord[metric_name] = iterations.value?._data?.iteration_data[i].metrics[m].metric_value;
            if ((iterationMetricsRecord[metric_name] === null || iterationMetricsRecord[metric_name] === '') && iterationMetricsRecord[metric_name]) {
              iterationMetricsRecord[metric_name] = 'N/A';
            } else if (!isNaN(parseFloat(iterationMetricsRecord[metric_name])) && isFinite(iterationMetricsRecord[metric_name])) {
              iterationMetricsRecord[metric_name] = iterationMetricsRecord[metric_name].toFixed(5);
            }
            if (i === 0) {
              iterationMetricsColumns.value.push({ header: metric_name, field: metric_name });
            }
          }
          iterationMetricsData.value.push(iterationMetricsRecord);
        }
      }

      if (!iterationMetricsData.value.length) {
        const tMsg: ToastMessageOptions = { severity: 'info', summary: 'Calibration Run ' + calibrationJobId.value + ' has no iteration metrics', life: ToastTimeout.timeout5000 };
        toast.add(tMsg); addToastRecord(tMsg);
      }
    } else if (selectedSupplementalTable.value === 2) {
      // Get Iteration Data
      if (!iterations.value?._data || !iterations.value?._data?.length) {
        iterations.value = await queryGetIterations();
      }

      // set up array for iterationParamsData
      iterationParamsData.value = [];
      iterationParamsColumns.value = [{ header: 'Iteration', field: 'iteration' }];
      if (iterations.value?._data?.iteration_data) {
        for (let i = 0; i < iterations.value?._data?.iteration_data?.length; i++) {
          const iterationParamsRecord: DynamicObject = {};
          iterationParamsRecord['iteration'] = iterations.value?._data?.iteration_data[i].iteration_num;
          for (let p = 0; p < iterations.value?._data?.iteration_data[i].parameters.length; p++) {
            let param_name = iterations.value?._data?.iteration_data[i].parameters[p].parameter_name;
            iterationParamsRecord[param_name] = iterations.value?._data?.iteration_data[i].parameters[p].parameter_value;
            if ((iterationParamsRecord[param_name] === null || iterationParamsRecord[param_name] === '') && iterationParamsRecord[param_name]) {
              iterationParamsRecord[param_name] = 'N/A';
            } else if (!isNaN(parseFloat(iterationParamsRecord[param_name])) && isFinite(iterationParamsRecord[param_name])) {
              iterationParamsRecord[param_name] = iterationParamsRecord[param_name].toFixed(5);
            }
            if (i === 0) {
              iterationParamsColumns.value.push({ header: param_name, field: param_name });
            }
          }
          iterationParamsData.value.push(iterationParamsRecord);
        }
      }

      if (!iterationParamsData.value.length) {
        const tMsg: ToastMessageOptions = { severity: 'info', summary: 'Calibration Run ' + calibrationJobId.value + ' has no iteration parameters', life: ToastTimeout.timeout5000 };
        toast.add(tMsg); addToastRecord(tMsg);
      }
    } else if (selectedSupplementalTable.value === 3) {
      // Get Performance Metrics - put each one into the table as its own row
      if (!performanceMetrics.value?._data || !performanceMetrics.value?._data?.length) {
        performanceMetrics.value = await queryGetPerformanceMetrics();
      }

      performanceMetricsData.value = [];
      if (performanceMetrics.value?._data) {
        if (performanceMetrics.value?._data?.performance_metrics) {
          // First add the metric names and the values from our Calibration run
          performanceMetricsColumns.value.push({ header: 'Calibration Job ID ' + calibrationJobId.value, field: 'calibration_job_id_' + calibrationJobId.value });
          Object.keys(performanceMetrics.value?._data.performance_metrics).forEach(key => {
            performanceMetricsData.value.push({ 'metric': key });
            performanceMetricsData.value.at(-1)['calibration_job_id_' + calibrationJobId.value] = performanceMetrics.value?._data?.performance_metrics[key];
          });
          // Now go through the values from our Validations and add each metric value to the appropriate row
          if (performanceMetrics.value?._data?.validations) {
            for (let v = 0; v < performanceMetrics.value?._data?.validations.length; v++) {
              let validation_run_id = performanceMetrics.value?._data?.validations[v].validation_run_id;
              let validation_type = performanceMetrics.value?._data?.validations[v].validation_type;
              if (validation_type == 'valid_iteration') {
                validation_type = 'Iter';
              } else if (validation_type == 'valid_control') {
                validation_type = 'Control';
              } else if (validation_type == 'valid_best') {
                validation_type = 'Best';
              }
              if (performanceMetrics.value?._data?.validations[v].iteration_num !== null) {
                if (validation_type != 'Iter') {
                  validation_type += ': Iter';
                }
                validation_type += ' ' + performanceMetrics.value?._data?.validations[v].iteration_num;
              }
              performanceMetricsColumns.value.push({ header: 'Validation Job ID ' + validation_run_id + ' (' + validation_type + ')', field: 'validation_job_id_' + validation_run_id });
              if (performanceMetrics.value?._data?.validations[v]?.performance_metrics) {
                Object.keys(performanceMetrics.value?._data?.validations[v].performance_metrics).forEach(key => {
                  // Loop through our existing rows and see if we have this metric already
                  let metricRow = -1;
                  for (let m = 0; m < performanceMetricsData.value.length; m++) {
                    if (performanceMetricsData.value[m].metric === key) {
                      metricRow = m;
                      performanceMetricsData.value[m]['validation_job_id_' + validation_run_id] = performanceMetrics.value?._data?.validations[v].performance_metrics[key];
                      break;
                    }
                  }
                  if (metricRow === -1) {
                    // We didn't find this metric, so create a new row for it
                    performanceMetricsData.value.push({ 'metric': key });
                    performanceMetricsData.value.at(-1)['validation_job_id_' + validation_run_id] = performanceMetrics.value?._data?.validations[v].performance_metrics[key];
                  }
                });
              }
            }
            // Now clean up our metric names so that they display nicely
            for (let m = 0; m < performanceMetricsData.value.length; m++) {
              let column_header_words = performanceMetricsData.value[m].metric.split("_");
              for (let w = 0; w < column_header_words.length; w++) {
                let word = column_header_words[w]
                column_header_words[w] = word.charAt(0).toUpperCase() + word.slice(1);
              }
              let column_header = column_header_words.join(" ");
              performanceMetricsData.value[m].metric = column_header;
            }
          }
        }
      }
      if (!performanceMetricsData.value.length) {
        const tMsg: ToastMessageOptions = { severity: 'info', summary: 'Calibration Run ' + calibrationJobId.value + ' has no performance metrics', life: ToastTimeout.timeout5000 };
        toast.add(tMsg); addToastRecord(tMsg);
      }
    }
    plotTableData.value = [];
    plotTableColumns.value = [];
    selectedLogCategory.value = '';
    selectedLogList.value = [];
  }
  // selectedPlotName is a log 
  else if (selectedPlotName.value && selectedPlotName.value.includes(" Logs") && selectedPlotName.value.replace(" Logs", "").toLowerCase() in logLists.value) {
    selectedPlotFilename.value = null;
    selectedPlotFileUrl.value = null;
    selectedPlotHasTimeseries.value = false;
    plotTableData.value = [];
    plotTableColumns.value = [];
    plotGraphData.value = [];
    plotGraphLines.value = [];
    sliderBoxPosition.value = {};
    selectedSupplementalTable.value = 0;
    selectedLogName.value = '';
    selectedLogCategory.value = selectedPlotName.value.replace(" Logs", "").toLowerCase();
    sweTimeSeriesData.value = [];
  }
  // selectedPlotName is a grid display option
  else if (selectedPlotName.value && gridDisplayOptions.includes(selectedPlotName.value)) {
    // clear out previous Display data
    selectedPlotFilename.value = null;
    selectedPlotFileUrl.value = null;
    selectedPlotHasTimeseries.value = true;
    plotTableErrorMessage.value = '';
    plotTableData.value = [];
    plotTableColumns.value = [];
    plotGraphData.value = [];
    plotGraphLines.value = [];
    sliderBoxPosition.value = {};
    selectedSupplementalTable.value = 0;
    selectedLogCategory.value = '';
    selectedLogList.value = [];
    selectedLogName.value = '';
    sweTimeSeriesData.value = [];

    // set selectedGridType to 'catchment' by default if not already set
    if (!selectedGridType.value) {
      selectedGridType.value = 'catchment';
    }

    // set sweStartDateTime and sweEndDateTime if not already set
    if (!sweStartDateTime.value || !sweEndDateTime.value) {
      setSweStartDateTime();
      setSweEndDateTime();
    }
    // set selectedSweDateTime to sweStartDateTime if not already set
    /* if (!selectedSweDateTime.value) {
      selectedSweDateTime.value = sweStartDateTime.value;
    } */

    // pre-load SWE Timeseries Data so that we know our date range
    if (!sweTimeSeriesData.value || sweTimeSeriesData.value.length == 0) {
      const response: any = await queryGetSWETimeseriesData(
        (evaluateValidationRunId.value) ? evaluateValidationRunId.value : 0, // validation_run_id
      );
      if (response?._data?.swe_timeseries_data) {
        // get time series data from server
        sweTimeSeriesData.value = response?._data?.swe_timeseries_data;
      } else {
        selectedPlotHasTimeseries.value = false;
        toast.removeAllGroups();
        const tMsg: ToastMessageOptions = { severity: 'info', summary: 'SWE time series data is currently unavailable', life: ToastTimeout.timeout5000 };
        toast.add(tMsg); addToastRecord(tMsg);
      }
    }

    // Start with SWE timeseries already displayed
    togglePlotGraph();
  } else if (selectedPlotName.value) {
    plotGraphData.value = [];
    plotGraphLines.value = [];
    expandPlotTable.value = false;
    sliderBoxPosition.value = {};
    selectedSupplementalTable.value = 0;
    selectedLogCategory.value = '';
    selectedLogList.value = [];
    plotTableCurrentPage.value = 1;

    // get selected plot file name and url from server
    const response: any = await queryGetPlot(
      selectedPlotName.value !== null ? selectedPlotName.value : '', // plotName
      true, // include_data
      true, // force_include_plot
      (evaluateValidationRunId.value) ? 0 : calibrationJobId.value, // calibration_run_id
      (evaluateValidationRunId.value) ? evaluateValidationRunId.value : 0, // validation_run_id
      0, // start
      plotTablePageSize.value // limit
    );

    if (response?._data) {
      if (response?._data?.plot_file_path && response?._data?.plot_url) {
        selectedPlotFilename.value = response?._data?.plot_file_path;
        selectedPlotFileUrl.value = response?._data?.plot_url;
        for (let p = 0; p < plotList.value.length; p++) {
          if (plotList.value[p].name == selectedPlotName.value) {
            selectedPlotHasTimeseries.value = plotList.value[p].timeseries_available;
          }
        }
      } else {
        selectedPlotFilename.value = null;
        selectedPlotFileUrl.value = null;
        selectedPlotHasTimeseries.value = false;
        toast.removeAllGroups();
        const tMsg: ToastMessageOptions = { severity: 'info', summary: 'Plot graph is currently unavailable', life: ToastTimeout.timeout5000 };
        toast.add(tMsg); addToastRecord(tMsg);
      }

      if (response?._data?.plot_data && response?._data?.plot_data.length > 0) {
        plotTables.value = {};
        plotTableList.value = [];
        selectedPlotTable.value = '';
        if (response?._data?.pagination_metadata?.count) {
          plotTableTotalSize.value = response?._data?.pagination_metadata?.count;
        } else {
          plotTableTotalSize.value = response?._data?.plot_data.length;
        }
        plotTableData.value = [];
        if (Array.isArray(response?._data?.plot_data[0])) {
          // special case - we are dealing with an array of multiple tables, instead of a single table
          for (let i = 0; i < response?._data?.plot_data.length; i++) {
            // i is the iteration number - we need to get the table name from the iteration data row
            let iteration_data_row = response?._data?.plot_data[i];
            // table_name is the name of the run - should be the same across the entire iteration data row
            let table_name = iteration_data_row[0].run;
            // make sure our table is named in plotTables
            if (!(table_name in plotTables.value)) {
              plotTables.value[table_name] = [];
            }
            // now go through and add rows to our table
            for (let d = 0; d < iteration_data_row.length; d++) {
              let data_row = iteration_data_row[d];
              delete data_row.run;
              plotTables.value[table_name].push(data_row);
            }
          }
          // find the name of our first table and make that one selected by default
          Object.keys(plotTables.value).forEach(key => {
            plotTableList.value.push({ name: key });
          });
          selectedPlotTable.value = plotTableList.value[0].name;
          if (selectedPlotTable.value !== '') {
            plotTableData.value = plotTables.value[selectedPlotTable.value];
          } else {
            plotTableData.value = [];
          }
          adjustPlotTableColumns();
        } else {
          plotTables.value = { default_table: [] };
          for (let d = 0; d < response?._data?.plot_data.length; d++) {
            let data_row = response?._data?.plot_data[d];
            if ("metrics" in data_row) {
              for (let d = 0; d < data_row.metrics.length; d++) {
                data_row[data_row.metrics[d].name] = data_row.metrics[d].value;
              }
              delete data_row.metrics;
            }
            if ("parameters" in data_row) {
              for (let d = 0; d < data_row.parameters.length; d++) {
                data_row[data_row.parameters[d].name] = data_row.parameters[d].value;
              }
              delete data_row.parameters;
            }
            plotTables.value.default_table.push(data_row);
          }
          plotTableData.value = plotTables.value.default_table;
          adjustPlotTableColumns();
        }
        plotTableStartRow.value = 1;
        plotTableEndRow.value = plotTableData.value.length;
        plotTableTotalPages.value = Math.ceil(plotTableTotalSize.value / plotTablePageSize.value);
      } else {
        plotTableData.value = [];
        plotTableColumns.value = [];
        plotTableErrorMessage.value = 'Data internally calculated by program and unavailable for table display.';
      }
    } else {
      selectedPlotFilename.value = null;
      selectedPlotFileUrl.value = null;
      selectedPlotHasTimeseries.value = false;
      plotTableData.value = [];
      plotTableColumns.value = [];
      toast.removeAllGroups();
      const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'Error getting plot', life: ToastTimeout.timeout5000 };
      toast.add(tMsg); addToastRecord(tMsg);
    }
  }
});

// Handle selectedPlotTable changes
watch(selectedPlotTable, async () => {
  if (selectedPlotTable.value !== '') {
    plotTableData.value = plotTables.value[selectedPlotTable.value];
    adjustPlotTableColumns();
  }
});

// Convert selectedSweDateTime string to Date object
// VueDatePicker sets selectedSweDateTime to a string, so we need to convert it to a Date object
const convertSelectedSweDateStringToDateTimeObject = (value: string) => {
  selectedSweDateTime.value = DateTime.fromISO(value, { zone: 'utc' });
}

// Handle selectedSweDateTime changes
// if selectedSweDateTime is a string, convert it to a Date object
watch(selectedSweDateTime, async () => {
  if (typeof selectedSweDateTime.value === 'string') {
    convertSelectedSweDateStringToDateTimeObject(selectedSweDateTime.value);
  }
});

// set plotTableColumns whenever plotTableData is changed
function adjustPlotTableColumns() {
  plotTableErrorMessage.value = '';
  plotTableColumns.value = [];
  if (plotTableData.value.length > 0) {
    Object.keys(plotTableData.value[0]).forEach(key => {
      let column_header_words = key.split("_");
      for (let w = 0; w < column_header_words.length; w++) {
        let word = column_header_words[w]
        column_header_words[w] = word.charAt(0).toUpperCase() + word.slice(1);
      }
      let column_header = column_header_words.join(" ");
      plotTableColumns.value.push({ header: column_header, value: key });
    });
    for (let d = 0; d < plotTableData.value.length; d++) {
      Object.keys(plotTableData.value[d]).forEach(key => {
        if (plotTableData.value[d][key] && (plotTableData.value[d][key] === null || plotTableData.value[d][key] === '')) {
          plotTableData.value[d][key] = 'N/A';
        } else if (!isNaN(parseFloat(plotTableData.value[d][key])) && isFinite(plotTableData.value[d][key]) && plotTableData.value[d][key].toString().indexOf('.') > 0) {
          // attempt to round to 5 digits - just display as is if there are any problems doing this
          try {
            plotTableData.value[d][key] = Number(plotTableData.value[d][key]).toFixed(5);
          } catch (error) {
            console.error('Error rounding value ' + plotTableData.value[d][key] + ': ', error);
          }
        }
      });
    }
  }
}

// Watch for page number changes in plot table
watch(plotTableCurrentPage, async () => {
  if (isNaN(plotTableCurrentPage.value) || plotTableCurrentPage.value < 1 || plotTableCurrentPage.value > Math.ceil(plotTableTotalSize.value / plotTablePageSize.value)) {
    console.log('ERROR: Page number ' + plotTableCurrentPage.value + ' out of bounds');
  } else {
    plotTableStartRow.value = (plotTablePageSize.value * (plotTableCurrentPage.value - 1)) + 1;
    plotTableEndRow.value = Math.min(plotTableStartRow.value + (plotTablePageSize.value - 1), plotTableTotalSize.value);
    const response: any = await queryGetPlot(
      selectedPlotName.value !== null ? selectedPlotName.value : '', // plotName
      true, // include_data
      false, // force_include_plot
      (evaluateValidationRunId.value) ? 0 : calibrationJobId.value, // calibration_run_id
      (evaluateValidationRunId.value) ? evaluateValidationRunId.value : 0, // validation_run_id
      plotTableStartRow.value - 1, // start
      plotTablePageSize.value // limit
    );
    if (response?._data?.plot_data) {
      plotTableData.value = response?._data?.plot_data;
    }
  }
});

// Handle plotGraphData changes
watch(plotGraphData, async () => {
  if (plotGraphData.value.length > 0) {
    if (plotGraphLines.value.length == 0) {
      for (let c = 1; c < plotTableColumns.value.length; c++) {
        let strokeColor = c < plotGraphColors.length ? plotGraphColors[c - 1] : plotGraphColors[0];
        plotGraphLines.value.push({
          id: c,
          name: plotTableColumns.value[c].header,
          color: strokeColor,
          symbol: 'line',
          checked: true
        });
      }
    }
    nextTick(() => {
      drawInteractivePlot();
    })
  } else {
    showPlotGraph.value = false;
  }
});

const togglePlotGraph = async () => {
  if (showPlotGraph.value) {
    showPlotGraph.value = false;
  } else {
    if (!plotGraphData.value || plotGraphData.value.length == 0) {
      if (gridDisplayOptions.includes(selectedPlotName.value)) {
        // special case for SWE time series
        plotGraphDataRaw.value = sweTimeSeriesData.value;
        plotTableData.value = plotGraphDataRaw.value;
        adjustPlotTableColumns();
      } else {
        // standard interactive plot logic
        const response: any = await queryGetPlot(
          selectedPlotName.value !== null ? selectedPlotName.value : '', // plotName
          true, // include_data
          false, // force_include_plot
          (evaluateValidationRunId.value) ? 0 : calibrationJobId.value, // calibration_run_id
          (evaluateValidationRunId.value) ? evaluateValidationRunId.value : 0, // validation_run_id
          24, // start - ignore first 24 data records for plotting purposes
          plotTableTotalSize.value // limit
        );
        if (response?._data?.plot_data) {
          plotGraphDataRaw.value = response?._data?.plot_data;
        }
      }
      // setting min/max dates will trigger the date filter below
      plotGraphDateLimits.value = {
        start: new Date(plotGraphDataRaw.value[0][plotTableColumns.value[0].value]).toISOString().split('T')[0],
        end: new Date(plotGraphDataRaw.value[plotGraphDataRaw.value.length - 1][plotTableColumns.value[0].value]).toISOString().split('T')[0],
        span: Math.ceil((new Date(plotGraphDataRaw.value[plotGraphDataRaw.value.length - 1][plotTableColumns.value[0].value]).getTime() - new Date(plotGraphDataRaw.value[0][plotTableColumns.value[0].value]).getTime()) / (1000 * 3600 * 24))
      }
      plotGraphDateRange.value = {
        start: plotGraphDateLimits.value.start,
        end: plotGraphDateLimits.value.end,
      };
      showPlotGraph.value = true;
      nextTick(() => {
        drawInteractiveSlider();
      })
    } else {
      showPlotGraph.value = true;
      nextTick(() => {
        drawInteractivePlot();
        drawInteractiveSlider();
      })
    }
  }
}

// draw interactive plot when plot graph data is first loaded, and also when checkboxes are clicked
const drawInteractivePlot = () => {
  if (!plotGraphCheckboxesEmpty()) {
    plotGraphOptions.value = {
      x: { grid: true },
      y: { grid: true, labelAnchor: 'center', labelArrow: 'none' },
      marks: [],
      width: plotGraphArea.value.offsetWidth - 50,
      height: (document.getElementById('MainLeftDataParent').getBoundingClientRect().bottom - document.getElementById('PlotGraphArea').getBoundingClientRect().top) - 150
    };
    console.log('plotGraphOptions: ', plotGraphOptions.value);
    if (gridDisplayOptions.includes(selectedPlotName.value)) {
      plotGraphOptions.value.y.label = 'Depth (m)';
      plotGraphOptions.value.y.labelOffset = -10;
      plotGraphOptions.value.marginLeft = 50;
    } else {
      plotGraphOptions.value.y.label = 'Streamflow (cm/s)';
    }
    let plotLineData = [];
    let plotDotData = [];
    for (let c = 1; c < plotTableColumns.value.length; c++) {
      if (document?.getElementById('plotGraphCheckbox-' + c)?.checked) {
        for (let d = 0; d < plotGraphData.value.length; d++) {
          if (plotGraphLines.value[c - 1].symbol == 'line') {
            plotLineData.push({
              'time': new Date(plotGraphData.value[d][plotTableColumns.value[0].value]),
              'measurement': parseFloat(plotGraphData.value[d][plotTableColumns.value[c].value]),
              'color': plotGraphLines.value[c - 1].color,
              'name': plotGraphLines.value[c - 1].name
            });
          } else {
            plotDotData.push({
              'time': new Date(plotGraphData.value[d][plotTableColumns.value[0].value]),
              'measurement': parseFloat(plotGraphData.value[d][plotTableColumns.value[c].value]),
              'color': plotGraphLines.value[c - 1].color,
              'symbol': plotGraphLines.value[c - 1].symbol,
              'name': plotGraphLines.value[c - 1].name
            });
          }
        }
      }
    }

    let plotGraphLeftEdge = new Date(plotGraphDateRange.value.start);
    let plotGraphRightEdge = new Date(plotGraphDateRange.value.end);
    let lineOptions = {
      x: { value: 'time', label: 'Time' },
      y: { value: 'measurement', label: 'Measurement' },
      stroke: 'color'
    }
    let lineTipOptions = {
      x: { value: 'time', label: 'Time' },
      y: { value: 'measurement', label: 'Measurement' },
      title: (d) => `${d.name} (${d.color})`,
      fontSize: 14
    }
    let dotOptions = {
      x: { value: 'time', label: 'Time' },
      y: { value: 'measurement', label: 'Measurement' },
      stroke: 'color',
      symbol: 'symbol'
    }
    let dotTipOptions = {
      x: { value: 'time', label: 'Time' },
      y: { value: 'measurement', label: 'Measurement' },
      title: (d) => `${d.name} (${d.color} ${d.symbol})`,
      fontSize: 14
    }
    if (gridDisplayOptions.includes(selectedPlotName.value)) {
      lineOptions.y.label = 'Depth (cm/s)';
      lineTipOptions.y.label = 'Depth';
      lineTipOptions.title = (d) => `${d.name} (${d.color})\nTime: ${d.time.toISOString().split("T")[0]} ${d.time.toISOString().split("T")[1].split(":").slice(0, 2).join(":")}\nDepth: ${d.measurement} cm/s`
      dotOptions.y.label = 'Depth (cm/s)';
      dotTipOptions.y.label = 'Depth';
      dotTipOptions.title = (d) => `${d.name} (${d.color} ${d.symbol})\nTime: ${d.time.toISOString().split("T")[0]} ${d.time.toISOString().split("T")[1].split(":").slice(0, 2).join(":")}\nDepth: ${d.measurement} cm/s`
    } else {
      lineOptions.y.label = 'Flow (cm/s)';
      lineTipOptions.y.label = 'Flow';
      lineTipOptions.title = (d) => `${d.name} (${d.color})\nTime: ${d.time.toISOString().split("T")[0]} ${d.time.toISOString().split("T")[1].split(":").slice(0, 2).join(":")}\nStreamflow: ${d.measurement} cm/s`;
      dotOptions.y.label = 'Flow (cm/s)';
      dotTipOptions.y.label = 'Flow';
      dotTipOptions.title = (d) => `${d.name} (${d.color} ${d.symbol})\nTime: ${d.time.toISOString().split("T")[0]} ${d.time.toISOString().split("T")[1].split(":").slice(0, 2).join(":")}\nStreamflow: ${d.measurement} cm/s`;
    }
    if (plotLineData.length > 0) {
      plotGraphLeftEdge = new Date(plotLineData[0].time);
      plotGraphOptions.value.marks.push(
        Plot.lineY(plotLineData, lineOptions)
      );
      plotGraphOptions.value.marks.push(
        Plot.tip(plotLineData, Plot.pointer(lineTipOptions))
      );
    }
    if (plotDotData.length > 0) {
      plotGraphLeftEdge = new Date(plotDotData[0].time);
      plotGraphOptions.value.marks.push(
        Plot.dot(plotDotData, dotOptions)
      );
      plotGraphOptions.value.marks.push(
        Plot.tip(plotDotData, Plot.pointer(dotTipOptions))
      );
    }
    plotGraphOptions.value.marks.push(Plot.ruleX([plotGraphLeftEdge]));
    plotGraphOptions.value.marks.push(Plot.ruleY([0]));
    if (calData?.value?.validation_times) {
      // create dashed vertical lines for Sim Start, Val Start, Val End
      if (calData?.value?.validation_times.simulation_start_time) {
        let simStartTime = new Date(calData?.value?.validation_times.simulation_start_time);
        if (simStartTime < new Date(plotGraphDateLimits.value.start)) {
          // Don't plot Sim Start Time outside of the range of our usable data
          simStartTime = new Date(plotGraphDateLimits.value.start);
        }
        if (simStartTime >= plotGraphLeftEdge && simStartTime <= plotGraphRightEdge) {
          plotGraphOptions.value.marks.push(Plot.ruleX([simStartTime], { stroke: 'grey', strokeWidth: 2, strokeDasharray: 10 }));
          plotGraphOptions.value.marks.push(Plot.text([" Sim Start Time "], { x: [simStartTime], frameAnchor: 'top', textAnchor: 'start' }));
        }
      }
      if (calData?.value?.validation_times.validation_start_time) {
        let valStartTime = new Date(calData?.value?.validation_times.validation_start_time);
        if (valStartTime >= plotGraphLeftEdge && valStartTime <= plotGraphRightEdge) {
          plotGraphOptions.value.marks.push(Plot.ruleX([valStartTime], { stroke: 'grey', strokeWidth: 2, strokeDasharray: 10 }));
          plotGraphOptions.value.marks.push(Plot.text([" Val Start Time "], { x: [valStartTime], frameAnchor: 'top' }));
        }
      }
      if (calData?.value?.validation_times.validation_end_time) {
        let valEndTime = new Date(calData?.value?.validation_times.validation_end_time);
        if (valEndTime > new Date(plotGraphDateLimits.value.end)) {
          // Don't plot Sim Start Time outside of the range of our usable data
          valEndTime = new Date(plotGraphDateLimits.value.end);
        }
        if (valEndTime >= plotGraphLeftEdge && valEndTime <= plotGraphRightEdge) {
          plotGraphOptions.value.marks.push(Plot.ruleX([valEndTime], { stroke: 'grey', strokeWidth: 2, strokeDasharray: 10 }));
          plotGraphOptions.value.marks.push(Plot.text([" Val End Time "], { x: [valEndTime], frameAnchor: 'top', textAnchor: 'end' }));
        }
      }
    }
    plotGraphSVG.value.innerHTML = '';
    plotGraphSVG.value.append(Plot.plot(plotGraphOptions.value));
    nextTick(() => {
      if (plotGraphArea.value) {
        plotGraphOptions.value.width = plotGraphArea.value.offsetWidth - 50;
        plotGraphSliderOptions.value.width = plotGraphArea.value.offsetWidth - 100;
      };
    })
  }
}

const getSliderWidth = () => {
  return document.getElementById('PlotGraphSlider').getBoundingClientRect().right - document.getElementById('PlotGraphSlider').getBoundingClientRect().left;
}

const plotGraphCheckboxesEmpty = () => {
  if (plotGraphLines.value.length > 1) {
    for (let c = 0; c < plotGraphLines.value.length; c++) {
      if (!document?.getElementById('plotGraphCheckbox-' + (c+1))) {
        return false;
      } else if (document?.getElementById('plotGraphCheckbox-' + (c+1))?.checked) {
        return false;
      }
    }
    return true;
  }
  return false;
};

// Create slider as a mini-plot of just the first plot line
const drawInteractiveSlider = () => {
  if (!plotGraphCheckboxesEmpty()) {
    plotGraphSliderData.value = [];
    let rowSkip = plotGraphDataRaw.value.length / 1000;
    for (let c = 1; c < plotTableColumns.value.length; c++) {
      console.log('Column name: ', plotTableColumns.value[c].value);
      if ((gridDisplayOptions.includes(selectedPlotName.value) && plotTableColumns.value[c].value.toLowerCase().indexOf('snodas') >= 0) || 
        (!gridDisplayOptions.includes(selectedPlotName.value) && document?.getElementById('plotGraphCheckbox-' + c)?.checked)) {
        for (let d = 0; d < plotGraphDataRaw.value.length; d += rowSkip) {
          let dataPoint = {
            time: new Date(plotGraphDataRaw.value[Math.floor(d)][plotTableColumns.value[0].value]),
            measurement: parseFloat(plotGraphDataRaw.value[Math.floor(d)][plotTableColumns.value[c].value])
          };
          plotGraphSliderData.value.push(dataPoint);
        }
        console.log('Using column ' + plotTableColumns.value[c].value + ' to draw slider');
        break;
      }
    }
    let lineOptions = {
      x: 'time',
      y: 'measurement'
    }
    plotGraphSliderOptions.value = {
      x: { tickSize: 0, inset: 0 },
      y: { axis: null },
      marks: [
        Plot.lineY(plotGraphSliderData.value, lineOptions)
      ],
      width: plotGraphArea.value.offsetWidth - 100,
      height: 100,
      marginLeft: 0,
      marginRight: 0
    };
    while (plotGraphSlider.value.children.length > 1) {
      plotGraphSlider.value.removeChild(plotGraphSlider.value.children[1]);
    }
    plotGraphSlider.value.append(Plot.plot(plotGraphSliderOptions.value));
    console.log('Previous slider box position: ', sliderBoxPosition.value);
    if (!sliderBoxPosition.value || Object.keys(sliderBoxPosition.value).length != 2) {
      console.log('Resetting sliderBoxPosition')
      // we don't have a previous position to remember
      if (gridDisplayOptions.includes(selectedPlotName.value)) {
        // find our highest SNODAS measurement and start there
        let snodasColumnName = '';
        let snodasMaxValue = 0;
        let snodasMaxDate = null;
        Object.keys(plotGraphData.value[0]).forEach(key => {
          if (key.toLowerCase().indexOf('snodas') >= 0) {
            snodasColumnName = key;
          }
        });
        for (let d = 0; d < plotGraphData.value.length; d++) {
          if (plotGraphData.value[d][snodasColumnName] > snodasMaxValue) {
            snodasMaxValue = plotGraphData.value[d][snodasColumnName];
            snodasMaxDate = new Date(plotGraphData.value[d]['timestamp'])
          }
        }
        // override the default date for SWE
        selectedSweDateTime.value = snodasMaxDate.toISOString().split('T')[0];
        // start with a 4-month range around our highest measurement
        let daysFromStart = Math.round(snodasMaxDate.getTime() - (new Date(plotGraphDateRange.value.start)).getTime()) / (1000 * 3600 * 24);
        let sliderBoxStart = Math.ceil((daysFromStart - 150) * (getSliderWidth() / plotGraphDateLimits.value.span));
        let sliderBoxEnd = Math.ceil((daysFromStart + 90) * (getSliderWidth() / plotGraphDateLimits.value.span));
        sliderBoxPosition.value = {
          start: sliderBoxStart,
          end: sliderBoxEnd
        }
      } else {
        // for other plots, start with the middle third of the available range
        sliderBoxPosition.value = {
          start: getSliderWidth() / 3,
          end: getSliderWidth() * 2 / 3
        }
      }
    }
    document.getElementById('PlotGraphSliderBox').style.left = sliderBoxPosition.value.start + 'px';
    document.getElementById('PlotGraphSliderBox').style.right = (getSliderWidth() - sliderBoxPosition.value.end) + 'px';
    setSliderDateRange();
    plotGraphSliderHelpDisplay.value = plotGraphSliderHelpText[0];
  }
}

// Filter interactive plot when date range is changed
const updatePlotGraphDates = () => {
  interactivePlotDateFilter();
}

watch(plotGraphDateRange, async () => {
  if (plotGraphDataRaw.value) {
    interactivePlotDateFilter();
  }
});

const interactivePlotDateFilter = () => {
  let tempPlotGraphData = [];

  if (plotGraphDateRange.value.start > plotGraphDateRange.value.end) {
    plotGraphDateRange.value = {
      start: plotGraphDateRange.value.end,
      end: plotGraphDateRange.value.start
    }
  }
  if (plotGraphDateRange.value.start < plotGraphDateLimits.value.start) {
    plotGraphDateRange.value.start = plotGraphDateLimits.value.start;
  }
  if (plotGraphDateRange.value.end > plotGraphDateLimits.value.end) {
    plotGraphDateRange.value.end = plotGraphDateLimits.value.end;
  }
  let startDate = new Date(plotGraphDateRange.value.start);
  let endDate = new Date(plotGraphDateRange.value.end);
  startDate.setHours(0);
  startDate.setMinutes(0);
  endDate.setHours(23);
  endDate.setMinutes(59);
  for (let r = 0; r < plotGraphDataRaw.value.length; r++) {
    let currentDate = new Date(plotGraphDataRaw.value[r][plotTableColumns.value[0].value]);
    if (currentDate >= startDate && currentDate <= endDate) {
      tempPlotGraphData.push(plotGraphDataRaw.value[r]);
    }
  }
  let tempPlotGraphDataFiltered = [];
  if (tempPlotGraphData.length > 1000) {
    // only plot 1,000 data points at a time
    let rowSkip = tempPlotGraphData.length / 1000;
    for (let r = 0; r < tempPlotGraphData.length; r += rowSkip) {
      if (tempPlotGraphDataFiltered.length < 1000) {
        tempPlotGraphDataFiltered.push(tempPlotGraphData[Math.floor(r)]);
      }
    }
    plotGraphData.value = tempPlotGraphDataFiltered;
  } else {
    plotGraphData.value = tempPlotGraphData;
  }
}

const sliderDragStart = (event) => {
  const x = event.clientX - document.getElementById('PlotGraphSlider').getBoundingClientRect().left;
  sliderDragPosition.value.start = x;
  sliderDragPosition.value.current = x;
  sliderBoxPosition.value = {
    start: document.getElementById('PlotGraphSliderBox').getBoundingClientRect().left - document.getElementById('PlotGraphSlider').getBoundingClientRect().left,
    end: document.getElementById('PlotGraphSliderBox').getBoundingClientRect().right - document.getElementById('PlotGraphSlider').getBoundingClientRect().left
  }
  plotGraphSliderCursor.value = 'cursor-ew-resize';
  if (Math.abs(sliderBoxPosition.value.start - sliderDragPosition.value.start) <= 10) {
    sliderDragType.value = 'left';
    plotGraphSliderHelpDisplay.value = plotGraphSliderHelpText[1];
  } else if (Math.abs(sliderBoxPosition.value.end - sliderDragPosition.value.start) <= 10) {
    sliderDragType.value = 'right';
    plotGraphSliderHelpDisplay.value = plotGraphSliderHelpText[2];
  } else if (sliderBoxPosition.value.start < sliderDragPosition.value.start && sliderDragPosition.value.start < sliderBoxPosition.value.end) {
    sliderDragType.value = 'middle';
    plotGraphSliderHelpDisplay.value = plotGraphSliderHelpText[3];
    plotGraphSliderCursor.value = 'cursor-grabbing';
  } else {
    sliderDragType.value = '';
    plotGraphSliderHelpDisplay.value = plotGraphSliderHelpText[4];
    plotGraphSliderCursor.value = 'cursor-not-allowed';
  }
}

const sliderDragChange = (event) => {
  const x = event.clientX - document.getElementById('PlotGraphSlider').getBoundingClientRect().left;
  sliderBoxPosition.value = {
    start: document.getElementById('PlotGraphSliderBox').getBoundingClientRect().left - document.getElementById('PlotGraphSlider').getBoundingClientRect().left,
    end: document.getElementById('PlotGraphSliderBox').getBoundingClientRect().right - document.getElementById('PlotGraphSlider').getBoundingClientRect().left
  }
  if (!sliderDragType.value) {
    if (Math.abs(sliderBoxPosition.value.start - x) <= 10) {
      plotGraphSliderCursor.value = 'cursor-ew-resize';
      plotGraphSliderHelpDisplay.value = plotGraphSliderHelpText[1];
    } else if (Math.abs(sliderBoxPosition.value.end - x) <= 10) {
      plotGraphSliderCursor.value = 'cursor-ew-resize';
      plotGraphSliderHelpDisplay.value = plotGraphSliderHelpText[2];
    } else if (sliderBoxPosition.value.start < x && x < sliderBoxPosition.value.end) {
      plotGraphSliderCursor.value = 'cursor-grab';
      plotGraphSliderHelpDisplay.value = plotGraphSliderHelpText[3];
    } else {
      plotGraphSliderCursor.value = 'cursor-not-allowed';
      plotGraphSliderHelpDisplay.value = plotGraphSliderHelpText[4];
    }
  } else {
    switch (sliderDragType.value) {
      // imitate "dragging" of the box, but don't reset the plot dates yet
      case 'left':
        // only drag the left side of the box
        document.getElementById('PlotGraphSliderBox').style.left = x + 'px';
        break;
      case 'right':
        // only drag the right side of the box
        document.getElementById('PlotGraphSliderBox').style.right = (getSliderWidth() - x) + 'px';
        break;
      case 'middle':
        // drag both ends of the box by the same distance
        let xd = x - sliderDragPosition.value.current;
        document.getElementById('PlotGraphSliderBox').style.left = (sliderBoxPosition.value.start + xd) + 'px';
        document.getElementById('PlotGraphSliderBox').style.right = (getSliderWidth() - (sliderBoxPosition.value.end + xd)) + 'px';
    }
  }
  // have to keep track of the previous drag position every time this is triggered
  // (otherwise dragging the whole box by a relative distance doesn't work properly)
  sliderDragPosition.value.current = x;
}

const sliderDragCancel = (event) => {
  plotGraphSliderCursor.value = 'cursor-grab';
  plotGraphSliderHelpDisplay.value = plotGraphSliderHelpText[0];
  const x = event.clientX - document.getElementById('PlotGraphSlider').getBoundingClientRect().left;
  if (sliderDragType.value) {
    console.log('Dragged outside of slider box at position ' + x);
    if (x < 0) {
      document.getElementById('PlotGraphSliderBox').style.left = '0px';
      sliderBoxPosition.value.start = 0;
    } else if (x > getSliderWidth()) {
      document.getElementById('PlotGraphSliderBox').style.right = '0px';
      sliderBoxPosition.value.end = getSliderWidth();
    }
    sliderDragEnd(event);
  }
}

const sliderDragEnd = (event) => {
  console.log('sliderDragEnd event:', event);
  const x = event.clientX - document.getElementById('PlotGraphSlider').getBoundingClientRect().left;
  sliderDragPosition.value.end = x;
  setSliderDateRange();
  sliderDragType.value = '';
  plotGraphSliderCursor.value = 'cursor-grab';
  plotGraphSliderHelpDisplay.value = plotGraphSliderHelpText[0];
}

const setSliderDateRange = () => {
  if (sliderBoxPosition.value.start < 0) {
    sliderBoxPosition.value.start = 0;
  }
  if (sliderBoxPosition.value.end > getSliderWidth()) {
    sliderBoxPosition.value.end = getSliderWidth();
  }
  if (sliderBoxPosition.value.start > sliderBoxPosition.value.end) {
    sliderBoxPosition.value = {
      start: sliderBoxPosition.value.end,
      end: sliderBoxPosition.value.start
    };
  }

  let daysFromStart = Math.ceil(sliderBoxPosition.value.start * (plotGraphDateLimits.value.span / getSliderWidth()));
  console.log('daysFromStart:', daysFromStart);
  let newStartDate = new Date(plotGraphDateLimits.value.start);
  newStartDate.setDate(newStartDate.getDate() + daysFromStart);
  console.log('newStartDate:', newStartDate);

  let daysFromEnd = Math.ceil((getSliderWidth() - sliderBoxPosition.value.end) * (plotGraphDateLimits.value.span / getSliderWidth()));
  console.log('daysFromEnd:', daysFromEnd);
  let newEndDate = new Date(plotGraphDateLimits.value.end);
  newEndDate.setDate(newEndDate.getDate() - daysFromEnd);
  console.log('newEndDate:', newEndDate);

  document.getElementById('PlotGraphSliderBox').style.left = sliderBoxPosition.value.start + 'px';
  plotGraphDateRange.value.start = newStartDate.toISOString().split('T')[0];
  document.getElementById('PlotGraphSliderBox').style.right = (getSliderWidth() - sliderBoxPosition.value.end) + 'px';
  plotGraphDateRange.value.end = newEndDate.toISOString().split('T')[0];
  updatePlotGraphDates();
  console.log('plotGraphDateRange:', plotGraphDateRange.value);
}

const toggleCustomizePlot = async () => {
  if (showCustomizePlot.value) {
    showCustomizePlot.value = false;
  } else {
    showCustomizePlot.value = true;
  }
}

// Handle selectedLogCategory changes
watch(selectedLogCategory, async () => {
  selectedLogList.value = logLists.value[selectedLogCategory.value];
  // start with the first log
  selectedLogName.value = selectedLogList.value[0].name;
  if (!selectedLogList.value.length) {
    const tMsg: ToastMessageOptions = { severity: 'info', summary: selectedPlotName.value + ' not available', life: ToastTimeout.timeout5000 };
    toast.add(tMsg); addToastRecord(tMsg);
  }
});

// Handle selectedLogName changes
watch(selectedLogName, async () => {
  if (selectedLogName.value !== '') {
    selectedLogCurrentPage.value = 1;
    const response: any = await queryGetLogData(
      selectedLogCategory.value, // log_category,
      selectedLogName.value, // log_name
      (evaluateValidationRunId.value) ? evaluateValidationRunId.value : 0, // validation_run_id
      0, // start
      logDataPageSize.value // limit
    );
    if (response?._data) {
      let logText = '';
      for (let t = 0; t < response?._data?.log_data.length; t++) {
        logText += response?._data?.log_data[t] + '<br/>\n';
      }
      selectedLogDisplay.value = logText;
      selectedLogTotalSize.value = response?._data?.pagination_metadata?.count;
      selectedLogTotalPages.value = Math.ceil(selectedLogTotalSize.value / logDataPageSize.value);
      selectedLogStartRow.value = 1;
      if (selectedLogTotalPages.value === 1) {
        selectedLogEndRow.value = selectedLogTotalSize.value;
      } else {
        selectedLogEndRow.value = logDataPageSize.value;
      }
    }
    plotTables.value = {};
    plotTableList.value = [];
    plotTableData.value = [];
  }
});

// Watch for page number changes in logs
watch(selectedLogCurrentPage, async () => {
  if (isNaN(selectedLogCurrentPage.value) || selectedLogCurrentPage.value < 1 || selectedLogCurrentPage.value > selectedLogTotalPages.value) {
    console.log('ERROR: Page number ' + selectedLogCurrentPage.value + ' out of bounds');
  } else {
    selectedLogStartRow.value = (logDataPageSize.value * (selectedLogCurrentPage.value - 1)) + 1;
    if (selectedLogCurrentPage.value === selectedLogTotalPages.value) {
      selectedLogEndRow.value = selectedLogTotalSize.value;
    } else {
      selectedLogEndRow.value = (selectedLogStartRow.value + logDataPageSize.value) - 1;
    }
    const response: any = await queryGetLogData(
      selectedLogCategory.value, // log_category,
      selectedLogName.value, // log_name
      (evaluateValidationRunId.value) ? evaluateValidationRunId.value : 0, // validation_run_id
      selectedLogStartRow.value - 1, // start
      logDataPageSize.value // limit
    );
    if (response?._data) {
      let logText = '';
      for (let t = 0; t < response?._data?.log_data.length; t++) {
        logText += response?._data?.log_data[t] + '<br/>\n';
      }
      selectedLogDisplay.value = logText;
    }
  }
});

function capitalCase(str: string) {
  return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function formatDateString(str: string) {
  let date = new Date(str);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const gotoSelectAlternateIteration = () => {
  nextTick(() => {
    const tabs = document.getElementsByClassName("tabs");
    const e = <HTMLElement>tabs[2];
    e.click();
  })
}

const newValidation = () => {
  alert('newValidation');
  //tabChanged.value = 3;
}

const toggleMessagesGroup = async () => {
  if (showMessagesGroup.value) {
    showMessagesGroup.value = false;
  } else {
    showMessagesGroup.value = true;
  }
}

// call get_swe_images_by_date to load the SWE images when user clicks 'Get Spatial Plot' button
const getSpatialPlots = async () => {
  isEvaluationLoading.value = true;
  showPlotGraph.value = false;
  if (selectedPlotName.value && gridDisplayOptions.includes(selectedPlotName.value)) {
    // load the SWE images
    if (selectedSweDateTime.value && isValidDateTime(selectedSweDateTime.value)) {
      const selectedSweDate: Date = selectedSweDateTime.value.toJSDate();
      if (isValidDate(selectedSweDate)) {
        // load the SWE images
        const loadSweImagesErrors = await loadSweImages(evaluateValidationRunId.value, formatISOStringOrDateToYYYYMMDD(selectedSweDate as Date));

        if (loadSweImagesErrors) {
          loadSweImagesErrors.forEach((errorMessage) => {
            const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: errorMessage };
            toast.add(tMsg); addToastRecord(tMsg);
          });
        }
      } else {
        const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'selected SWE date is not in Date format' };
        toast.add(tMsg); addToastRecord(tMsg);
      }
    } else {
      const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'selected SWE date is not in DateTime format' };
      toast.add(tMsg); addToastRecord(tMsg);
    }
    isEvaluationLoading.value = false;
  }
}

const toggleExpandPlotTable = async () => {
  if (expandPlotTable.value) {
    expandPlotTable.value = false;
  } else {
    expandPlotTable.value = true;
  }
}

onUnmounted(() => {
  // make sure page clears all selected plots/tables when the user leaves
  selectedPlotName.value = null;
  selectedPlotFilename.value = null;
  selectedPlotFileUrl.value = null;
  selectedPlotHasTimeseries.value = false;
  selectedSupplementalTable.value = 0;
  selectedLogName.value = '';
  selectedLogList.value = [];
  sweTimeSeriesData.value = [];
})
</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

#DisplayOptions {
  width: 375px;
  margin-left: 0px;
}

#CalibrationLogOptions {
  width: 268px;
}

#validationLogOptions {
  width: 275px;
}

#GraphArea img {
  margin: 20px auto;
}

#PlotGraphArea {
  width: 100%;
}

#PlotGraphArea label {
  padding-left: 12px;
}

#PlotGraphSVG {
  width: 100%;
}

#PlotGraphSliderContainer {
  position: relative;
  user-select: none;
}

#PlotGraphSlider {
  position: absolute;
  background-color: #cccccc;
  padding: 0;
  margin: 0;
  height: 75px;
}

#PlotGraphSliderBox {
  position: absolute;
  border: 1px solid #000000;
  background-color: #ffffff;
  opacity: 0.5;
  z-index: 2;
  left: 0px;
  right: 0px;
  height: 100%;
}

#PlotGraphSliderDateRange {
  position: relative;
  top: 95px;
  font-weight: bold;
  font-size: 14px;
}

#PlotGraphSliderHelp {
  position: relative;
  top: 100px;
  font-size: 12px;
}

#MessagesGroupWindow {
  z-index: 100;
  border: 1px solid black;
  position: absolute;
  right: 2%;
  top: 161px;
  width: 48%;
  background-color: white;
  overflow: auto;
}

#PlotGraphControls {
  min-width: 225px;
}

#PlotGraphControls input[type='checkbox'] {
  margin-top: 4px;
}

#PlotGraphControls label, #CustomizePlotWindow label {
  margin: 0 4px 4px 4px !important;
  display: inline-block;
}

#CustomizePlotWindow {
  z-index: 98;
  border: 1px solid black;
  position: absolute;
  right: 2%;
  top: 266px;
  background-color: white;
  padding-left: 16px;
  padding-bottom: 16px;
}

#CustomizePlotWindow h2 {
  margin-top: 12px;
  margin-bottom: 12px;
}

#CustomizePlotWindow .select150 {
  z-index: 99;
}

#selectedLogDisplay,
#ValidationLogDisplay {
  max-height: 400px;
}

#validationJobId {
  font-size: 0.9em;
  background-color: #fff;
  border: 0px solid #fff;
  border-left: 0;
  border-right: 0;
  color: black;
  box-shadow: none;
}

#resultsPathname {
  font-size: 0.9em;
  background-color: #fff;
  border: 0px solid #fff;
  border-left: 0;
  border-right: 0;
  color: black;
  box-shadow: none;
}

.gray-border {
  border: 2px solid #d9d9d9;
}

.pagingLink {
  padding-left: 4px;
  padding-right: 4px;
  padding-top: 8px;
}

.pagingLink a:hover {
  text-decoration: underline;
  cursor: pointer;
}

.pagingLink.active {
  font-weight: bold;
}


.layout__table {
  position: relative;
  display: block;
}

.layout__row {
  display: flex;
}

.layout__row div {
  line-height: 2em;
}

.center-label {
  display: flex;
  align-items: center
}
</style>