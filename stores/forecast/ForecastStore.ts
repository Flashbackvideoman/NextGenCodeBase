import { defineStore, storeToRefs } from "pinia";
import type { SelectOption, CalibrationRunForForecast, CalibrationRunsForForecast, ForecastCycle, ForecastJob, ForecastJobs } from "@/composables/NextGenModel";
import { useUserDataStore } from "@/stores/common/UserDataStore";
import { generalStore } from "@/stores/common/GeneralStore";

import { makeProtectedApiCall } from "@/composables/UserAuth";
import { useBackendConfig } from "@/composables/UseBackendConfig";
import { useApiErrorResponsePreprocess } from "@/composables/ValidationHandlers";
import { isValidDate } from '@/utils/CommonHelpers';
import { convertTimeZone } from '@/utils/TimeHelpers';

export const useForecastStore = defineStore('ForecastStore', () => {
  const { ngencerfBaseUrl } = useBackendConfig();
  const { getAccessToken, fetchUserCalibrationRunData, clearUserCalibrationRunData } = useUserDataStore();
  const { calibrationJobId } = storeToRefs(generalStore());
  // refs
  const forecastJobId = ref<number>();
  const forecastCycles = ref<ForecastCycle[]>();
  const forecastCycle = ref<ForecastCycle>();
  const forecastCycleName = ref<string>();
  const forecastJobStatus = ref<string>();
  const forcingDownloadStatus = ref<string>();
  const elapsedTime = ref<string>();
  const submitTimeDate = ref<Date>();
  const submitTime = ref<string>();
  const elapsedTimeIntervalId = ref<number>();
  const forecastJobStatusIntervalId = ref<number>();
  const resultsPathname = ref<string>();
  const forecastPlotName = ref<any>(); // TODO: create forecastPlotName interface
  const forecastPlot = ref<any>(); // TODO: create forecastPlot interface

  const calibrationRunsForForecast = ref<CalibrationRunsForForecast>([]);
  const calibrationRunForForecast = ref<CalibrationRunForForecast>();

  const uiGageId = ref<string>("");

  const forecastRuns = ref<ForecastJob[]>([]);
  const selectedForecastJob = ref<ForecastJob>();

  const isForecastLoading = ref<boolean>(false);

  /**
   * Compute Overall Forcing Download and Forecast status
   */
  const overallForcingDownloadForecastStatus = computed<string>(() => {
    if (
      [
        "Saved",
        "Ready",
        "Running",
        "Cancelled",
        "Failed",
        "Server Error",
      ].includes(forcingDownloadStatus.value as string)
    ) {
      return `Forcing Download ${forcingDownloadStatus.value as string}`;
    } else if (forcingDownloadStatus.value === "Done") {
      if (
        [
          "Saved",
          "Ready",
          "Running",
          "Cancelled",
          "Failed",
          "Server Error",
        ].includes(forecastJobStatus.value as string)
      ) {
        return `Forcing Download Done, Forecast ${forecastJobStatus.value as string}`;
      } else if (forecastJobStatus.value === "Done") {
        return "Done";
      } else {
        return "Unknown";
      }
    } else {
      return "Unknown";
    }
  });
  
  /**
   * fetch get_forecast_jobs
   * @return {void}
   */
  const getForecastJobs = async (): Promise<any> => {
    forecastRuns.value = [];
    const runListDataResult = await makeProtectedApiCall<ForecastJobs>(`${ngencerfBaseUrl}/calibration/get_forecast_jobs/`, {
      method: "POST",
      mode: 'cors',
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      }
    });

    if (runListDataResult?._data?.forecast_jobs.length > 0) {
      runListDataResult?._data?.forecast_jobs.forEach((jobItem: ForecastJob) => {
        forecastRuns.value.push(jobItem);
      });
    }
  }

  /**
  * @returns {SelectOption[]}
  */
  const forecastRunGageList = computed(() => {
    let gageOptionList = <SelectOption[]>[];
    gageOptionList.push({
      'name': "All",
      'description': "All"
    });
    calibrationRunsForForecast.value.forEach(runItem => {
      const checkGageIndex = gageOptionList.findIndex(
        (gageOption) =>
          gageOption.name === (runItem as any as CalibrationRunForForecast).gage_id
      ) !== -1;
      if (!checkGageIndex) {
        gageOptionList.push({
          'name':  (runItem as any as CalibrationRunForForecast).gage_id,
          'description':  (runItem as any as CalibrationRunForForecast).gage_id
        });
      }
    });
    return gageOptionList;
  });

  /**
   * Load Setup Forecast tab data
   */
  const loadSetupForecastTabData = async (): Promise<void> => {
    // load forecast cycles
    const loadForecastTabResponse: any = await loadForecastTab();
    forecastCycles.value = loadForecastTabResponse?._data?.forecast_cycle_values;
  };

  /**
   * Load Forecast Status/Run tab data
   */
  const loadForecastStatusRunTabData = async (): Promise<void> => {
    // get forecast job data
    if (forecastJobId?.value) {
      // query get_status endpoint
      const getStatusResponse: any = await getStatus();

      // TODO: create forecastJob interface
      const forecastJob: any  = getStatusResponse?._data?.forecasts.find((forecast: any) => forecast.forecast_run_id === forecastJobId.value);

      // set forecastCycle, forecastJobStatus, elapsedTime, submitTime, and resultsPathname
      forecastCycleName.value = forecastJob?.cycle;
      forecastJobStatus.value = forecastJob?.status;
      forcingDownloadStatus.value = forecastJob?.forcing_download?.status;
      elapsedTime.value = forecastJob?.elapsed_time;
      submitTimeDate.value = new Date(forecastJob?.submit_date as string);
      if (isValidDate(submitTimeDate.value)) {
        submitTime.value = convertTimeZone(submitTimeDate.value);
      }
    }
    // set resultsPathname
    await setResultsPathname();
  };

  /**
   * Load Forecast Results tab data
   */
  const loadForecastResultsTabData = async (): Promise<void> => {
    await loadForecastStatusRunTabData() // load forecast status/run tab data
    await setForecastPlot() // set forecastPlot  
  };

  /**
   * Query load_forecast_tab endpoint
   */
  const loadForecastTab = async (): Promise<any> => {
    return makeProtectedApiCall<CalibrationStatus>(`${ngencerfBaseUrl}/calibration/load_forecast_tab/`, {
      method: "POST",
      mode: 'cors',
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      }
    });
  };

  /**
   * Create and Run Forecast Job by querying create_and_run_forecast endpoint
   */
  const createAndRunForecastJob = async (calibrationRunId: number, forecastCycleName: string): Promise<any> => {
    return makeProtectedApiCall<CalibrationStatus>(`${ngencerfBaseUrl}/calibration/create_and_run_forecast/`, {
      method: "POST",
      mode: 'cors',
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: calibrationRunId, cycle_name: forecastCycleName })
    });
  };

  /**
   * Cancel Forecast Job by querying cancel_job endpoint
   */
  const cancelForecastJob = async (): Promise<any> => {
    return makeProtectedApiCall<CalibrationStatus>(`${ngencerfBaseUrl}/calibration/cancel_job/`, {
      method: "POST",
      mode: 'cors',
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ forecast_run_id: forecastJobId.value })
    });
  };

  /**
   * Query get_calibration_jobs_for_forecast endpoint
   */
  const getCalibrationJobsForForecast = async (): Promise<any> => {
    return makeProtectedApiCall<CalibrationRunsForForecast>(`${ngencerfBaseUrl}/calibration/get_calibration_jobs_for_forecast/`, {
      method: "POST",
      mode: 'cors',
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: ""
    }).then((result) => {
      calibrationRunsForForecast.value = result._data.jobs;
    });
  };

  /**
   * Call get_status endpoint with calibrationRunForForecast.value.calibration_run_id
   * @return {any}
   */
  const getStatus = async (): Promise<any> => {
    return makeProtectedApiCall<CalibrationStatus>(`${ngencerfBaseUrl}/calibration/get_status/`, {
      method: "POST",
      mode: 'cors',
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: calibrationRunForForecast.value?.calibration_run_id })
    });
  };

  /**
   * Get Forecast Plots
   */
  const getForecastPlotNames = async (): Promise<any> => {
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_plot_names/`, {
      method: "POST",
      mode: 'cors',
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ forecast_run_id: forecastJobId.value })
    });
  };

  /**
   * Get Forecast Plot
   */
  const getForecastPlot = async ({
    plotName,
    include_data = false,
    force_include_plot = false,
  }: {
    plotName: string;
    include_data?: boolean;
    force_include_plot?: boolean;
  }): Promise<any> => {
    if (forecastJobId.value) {
      const params = new URLSearchParams({
        plot_name: plotName,
        include_data: include_data.toString(),
        force_include_plot: force_include_plot.toString(),
        forecast_run_id: forecastJobId.value.toString(),
      });

      return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_plot/?${params.toString()}`, {
        method: "GET",
        mode: 'cors',
        headers: {
          "Authorization": `Bearer ${getAccessToken()}`,
          "Content-Type": "application/json"
        }
      });
    }
  };

  /**
   * Get Job Data Directory
   * @returns {any}
   */
  const getJobDataDirectory = async (): Promise<any> => {
    return makeProtectedApiCall<any>(`${ngencerfBaseUrl}/calibration/get_job_data_dir/`, {
      method: "POST",
      mode: 'cors',
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({ calibration_run_id: calibrationRunForForecast.value?.calibration_run_id })
    });
  };

  const loadSelectedCalibrationRun = async (calibration_run_id: number) => {
    setSelectedCalibrationRunId( calibration_run_id );
    await fetchUserCalibrationRunData();
  }

  const setSelectedCalibrationRunId = ( calibration_run_id: number ):void => {
    calibrationJobId.value = calibration_run_id;
  }

  const resetSelectedCalibrationRunId = (): void => {
    calibrationJobId.value = 0;
  }

  const setSelectedForecastRunId = (forecast_job_id: number): void => {
    forecastJobId.value = forecast_job_id;
  }

  const setSelectedForecastRowData = async ( forecast_row_data: ForecastJob ): void => {
    setSelectedForecastRunId( forecast_row_data.forecast_run_id );
    setSelectedCalibrationRunId( forecast_row_data.calibration_run_id );

    /// load forecastCycles
    await loadSetupForecastTabData();

    console.log('forecast_row_data', forecast_row_data);
    console.log('forecastCycles.value', forecastCycles.value);

    forecastCycle.value = forecastCycles.value?.find( (forecast_cycle_data : ForecastCycle ) =>
      forecast_cycle_data.name === forecast_row_data.cycle
    );
    console.log('forecastCycle set in setSelectedForecastRowData', forecastCycle.value);

    /*
     * the follow is hack to get around the fact that we are using calibrationRunForForecast to check for calibration_run_id, but it's only set on calibration run tab
     * user should be able to go straight to forecast runs and view results so this is a easy way to provide it.
     */
    calibrationRunForForecast.value = ( forecast_row_data as any as CalibrationRunForForecast); 
    forecastJobStatus.value = forecast_row_data.status;
  }

  const resetSelectedForecastRunData = (): void => {
    forecastJobId.value = undefined;
    forecastJobStatus.value = undefined;
    forecastCycle.value = undefined;
    resetSelectedCalibrationRunId();
  }

  /**
   * Set resultsPathname
   */
  const setResultsPathname = async (): Promise<string[]> => {
    if (calibrationRunForForecast.value?.calibration_run_id) {
      const queryGetJobDataDirectoryResponse = await getJobDataDirectory();

      if (queryGetJobDataDirectoryResponse?._data?.data_dir) {
        resultsPathname.value = queryGetJobDataDirectoryResponse._data.data_dir;
        return [];
      } else {
        return ['No data directory found from get_job_data_dir endpoint'];
      }
    } else {
      return ['No calibration run id found'];
    }
  };

  /**
   * Set forecastPlot
   */
  const setForecastPlot = async (): Promise<string[]> => {
    if (forecastJobId?.value) {
      const getForecastPlotNamesResponse: any = await getForecastPlotNames();

      // set forecastPlotNamesList
      if (getForecastPlotNamesResponse.status === 200) {
        if (getForecastPlotNamesResponse?._data?.plot_names) {
          const forecastPlotNamesList: any[] = getForecastPlotNamesResponse._data.plot_names;

          // there should only be one forecast plot
          if (forecastPlotNamesList.length === 1) {
            forecastPlotName.value = forecastPlotNamesList[0];
            const getForecastPlotResponse: any = await getForecastPlot({
              plotName: (forecastPlotName?.value?.name as string),
              include_data: true,
              force_include_plot: true
            });

            if (getForecastPlotResponse.status === 200) {
              forecastPlot.value = getForecastPlotResponse._data;
              return [];
            } else {
              return useApiErrorResponsePreprocess(getForecastPlotResponse);
            }
          } else {
            return [`${forecastPlotNamesList.length} forecast plots found. Only one forecast plot is expected.`];
          }
        } else {
          return ['Could not get forecast plot names from get_plot_names endpoint'];
        }
      } else {
        return useApiErrorResponsePreprocess(getForecastPlotNamesResponse);
      }
    } else {
      return ['No forecast job id found'];
    }
  };


  /**
   * reset user-selected forecast data
   */
  const resetUserSelectedForecastCalibrationRun = (): void => {
    forecastJobId.value =  undefined;
    forecastCycles.value =  [];
    forecastCycle.value =  undefined;
    forecastCycleName.value =  undefined;
    forecastJobStatus.value =  undefined;
    forcingDownloadStatus.value =  undefined;
    elapsedTime.value =  undefined;
    submitTimeDate.value = undefined;
    submitTime.value =  undefined;
    resultsPathname.value =  undefined;
    forecastPlotName.value =  undefined;
    forecastPlot.value = undefined;
    calibrationRunForForecast.value =  undefined;

    if (elapsedTimeIntervalId.value) {
      clearInterval(elapsedTimeIntervalId.value);
      elapsedTimeIntervalId.value =  undefined; 
    }

    if (forecastJobStatusIntervalId.value) {
      clearInterval(forecastJobStatusIntervalId.value);
      forecastJobStatusIntervalId.value =  undefined; 
    }
    isForecastLoading.value =  false;

    clearUserCalibrationRunData();
  }

 
  return {
    forecastJobId,
    forecastCycles,
    forecastCycle,
    forecastCycleName,
    forecastJobStatus,
    forcingDownloadStatus,
    elapsedTime,
    submitTimeDate,
    submitTime,
    elapsedTimeIntervalId,
    forecastJobStatusIntervalId,
    resultsPathname,
    forecastPlotName,
    forecastPlot,
    forecastRunGageList,
    calibrationRunsForForecast,
    calibrationRunForForecast,
    uiGageId,
    forecastRuns,
    selectedForecastJob,
    isForecastLoading,
    overallForcingDownloadForecastStatus,
    getForecastJobs,
    loadSetupForecastTabData,
    loadForecastStatusRunTabData,
    loadForecastResultsTabData,
    loadForecastTab,
    createAndRunForecastJob,
    cancelForecastJob,
    getCalibrationJobsForForecast,
    resetUserSelectedForecastCalibrationRun,
    loadSelectedCalibrationRun,
    setSelectedCalibrationRunId,
    resetSelectedCalibrationRunId,
    setResultsPathname,
    setForecastPlot,
    getStatus,
    getForecastPlotNames,
    getForecastPlot,
    getJobDataDirectory,
    setSelectedForecastRunId,
    resetSelectedForecastRunData,
    setSelectedForecastRowData
  };
});

/* Pinia supports Hot Module replacement so you can edit your stores
   and interact with them directly in your app without reloading the page,
   allowing you to keep the existing state, add, or even remove state,
   actions, and getters.
*/
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useForecastStore, import.meta.hot));
}