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
  <client-only>
    <div class="pr-2">
      <div class="flex mt-2">
        <div class="w-full">
          <h1 class="pt-3 mb-6 text-3xl font-bold text-center">
            <span v-if="computedCalibrationValidationRunList.length <= 1">
              Calibration Runs<br />
              <span class="prompt-txt">
                Select row then right click for available options.
              </span>
            </span>
            <span v-if="computedCalibrationValidationRunList.length > 1">Validation Runs for Calibration Job {{
              userSelectedEvalCalibrationRunId }}<br />
              <span class="prompt-txt">
                Select row then right click for available options.
              </span>
            </span>
          </h1>
        </div>
      </div>

      <div id="calibrationRunList"
        v-if="userEvaluationCalibrationRunListData.length > 0 && computedCalibrationValidationRunList.length <= 1">

        <div id="CalTable" class="w-max mx-auto">
          <EvalRunsFilterDialog id="EvalRunsFilterDialog" @ApplyJobFilters="applyJobFilters()" :disable-all="false"
            @RefreshJobList="refreshJobList()" :calJobs="updatedUserEvaluationJobsListData"
            ref="evalRunsFilterDialog" />

          <ConfirmDialog></ConfirmDialog>
          <ContextMenu :pt="{ root: { id: 'cr-context-menu' } }" class="bg-white" ref="crContextMenu"
            :model="cmCalibrationRun"></ContextMenu>


          <DataTable id="EvalRunTable" :value="updatedUserEvaluationJobsListData" scrollable scroll-height="400px"
            sortField="calibration_run_id" :sortOrder="-1" table-style="min-width: 50rem"
            v-model:selection="selectedCalibrationRun" selectionMode="single" :rowStyle="rowStyle"
            @rowSelect="onEvalCalibrationRowSelect" @rowUnselect="onEvalCalibrationRowUnSelect"
            @rowContextmenu="onRowContextMenu" class="boxed">
            <Column :pt="ptColumn" field="calibration_run_id" header="Job ID" sortable> <template #body="slotProps">
                <span v-if="slotProps.data.calibration_run_id"
                  :aria-label="'Job ID ' + slotProps.data.calibration_run_id"
                  :title="'Job ID ' + slotProps.data.calibration_run_id">
                  {{ slotProps.data.calibration_run_id }}
                </span>
              </template></Column>

            <Column v-if="checkArchived" :pt="ptColumn" field="is_archived" :body="binaryValueBodyTemplate"
              :sortable="true">
              <template #header>
                <div class="column-header">
                  <span>Archived?</span>
                </div>
              </template> 
              <template #body="slotProps">
                <span v-if="slotProps.data.calibration_run_id"
                  :aria-label="slotProps.data.is_archived ? 'Archived' : ''"
                  :title="slotProps.data.is_archived ? 'Archived' : ''">
                  {{ slotProps.data.is_archived ? 'Yes' : 'No' }}
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
            <Column :pt="ptColumn" field="validation_runs" sortable>
              <template #header>
                <div class="column-header">
                  <span>Validation</span><br /><span>Runs</span>
                </div>
              </template>
              <template #body="slotProps">
                <span v-if="slotProps.data.validation_runs"
                  :aria-label="'Validation Run ' + slotProps.data.validation_runs"
                  :title="'Validation Run ' + slotProps.data.validation_runs">
                  {{ slotProps.data.validation_runs }}
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
            <Column :pt="ptColumn" field="job_genesis" sortable>
              <template #header>
                <div class="column-header">
                  <span>Job</span><br /><span>Genesis</span>
                </div>
              </template>
              <template #body="slotProps">
                <span v-if="slotProps.data.job_genesis" :aria-label="'Job Genesis ' + slotProps.data.job_genesis"
                  :title="'Job Genesis ' + slotProps.data.job_genesis">
                  {{ slotProps.data.job_genesis }}
                </span>
              </template>
            </Column>
            <Column :pt="ptColumn" field="created_at" sortable>
              <template #header>
                <div class="column-header">
                  <span>Creation</span><br /><span>Date</span>
                </div>
              </template>
              <template #body="slotProps">
                <span :aria-label="'Creation Date ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.created_at)"
                  :title="'Creation Date ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.created_at)">
                  {{ formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.created_at) }}
                </span>
              </template>
            </Column>
            <Column field="submit_date" sortable>
              <template #header>
                <div class="column-header">
                  <span>Submit</span><br /><span>Date</span>
                </div>
              </template>
              <template #body="slotProps">
                <span :aria-label="'Submit Date ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.submit_date)"
                  :title="'Submit Date ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.submit_date)">
                  {{ formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.submit_date) }}
                </span>
              </template>
            </Column>
          </DataTable>

        </div>

      </div>
      <div v-if="computedCalibrationValidationRunList.length > 1">
        <div id="evaluationCalibrationList">
          <ContextMenu :pt="{ root: { id: ' vr-context-menu' } }" class="bg-white" ref="vrContextMenu"
            :model="cmValidationRun"></ContextMenu>
          <DataTable id="validation-list" :value="computedCalibrationValidationRunList" scrollable scroll-height="400px"
            sortField="validation_run_id" :sortOrder="-1" table-style="min-width: 50rem" selectionMode="single"
            v-model:selection="selectedCalibrationValidationRun" :rowStyle="rowStyle"
            @rowContextmenu="onRowVrContextMenu" @rowSelect="onEvalValdiationRowSelect"
            @rowUnselect="onEvalValidationRowUnSelect" class="boxed">
            <Column :pt="ptValColumns" v-for="(col, colIndex) in calibrationValidationRunListHeaders" :key="colIndex"
              :header="col.header" :field="col.field">
            </Column>
          </DataTable>
          <div class="mt-3 mx-auto prompt-txt">
            * Iteration containing best parameter set determined during calibration.
          </div>
        </div>
        <div class="flex mt-2">
          <div class="ml-auto mt-4">
            <div id="NewButton">
              <Button id="btn-evaluate" class="ngenButtonDiv" @click.stop="returnCalibrationJobList">
                Return to Calibration Jobs
              </Button>
            </div>
          </div>
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
import type { CalibrationValidationJobData, DataTableContextMenuOption } from "@/composables/NextGenModel";
import { ToastTimeout } from "@/composables/NextgenEnums";

