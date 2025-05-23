// @ts-check

import { defineStore, storeToRefs } from "pinia";
import { DateTime } from "luxon";

import { useUserDataStore } from "@/stores/common/UserDataStore";
import { generalStore } from "../common/GeneralStore";
import { makeProtectedApiCall } from "@/composables/UserAuth";
import { useApiErrorResponsePreprocess } from "@/composables/ValidationHandlers";
import { formatISOStringOrDateToYYYYMMDD } from '@/utils/TimeHelpers';

export const useEvaluationSupplementalDataStore = defineStore('EvaluationSupplementalDataStore', () => {
  const { calibrationJobId } = storeToRefs(generalStore());
  const { ngencerfBaseUrl } = useBackendConfig();
  const { userCalibrationRunData } = storeToRefs(useUserDataStore());
  const { getAccessToken } = useUserDataStore();


  // refs
  const plotNames = ref<APIResponse>({});
  const plotList = ref<any[]>([]);
  const selectedPlotName = ref<string | null>(null);
  const selectedPlotFilename = ref<string | null>(null);
  const selectedPlotFileUrl = ref<string | null>(null);

  // grid refs
  const simulatedSources = ref<string[]>([
    'Calibration Best Run',
    'Calibration Last Run',
    'Calibration Control Run',
    'Validation Control Run',
    'Validation Best Run',
    'Validation Alt Iteration X Run'
  ]);
  const sweStartDateTime = ref<any>();
  const minSweDateTime = ref<any>();
  const sweEndDateTime = ref<any>();
  const maxSweDateTime = ref<any>();
  const sweTimeSeriesData = ref<any[]>([]);


  const gridTypes = ref<string[]>([
    'Gridded',
    'Catchment Means'
  ]);
  const selectedGridType = ref<string>();
  const selectedSweDateTime = ref<any>();

  const selectedSnodasLumpedMapUrl = ref<string>();
  const selectedSnodasRawMapUrl = ref<string>();
  const selectedSnodasSimMapUrl = ref<string>();

  const isEvaluationLoading = ref<boolean>(false);

  const userTimeZone = DateTime.local().zoneName;

  /**
   * set sweStartDateTime
   */
  const setSweStartDateTime = (): void => {
    if (sweTimeSeriesData.value.length > 0) {
      sweStartDateTime.value = DateTime.fromISO(sweTimeSeriesData.value[0].timestamp, { zone: 'utc' });
    } else {
      sweStartDateTime.value = DateTime.fromISO(userCalibrationRunData?.value?.validation_times?.simulation_start_time as string, { zone: 'utc' });
    }
    
    // this is used to set the min date for the date picker correctly
    minSweDateTime.value = sweStartDateTime.value.setZone(userTimeZone, { keepLocalTime: true });
  };

  /**
   * set sweEndDateTime
   */
  const setSweEndDateTime = (): void => {
    if (sweTimeSeriesData.value.length > 0) {
      sweEndDateTime.value = DateTime.fromISO(sweTimeSeriesData.value[sweTimeSeriesData.value.length - 1].timestamp, { zone: 'utc' });
    } else {
      sweEndDateTime.value = DateTime.fromISO(userCalibrationRunData?.value?.validation_times?.simulation_end_time as string, { zone: 'utc' });
    }
    
    // this is used to set the max date for the date picker correctly
    maxSweDateTime.value = sweEndDateTime.value.setZone(userTimeZone, { keepLocalTime: true });
  };

  /**
   * get sweTimeRange
   */
  const getSweTimeRange = (): string => {
    return `Range: ${formatISOStringOrDateToYYYYMMDD(sweStartDateTime.value.toJSDate())} to ${formatISOStringOrDateToYYYYMMDD(sweEndDateTime.value.toJSDate())}`;
  };

  /**
   * Load SWE images
   */
  const loadSweImages = async (validation_run_id: number, date: string): Promise<string[]> => {
    const getSweImagesResponse = await getSweImagesByDate(validation_run_id, date);

    if (getSweImagesResponse.status >= 200 && getSweImagesResponse.status < 300) {
      if (getSweImagesResponse._data) {
        selectedSnodasLumpedMapUrl.value = getSweImagesResponse?._data?.lumped_map;
        selectedSnodasRawMapUrl.value = getSweImagesResponse?._data?.raw_map;
        selectedSnodasSimMapUrl.value = getSweImagesResponse?._data?.sim_map;
        return [];
      } else {
        return ['No data from get_swe_images_by_date endpoint'];
      }
    } else {
      return useApiErrorResponsePreprocess(getSweImagesResponse);
    }
  };

  /**
   * Get Calibration Iteration Data
   * @return {any}
   */
  const queryGetIterations = async (): Promise<any> => {
    if (!calibrationJobId.value) {
      return null;
    }
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_calibration_data_by_iteration/`, {
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
  * Get Performance Metrics
  * @return {any}
  */
  const queryGetPerformanceMetrics = async (): Promise<any> => {
    if (!calibrationJobId.value) {
      return null;
    }
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_status/`, {
      method: "POST",
      mode: 'cors',
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(
        {
          calibration_run_id: calibrationJobId.value,
          include_performance_metrics: true
        }
      )
    });
  };

  /**
   * Get Calibration/Validation Log Names
   * @return {any}
   */
  const queryGetLogNames = async (validation_run_id: number = 0): Promise<any> => {
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_log_names/`, {
      method: "POST",
      mode: 'cors',
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        validation_run_id: validation_run_id
      })
    });
  };

  /**
   * Get Calibration/Validation Log Data
   * @return {any}
   */
  const queryGetLogData = async (
    log_category: string,
    log_name: string,
    validation_run_id: number = 0,
    start?: number,
    limit?: number
  ): Promise<any> => {
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_log/`, {
      method: "POST",
      mode: 'cors',
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        validation_run_id: validation_run_id,
        log_category: log_category,
        log_name: log_name,
        start: start !== undefined ? start.toString() : '',
        limit: limit !== undefined ? limit.toString() : ''
      })
    });
  };

  /**
   * get_snodas_images endpoint
   * @param {number} validation_run_id
   * @param {string} date
   * @return {any}
   */
  const getSweImagesByDate = async (validation_run_id: number, date: string): Promise<any> => {
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_swe_images_by_date/`, {
      method: "POST",
      mode: 'cors',
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        validation_run_id: validation_run_id,
        date: date
      })
    });
  };

  /**
   * run_swe endpoint
   * @param {number} validation_run_id
   * @return {any}
   */
  const queryGetSWETimeseriesData = async (validation_run_id: number): Promise<any> => {
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_swe_timeseries_data/`, {
      method: "POST",
      mode: 'cors',
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        validation_run_id: validation_run_id
      })
    });
  };

  return {
    plotNames,
    plotList,
    selectedPlotName,
    selectedPlotFilename,
    selectedPlotFileUrl,
    simulatedSources,
    gridTypes,
    selectedGridType,
    sweStartDateTime,
    minSweDateTime,
    maxSweDateTime,
    sweEndDateTime,
    selectedSweDateTime,
    selectedSnodasLumpedMapUrl,
    selectedSnodasRawMapUrl,
    selectedSnodasSimMapUrl,
    sweTimeSeriesData,
    isEvaluationLoading,
    setSweStartDateTime,
    setSweEndDateTime,
    getSweTimeRange,
    queryGetIterations,
    queryGetPerformanceMetrics,
    queryGetLogNames,
    queryGetLogData,
    getSweImagesByDate,
    loadSweImages,
    queryGetSWETimeseriesData,
  };
});

/* Pinia supports Hot Module replacement so you can edit your stores
   and interact with them directly in your app without reloading the page,
   allowing you to keep the existing state, add, or even remove state,
   actions, and getters.
*/
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useEvaluationSupplementalDataStore, import.meta.hot));
}