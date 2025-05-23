<template>
  <client-only>
    <div class="mx-auto px-8 text-center overflow-auto">
      <div>
        <!-- Page top -->
        <div>
          <h1 class="mt-10 mb-6 text-3xl font-bold inline-block">Calibration Jobs</h1>
          <Button class="ngenButtonDiv ml-8" @click="createNewCalibration" aria-label="New Calibration Job"
            title="New Calibration Job">New</Button>
          <br />
          <p class="prompt-txt mb-2" style="margin-top:-10px;">
            Double click on a row to open, or right click for more options. Click "New" button for a fresh setup.
          </p>
        </div>

        <!-- Table -->
        <div class="">

          <div id="CalTable" class="w-max mx-auto">
            <JobFilterDialog id="JobFilterDialog" @ApplyJobFilters="applyJobFilters()" :disable-all="disableFilters"
              @RefreshJobList="refreshJobList()" :calJobs="updatedUserCalibrationJobsListData" ref="jobFilterDialog" />
            <ConfirmDialog></ConfirmDialog>

            <ContextMenu :pt="{ root: { id: 'cr-context-menu' } }" class="bg-white w-[144px]" ref="crContextMenu"
              :model="whichContextMenu" @hide="selectedCalibrationRun = undefined"></ContextMenu>

            <DataTable id="Datatable" :value="updatedUserCalibrationJobsListData" sortField="calibration_run_id"
              :sortOrder="-1" scrollable scroll-height="400px" table-style="min-width: 50rem; z-index: 1" scrollY="true"
              v-model:selection="selectedCalibrationRun" selectionMode="multiple" contextMenu
              v-model:contextMenuSelection="selectedCalibrationRun" @rowContextmenu="onRowContextMenu"
              :rowStyle="rowStyle" @row-dblclick="onRowDblClick($event)" @row-select="dtRowSelected($event)"
              @row-unselect="dtRowUnselect($event)">

              <Column :pt="ptColumn" header=""
                style="width: 10px; text-align:center; vertical-align: top; padding: 0px !important">
                <template #body="slotProps">
                  <div v-if="slotProps.data.status.indexOf('Running') === -1"
                    :style="{ 'backgroundColor': colStyle(slotProps.data) }" :aria-label="slotProps.data.status"
                    :title="slotProps.data.status">
                    &nbsp;
                  </div>
                  <div v-else :style="{ backgroundColor: runningColor }" :aria-label="slotProps.data.status"
                    :title="slotProps.data.status">
                    &nbsp;
                  </div>
                </template>
              </Column>

              <Column :pt="ptColumn" field="calibration_run_id" header="Job ID" sortable>
                <template #body="slotProps">
                  <span v-if="slotProps.data.calibration_run_id"
                    :aria-label="'Job ID ' + slotProps.data.calibration_run_id"
                    :title="'Job ID ' + slotProps.data.calibration_run_id">
                    {{ slotProps.data.calibration_run_id }}
                  </span>
                </template>
              </Column>

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

              <Column :pt="ptColumn" field="gage_id" sortable>
                <template #header>
                  <div class="column-header">
                    <span>Headwater</span><br /><span>Basin Gage</span>
                  </div>
                </template>
                <template #body="slotProps">
                  <span v-if="slotProps.data.gage_id" :aria-label="'Headwater Basin Gag ' + slotProps.data.gage_id"
                    :title="'Headwater Basin Gag ' + slotProps.data.gage_id">
                    {{ slotProps.data.gage_id }}
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
              <Column field="created_at" sortable>Column
                <template #header>
                  <div class="column-header">
                    <span>Creation Date</span>
                  </div>
                </template>
                <template #body="slotProps">
                  <span :aria-label="'Creation Date ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.created_at)"
                    :title="'Creation Date ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.created_at)"
                    class="nowrap">
                    {{ formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.created_at) }}
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
                  <span v-if="slotProps.data.submit_date"
                    :aria-label="'Submit Date ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.submit_date)"
                    :title="'Submit Date ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.submit_date)"
                    class="nowrap">
                    {{ formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.submit_date) }}
                  </span>
                </template>
              </Column>
              <Column  sortable>
                <template #header>
                  <div class="column-header">
                    <span>Calibration Period</span>
                  </div>
                </template>
                <template #body="slotProps">
                  <span v-if="slotProps.data.calibration_start_period || slotProps.data.calibration_end_period"
                    :aria-label="'Calibration Period ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.calibration_start_period) + ' to ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.calibration_end_period)"
                    :title="'Calibration Period ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.calibration_start_period) + ' to ' + formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.calibration_end_period)"
                    class="nowrap">
                    {{ formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.calibration_start_period) }} <span
                      v-if="slotProps.data.calibration_end_period">to</span>
                    {{ formatISOStringOrDateToYYYYMMDDHHMM(slotProps.data.calibration_end_period) }}
                  </span>
                </template>
              </Column>
              <Column :pt="ptColumn" field="status" header="Status" sortable> <template #body="slotProps">
                  <span v-if="slotProps.data.status" :aria-label="'Status ' + slotProps.data.status"
                    :title="'Status ' + slotProps.data.status">
                    {{ slotProps.data.status }}
                  </span>
                </template></Column>
            </DataTable>
          </div>
        </div>

        <div id="MultJobOpsDlg" v-if="showHideMultOps">
          <MultipleJobOperations :cal-jobs="selectedMultipleCalibrationRuns"
            :cal-job-list="selectedMultipleCalibrationRunData" @DeleteSelectedJobs="acceptMultipleDelete()"
            @ArchiveSelectedJobs="acceptMultpleArchive(true)" @UnarchiveSelectedJobs="acceptMultpleArchive(false)"
            @CloseMultJobWindow="closeMultJobsWindow" />
        </div>

      </div>
    </div>

    <div class="waitgif" v-if="isLoading">
      <img alt="Please wait..." src="@/assets/styles/img/wait.gif" />
    </div>

  </client-only>
