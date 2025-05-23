<template>
  <div class="w-full">
    <h1 class="pt-3 mb-8 text-3xl font-bold text-center" aria-label="Forecast Status Run Tab" title="Forecast Status Run Tab">
      Forecast
    </h1>
    <p class="text-center" style="font-size: 12px;font-weight: normal;margin-top:-20px;">
      If status is Ready click Run to submit and run the forecast.
    </p>
    <br />
  </div>
  <div>
    <div class="grid grid-cols-2">
      <div class="col-span-1">
        <table>
          <caption style="text-align: center;font-size:1.1em;font-weight:bold;margin-bottom:3px;"
            aria-label="Forecast Job Run Time Area" title="Forecast Job Run Time Area">Forecast Job Run Time
          </caption>
          <thead>
            <tr height="25px">
              <th scope="row" class="text-right" colspan="2" style="border-top: 3px solid #d9d9d9;"></th>
            </tr>
          </thead>
          <tbody>
            <tr height="40px" :aria-label="'Calibration Job ID ' + calibrationRunForForecast?.calibration_run_id"
              :title="'Calibration Job ID ' + calibrationRunForForecast?.calibration_run_id">
              <th scope="row" class="text-right font-bold">
                <div style="width: 140px;">Calibration Job ID</div>
              </th>
              <td class="pl-5">{{ calibrationRunForForecast?.calibration_run_id ?? '-'.repeat(30) }}</td>
            </tr>
            <tr height="40px" :aria-label="'Forecast Job ID ' + forecastJobId"
              :title="'Forecast Job ID ' + forecastJobId">
              <th scope="row" class="text-right font-bold">
                <div style="width: 140px;">Forecast Job ID</div>
              </th>
              <td class="pl-5">{{ forecastJobId ?? '-'.repeat(30) }}</td>
            </tr>
            <tr height="32px" :aria-label="'Submit Time ' + submitTime" :title="'Submit Time ' + submitTime">
              <th scope="row" class="text-right font-bold">
                <div style="width: 140px;">Submit Time</div>
              </th>
              <td class="pl-5">{{ submitTime ?? '-'.repeat(30) }}</td>
            </tr>
            <tr height="32px" :aria-label="'Elapsed Time ' + elapsedTime" :title="'Elapsed Time ' + elapsedTime">
              <th scope="row" class="text-right font-bold">
                <div style="width: 140px;">Elapsed Time</div>
              </th>
              <td class="pl-5">{{ elapsedTime ?? '-'.repeat(30) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="col-span-1 pl-5" style="border-left: 1px solid #d9d9d9">
        <table>
          <caption style="font-size:1.1em;font-weight:bold;margin-bottom:3px;" aria-label="Forecast Job Status area"
            title="Forecast Job Status area">Forecast Job Status</caption>
          <thead>
            <tr height="25px">
              <th scope="row" class="text-right" colspan="2" style="border-top: 3px solid #d9d9d9;"></th>
            </tr>
          </thead>
          <tbody>
            <tr height="40px" :aria-label="'Status is ' + overallForcingDownloadForecastStatus"
              :title="'Status is ' + overallForcingDownloadForecastStatus">
              <th scope="row" class="text-right font-bold">
                <div style="width: 140px;">Status</div>
              </th>
              <td v-if="forcingDownloadStatus && forecastJobStatus" class="pl-5">{{ overallForcingDownloadForecastStatus
                }}</td>
              <td v-else class="pl-5">Ready</td>
            </tr>
            <tr height="32px" :aria-label="'Cycle is ' + (forecastCycle as ForecastCycle).name"
              :title="'Cycle is ' + (forecastCycle as ForecastCycle).name">
              <td class="text-right font-bold">
                <div style="width: 140px;">Cycle</div>
              </td>
              <td class="pl-5">{{ (forecastCycle as ForecastCycle).name ?? '-'.repeat(30) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="col-span-2">
        <div style="display:flex; margin-top: 1em;" :aria-label="'Results pathname is ' + resultsPathname"
          :title="'Results pathname is ' + resultsPathname">
          <div class="text-right font-bold" style="width: 155px;">
            <label class="text-right" for="resultsPathname" style="width: 155px;">Results Pathname</label>
          </div>
          <div class="pl-5" style="width: 100%;">
            <InputText id="resultsPathname" v-model="resultsPathname" placeholder="Job Data Directory" disabled />
          </div>
        </div>
      </div>
    </div>
    <div class="grid grid-rows-1 ActionButtonsBox" id="HBCbuttons">
      <div class="row-span-1">
        <div class="grid grid-cols-8">
          <span v-if="!forecastJobStatus || forecastJobStatus === 'Ready'">
            <div class="col-span-1mr-6 h-8">
              <Button class=" ngenButtonDiv-green  font-normal" title="Run Button" aria-label="Run Button"
                @click="startForecastRun()">
                Run
              </Button>
            </div>
          </span>
          <span v-if="forcingDownloadStatus === 'Running' || forecastJobStatus === 'Running'">
            <div class="col-span-1 mr-3">
              <Button class="col-span-1 ngenButtonDiv-red mr h-8" title="Cancel Button" @click="cancelForecastRun()"
                aria-label="Cancel Button">
                Cancel
              </Button>
            </div>
          </span>
          <span v-if="overallForcingDownloadForecastStatus === 'Done'">
            <div class="col-span-1 mr-3">
              <Button class="ngenButtonDiv ml-6 font-normal h-8 px-4 whitespace-nowrap" title="View Results Button"
                @click="goToResultsTab()" aria-label="View Results Button">
                View Results
              </Button>
            </div>
          </span>
        </div>
      </div>
    </div>
    <div class="waitgif" v-if="isLoading">
      <img alt="Please wait..." src="@/assets/styles/img/wait.gif" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast';

import type { ToastMessageOptions } from "primevue/toast";

import { generalStore } from '~/stores/common/GeneralStore';
import { useForecastStore } from '@/stores/forecast/ForecastStore';

import { hilightTab } from '@/composables/TabHilight';
import { isValidDate } from '@/utils/CommonHelpers';
import { calculateElapsedTime, sumAndFormatElapsedTimes } from '@/utils/TimeHelpers';

const { isLoading } = storeToRefs(generalStore());
const { addToastRecord } = generalStore();

const toast = useToast();

const {
  forecastJobId,
  forecastCycle,
  forecastJobStatus,
  forcingDownloadStatus,
  elapsedTime,
  submitTimeDate,
  submitTime,
  elapsedTimeIntervalId,
  forecastJobStatusIntervalId,
  resultsPathname,
  calibrationRunForForecast,
  overallForcingDownloadForecastStatus
} = storeToRefs(useForecastStore());

const {
  loadForecastStatusRunTabData,
  createAndRunForecastJob,
  cancelForecastJob,
  getStatus,
  setResultsPathname
} = useForecastStore();

onMounted(async () => {
  toast.removeAllGroups(); // clear all toast messages
  isLoading.value = false; // set isLoading to false

  // scroll to top of the page
  let ele = document.getElementById("MainLeftDataArea") as HTMLElement;
  if (ele) { ele.scrollTo(0, 0); }

  // highlight the tab when selected
  hilightTab(ForecastTabs.tab_statusRun);

  // load Status/Run tab data
  await loadForecastStatusRunTabData();
});

/**
 * Create elapsedTimeIntervalId to increment elapsedTime every second while forcingDownloadStatus
 * or forecastJobStatus is Running
 */
const createElapsedTimeInterval = () => {
  elapsedTimeIntervalId.value = setInterval(async () => {
    // continue incrementing elapsedTime every second while forcingDownloadStatus or forecastJobStatus
    // is Running
    if (forcingDownloadStatus.value === 'Running' || forecastJobStatus.value === 'Running') {
      elapsedTime.value = calculateElapsedTime(submitTimeDate.value as Date, new Date());
    } else {
      clearInterval(elapsedTimeIntervalId.value);
      elapsedTimeIntervalId.value = undefined;
    }
  }, 1000) as unknown as number;
};

/**
 * Create forecastJobStatusIntervalId to update forcingDownloadStatus and forecastJobStatus every 10 seconds
 * while forcingDownloadStatus or forecastJobStatus is Running
 */
const createForcingDownloadAndForecastStatusInterval = () => {
  forecastJobStatusIntervalId.value = setInterval(async () => {
    const getStatusResponse = await getStatus();
    const forecasts: any[] = getStatusResponse?._data.forecasts;
    const forecast = forecasts?.find((f: any) => f.forecast_run_id === forecastJobId.value);

    if (forecast) {
      // if forcing download and forecast job is not running, clear the interval
      if (forecast.forcing_download.status != 'Running' && forecast.status !== 'Running') {
        clearInterval(forecastJobStatusIntervalId.value);
        forecastJobStatusIntervalId.value = undefined;
      }
      // update forcingDownloadStatus and forecastJobStatus
      forecastJobStatus.value = forecast.status;
      forcingDownloadStatus.value = forecast.forcing_download.status;
    } else {
      const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: `Could not find Forecast job ${forecastJobId.value} in server response` };
      toast.add(tMsg); addToastRecord(tMsg);
    }
  }, 10000) as unknown as number;
};

/**
 * Start the forecast run
 */
const startForecastRun = async () => {
  forecastJobStatus.value = 'Submitted';

  try {
    const createAndRunForecastJobResponse = await createAndRunForecastJob(calibrationRunForForecast?.value?.calibration_run_id as number, forecastCycle?.value?.name as string);

    forecastJobStatus.value = createAndRunForecastJobResponse._data.forecast_status;
    forcingDownloadStatus.value = createAndRunForecastJobResponse._data.forecast_forcing_download_status;
    forecastJobId.value = createAndRunForecastJobResponse._data.forecast_run_id;

    if (createAndRunForecastJobResponse?._data?.submit_date) {
      submitTimeDate.value = new Date(createAndRunForecastJobResponse?._data?.submit_date);

      if (isValidDate(submitTimeDate.value)) {
        submitTime.value = convertTimeZone(submitTimeDate.value);
      }
    } else {
      const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'submit_date from server could not be converted to a Date object' };
      toast.add(tMsg); addToastRecord(tMsg);
    }

    // set resultsPathname
    await setResultsPathname();

  } catch (error) {
    const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'Error running Forecast job' };
    toast.add(tMsg); addToastRecord(tMsg);
  }
};

/**
 * Cancel the forecast run
 */
const cancelForecastRun = async () => {
  try {
    const cancelForecastJobResponse = await cancelForecastJob();

    if (cancelForecastJobResponse?._data?.status) {
      forecastJobStatus.value = cancelForecastJobResponse._data.status;

      if (forecastJobStatus.value !== 'Cancelled') {
        const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'Forecast status not set to Cancelled after clicking CANCEL' };
        toast.add(tMsg); addToastRecord(tMsg);
      }
      await loadForecastStatusRunTabData();
    } else {
      const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'Could not get Forecast status from server' };
      toast.add(tMsg); addToastRecord(tMsg);
    }
  } catch (error) {
    const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'Error cancelling Forecast job' };
    toast.add(tMsg); addToastRecord(tMsg);
  }
};

