<template>
  <Transition name="slide-fade">
    <div id="MessagesGroupWindow" v-if="showMessagesGroup">
      <div class="text-right sticky top-0">
        <img title="Close" aria-label="Close" src="~/assets/styles/img/xclose.png" width="40"
          class="absolute cursor-pointer right-0 boxed mt-1 mr-1" @click="toggleMessagesGroup" alt="Close" />
      </div>
      <MessagesGroup />
    </div>
  </Transition>
  <client-only>
    <div class="pr-2">
      <div id="calibrationRunList">
        <div id="CalTable" class="w-[1200px] mx-auto">
          <div class="flex mt-2">
            <h1 class="pt-3 mb-8 text-3xl font-bold inline-block text-center w-[1200px]">
              <span>Forecast Runs</span><br />
              <span style="font-size: 12px;font-weight: normal;padding-left: 5px;">
                Right click on a row for options.
              </span>
            </h1>
          </div>
          <div class="grid grid-cols-2 mb-5">
            <div class="col-span-1">
              <div class="inline ">
                <label for="HeadwaterBasinGage">Headwater Basin Gage Filter</label><br>
                <Select id="HeadwaterBasinGage" class="mr-2 basin-gage-filter" v-model="uiGageId"
                  :options="forecastRunGageList" filter optionLabel="name" optionValue="name" placeholder=""
                  aria-label="Select Headwater Basin Gage Filter" title="Select Headwater Basin Gage Filter"></Select>
              </div>
            </div>
          </div>

          <ConfirmDialog></ConfirmDialog>
          <ContextMenu :pt="{ root: { id: 'cr-context-menu' } }" class="bg-white" ref="crContextMenu"
            :model="cmForecastRun"></ContextMenu>
          <DataTable id="ForecastRuns" :value="forecastRuns" scrollable scroll-height="400px"
            sortField="forecast_run_id" :sortOrder="-1" table-style="min-width: 50rem"
            v-model:selection="selectedForecastJob" selectionMode="single" :rowStyle="rowStyle"
            @rowSelect="onForecastRowSelect" @rowUnselect="onForecastRowUnSelect" @rowContextmenu="onRowContextMenu"
            class="boxed">
            <Column :pt="ptColumn" field="forecast_run_id" sortable>
              <template #header>
                <div class="column-header">
                  <span>Forecast</span><br /><span>ID</span>
                </div>
              </template>
              <template #body="slotProps">
                <span v-if="slotProps.data.forecast_run_id"
                  :aria-label="'Forecast Job ID ' + slotProps.data.forecast_run_id"
                  :title="'Forecast Job ID ' + slotProps.data.forecast_run_id">
                  {{ slotProps.data.forecast_run_id }}
                </span>
              </template>
            </Column>
            <Column :pt="ptColumn" field="cycle" header="Forecast Cycle" sortable>
              <template #body="slotProps">
                <span v-if="slotProps.data.cycle" :aria-label="'Forecast Cycle ' + slotProps.data.cycle"
                  :title="'Forecast Cycle ' + slotProps.data.cycle">
                  {{ slotProps.data.cycle }}
                </span>
              </template>
            </Column>
            <Column :pt="ptColumn" field="forecast_status" sortable>
              <template #header>
                <div class="column-header">
                  <span>Job Status</span>
                </div>
              </template>
              <template #body="slotProps">
                <span v-if="slotProps.data.forecast_status" :aria-label="'Job Status ' + slotProps.data.forecast_status"
                  :title="'Job Status ' + slotProps.data.forecast_status">
                  {{ slotProps.data.forecast_status }}
                </span>
              </template>
            </Column>
            <Column field="submit_date" sortable>
              <template #header>
                <div class="column-header">
                  <span>Submit Date</span>
                </div>
              </template>
              <template #body="slotProps">
                <div v-if="slotProps.data.submit_date" class="text-center"
                  :aria-label="'Submit Date ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.submit_date)"
                  :title="'Submit Date ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.submit_date)">
                  {{ formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.submit_date) }}
                </div>
              </template>
            </Column>
            <Column :pt="ptColumn" field="gage_id" sortable>
              <template #header>
                <div class="column-header">
                  <span>Headwater</span><br /><span>Basin Gage</span>
                </div>
              </template>
              <template #body="slotProps">
                <span v-if="slotProps.data.gage_id" :aria-label="'Headwater Basin Gage ' + slotProps.data.gage_id"
                  :title="'Headwater Basin Gage ' + slotProps.data.gage_id">
                  {{ slotProps.data.gage_id }}
                </span>
              </template>
            </Column>
            <Column :pt="ptColumn" field="calibration_run_id" sortable>
              <template #header>
                <div class="column-header">
                  <span>Calibration</span><br /><span>Job ID</span>
                </div>
              </template>
              <template #body="slotProps">
                <span v-if="slotProps.data.calibration_run_id"
                  :aria-label="'Calibration Job ID ' + slotProps.data.calibration_run_id"
                  :title="'Calibration Job ID ' + slotProps.data.calibration_run_id">
                  {{ slotProps.data.calibration_run_id }}
                </span>
              </template>
            </Column>
            <Column :pt="ptColumn" field="forcing_download_status" sortable>
              <template #header>
                <div class="column-header">
                  <span>Forcing</span><br /><span>Download Status</span>
                </div>
              </template>
              <template #body="slotProps">
                <span v-if="slotProps.data.forcing_download_status"
                  :aria-label="'Forcing Download Status ' + slotProps.data.forcing_download_status"
                  :title="'Forcing Download Status ' + slotProps.data.forcing_download_status">
                  {{ slotProps.data.forcing_download_status }}
                </span>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>

    </div>
    <div class="waitgif" v-if="isForecastLoading">
      <img alt="Please wait..." src="@/assets/styles/img/wait.gif" />
    </div>
  </client-only>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useToast } from "primevue/usetoast";