import { useEvaluationCalibrationRunStore } from "@/stores/evaluation/EvaluationCalibrationRunStore";
import { useUserDataStore } from "@/stores/common/UserDataStore";
import { useCalibrationJobStore } from "@/stores/common/CalibrationJobStore";
import { generalStore } from "@/stores/common/GeneralStore"

import MessagesGroup from "@/components/Common/MessagesGroup.vue";
import EvalRunsFilterDialog from "@/components/Common/EvalRunsFilterDialog.vue"

import { formatISOStringOrDateToYYYYMMDDHHMM } from '@/utils/TimeHelpers';
import { hilightTab } from '@/composables/TabHilight';
import { EvaluationTabs } from "@/composables/NextgenEnums";

const { deleteCalibrationRun } = useCalibrationJobStore();
const showMessagesGroup = ref<boolean>(false);

const crContextMenu = ref(); //calibration run context menu
const vrContextMenu = ref(); //validation run context menu

const contextMenuJob = ref<number>();

const cmCalibrationRun = ref<DataTableContextMenuOption[]>([]);
const cmValidationRun = ref<DataTableContextMenuOption[]>([]);

const evaluationCalibrationRunStore = useEvaluationCalibrationRunStore();

const updatedUserEvaluationJobsListData = ref<CalibrationJobListItem[]>([]);

const ptColumn = ref({
  columnHeaderContent: { style: { "justify-content": "center" } },
  bodyCell: { style: { "text-align": "center" } }
});

const ptValColumns = ref({
  columnHeaderContent: { style: { "justify-content": "center" } },
  bodyCell: { style: { "text-align": "right", "padding-right": "10px" } }
});

