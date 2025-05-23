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
      <div class="flex mt-2">
        <div class="w-full">
          <h1 class="pt-3 mb-8 text-3xl font-bold text-center">
            Calibration Runs<br />
            <span style="font-size: 12px;font-weight: normal;">
              Select row and right click for options.
            </span>
          </h1>
        </div>
      </div>

      <div id="calibrationRunList">
        <div id="CalTable">
          <div class="grid grid-cols-2 mb-5 gage-filter-wrapper">
            <div class="col-span-1">
              <label for="HeadwaterBasinGage">Headwater Basin Gage Filter</label><br>
              <Select id="HeadwaterBasinGage" class="mr-2 basin-gage-filter" v-model="uiGageId"
                :options="forecastRunGageList" filter optionLabel="name" optionValue="name"
                aria-label="Headwater Basin Gage Filter Select" title="Headwater Basin Gage Filter Select"
                placeholder="All"></Select>
            </div>
          </div>
          <ConfirmDialog></ConfirmDialog>
          <ContextMenu :pt="{ root: { id: 'cr-context-menu' } }" class="bg-white" ref="crContextMenu"
            :model="cmCalibrationRun"></ContextMenu>
          <DataTable id="CalibrationRunForForecastTable" :value="filteredData" scrollable scroll-height="400px"
            sortField="calibration_run_id" :sortOrder="-1" table-style="min-width: 50rem"
            v-model:selection="calibrationRunForForecast" selectionMode="single" :rowStyle="rowStyle"
            @rowSelect="onCalibrationRunForForecastRowSelect" @rowUnselect="onCalibrationRunForForecastRowUnSelect"
            @rowContextmenu="onRowContextMenu" class="boxed">
            <Column :pt="ptColumn" field="calibration_run_id" header="Job ID" sortable>
              <template #body="slotProps">
                <span v-if="slotProps.data.calibration_run_id"
                  :aria-label="'Job ID ' + slotProps.data.calibration_run_id"
                  :title="'Job ID ' + slotProps.data.calibration_run_id">
                  {{ slotProps.data.calibration_run_id }}
                </span>
              </template>
            </Column>
            <Column :pt="ptColumn" field="status" header="Status" sortable>
              <template #body="slotProps">
                <span v-if="slotProps.data.status" :aria-label="'Status ' + slotProps.data.status"
                  :title="'Status ' + slotProps.data.status">
                  {{ slotProps.data.status }}
                </span>
              </template>
            </Column>
            <Column :pt="ptColumn" field="submit_date" sortable>
              <template #header>
                <div class="column-header">
                  <span>Run Date</span>
                </div>
              </template>
              <template #body="slotProps">
                <span :aria-label="'Run Date ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.submit_date)"
                  :title="'Run Date ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.submit_date)">
                  {{ formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.submit_date) }}
                </span>
              </template>
            </Column>
            <Column :pt="ptColumn" field="formulation_name" sortable>
              <template #header>
                <div class="column-header">
                  <span>Formulation Name</span>
                </div>
              </template>
              <template #body="slotProps">
                <span v-if="slotProps.data.formulation_name"
                  :aria-label="'Formulation Name ' + slotProps.data.formulation_name"
                  :title="'Formulation Name ' + slotProps.data.formulation_name">
                  {{ slotProps.data.formulation_name }}
                </span>
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
            <Column :pt="ptColumn" field="objective_function" sortable>
              <template #header>
                <div class="column-header">
                  <span>Objective</span><br /><span>Function</span>
                </div>
              </template>
              <template #body="slotProps">
                <span v-if="slotProps.data.objective_function"
                  :aria-label="'Objective Function ' + slotProps.data.objective_function"
                  :title="'Objective Function ' + slotProps.data.objective_function">
                  {{ slotProps.data.objective_function }}
                </span>
              </template>
            </Column>
            <Column :pt="ptColumn" field="optimization_algorithm" sortable>
              <template #header>
                <div class="column-header">
                  <span>Optimization</span><br /><span>Algorithm</span>
                </div>
              </template>
              <template #body="slotProps">
                <span v-if="slotProps.data.optimization_algorithm"
                  :aria-label="'Optimization Algorithm ' + slotProps.data.optimization_algorithm"
                  :title="'Optimization Algorithm ' + slotProps.data.optimization_algorithm">
                  {{ slotProps.data.optimization_algorithm }}
                </span>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>

    </div>

    <div class="waitgif" v-if="isLoading">
      <img alt="Please wait..." src="@/assets/styles/img/wait.gif" />
    </div>
  </client-only>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useToast } from "primevue/usetoast";

