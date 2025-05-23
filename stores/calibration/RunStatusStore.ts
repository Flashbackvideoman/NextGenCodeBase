// @ts-check

import { defineStore, storeToRefs } from "pinia";

import type { CalibrationStatus, CalibrationPlotListNamesData, BestIterationData } from "@/composables/NextGenModel";

import { useUserDataStore } from "@/stores/common/UserDataStore";
import { generalStore } from "@/stores/common/GeneralStore";

import { makeProtectedApiCall } from "@/composables/UserAuth";
import { useBackendConfig } from "@/composables/UseBackendConfig";
import { isValidDate, isCalibrationJobFinished, getValidControlAndValidBestStatus } from '@/utils/CommonHelpers';
import { convertTimeZone } from '@/utils/TimeHelpers';

export const useRunStatusStore = defineStore('RunStatusStore', () => {
  const { calibrationJobId } = storeToRefs(generalStore());
  const { ngencerfBaseUrl } = useBackendConfig();
  const { getAccessToken } = useUserDataStore();
  const { userCalibrationRunData } = storeToRefs(useUserDataStore());

  // refs
  const calibrationElapsedTime = ref<string>();
  const submitTimeDate = ref<Date>();
  const submitTime = ref<string>();

  const plotNames = ref({});
  const plotList = ref<any[]>([]);
  const selectedPlotName = ref<string>();
  const selectedPlotFilename = ref<string>();
  const selectedPlotFileUrl = ref<string>();
  const iteration = ref<number>();

  const stopCriteria = ref<number>();
  const stopCriteriaMet = ref<boolean>(false);
  const elapsedTimeIntervalId = ref<number>();
  const calibrationStatusIntervalId = ref<number>();
  const validationsStatusIntervalId = ref<number>();
  const validationControlStatus = ref<string>();
  const validationBestStatus = ref<string>();
  const validControlAndValidBestStatus = ref<string>();
  const resultsPathname = ref<string>();
  const validationBestAchieved = ref<BestIterationData>({ iteration: 0, isBest: false});
;
  /**
   * Compute Overall Calibration Validation Status
   */
  const overallCalibrationValidationStatus = computed<string>(() => {
    if (userCalibrationRunData?.value?.status !== 'Done') {
      return `Calibration ${userCalibrationRunData?.value?.status}`;
    } else if (userCalibrationRunData?.value?.status === 'Done' && validationControlStatus?.value === 'Running') {
      return `Calibration Done, Validation Control Running`;
    } else if (userCalibrationRunData?.value?.status === 'Done' && validationBestStatus?.value === 'Running') {
      return `Calibration Done, Validation Best Running`;
    } else if (
      userCalibrationRunData?.value.status === 'Done' &&
      validationControlStatus?.value === 'Done' &&
      validationBestStatus?.value === 'Done'
    ) {
      return 'Done';
    } else if (userCalibrationRunData.value.status === 'Done' && validControlAndValidBestStatus?.value) {
      return `Calibration Done, Validation ${validControlAndValidBestStatus.value}`;
    }
    return '';
  });

   /** 
   * Load RunStatusStore
   */
  const loadRunStatusStore = async (): Promise<void> => {
    // load stopCriteria, submitTimeDate, and submitTime from load_calibration_run
    stopCriteria.value = userCalibrationRunData?.value?.stop_criteria;

    if (isCalibrationJobFinished(userCalibrationRunData?.value?.status)) {
      submitTimeDate.value = new Date(userCalibrationRunData.value?.submit_date as string);
      if (isValidDate(submitTimeDate.value)) {
        submitTime.value = convertTimeZone(submitTimeDate.value);
      }
    }

    // load validControlAndValidBestStatus and calibrationElapsedTime from queryGetCalibrationStatus
    // Calibration must be Done to get validations
    // Calibration and Validations must be Done and run on Parallel Works to get completed calibrationElapsedTime
    const getStatusResponse = await queryGetCalibrationStatus(calibrationJobId.value);
    const validations = getStatusResponse?._data?.validations;
    const validControl = validations?.find((validation: any) => validation.validation_type === 'valid_control');
    const validBest = validations?.find((validation: any) => validation.validation_type === 'valid_best');
    
    if (validControl?.status) {
      validationControlStatus.value = validControl.status;
    }
    if (validBest?.status) {
      validationBestStatus.value = validBest.status;
    }
    if (validationControlStatus?.value && validationBestStatus?.value) {
      validControlAndValidBestStatus.value = getValidControlAndValidBestStatus(validationControlStatus.value, validationBestStatus.value);

      // get elapsed time from valid_best
      if (validBest.elapsed_time) {
        calibrationElapsedTime.value = validBest.elapsed_time;
      }
    }

    // load plotNames and plotList from get_plot_names
    plotNames.value = await queryGetPlotNames();
    plotList.value = ((plotNames?.value as any)?._data as PlotNames)?.plot_names;

    // load iteration from get_iteration.
    const getIterationResponse = await queryGetIteration();
    iteration.value = getIterationResponse?._data?.iteration;

    // load resultsPathname from get_job_data_dir. Calibration must be Done, Running, or Failed to get resultsPathname
    const getJobDataDirectoryResponse = await queryGetJobDataDirectory();
    resultsPathname.value = getJobDataDirectoryResponse?._data?.data_dir;
  };

  /**
   * Get Calibration Status
   * @return {any}
   */
  const queryGetCalibrationStatus = async (calibrationJobId: number): Promise<any> => {
    return makeProtectedApiCall<CalibrationStatus>(`${ngencerfBaseUrl}/calibration/get_status/`, {
      method: "POST",
      mode: 'cors',
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: calibrationJobId })
    });
  };

  /**
   * Get Calibration Plot Names
   * @return {any}
   */
  const queryGetPlotNames = async (): Promise<any> => {
    if(!calibrationJobId.value) {
      return null;
    }
    return makeProtectedApiCall<CalibrationPlotListNamesData>(`${ngencerfBaseUrl}/calibration/get_plot_names/`, {
      method: "POST",
      mode: 'cors',
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: calibrationJobId.value })
    });
  };

  /**
   * Get Calibration Plot
   * @return {any}
   */
  const queryGetPlot = async (
    plotName: string,
    include_data: boolean = false,
    force_include_plot: boolean = true,
    calibration_run_id: number = calibrationJobId.value,
    validation_run_id: number = 0,
    start?: number,
    limit?: number
  ): Promise<any> => {
    const params = new URLSearchParams({
      plot_name: plotName,
      include_data: include_data.toString(),
      force_include_plot: force_include_plot.toString()
    });
    if (validation_run_id > 0) {
      params.set('validation_run_id', validation_run_id.toString());
    } else {
      params.set('calibration_run_id', calibration_run_id.toString());
    }
    if (include_data) {
      params.set('start', start !== undefined ? start.toString() : '0');
      params.set('limit', limit !== undefined ? limit.toString() : '1');
    }

    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_plot/?${params.toString()}`, {
      method: "GET",
      mode: 'cors',
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": "application/json"
      }
    });
  };

  /**
   * Run Calibration
   * @return {any}
   */
  const runCalibrationJob = async (): Promise<any> => {
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/run_calibration/`, {
      method: "POST",
      mode: 'cors',
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: calibrationJobId.value })
    });
  }

  /**
   * Get Calibration Iteration
   * @returns {any}
   */
  const queryGetIteration = async (): Promise<any> => {
    if(!calibrationJobId.value) {
      return null;
    }
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_iteration/`, {
      method: "POST",
      mode: 'cors',
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: calibrationJobId.value })
    });
  };

  /**
   * Cancel Calibration Job
   * @returns {any}
   */
  const cancelCalibrationJob = async (): Promise<any> => {
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/cancel_job/`, {
      method: "POST",
      mode: 'cors',
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: calibrationJobId.value })
    });
  };

  /**
   * Get Job Data Directory
   * @returns {any}
   */
  const queryGetJobDataDirectory = async (): Promise<any> => {
    if(!calibrationJobId.value) {
      return null;
    }
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_job_data_dir/`, {
      method: "POST",
      mode: 'cors',
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: calibrationJobId.value })
    });
  };

  /**
   * Hard Reset Run/Status Store
   */
  const hardResetRunStatusStore = (): void => {
    calibrationElapsedTime.value = "";
    submitTimeDate.value = undefined;
    submitTime.value = "";
    plotNames.value = {};
    plotList.value = [];
    selectedPlotName.value = "";
    selectedPlotFilename.value = "";
    selectedPlotFileUrl.value = "";
    iteration.value = undefined;
    stopCriteria.value = undefined;
    stopCriteriaMet.value = false;
    validControlAndValidBestStatus.value = undefined;
    resultsPathname.value = undefined;

    if (elapsedTimeIntervalId.value) {
      clearInterval(elapsedTimeIntervalId.value);
      elapsedTimeIntervalId.value = undefined;
    }

    if (calibrationStatusIntervalId.value) {
      clearInterval(calibrationStatusIntervalId.value);
      calibrationStatusIntervalId.value = undefined;
    }

    if (validationsStatusIntervalId.value) {
      clearInterval(validationsStatusIntervalId.value);
      validationsStatusIntervalId.value = undefined;
    }
  };

  return {
    submitTimeDate,
    submitTime,
    calibrationElapsedTime,
    plotNames,
    plotList,
    selectedPlotName,
    selectedPlotFilename,
    selectedPlotFileUrl,
    iteration,
    stopCriteria,
    stopCriteriaMet,
    elapsedTimeIntervalId,
    calibrationStatusIntervalId,
    validationsStatusIntervalId,
    validationControlStatus,
    validationBestStatus,
    validControlAndValidBestStatus,
    resultsPathname,
    overallCalibrationValidationStatus,
    loadRunStatusStore,
    getValidControlAndValidBestStatus,
    queryGetCalibrationStatus,
    queryGetPlotNames,
    queryGetPlot,
    runCalibrationJob,
    queryGetIteration,
    queryGetJobDataDirectory,
    cancelCalibrationJob,
    hardResetRunStatusStore,
    validationBestAchieved
  };
});

/* Pinia supports Hot Module replacement so you can edit your stores
   and interact with them directly in your app without reloading the page,
   allowing you to keep the existing state, add, or even remove state,
   actions, and getters.
*/
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRunStatusStore, import.meta.hot));
}