const {
  uiGageId,
  evaluationCalibrationRunGageList,
  loadCalibrationDataComplete,
  userSelectedEvalCalibrationRunId,
  calibrationValidationRunListHeaders,
  computedCalibrationValidationRunList,
  userEvaluationCalibrationRunListData,
  evaluateValidationRunId,
  evaluateValidationRunStatus,
} = storeToRefs(evaluationCalibrationRunStore);

const {
  fetchUserSelectedCalibrationValidationRunList,
  loadSelectedCalibrationRun,
  resetUserSelectedEvalCalibrationRun,
  resetUserSelectedEvalValidationRun,
  fetchUserValidatedCalibrationJobsListData,
  clearUserCalibrationRunData,
  setSelectedCalibrationRunId,
  fetchValidationRunListByCalibrationRun,
} = evaluationCalibrationRunStore;

const { userCalibrationRunData, modulesFilterList, includeArchivedJobs } = storeToRefs(useUserDataStore());

const { isLoading } = storeToRefs(generalStore());
const { addToastRecord } = generalStore();

const toast = useToast();
//this model is for highlighting purpose
const selectedCalibrationRun = ref<ValidatedCalibrationRunListItem>();
const selectedCalibrationValidationRun = ref<CalibrationValidationJobData>();

const formulationName = "Formulation Name";

onMounted(() => {
  hilightTab(EvaluationTabs.tab_calibrationRuns);
  includeArchivedJobs.value = false;
  //clear calibration data if user were on calibraiton tab and clear evaludation previous run data user may have selected
  resetUserSelectedEvalCalibrationRun();
  fetchUserValidatedCalibrationJobsListData();
  updatedUserEvaluationJobsListData.value = userEvaluationCalibrationRunListData?.value;
  isLoading.value = false;
});

/**
 * Splits a header string into two parts:
 * - `first`: all words except the last (or the entire header if only one word)
 * - `second`: the last word (or an empty string if only one word)
 */
function splitHeader(header: string): { first: string; second: string } {
  const words = header.split(' ');
  if (words.length > 1) {
    return {
      first: words.slice(0, words.length - 1).join(' '),
      second: words[words.length - 1]
    };
  }
  return { first: header, second: '' };
}

const refreshJobList = async () => {
  isLoading.value = true;
  await fetchUserValidatedCalibrationJobsListData();
  updatedUserEvaluationJobsListData.value = userEvaluationCalibrationRunListData?.value;
  isLoading.value = false;
}

const checkArchived = computed(() => {
  return userEvaluationCalibrationRunListData?.value.some(item => item.is_archived === true)
});

// A method to convert the binary value (boolean) to a sortable format
const binaryValueBodyTemplate = (rowData: any) => {
  return rowData.is_archived ? 'Yes' : 'No'; // Or return 1/0 as string or number
};


/**
 * Populate updatedUserEvaluationJobsListData with the job statuses to include the validation status
 */
const updateUserEvaluationJobsListData = async (): Promise<void> => {
  // set updatedUserEvaluationJobsListData to userCalibrationJobsListData, but with the updated status for the job to include the validation status
  updatedUserEvaluationJobsListData.value = await Promise.all(
    userEvaluationCalibrationRunListData.value
      .map(async (calibrationJob: CalibrationJobListItem) => {
        // if Calibration job is done, get validation statuses and update the overall status
        if (calibrationJob.status === 'Done') {
          const validationControlJobStatus: string | undefined = calibrationJob.validations?.find((validation: CalibrationJobValidationItem) => validation.validation_type === 'valid_control')?.status;

          const validationBestJobStatus: string | undefined = calibrationJob.validations?.find
            ((validation: CalibrationJobValidationItem) => validation.validation_type === 'valid_best')?.status;

          // get the overall calibration/validation status
          const overallCalibrationValidationStatus: string = getOverallCalibrationValidationStatus(
            calibrationJob.status,
            validationControlJobStatus,
            validationBestJobStatus
          );

          // save userCalibrationJobsListData with the updated status for the job
          return {
            ...calibrationJob,
            status: overallCalibrationValidationStatus
          };
        } else {
          // Calibration is not done, so just return the job data with the status as is
          return calibrationJob;
        }
      })
  );
};