/**
 * Go to the Status Run tab
 */
const goToResultsTab = () => {
  const allTabs = document.getElementsByClassName("tabs");
  const e = allTabs[ForecastTabs.tab_results] as HTMLElement;
  e.click();
};

/**
 * Watch overallForcingDownloadForecastStatus for changes
 * overallForcingDownloadForecastStatus is a computed value based on forcingDownloadStatus and forecastJobStatus
 * so we're essentially watching both forcingDownloadStatus and forecastJobStatus for changes
 */
watch(overallForcingDownloadForecastStatus, async (oldForecastJobStatus, newForecastJobStatus, onCleanup) => {
  // set resultsPathname if not already set
  if (!resultsPathname.value) {
    await setResultsPathname();
  }

  // when overallForcingDownloadForecastStatus first changes to Running, start incrementing elapsedTime every second until
  // overallForcingDownloadForecastStatus changes to Done, Cancelled, Failed, or Server Error
  if (forcingDownloadStatus.value === 'Running' || forecastJobStatus.value === 'Running') {
    // create elapsedTimeIntervalId to update elapsedTime every second while overallForcingDownloadForecastStatus 
    // is Running if not already created
    if (!elapsedTimeIntervalId.value) {
      createElapsedTimeInterval();
    }
    // create forecastJobStatusIntervalId to update forcingDownloadStatus and forecastJobStatus every 10 seconds
    // while forcingDownloadStatus or forecastJobStatus is Running if not already created
    if (!forecastJobStatusIntervalId.value) {
      createForcingDownloadAndForecastStatusInterval();
    }
  }

  // when overallForcingDownloadForecastStatus changes to Done, look for Forcing Download and Forecast 
  // elapsedTimes from server and set elapsedTime to the sum of those durations
  //  if interval incrementing elapsedTime every second is no longer running
  if (forcingDownloadStatus.value === 'Done' || forecastJobStatus.value === 'Done') {
    // if forecastJobStatusIntervalId is not set, that means elapsedTime is no longer incrementing every second
    // so we need to get elapsed_time from the server
    if (!forecastJobStatusIntervalId.value) {
      const getStatusResponse = await getStatus();
      const forecasts: any[] = getStatusResponse?._data.forecasts;
      const forecast = forecasts?.find((f: any) => f.forecast_run_id === forecastJobId.value);

      if (forecast) {
        if (forecast.elapsed_time && forecast.forcing_download.elapsed_time) {
          let elapsedTimeArray: string[] = [];
          elapsedTimeArray.push(forecast.elapsed_time);
          elapsedTimeArray.push(forecast.forcing_download.elapsed_time);

          elapsedTime.value = sumAndFormatElapsedTimes(elapsedTimeArray);
        } else {
          const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Warning', detail: `Could not find elapsed_time for Forecast job ${forecastJobId.value} in server response` };
          toast.add(tMsg); addToastRecord(tMsg);
        }
      } else {
        const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: `Could not find Forecast job ${forecastJobId.value} in server response` };
        toast.add(tMsg); addToastRecord(tMsg);
      }
    }
  }

  onCleanup(() => {
    console.log('cleanup');
  });
}, { immediate: true });
</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

#resultsPathname {
  background-color: #fff;
  border: 0px solid #fff;
  border-left: 0;
  border-right: 0;
  color: black;
  box-shadow: none;
}
</style>