import type { CalibrationRunForForecast, DataTableContextMenuOption, ForecastJob } from "@/composables/NextGenModel";
import type { ToastMessageOptions } from "primevue/toast";

import { useForecastStore } from "@/stores/forecast/ForecastStore";
import { generalStore } from "~/stores/common/GeneralStore";

import { formatISOStringOrDateToYYYYMMDDHHMM } from '@/utils/TimeHelpers';
import { hilightTab } from '@/composables/TabHilight';

import type { DataTableRowClickEvent } from "primevue/datatable";
import MessagesGroup from "@/components/Common/MessagesGroup.vue";

const forecastStore = useForecastStore();
const {
  forecastRunGageList,
  uiGageId,
  calibrationRunForForecast,
  calibrationRunsForForecast,
  forecastRuns,
  selectedForecastJob,
  isForecastLoading
} = storeToRefs(forecastStore);

const {
  setSelectedForecastRunId,
  resetSelectedForecastRunData,
  loadForecastStatusRunTabData,
  loadForecastResultsTabData,
  loadSelectedCalibrationRun,
  setSelectedForecastRowData,
  getForecastJobs,
  getCalibrationJobsForForecast,
  resetUserSelectedForecastCalibrationRun } = useForecastStore();
const showMessagesGroup = ref<boolean>(false);
const toast = useToast();
const crContextMenu = ref(); //calibration run context menu

const { addToastRecord } = generalStore();

const cmForecastRun = ref<DataTableContextMenuOption[]>([]);

const ptColumn = ref({
  columnHeaderContent: { style: { "justify-content": "center" } },
  bodyCell: { style: { "text-align": "center" } }
});

const onRowContextMenu = (event: any) => {
  cmForecastRun.value = [];
  const crRowData = event.data as ForecastJob;
  console.log(`crRowData: ${JSON.stringify(crRowData)}`);

  if (selectedForecastJob && selectedForecastJob.value?.forecast_run_id == crRowData.forecast_run_id) {
    crContextMenu.value.show(event.originalEvent);
    setSelectedForecastRunId(parseInt(event.originalEvent.currentTarget.children[0].textContent));
    if (crRowData.forecast_status !== 'Running') {
      cmForecastRun.value.push({ label: 'View Results', icon: 'pi pi-fw-pisearch', command: () => navigateToForecastResults() });
    } else {
      cmForecastRun.value.push({ label: 'View Forecast Run Status', icon: 'pi pi-fw-pisearch', command: () => navigateToForecastRunStatus() });
    }
    cmForecastRun.value.push({ label: 'Run New Forecast', icon: 'pi pi-fw-pisearch', command: () => clearDataAndNavigateToSetupForecast() });
    cmForecastRun.value.push({ label: 'View Calibration Details', icon: 'pi pi-fw-pisearch', command: () => viewCalibrationDetails(crRowData.calibration_run_id) })
  }
};