/**
 * Applies the job filters
 */
let listcals: CalibrationJobListItem[];
const applyJobFilters = async () => {
  isLoading.value = true;
  await fetchUserValidatedCalibrationJobsListData();
  let fullJobList: CalibrationJobListItem[];
  let list: CalibrationJobListItem[];
  await updateUserEvaluationJobsListData();

  if (updatedUserEvaluationJobsListData?.value) {
    // Filter Headwater Basin Gage for the initial whole list
    if (!uiGageId.value || uiGageId.value === "All") {
      fullJobList = updatedUserEvaluationJobsListData?.value;
    } else {
      fullJobList = updatedUserEvaluationJobsListData?.value?.filter((row) => (row as CalibrationJobListItem).gage_id === uiGageId.value);
    }

    if (modulesFilterList.value.length) {
      list = fullJobList.filter(job =>
        job.modules.some(module => modulesFilterList.value.includes(module))
      );
      fullJobList = list;
    }

    updatedUserEvaluationJobsListData.value = fullJobList.filter((job, index, self) =>
      index === self.findIndex(j => j.calibration_run_id === job.calibration_run_id)
    );
    isLoading.value = false;
  }
};







const onRowContextMenu = (event: any) => {
  cmCalibrationRun.value = [];
  const crRowData = event.data as ValidatedCalibrationRunListItem;
  if (selectedCalibrationRun && selectedCalibrationRun.value?.calibration_run_id == crRowData.calibration_run_id) {
    crContextMenu.value.show(event.originalEvent);
    contextMenuJob.value = parseInt(event.originalEvent.currentTarget.children[0].textContent);
    if (crRowData.validation_runs > 1) {
      cmCalibrationRun.value.push({ label: 'Select Validation Run', icon: 'pi pi-fw-pisearch', command: () => viewSelectedCalibrationValidationRuns(crRowData.calibration_run_id) })
    } if (crRowData.validation_runs === 1) {
      cmCalibrationRun.value.push({ label: 'Evaluate', icon: 'pi pi-fw-pisearch', command: () => evaluateValidationJobFromCalibration(crRowData.calibration_run_id) })
    }
    cmCalibrationRun.value.push({ label: 'New Validation Run', icon: 'pi pi-fw-pisearch', command: () => viewSelectAlternateIteration(crRowData.calibration_run_id) });
    cmCalibrationRun.value.push({ label: 'View Calibration Details', icon: 'pi pi-fw-pisearch', command: () => viewCalibrationDetails(crRowData.calibration_run_id) })
    if (crRowData.validation_runs === 1) {
      cmCalibrationRun.value.push({ label: 'View Validation Run Status', icon: 'pi pi-fw-pisearch', command: () => viewValidationRunStatus(crRowData.calibration_run_id) })
    }
    cmCalibrationRun.value.push({ label: 'Delete Calibration Job', icon: 'pi pi-fw-pisearch', command: () => deleteSelectedCalibrationRun() });
  }
};

const onRowVrContextMenu = (event: any) => {
  cmValidationRun.value = [];
  const vrRowData = event.data as CalibrationValidationJobData;
  if (selectedCalibrationValidationRun && selectedCalibrationValidationRun.value?.validation_run_id === vrRowData.validation_run_id) {
    vrContextMenu.value.show(event.originalEvent);
    if (vrRowData.status.toLocaleUpperCase() !== 'RUNNING') {
      cmValidationRun.value.push({ label: 'Evaluate', icon: 'pi pi-fw-pisearch', command: () => evaluateValidationJob(vrRowData.validation_run_id, vrRowData.status) });
    }
    cmValidationRun.value.push({ label: 'New Validation Run', icon: 'pi pi-fw-pisearch', command: () => viewSelectAlternateIteration(userSelectedEvalCalibrationRunId.value) });
    cmValidationRun.value.push({ label: 'View Calibration Details', icon: 'pi pi-fw-pisearch', command: () => viewCalibrationDetails(userSelectedEvalCalibrationRunId.value) });
    cmValidationRun.value.push({ label: 'View Validation Run Status', icon: 'pi pi-fw-pisearch', command: () => navigationToStatusRun(vrRowData.validation_run_id, vrRowData.status) });
    if (vrRowData.status.toLocaleUpperCase() === 'RUNNING') {
      cmValidationRun.value.push({ label: 'Cancel', icon: 'pi pi-fw-pisearch', command: () => navigationToStatusRun(vrRowData.validation_run_id, vrRowData.status) });
    }
  }
}