</template>

<script setup lang="ts">
import { onMounted, computed, getCurrentInstance } from "vue";
import { storeToRefs } from "pinia";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import Swal from 'sweetalert2';

//const LazyJobFilterDialog = defineAsyncComponent(() => import("@/components/Common/JobFilterDialog.vue"));
import JobFilterDialog from "@/components/Common/JobFilterDialog.vue"
import MultipleJobOperations from "@/components/Common/MultipleJobOperations.vue"

import type { CalibrationJobListItem, CalibrationJobValidationItem } from "@/composables/NextGenModel";
import type { ToastMessageOptions } from "primevue/toast";
import { ToastTimeout, JobStatusAction } from "@/composables/NextgenEnums";

import { useUserDataStore } from "@/stores/common/UserDataStore"
import { generalStore } from "@/stores/common/GeneralStore";
import { useCalibrationJobStore } from "@/stores/common/CalibrationJobStore";
import { useGageStore } from "@/stores/calibration/GageStore";
import { useTuningStore } from "@/stores/calibration/TuningStore";
import { useOptimizationStore } from "@/stores/calibration/OptimizationStore";
import { useRunStatusStore } from "@/stores/calibration/RunStatusStore";

import { useApiResponseToastSeverityCode, useApiErrorResponsePreprocess } from "@/composables/ValidationHandlers";
import { getOverallCalibrationValidationStatus } from "@/utils/CommonHelpers";
import { formatISOStringOrDateToYYYYMMDDHHMM } from '@/utils/TimeHelpers';

const { loadGageTabStaticData, resetGageStore } = useGageStore();

const { loadOptimizationTabStaticData } = useOptimizationStore();
const { loadTuningTabStaticData, hardResetTuningStore } = useTuningStore();

const { hardResetRunStatusStore } = useRunStatusStore();

const { calibrationJobId } = storeToRefs(generalStore());
const { getMenuIndex, addToastRecord } = generalStore();

const { userCalibrationJobsListData, userCalibrationRunData, uiGageId, modulesFilterList,
  statusTypeFilterList, includeArchivedJobs } = storeToRefs(useUserDataStore());