onMounted(async () => {
  isForecastLoading.value = true;

  hilightTab(ForecastTabs.tab_forecastRuns);
  let ele = document.getElementById("MainLeftDataArea") as HTMLElement;
  if (ele) { ele.scrollTo(0, 0); }

  nextTick(async () => {
    // clear previously selected forecast job
    if (selectedForecastJob.value) {
      selectedForecastJob.value = undefined;
    }

    // clear all user-selected forecast and calibration data
    resetUserSelectedForecastCalibrationRun();

    // load forecastRuns
    await getForecastJobs();

    // load calibrationRunsForForecast
    await getCalibrationJobsForForecast();
  });

  isForecastLoading.value = false;
});

const onForecastRowSelect = async (event: DataTableRowClickEvent) => {
  const rowData = event.data as ForecastJob;
  setSelectedForecastRowData(rowData);
}

const onForecastRowUnSelect = async (event: DataTableRowClickEvent) => {
  resetSelectedForecastRunData();
}

const viewCalibrationDetails = async (calibration_run_id: number) => {
  isForecastLoading.value = true;
  nextTick(async () => {
    await loadSelectedCalibrationRun(calibration_run_id);
    isForecastLoading.value = false;
    showMessagesGroup.value = true;
  })
}

const clearDataAndNavigateToSetupForecast = () => {
  isForecastLoading.value = true;

  nextTick(async () => {
    // clear all user-selected forecast data
    resetUserSelectedForecastCalibrationRun();

    // set calibrationRunForForecast based on selectedForecastJob
    calibrationRunForForecast.value = calibrationRunsForForecast.value.find((calibrationRun: CalibrationRunForForecast) => {
      return calibrationRun.calibration_run_id === selectedForecastJob.value?.calibration_run_id;
    }) as CalibrationRunForForecast;

    // set userCalibrationRunData
    await loadSelectedCalibrationRun(selectedForecastJob?.value?.calibration_run_id as number);
    isForecastLoading.value = false;

    navigateToSetupForecast();
  });
};

const navigateToSetupForecast = () => {
  nextTick(() => {
    const e: HTMLElement | null = document.querySelector('.tabs[title="Setup Forecast tab"]');

    if (e) {
      e.click();
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Setup Forecast tab not found' } as ToastMessageOptions);
    }
  });
}

const navigateToForecastRunStatus = () => {
  isForecastLoading.value = true;
  nextTick(async () => {
    const e: HTMLElement | null = document.querySelector('.tabs[title="Status/Run Tab"]');

    // load status/run tab data
    await loadForecastStatusRunTabData();
    isForecastLoading.value = false;

    if (e) {
      e.click();
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Status/Run tab not found' } as ToastMessageOptions);
    }
  });
}

const navigateToForecastResults = () => {
  isForecastLoading.value = true;
  nextTick(async () => {
    const e: HTMLElement | null = document.querySelector('.tabs[title="Results tab"]');

    // load results tab data
    await loadForecastResultsTabData();
    isForecastLoading.value = false;

    if (e) {
      e.click();
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Results tab not found' } as ToastMessageOptions);
    }
  });
}

const rowStyle = (data: any) => {
  if (!['Saved', 'Ready'].includes(data.status)) {
    return { backgroundColor: 'white' }
  }
}

const toggleMessagesGroup = () => {
  if (showMessagesGroup.value) {
    showMessagesGroup.value = false;
  } else {
    showMessagesGroup.value = true;
  }
}

</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

#HeadwaterBasinGage {
  width: 300px;
}

#MessagesGroupWindow {
  z-index: 999;
  border: 1px solid black;
  position: absolute;
  right: 2%;
  top: 161px;
  width: 48%;
  background-color: white;
  overflow: auto;
}
</style>