const onEvalCalibrationRowSelect = async (event: DataTableRowClickEvent) => {
  resetUserSelectedEvalValidationRun();
  //loadSelectedCalibrationRun(event.data.calibration_run_id);
  setSelectedCalibrationRunId(event.data.calibration_run_id);
  //isLoading.value = true;
  if (event.data.validation_runs === 1) {
    fetchUserSelectedCalibrationValidationRunList();
  }
}

watch(() => userCalibrationRunData.value, (updatedRunData, initialRunData) => {
  if (updatedRunData !== undefined && Object.keys(updatedRunData).length > 0) {
    nextTick(() => {
      isLoading.value = false;
      loadCalibrationDataComplete.value = true;
    });
  }
});

const onEvalCalibrationRowUnSelect = (event: any) => {
  resetUserSelectedEvalCalibrationRun();
}

const onEvalValdiationRowSelect = async (event: DataTableRowClickEvent) => {
  evaluateValidationRunId.value = event.data.validation_run_id;
  evaluateValidationRunStatus.value = event.data.status;
}

const onEvalValidationRowUnSelect = async (event: DataTableRowClickEvent) => {
  evaluateValidationRunId.value = 0;
  evaluateValidationRunStatus.value = '';
}

const onRowDblClick = (event: any) => {
  isLoading.value = true;
  const rowData = event.data;
  contextMenuJob.value = rowData.calibration_run_id;
  openSelectedCalibrationRun();
}

const openSelectedCalibrationRun = () => {
  isLoading.value = true;
  resetUserSelectedEvalValidationRun();
  nextTick(async () => {
    setSelectedCalibrationRunId(contextMenuJob.value as number);
    await fetchUserSelectedCalibrationValidationRunList();
    isLoading.value = false;
  })
}

const viewCalibrationDetails = async (calibration_run_id: number) => {
  isLoading.value = true;
  nextTick(async () => {
    await loadSelectedCalibrationRun(calibration_run_id);
    isLoading.value = false;
    showMessagesGroup.value = true;
  })
}

const viewSelectedCalibrationValidationRuns = async (calibration_run_id: number) => {
  resetUserSelectedEvalValidationRun();
  isLoading.value = true;
  nextTick(async () => {
    setSelectedCalibrationRunId(calibration_run_id);
    await fetchUserSelectedCalibrationValidationRunList();
    isLoading.value = false;
  })
}

const navigationToStatusRun = (validation_run_id: number, validation_status: string) => {
  evaluateValidationRunId.value = validation_run_id;
  evaluateValidationRunStatus.value = validation_status;
  const tabs = document.getElementsByClassName("tabs");
  const e = <HTMLElement>tabs[EvaluationTabs.tab_runStatus];
  e.click();
}

const viewSelectAlternateIteration = async (calibration_run_id: number) => {
  setSelectedCalibrationRunId(calibration_run_id);
  if (userSelectedEvalCalibrationRunId.value > 0) {
    const tabs = document.getElementsByClassName("tabs");
    const e = <HTMLElement>tabs[EvaluationTabs.tab_selectAltIteration];
    e.click();
  } else {
    const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Missing Calibration Job', detail: 'Pleasea select a calibration job first.', life: ToastTimeout.timeout6000 };
    toast.add(tMsg); addToastRecord(tMsg);
  }
}