import type { DataTableRowClickEvent } from 'primevue/datatable';
import type { ToastMessageOptions } from "primevue/toast";
import type { CalibrationRunForForecast, DataTableContextMenuOption } from "@/composables/NextGenModel";
import { ToastTimeout } from "@/composables/NextgenEnums";

import { useForecastStore } from "@/stores/forecast/ForecastStore";
import { useEvaluationCalibrationRunStore } from "@/stores/evaluation/EvaluationCalibrationRunStore";
import { useCalibrationJobStore } from "@/stores/common/CalibrationJobStore";
import { useUserDataStore } from "@/stores/common/UserDataStore";
import { generalStore } from "~/stores/common/GeneralStore";

import MessagesGroup from "@/components/Common/MessagesGroup.vue";

import { formatISOStringOrDateToYYYYMMDDHHMM } from '@/utils/TimeHelpers';
import { hilightTab } from '@/composables/TabHilight';
import { ForecastTabs } from "@/composables/NextgenEnums";

const { deleteCalibrationRun } = useCalibrationJobStore();

const { addToastRecord } = generalStore();

const evaluationCalibrationRunStore = useEvaluationCalibrationRunStore();
const showMessagesGroup = ref<boolean>(false);

const ptColumn = ref({
  columnHeaderContent: { style: { "justify-content": "center" } },
  bodyCell: { style: { "text-align": "center" } }
});

const forecastStore = useForecastStore();
const { getCalibrationJobsForForecast, resetUserSelectedForecastCalibrationRun } = forecastStore;


const toast = useToast();
const crContextMenu = ref(); //calibration run context menu

//this model is for highlighting purpose
const selectedCalibrationRun = ref<CalibrationRunForForecast>();

const { isLoading } = storeToRefs(generalStore());

const cmCalibrationRun = ref<DataTableContextMenuOption[]>([]);
const onRowContextMenu = (event: any) => {
  cmCalibrationRun.value = [];
  const crRowData = event.data as CalibrationRunForForecast;
  if (calibrationRunForForecast && calibrationRunForForecast.value?.calibration_run_id == crRowData.calibration_run_id) {
    crContextMenu.value.show(event.originalEvent);
    //forecastJobId.value = parseInt(event.originalEvent.currentTarget.children[0].textContent);
    setSelectedCalibrationRunId(parseInt(event.originalEvent.currentTarget.children[0].textContent));
    cmCalibrationRun.value.push({ label: 'Run New Forecast', icon: 'pi pi-fw-pisearch', command: () => navigateToSetupForecast() });
    cmCalibrationRun.value.push({ label: 'View Calibration Details', icon: 'pi pi-fw-pisearch', command: () => viewCalibrationDetails(crRowData.calibration_run_id) })
    //cmCalibrationRun.value.push( { label: 'Evaluate', icon: 'pi pi-fw-pisearch', command: () => openSelectedCalibrationRun() } );
    //cmCalibrationRun.value.push( { label: 'Show Setup', icon: 'pi pi-fw-pisearch', command: () => onCalibrationRunForForecastRowSelect() } );    
    cmCalibrationRun.value.push({ label: 'Delete Calibration Job', icon: 'pi pi-fw-pisearch', command: () => deleteSelectedCalibrationRun() });
  }
};

const {
  uiGageId,
  loadCalibrationDataComplete,
  userSelectedEvalCalibrationRunId,
} = storeToRefs(evaluationCalibrationRunStore);

const {
  fetchUserSelectedCalibrationValidationRunList,
  loadSelectedCalibrationRun,
  resetUserSelectedEvalCalibrationRun,
  resetUserSelectedEvalValidationRun,
  fetchUserValidatedCalibrationJobsListData,
} = evaluationCalibrationRunStore;

const { userCalibrationRunData } = storeToRefs(useUserDataStore());

const { calibrationRunsForForecast, calibrationRunForForecast, forecastRunGageList } = storeToRefs(useForecastStore());

const { setSelectedCalibrationRunId, resetSelectedCalibrationRunId } = useForecastStore();

onMounted(async () => {
  isLoading.value = true;
  hilightTab(ForecastTabs.tab_calibrationRuns);
  let ele = document.getElementById("MainLeftDataArea") as HTMLElement;
  if (ele) { ele.scrollTo(0, 0); }

  nextTick(async () => {
    resetSelectedCalibrationRunId();
    //clear calibration data if user were on calibration tab and clear evaluation previous run data user may have selected
    resetUserSelectedEvalCalibrationRun();
    resetUserSelectedForecastCalibrationRun();
    await getCalibrationJobsForForecast();
    isLoading.value = false;
  });
});