const { queryUserCalibrationRunData, fetchUserCalibrationJobsListData, clearUserCalibrationRunData } = useUserDataStore();
const { fetchNewCalibrationRunId, deleteCalibrationRun, cloneCalibrationRun, archiveCalibrationRun } = useCalibrationJobStore();

import { hilightTab } from '@/composables/TabHilight';

const toast = useToast();
const crContextMenu = ref(); //calibration run context menu

const { isLoading } = storeToRefs(generalStore());

const selectedCalibrationRun = ref<CalibrationJobListItem>();

const selectedMultipleCalibrationRuns = ref<number[]>([]);
const selectedMultipleCalibrationRunData = ref<CalibrationJobListItem[]>([]);

const updatedUserCalibrationJobsListData = ref<CalibrationJobListItem[]>([]);

let interval: number | undefined;
const runningColor = ref<string>('white');

const showHideMultOps = ref<boolean>(false);
const systemContextMenu = ref<boolean>(false);

const cmCalibrationRun = ref([
  { label: 'Open', icon: 'pi pi-folder-open', command: () => openSelectedCalibrationRun(selectedCalibrationRun) },
  { label: 'Clone', icon: 'pi pi-clone', command: () => cloneSelectedCalibrationRun(selectedCalibrationRun) },
  { label: 'Delete', icon: 'pi pi-trash', command: () => deleteSelectedCalibrationRun(selectedCalibrationRun, JobStatusAction.delete) },
  { label: 'Archive', icon: 'pi pi-folder', command: () => deleteSelectedCalibrationRun(selectedCalibrationRun, JobStatusAction.archive) }
]);

const cmArchiveRun = ref([
  { label: 'Un-archive', icon: 'pi pi-unlock', command: () => deleteSelectedCalibrationRun(selectedCalibrationRun, JobStatusAction.unarchive) }
]);


onMounted(async () => {
  if (getMenuIndex() === 1) { // Prevents calling get_calibration_jobs if we are not on the Calibration menu
    hilightTab(CalibrationTabs.tab_calibrationRuns);

    isLoading.value = false;
    let ele = document.getElementById("MainLeftDataArea") as HTMLElement;
    if (ele) { ele.scrollTo(0, 0); } 
    includeArchivedJobs.value = false;
    // populate updatedUserCalibrationJobsListData with the job statuses to include the validation status
    resetGageStore();
    hardResetTuningStore();
    hardResetRunStatusStore();
    clearUserCalibrationRunData();
    await updateUserCalibrationJobsListData();
    interval = window.setInterval(toggleColor, 500); // Toggle every 500ms (0.5s)
  }
})

onBeforeUnmount(() => {
  selectedCalibrationRun.value = undefined;
  if (interval) {
    clearInterval(interval); // Clean up the interval when the component is destroyed
  }
});

const onRowContextMenu = (event: any) => {
  if (selectedMultipleCalibrationRuns.value.length <= 1) {
    crContextMenu.value.show(event.originalEvent);
  }
  else {
    showHideMultOps.value = true;
    window.addEventListener(`click`, handleContextMenu);
  }
};

const dtRowSelected = (e: any) => {
  addCalibrationRun(e.data);
}

const dtRowUnselect = (e: any) => {
  deleteCalibrationRunById(e.data);
}

/**
 * Adds a calibration run object if one with the same `calibration_run_id` doesn't exist.
 * @param newRun - The new calibration run to be added.
 */
function addCalibrationRun(calRun: CalibrationJobListItem): void {
  const exists = selectedMultipleCalibrationRuns.value.some(
    run => run === calRun.calibration_run_id
  );
  if (!exists) {
    selectedMultipleCalibrationRuns.value.push(calRun.calibration_run_id);
    selectedMultipleCalibrationRunData.value.push(calRun);
  }
}

/**
 * Deletes calibration run(s) with a specific `calibration_run_id`.
 * In this example, it will remove any calibration run with id equal to 1.
 * @param id - The calibration run id to delete (default is 1).
 */
function deleteCalibrationRunById(calRun: CalibrationJobListItem): void {
  selectedMultipleCalibrationRuns.value = selectedMultipleCalibrationRuns.value.filter(
    run => run !== calRun.calibration_run_id
  );
  selectedMultipleCalibrationRunData.value = selectedMultipleCalibrationRunData.value.filter(
    run => run.calibration_run_id !== calRun.calibration_run_id
  );
}