const navigateToAlternateIteration = (event: any) => {
  if (userSelectedEvalCalibrationRunId.value > 0) {
    const tabs = document.getElementsByClassName("tabs");
    const e = <HTMLElement>tabs[EvaluationTabs.tab_selectAltIteration];
    e.click();
  } else {
    const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Missing Calibration Job', detail: 'Pleasea select a calibration job first.', life: ToastTimeout.timeout6000 };
    toast.add(tMsg); addToastRecord(tMsg);
  }
}

const evaluateValidationJobFromCalibration = async (calibration_run_id: number): Promise<void> => {
  loadSelectedCalibrationRun(calibration_run_id, false);
  await fetchValidationRunListByCalibrationRun().then(validationRunList => {
    if (validationRunList.length === 1) {
      evaluateValidationRunId.value = validationRunList[0].validation_run_id;
      evaluateValidationRunStatus.value = validationRunList[0].status;

      const tabs = document.getElementsByClassName("tabs");
      const e = <HTMLElement>tabs[EvaluationTabs.tab_evaluate];
      e.click();
    }
  });
}

const evaluateValidationJob = (validation_run_id: number, validation_status: string): void => {
  evaluateValidationRunId.value = validation_run_id;
  evaluateValidationRunStatus.value = validation_status;
  const tabs = document.getElementsByClassName("tabs");
  const e = <HTMLElement>tabs[EvaluationTabs.tab_evaluate];
  e.click();
}

const viewValidationRunStatus = async (calibration_run_id: number): Promise<void> => {
  resetUserSelectedEvalValidationRun();
  nextTick(async () => {
    setSelectedCalibrationRunId(calibration_run_id);
    await fetchValidationRunListByCalibrationRun().then(validationRunList => {
      if (validationRunList.length === 1) {
        navigationToStatusRun(validationRunList[0].validation_run_id, validationRunList[0].status);
      }
    });
  })
}

const navigateToEvaluation = (event: any) => {
  if (evaluateValidationRunId.value > 0) {
    const tabs = document.getElementsByClassName("tabs");
    const e = <HTMLElement>tabs[EvaluationTabs.tab_evaluate];
    e.click();
  } else {
    const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Missing Validation Job', detail: 'Pleasea select a validation job first.', life: ToastTimeout.timeout6000 };
    toast.add(tMsg); addToastRecord(tMsg);
  }
}

const returnCalibrationJobList = (event: any) => {
  selectedCalibrationRun.value = selectedCalibrationValidationRun.value = undefined;
  resetUserSelectedEvalValidationRun();
  clearUserCalibrationRunData();
}

const confirmDelete = useConfirm();
const deleteSelectedCalibrationRun = () => {
  const selectedRunId = contextMenuJob.value as number;
  let confirmMessage = "Are you sure you want to delete this calibration run? All associated validation job will also be deleted."
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
}
const acceptDelete = (selectedRunId: number) => {
  deleteCalibrationRun(selectedRunId).then(response => {
    if (response.status === 200) {
      fetchUserValidatedCalibrationJobsListData();
      resetUserSelectedEvalValidationRun();
    } else {
      useApiErrorResponsePreprocess(response).forEach(message => {
        const tMsg: ToastMessageOptions = { severity: useApiResponseToastSeverityCode(response?.status), summary: 'Delete Calibration Job Failed.', detail: message, life: ToastTimeout.timeout10000 };
        toast.add(tMsg); addToastRecord(tMsg);
      });
    }
  });
  //selectedCalibrationRun.value = undefined;

}

const toggleMessagesGroup = () => {
  if (showMessagesGroup.value) {
    showMessagesGroup.value = false;
  } else {
    showMessagesGroup.value = true;
  }
}

const rowStyle = (data: any) => {
  if (!['Saved', 'Ready'].includes(data.status)) {
    //return { backgroundColor: 'gainsboro' }
    return { backgroundColor: 'white' }
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

#EvalRunTable,
#EvalRunsFilterDialog {
  width: 1200px;
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