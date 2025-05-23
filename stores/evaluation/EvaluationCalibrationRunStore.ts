// @ts-check
import { defineStore, storeToRefs } from "pinia";

import type { SelectOption, CalibrationValidationRunData, ValidatedCalibrationRunList, CalibrationValidationJobList, CalibrationRunValidationParameterData } from "@/composables/NextGenModel";

import { useUserDataStore } from "@/stores/common/UserDataStore";
import { generalStore } from "@/stores/common/GeneralStore";

import { useBackendConfig } from "@/composables/UseBackendConfig";
import { makeProtectedApiCall } from "@/composables/UserAuth"
import { formatISOStringOrDateToYYYYMMDDHHMM } from '@/utils/TimeHelpers';
import { fixFloatToFivePlaces } from "@/utils/CommonHelpers";

export const useEvaluationCalibrationRunStore = defineStore('EvaluationCalibrationRunStore', () => {
  const { calibrationJobId, evaluateValidationRunId, evaluateIterationRunId, evaluateValidationRunStatus } = storeToRefs(generalStore());
  const { fetchUserCalibrationRunData, clearUserCalibrationRunData, getAccessToken } = useUserDataStore();
  const calibrationRunList = ref<any[]>([]);
  const userSelectedEvalCalibrationRunId = ref<number>(0);
  const { ngencerfBaseUrl } = useBackendConfig();

  const uiGageId = ref<string>("");
  const userSelectedEvalCalibrationRun = ref<any>();
  const loadCalibrationDataComplete = ref<boolean>(false);

  const { includeArchivedJobs } = storeToRefs(useUserDataStore());

  /**
   * list of calibration jobs with validation data
   */
  const userEvaluationCalibrationRunListData = ref<ValidatedCalibrationRunListItem[]>([]);
  /**
   * list of validation jobs of a selected calibration job id
   */
  const userSelectedCalibrationValidationRunList = ref<CalibrationValidationRunData[]>([]);

  const calibrationValidationRunListHeaders = ref<any[]>([]);
  const computedCalibrationValidationRunList = ref<CalibrationValidationJobData[]>([]);

  /**
  * @returns {SelectOption[]}
  */
  const evaluationCalibrationRunGageList = computed(() => {
    let gageOptionList = <SelectOption[]>[];
    gageOptionList.push({
      'name': "All",
      'description': "All"
    });
    userEvaluationCalibrationRunListData.value.forEach(runItem => {
      const checkGageIndex = gageOptionList.findIndex(
        (gageOption) =>
          gageOption.name === runItem.gage_id
      ) !== -1;
      if (!checkGageIndex) {
        gageOptionList.push({
          'name': runItem.gage_id,
          'description': runItem.gage_id
        });
      }
    });
    return gageOptionList;
  });

  /**
   * fetch user created calibration job list data
   * @return {void}
   */
  async function fetchUserValidatedCalibrationJobsListData() {
    userEvaluationCalibrationRunListData.value = [];
    const runListDataResult = await makeProtectedApiCall<ValidatedCalibrationRunList>(`${ngencerfBaseUrl}/calibration/get_calibration_jobs_for_evaluation/`, {
      method: "POST",
      mode: 'cors',
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ include_archived: includeArchivedJobs.value }),
    });

    if (runListDataResult?._data?.jobs.length > 0) {
      runListDataResult?._data?.jobs.forEach((runItem: ValidatedCalibrationRunListItem) => {
        if (runItem.status.toLowerCase() === "done" && runItem.submit_date !== null) {
          userEvaluationCalibrationRunListData.value.push(runItem);
        }
      });
    }
  }

  const fetchValidationRunListByCalibrationRun = async () => {
    const runListDataResult = await makeProtectedApiCall<CalibrationValidationJobList>(`${ngencerfBaseUrl}/calibration/get_validation_jobs/`, {
      method: "POST",
      mode: 'cors',
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: userSelectedEvalCalibrationRunId.value })
    });

    return runListDataResult._data?.validation_jobs as CalibrationValidationJobData[];
  }

  const fetchUserSelectedCalibrationValidationRunList = async () => {
    const runListDataResult = await makeProtectedApiCall<CalibrationValidationJobList>(`${ngencerfBaseUrl}/calibration/get_validation_jobs/`, {
      method: "POST",
      mode: 'cors',
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: userSelectedEvalCalibrationRunId.value })
    });

    if (runListDataResult._data?.validation_jobs) {
      //if there is only 1 validation job, we automatically set the selected validation id to that validation job     
      if (runListDataResult._data?.validation_jobs.length === 1) {
        const defaultValidationJob = runListDataResult._data?.validation_jobs[0] as CalibrationValidationJobData;
        evaluateValidationRunId.value = defaultValidationJob.validation_run_id;
        evaluateValidationRunStatus.value = defaultValidationJob.status;
      }

      runListDataResult._data?.validation_jobs.forEach((validation_job: CalibrationValidationJobData) => {
        if (validation_job.best === true) {
          calibrationValidationRunListHeaders.value.push({ field: 'validation_run_id', header: "Validation Job ID" });
          calibrationValidationRunListHeaders.value.push({ field: 'iteration_num', header: "Iteration" });
          calibrationValidationRunListHeaders.value.push({ field: 'status', header: "Status" });
          calibrationValidationRunListHeaders.value.push({ field: 'submit_date', header: "Submit Date" });

          validation_job.parameters.forEach((parameter: CalibrationRunValidationParameterData) => {
            calibrationValidationRunListHeaders.value.push({ field: parameter.name, header: parameter.name });
          });
        }
        let rowData = <any>{};
        rowData['validation_run_id'] = validation_job.validation_run_id;
        rowData['iteration_num'] = (validation_job.best === true) ? validation_job.iteration_num.toString() + "*" : validation_job.iteration_num;
        rowData['status'] = validation_job.status;
        rowData['submit_date'] = formatISOStringOrDateToYYYYMMDDHHMM(validation_job.submit_date);
        validation_job.parameters.forEach((parameter: CalibrationRunValidationParameterData) => {
          rowData[parameter.name] = fixFloatToFivePlaces(parameter.value)
        });
        computedCalibrationValidationRunList.value.push(rowData);
      });
    }
  }

  const setSelectedCalibrationRunId = (calibration_run_id: number): void => {
    userSelectedEvalCalibrationRunId.value = calibrationJobId.value = calibration_run_id;
  }

  /**
  * @returns {number}
  */
  const getValidationRunIdByCalibrationRunId = computed(() => {
    const find_validation_run = userEvaluationCalibrationRunListData.value.filter((validation: ValidatedCalibrationRunListItem) => {
      return validation.calibration_run_id === calibrationJobId.value;
    });
    if (!find_validation_run) {
      return 0;
    } else {
      // make sure we actually has validation run
      const validation_run = find_validation_run.shift();
      return validation_run?.validation_run_ids[0] ?? 0;
    }
  });

  const loadSelectedCalibrationRun = async (calibration_run_id: number, include_gpkg_map: boolean = true) => {
    setSelectedCalibrationRunId(calibration_run_id);
    await fetchUserCalibrationRunData(include_gpkg_map);
  }

  const resetUserSelectedCalibrationValidationRunList = () => {
    userSelectedCalibrationValidationRunList.value = [];
  }

  /**
   * @returns {SelectOption[]}
   */
  const getReferenceDataSetOptions = computed(() => {
    let options = <SelectOption[]>[];
    if (userSelectedEvalCalibrationRunId.value > 0) {
      options.push({
        'name': 'nwm',
        'description': 'NWM v2.0 retrospective'
      })
    }
    return options;
  });

  /**
   * @return {void}
   */
  const resetUserSelectedEvalCalibrationRun = (): void => {
    userSelectedEvalCalibrationRunId.value = 0;
    userSelectedEvalCalibrationRun.value = undefined;
    loadCalibrationDataComplete.value = false;
    userSelectedCalibrationValidationRunList.value = [];
    resetUserSelectedEvalValidationRun();
    clearUserCalibrationRunData();
  }

  /**
   * @return {void}
   */
  const resetUserSelectedEvalValidationRun = (): void => {
    calibrationJobId.value = userSelectedEvalCalibrationRunId.value = evaluateIterationRunId.value = 0;
    evaluateValidationRunId.value = 0;
    calibrationValidationRunListHeaders.value = [];
    computedCalibrationValidationRunList.value = [];
    evaluateValidationRunStatus.value = '';
  }

  useLogoutListen('logoutEvent', (evStr: string) => {
    if (evStr === "logout") {
      resetUserSelectedEvalCalibrationRun();
    }
  })

  return {
    uiGageId,
    calibrationRunList,
    evaluationCalibrationRunGageList,
    userSelectedEvalCalibrationRunId,
    loadCalibrationDataComplete,

    setSelectedCalibrationRunId,
    loadSelectedCalibrationRun,
    fetchUserValidatedCalibrationJobsListData,
    resetUserSelectedEvalCalibrationRun,
    getReferenceDataSetOptions,
    resetUserSelectedCalibrationValidationRunList,
    fetchUserSelectedCalibrationValidationRunList,
    resetUserSelectedEvalValidationRun,
    clearUserCalibrationRunData,
    fetchValidationRunListByCalibrationRun,

    getValidationRunIdByCalibrationRunId,
    userEvaluationCalibrationRunListData,
    calibrationValidationRunListHeaders,
    computedCalibrationValidationRunList,
    evaluateValidationRunId,
    evaluateIterationRunId,
    evaluateValidationRunStatus,
    userSelectedEvalCalibrationRun,
    }
})

/* Pinia supports Hot Module replacement so you can edit your stores
  and interact with them directly in your app without reloading the page,
  allowing you to keep the existing state, add, or even remove state,
  actions, and getters.
*/
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useEvaluationCalibrationRunStore, import.meta.hot));
}