watch(selectedCalibrationRun, () => {
  if (selectedMultipleCalibrationRuns.value.length === 0) {
    if (systemContextMenu.value) {
      window.removeEventListener(`contextmenu`, handleContextMenu);
      systemContextMenu.value = false;
    }
  } else if (!systemContextMenu.value) {
    window.addEventListener(`contextmenu`, handleContextMenu);
    systemContextMenu.value = true;
  };
});

const disableFilters = computed(() => {
  return (selectedMultipleCalibrationRuns.value.length > 1);
});


const handleContextMenu = (event: MouseEvent) => {
  event.preventDefault(); // Prevent the default context menu
}

/**
 * Close Mult Jobs Window
 * 
 */
const closeMultJobsWindow = () => {
  selectedCalibrationRun.value = undefined;
  selectedMultipleCalibrationRuns.value = [];
  selectedMultipleCalibrationRunData.value = [];
  showHideMultOps.value = false;
  window.removeEventListener(`click`, handleContextMenu);
}

const whichContextMenu = computed(() => {
  if (selectedCalibrationRun?.value?.is_archived) {
    return cmArchiveRun.value;
  }
  return cmCalibrationRun.value;
});

const ptColumn = ref({
  columnHeaderContent: { style: { "justify-content": "center" } },
  bodyCell: { style: { "text-align": "center" } }
});

/************************************************************/


const refreshJobList = async () => {
  isLoading.value = true;
  await fetchUserCalibrationJobsListData();
  isLoading.value = false;
}

// Function to toggle the color between 'red' and 'blue'
const toggleColor = () => {
  runningColor.value = runningColor.value === 'white' ? 'green' : 'white';
};

const checkArchived = computed(() => {
  return updatedUserCalibrationJobsListData?.value.some(item => item.is_archived === true)
});

// A method to convert the binary value (boolean) to a sortable format
const binaryValueBodyTemplate = (rowData: any) => {
  return rowData.is_archived ? 'Yes' : 'No'; // Or return 1/0 as string or number
};

/**
 * Applies the job filters
 */
let listcals: CalibrationJobListItem[];
const applyJobFilters = async () => {
  isLoading.value = true;
  await fetchUserCalibrationJobsListData();
  let fullJobList: CalibrationJobListItem[];
  let list: CalibrationJobListItem[];
  await updateUserCalibrationJobsListData();

  if (updatedUserCalibrationJobsListData?.value) {
    // Filter Headwater Basin Gage for the initial whole list
    if (!uiGageId.value || uiGageId.value === "All") {
      fullJobList = updatedUserCalibrationJobsListData?.value;
    } else {
      fullJobList = updatedUserCalibrationJobsListData?.value?.filter((row) => (row as CalibrationJobListItem).gage_id === uiGageId.value);
    }

    // Get calibrations
    listcals = (statusTypeFilterList.value.length > 0) ? fullJobList.filter((job) => statusTypeFilterList.value.includes(job.status)) : fullJobList;

    // Get evaluations
    list = fullJobList.filter(job =>
      job.validations.length > 0 &&
      job.validations.some(validation => statusTypeFilterList.value.includes(validation.status))
    );
    // Combine lists
    fullJobList = [...listcals, ...list];

    if (modulesFilterList.value.length) {
      list = fullJobList.filter(job =>
        job.modules.some(module => modulesFilterList.value.includes(module))
      );
      fullJobList = list;
    }

    updatedUserCalibrationJobsListData.value = fullJobList.filter((job, index, self) =>
      index === self.findIndex(j => j.calibration_run_id === job.calibration_run_id)
    );
    isLoading.value = false;
  }
};


const onRowDblClick = (e: any) => {
  const data = ref<any>();
  data.value = e.data;
  if (data.value.is_archived) {
    Swal.fire({
      width: 500,
      html: "Operation not allowed for archived jobs.<br />You must un-archive it first.",
      title: 'Cannot open job ' + data.value.calibration_run_id,
      confirmButtonText: 'Close',
    })
    return;
  }
  openSelectedCalibrationRun(data)
}