// Computed filtered data for DataTables
const filteredData = computed(() => {
  if (!uiGageId.value || uiGageId.value === "All") {
    return calibrationRunsForForecast?.value;
  } else {
    return calibrationRunsForForecast?.value?.filter((row) => (row as any as CalibrationJobListItem).gage_id === uiGageId.value);
  }
});


const viewCalibrationDetails = async (calibration_run_id: number) => {
  isLoading.value = true;
  nextTick(async () => {
    await loadSelectedCalibrationRun(calibration_run_id);
    isLoading.value = false;
    showMessagesGroup.value = true;
  })
}

const onCalibrationRunForForecastRowSelect = async (event: any) => {
  //isLoading.value = true;
  const rowData = event.data as CalibrationRunForForecast;
  setSelectedCalibrationRunId(rowData.calibration_run_id);
  //forecastJobId.value = rowData.calibration_run_id;
  //await loadSelectedCalibrationRun(forecastJobId.value as number);
  //await fetchUserSelectedCalibrationValidationRunList();
  //isLoading.value = false;
}

const onCalibrationRunForForecastRowUnSelect = async (event: DataTableRowClickEvent) => {
  //forecastJobId.value = 0;
  resetSelectedCalibrationRunId();
}

watch(() => userCalibrationRunData.value, (updatedRunData, initialRunData) => {
  if (updatedRunData !== undefined && Object.keys(updatedRunData).length > 0) {
    nextTick(() => {
      isLoading.value = false;
      loadCalibrationDataComplete.value = true;
    });
  }
});

const openSelectedCalibrationRun = async () => {
  console.log('openSelectedCalibrationRun');
  console.log('calibrationRunForForecast.value.calibration_run_id: ', calibrationRunForForecast.value?.calibration_run_id);
  isLoading.value = true;
  resetUserSelectedEvalValidationRun();
  console.log('calibrationRunForForecast.value.calibration_run_id: ', calibrationRunForForecast.value?.calibration_run_id);

  await loadSelectedCalibrationRun(calibrationRunForForecast.value?.calibration_run_id as number);
  await fetchUserSelectedCalibrationValidationRunList();
  navigateToSetupForecast();
  isLoading.value = false;
};

const navigateToSetupForecast = () => {
  if (calibrationRunForForecast?.value?.calibration_run_id && calibrationRunForForecast.value.calibration_run_id > 0) {
    const tabs = document.getElementsByClassName("tabs");
    const e = <HTMLElement>tabs[ForecastTabs.tab_setupForecast];
    e.click();
  } else {
    const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Missing Calibration Job', detail: 'Please select a calibration job first.', life: ToastTimeout.timeout6000 };
    toast.add(tMsg); addToastRecord(tMsg);
  }
}

const rowStyle = (data: any) => {
  if (!['Saved', 'Ready'].includes(data.status)) {
    return { backgroundColor: 'white' }
  }
}

const confirmDelete = useConfirm();

const deleteSelectedCalibrationRun = () => {
  const selectedRunId = calibrationRunForForecast.value?.calibration_run_id as number;
  let confirmMessage = "Are you sure you want to delete this run?"
  confirmDelete.require({
    message: confirmMessage,
    header: 'Confirm Delete',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'DELETE RUN',
    },
    accept: () => acceptDelete(selectedRunId),
    reject: () => {
      //do nothing
    }
  })
};

const acceptDelete = (selectedRunId: number) => {
  deleteCalibrationRun(selectedRunId).then(response => {
    if (response.status === 200) {
      fetchUserValidatedCalibrationJobsListData();
    } else {
      useApiErrorResponsePreprocess(response).forEach(message => {
        const tMsg: ToastMessageOptions = { severity: useApiResponseToastSeverityCode(response?.status), summary: 'Delete Calibration Job Failed.', detail: message, life: ToastTimeout.timeout10000 };
        toast.add(tMsg); addToastRecord(tMsg);
      });
    }
  });
  calibrationRunForForecast.value = undefined;
};

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

#calibrationRunList {
  height: 80%;
}

#HeadwaterBasinGage {
  width: 300px;
}

#CalibrationRunForForecastTable,
.gage-filter-wrapper {
  width: 1200px;
  margin: 0 auto;
}

.gage-filter-wrapper {
  margin-bottom: 1rem;
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