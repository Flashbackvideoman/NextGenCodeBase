// @ts-check
/**
 *  The General Store will be responsible for handling information OUTSIDE of the data needed for the back end.
 *  Data will include the current menu status and the current tab status for each of the 4 menu items
 */
import { defineStore } from "pinia";

import type { CombinedVersionInfo, ToastRecord } from "@/composables/NextGenModel";
import type { ToastMessageOptions } from "primevue/toast";

export const generalStore = defineStore(
  "generalStore",
  () => {

    const gitInfo = ref<Record<string, GitData>>({});

    const calibrationTabIndex = ref("1");
    const evaluationTabIndex = ref("1");
    const forecastTabIndex = ref("1");
    const verificationTabIndex = ref("1");

    const menuIndex = ref("1");

    const calibrationJobId = ref<number>(0);
    // user selected valiation run id from evaluate tab
    const evaluateValidationRunId = ref<number>(0);
    // user selected iteration run id from evaluate-select alternative tab
    const evaluateIterationRunId = ref<number>(0);
    // running validation run id from selected iteration
    const iterationValidationRunId = ref<number>(0);
    // user selected validation run status
    const evaluateValidationRunStatus = ref<string>("");
    // user seleted iteration run number for display only
    const evaluateDisplayIterationNumber = ref<number>(0);

    // Has the user selected a previous calibration run for Evaluation?
    const evaluationRunSelected = ref(true);

    const serverInfo = ref<CombinedVersionInfo>();

    const isLoading = ref<boolean>(false);

    // This is set if the user changes the gage.  Resets when saved.toastRecord
    const popupActive = ref<boolean>(false);

    // This is set if the user changes the gage.  Resets when saved.
    const gageHasChanged = ref<boolean>(false);
    // This is set if the user changes the modules on the Formulation page
    const modulesHaveChanged = ref<boolean>(false);

    const toastRecords = ref<ToastRecord[]>([]);

    function addToastRecord(rec: ToastMessageOptions) {
      let dt = { datetime: Date().toString().substring(4, 24) };
      let newRec = { ...rec, ...dt };
      toastRecords.value.push(newRec as ToastRecord);
    }

    function clearToastRecords() {
      toastRecords.value = [];
    }

    function getServerInfo() {
      return serverInfo.value;
    }

    function setServerInfo(si: CombinedVersionInfo) {
      serverInfo.value = si;
    }

    // Top Menu index
    function getMenuIndex() {
      return parseInt(menuIndex.value);
    }
    function setMenuIndex(tab: number) {
      menuIndex.value = tab.toString();
    }
    // setEvaluationTabIndex
    // Calibration Tab index
    function getCalibrationTabIndex() {
      return parseInt(calibrationTabIndex.value);
    }
    function setCalibrationTabIndex(tab: number) {
      calibrationTabIndex.value = tab.toString();
    }

    // Evaluation Tab index
    function getEvaluationTabIndex() {
      return parseInt(evaluationTabIndex.value);
    }
    function setEvaluationTabIndex(tab: number) {
      evaluationTabIndex.value = tab.toString();
    }

    //  Forecast Tab index
    function getForecastTabIndex() {
      return parseInt(forecastTabIndex.value);
    }
    function setForecastTabIndex(tab: number) {
      forecastTabIndex.value = tab.toString();
    }

    //  Verification Tab index
    function getVerificationTabIndex() {
      return parseInt(verificationTabIndex.value);
    }
    function setVerificationTabIndex(tab: number) {
      verificationTabIndex.value = tab.toString();
    }

    // Previous calibration run for Evaluation
    function getEvalRunSelected() {
      return evaluationRunSelected.value;
    }

    function setEvalRunSelected(b: boolean) {
      evaluationRunSelected.value = b;
    }

    function resetGeneralStore() {
      calibrationJobId.value = 0;
      popupActive.value = false;
    }

    return {
      gitInfo,
      getMenuIndex,
      setMenuIndex,
      getCalibrationTabIndex,
      setCalibrationTabIndex,
      getEvaluationTabIndex,
      setEvaluationTabIndex,
      getForecastTabIndex,
      setForecastTabIndex,
      getVerificationTabIndex,
      setVerificationTabIndex,
      getEvalRunSelected,
      setEvalRunSelected,
      calibrationJobId,
      evaluateValidationRunId,
      evaluateIterationRunId,
      iterationValidationRunId,
      evaluateValidationRunStatus,
      evaluateDisplayIterationNumber,
      calibrationTabIndex,
      evaluationTabIndex,
      forecastTabIndex,
      resetGeneralStore,
      setServerInfo,
      getServerInfo,
      serverInfo,
      gageHasChanged,
      modulesHaveChanged,
      verificationTabIndex,
      menuIndex,
      evaluationRunSelected,
      isLoading,
      toastRecords,
      addToastRecord,
      clearToastRecords,
      popupActive
    };
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.localStorage(),
    },
  }
);

/* Pinia supports Hot Module replacement so you can edit your stores
   and interact with them directly in your app without reloading the page,
   allowing you to keep the existing state, add, or even remove state,
   actions, and getters.
*/
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(generalStore, import.meta.hot));
}