const openSelectedCalibrationRun = async (selectedCalibrationRun: any) => {
  isLoading.value = true;
  //keep the following for references purpose
  /*
  if( ['Done','Failed','SEVER_ERROR'].includes( selectedCalibrationRun.value.status ) ) const tMsg: ToastMessageOptions = { severity: 'info', summary: 'Open', detail: 'Run ID ' + selectedCalibrationRun.value.calibration_run_id + ' will open Results tab', life: ToastTimeout.timeout3000 };
    toast.add(tMsg); addToastRecord(tMsg);
  if( ['Saved','Ready'].includes( selectedCalibrationRun.value.status ) ) const tMsg: ToastMessageOptions = { severity: 'info', summary: 'Open', detail: 'Run ID ' + selectedCalibrationRun.value.calibration_run_id + ' will open corresponding saved tab', life: ToastTimeout.timeout3000 };
    toast.add(tMsg); addToastRecord(tMsg);
  if( ['Running'].includes( selectedCalibrationRun.value.status ) ) const tMsg: ToastMessageOptions = { severity: 'info', summary: 'Open', detail: 'Run ID ' + selectedCalibrationRun.value.calibration_run_id + ' will open Run/Status tab', life: ToastTimeout.timeout3000 };
    toast.add(tMsg); addToastRecord(tMsg);
  */
  calibrationJobId.value = selectedCalibrationRun.value.calibration_run_id;
  queryUserCalibrationRunData().then(queryResponse => {
    userCalibrationRunData.value = queryResponse?._data;
    loadEntireRun();
  });
}

const loadEntireRun = () => {
  isLoading.value = true;
  nextTick(async () => {
    await loadGageTabStaticData();
    isLoading.value = true;
    await loadTuningTabStaticData();
    await loadOptimizationTabStaticData();
    isLoading.value = false;
    gotoRunStatusTab();
  })

}
const gotoRunStatusTab = () => {
  const allTabs = document.getElementsByClassName("tabs");
  const e = allTabs[CalibrationTabs.tab_statusRun] as HTMLElement;
  e.click();
}

const rowStyle = (data: any) => {
  if (data.is_archived === true) {
    return { backgroundColor: '#ebebeb' };
  }
  if (!['Saved', 'Ready'].includes(data.status)) {
    return { backgroundColor: 'white' };
  }
}

const colStyle = (data: any) => {
  if (data.status.indexOf('Failed') !== -1) {
    return 'Red';
  }
  else if (data.status.indexOf('Done') !== -1) {
    return 'Blue';
  }
  else if (data.status.indexOf('Saved') !== -1) {
    return 'Yellow';
  }
  else if (data.status.indexOf('Ready') !== -1) {
    return 'Green';
  }
  else if (data.status.indexOf('Cancelled') !== -1) {
    return 'Orange';
  }
}

const createNewCalibration = async () => {
  // Clear out old data
  resetGageStore();
  hardResetTuningStore();
  clearUserCalibrationRunData();

  fetchNewCalibrationRunId().then(response => {
    if (response.status == 201) {
      if (response?._data && response?._data?.calibration_run_id && response?._data?.calibration_run_id > 0) {
        calibrationJobId.value = response?._data?.calibration_run_id;
        queryUserCalibrationRunData().then(queryResponse => {
          userCalibrationRunData.value = queryResponse?._data;
          gotoHeadwaterBasinGage();
        });
      } else {
        const tMsg: ToastMessageOptions = { severity: "error", summary: 'Create Calibration Job Failed.', detail: "Unable to Retrieve Valid Calibration Job Id", life: ToastTimeout.timeout10000 };
        toast.add(tMsg); addToastRecord(tMsg);
      }
    } else {
      useApiErrorResponsePreprocess(response).forEach(message => {
        const tMsg: ToastMessageOptions = { severity: useApiResponseToastSeverityCode(response?.status), summary: 'Create Calibration Job Failed.', detail: message, life: ToastTimeout.timeout10000 };
        toast.add(tMsg); addToastRecord(tMsg);
      });
    }
  });
}

const gotoHeadwaterBasinGage = () => {
  nextTick(async () => {
    await loadGageTabStaticData();
    await loadTuningTabStaticData();
    await loadOptimizationTabStaticData();
    const tabs = document.getElementsByClassName("tabs");
    const e = <HTMLElement>tabs[CalibrationTabs.tab_headwaterBasinGage];
    e.click();
  })

}

/**
 * following section require backend api before them can be implemented
 */
const cloneSelectedCalibrationRun = (selectedCalibrationRun: any) => {
  isLoading.value = true;
  const selectedRunId = selectedCalibrationRun.value.calibration_run_id;
  cloneCalibrationRun(selectedRunId).then(async (response) => {
    if (response.status == 200) {
      await fetchUserCalibrationJobsListData();
      // populate updatedUserCalibrationJobsListData with the job statuses to include the validation status
      await updateUserCalibrationJobsListData();
      isLoading.value = false;
    } else {
      isLoading.value = false;
      useApiErrorResponsePreprocess(response).forEach(message => {
        const tMsg: ToastMessageOptions = { severity: useApiResponseToastSeverityCode(response?.status), summary: 'Clone Calibration Job Failed.', detail: message, life: ToastTimeout.timeout10000 };
        toast.add(tMsg); addToastRecord(tMsg);
      });
    }
  });  
};

const confirmDelete = useConfirm();
const deleteSelectedCalibrationRun = (selectedCalibrationRun: any, archiveRun: number) => {
  let ty = "";
  let label = "";
  if (archiveRun === JobStatusAction.delete) {
    ty = "delete"
    label = "DELETE"
  } else if (archiveRun === JobStatusAction.archive) {
    ty = "archive"
    label = "ARCHIVE"
  } else {
    ty = "unarchive (restore)"
    label = "Unarchive (restore)"
  }

  const selectedRunId = selectedCalibrationRun.value.calibration_run_id
  const selectedRunName = (selectedCalibrationRun.value.formulation_name) ? " titled '" + selectedCalibrationRun.value.formulation_name + "'" : " (untitled)";
  let confirmMessage = "Are you sure you want to " + ty + " calibration run " + selectedRunId + selectedRunName;
  if (selectedCalibrationRun.value.status == "Running") confirmMessage += " The running calibration will be aborted."

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
      label: label
    },
    accept: () => {
      if (archiveRun === JobStatusAction.delete) {
        acceptDelete(selectedRunId)
      }
      else if (archiveRun === JobStatusAction.archive) {
        acceptArchive(selectedRunId, true)
      }
      else acceptArchive(selectedRunId, false);
    },
    reject: () => {
      //do nothing
    }
  })
}

/**
 * Aceept the deletion of a single job
 */
const acceptDelete = (selectedRunId: number) => {
  deleteCalibrationRun(selectedRunId).then(async (response) => {
    if (response.status == 200) {
      await fetchUserCalibrationJobsListData();
      // populate updatedUserCalibrationJobsListData with the job statuses to include the validation status
      await updateUserCalibrationJobsListData();
    } else {
      useApiErrorResponsePreprocess(response).forEach(message => {
        const tMsg: ToastMessageOptions = { severity: useApiResponseToastSeverityCode(response?.status), summary: 'Delete Calibration Job Failed.', detail: message, life: ToastTimeout.timeout10000 };
        toast.add(tMsg); addToastRecord(tMsg);
      });
    }
  });
  selectedCalibrationRun.value = undefined;
}

/**
 * Aceept the deletion of a single job
 */
const acceptMultipleDelete = () => {
  deleteCalibrationRun(selectedMultipleCalibrationRuns.value).then(async (response) => {
    if (response.status == 200) {
      await fetchUserCalibrationJobsListData();
      // populate updatedUserCalibrationJobsListData with the job statuses to include the validation status
      await updateUserCalibrationJobsListData();
    } else {
      useApiErrorResponsePreprocess(response).forEach(message => {
        const tMsg: ToastMessageOptions = { severity: useApiResponseToastSeverityCode(response?.status), summary: 'Delete Calibration Jobs Failed.', detail: message, life: ToastTimeout.timeout10000 };
        toast.add(tMsg); addToastRecord(tMsg);
      });
    }
  });
  selectedCalibrationRun.value = undefined;
}


/**
 * Aceept archiving of a single job
 */
const acceptArchive = (selectedRunId: number, archiveJob: boolean) => {
  archiveCalibrationRun(selectedRunId, archiveJob).then(async (response) => {
    if (response.status == 200) {
      await fetchUserCalibrationJobsListData();
      // populate updatedUserCalibrationJobsListData with the job statuses to include the validation status
      await updateUserCalibrationJobsListData();
    } else {
      useApiErrorResponsePreprocess(response).forEach(message => {
        const tMsg: ToastMessageOptions = { severity: useApiResponseToastSeverityCode(response?.status), summary: 'Archive Calibration Job Failed.', detail: message, life: ToastTimeout.timeout10000 };
        toast.add(tMsg); addToastRecord(tMsg);
      });
    }
  });
  selectedCalibrationRun.value = undefined;
}

/**
 * Aceept archiving of a muiltiple jobs
 */
const acceptMultpleArchive = (archiveJob: boolean) => {
  archiveCalibrationRun(selectedMultipleCalibrationRuns.value, archiveJob).then(async (response) => {
    if (response.status == 200) {
      await fetchUserCalibrationJobsListData();
      // populate updatedUserCalibrationJobsListData with the job statuses to include the validation status
      await updateUserCalibrationJobsListData();
    } else {
      useApiErrorResponsePreprocess(response).forEach(message => {
        const tMsg: ToastMessageOptions = { severity: useApiResponseToastSeverityCode(response?.status), summary: 'Archive Calibration Job Failed.', detail: message, life: ToastTimeout.timeout10000 };
        toast.add(tMsg); addToastRecord(tMsg);
      });
    }
  });
  selectedCalibrationRun.value = undefined;
}


/**
 * Populate updatedUserCalibrationJobsListData with the job statuses to include the validation status
 */
const updateUserCalibrationJobsListData = async (): Promise<void> => {
  // set updatedUserCalibrationJobsListData to userCalibrationJobsListData, but with the updated status for the job to include the validation status
  updatedUserCalibrationJobsListData.value = await Promise.all(
    userCalibrationJobsListData.value
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


</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

label,
small-label,
.--dp-font-size {
  font-size: 0.9em !important;
}

#HeadwaterBasinGage {
  width: auto;
}

#FilterGroup {
  color: black;
  font-weight: 600;
  margin: 0 auto;
}

#CalTable {
  min-height: 400px;
}

#CalDateEnd,
#CalDateStart {
  padding: 0 4px;
  width: 100%;

  :first-child {
    > :first-child {
      > :first-child {
        font-size: 0.9em;
      }
    }
  }
}

.filter-link,
.module-select {
  color: global.$color-blue;
  text-decoration: underline;
  background-color: transparent !important;
  padding: 5px;
}

.filter-link:hover,
.module-select:hover {
  font-weight: bold !important;
  border: none;
}

.p-button:not(:disabled):hover {
  background-color: transparent;
  color: global.$color-blue;
  font-weight: bold;
}

.datePickers {
  display: inline-block;
  text-align: center;
}

/* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

#ModuleFilter {
  height: 37px;
  background-color: #f3f3f3;

  p-multiselect-label-container {
    margin-top: -6px;
  }
}

#Datatable,
#JobFilterDialog {
  width: 1325px !important;
}

#MultJobOpsDlg {
  position: fixed;
  top: 33%;
  z-index: 10;
  left: 40%;
}

.toggle-switch {
  height: 1.5em;
  width: 3em;
}

.toggle-switch::before {
  display: block;
  height: 1.25em;
  left: 0.125em;
  position: absolute;
  top: 0.125em;
  transition: left 150ms;
  width: 1.25em;
}

.nowrap {
  white-space: nowrap;
}

.grayedout {
  color: #555 !important;
}

.p-checkbox-box {
  border: 2px;
}

.archivedBackground {
  background-color: blue;
}
</style>