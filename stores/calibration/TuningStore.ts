// @ts-check
import { defineStore } from "pinia";

import { generalStore } from "@/stores/common/GeneralStore";
import { useUserDataStore } from "@/stores/common/UserDataStore";

import { makeProtectedApiCall } from "@/composables/UserAuth";
import { useBackendConfig } from "@/composables/UseBackendConfig";

export const useTuningStore = defineStore(
  "TuningStore",
  () => {
    // server-data properties
    const userDataStore = useUserDataStore();
    const loadTuningTabData = ref<any>();

    const { calibrationJobId } = storeToRefs(generalStore());
    const { getAccessToken } = userDataStore;

    const dataStore = userDataStore;
    const { userCalibrationRunData } = storeToRefs(dataStore);
    const { ngencerfBaseUrl } = useBackendConfig();

    // user-data properties
    const simStartTime = ref<any>("");
    const simEndTime = ref<any>("");

    const calStartTime = ref<any>("");
    const calEndTime = ref<any>("");

    const calibrationTuningModules = ref<any>();
    const calibrationTuningParameters = ref<any[]>([]);
    const userSelectedCalibrationTuningParameters = ref<any[]>([]);

    const automatic_validation = ref<boolean>(true);

    const avSimStartTime = ref<any>("");
    const avSimEndTime = ref<any>("");
    const avCalStartTime = ref<any>("");
    const avCalEndTime = ref<any>("");

    const rangeDateFrom = ref<any>();
    const rangeDateTo = ref<any>();

    const tuningStore_data_loading = ref(true);
    const saveTuningTabRequestBody = ref<any>({});

   
    /**
     * Load Tuning Tab data
     * @returns {Promise<any>}
     */
    async function loadTuningTabStaticData(): Promise<any> {
      tuningStore_data_loading.value = true;
      loadTuningTabData.value = await makeProtectedApiCall<any>(
        `${ngencerfBaseUrl}/calibration/load_tuning_tab/`,
        {
          method: "POST",
          mode: 'cors',
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ calibration_run_id: calibrationJobId.value }),
        }
      );
      tuningStore_data_loading.value = false;

      // set time range
      const timeRange = loadTuningTabData.value?._data?.time_range;
      // check if timeRange is provided and not empty
      if (timeRange?.start_time && timeRange?.end_time) {
        rangeDateFrom.value = timeRange?.start_time;
        rangeDateTo.value = timeRange?.end_time;
        if (userCalibrationRunData.value) {
          userCalibrationRunData.value.time_range.start_time =
            rangeDateFrom.value;
          userCalibrationRunData.value.time_range.end_time = rangeDateTo.value;
        }
      }

      calibrationTuningModules.value = loadTuningTabData.value?._data?.modules;

      calibrationTuningParameters.value =
        calibrationTuningModules?.value?.flatMap((module: any) =>
          module?.parameters?.map((param: any) => ({
            name: param.name,
            minimum: param.minimum,
            maximum: param.maximum,
            initial_value: param.initial_value,
            user_selected_for_tuning: param.user_selected_for_tuning,
            module: module.name,
            output: `${param.name} (${module.name})`,
          }))
        ) || [];

      // set calibration tuning parameters data table with user-selected parameters set to true if not already set, but without the user_selected_for_tuning flag
      if (
        !userSelectedCalibrationTuningParameters.value ||
        userSelectedCalibrationTuningParameters.value.length === 0
      ) {
        userSelectedCalibrationTuningParameters.value =
          calibrationTuningParameters.value
            ?.filter((param: any) => param?.user_selected_for_tuning)
            ?.map((param: any) => ({
              name: param.name,
              minimum: param.minimum,
              maximum: param.maximum,
              initial_value: param.initial_value,
              module: param.module,
            })) || [];
      }

      return loadTuningTabData.value;
    }

    /**
     * Save Tuning Tab data
     * @returns {Promise<any>} SaveTuningTab data
     */
    async function saveTuningTabData(): Promise<any> {
      const saveTuningTabResponse: any = await makeProtectedApiCall(
        `${ngencerfBaseUrl}/calibration/save_tuning_tab/`,
        {
          method: "POST",
          mode: 'cors',
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(saveTuningTabRequestBody.value),
        }
      );

      return saveTuningTabResponse;
    }

    useLogoutListen("logoutEvent", (evStr: string) => {
      if (evStr === "logout") {
        hardResetTuningStore();
      }
    });

    function clearCalibratableParameters() {
      userSelectedCalibrationTuningParameters.value = [];
    }

    /**
     * Hard Reset Tuning Store
     */
    const hardResetTuningTimeConrols = (): void => {
      simStartTime.value = "";
      simEndTime.value = "";
      calStartTime.value = "";
      calEndTime.value = "";
      avSimStartTime.value = "";
      avSimEndTime.value = "";
      avCalStartTime.value = "";
      avCalEndTime.value = "";
    };

    /**
     * Hard Reset Tuning Store
     */
    const hardResetTuningStore = (): void => {
      loadTuningTabData.value = null;
      simStartTime.value = "";
      simEndTime.value = "";
      calStartTime.value = "";
      calEndTime.value = "";
      calibrationTuningModules.value = null;
      calibrationTuningParameters.value = [];
      userSelectedCalibrationTuningParameters.value = [];
      automatic_validation.value = true;
      avSimStartTime.value = "";
      avSimEndTime.value = "";
      avCalStartTime.value = "";
      avCalEndTime.value = "";
      rangeDateFrom.value = null;
      rangeDateTo.value = null;
      tuningStore_data_loading.value = true;
    };

    return {
      tuningStore_data_loading,
      loadTuningTabStaticData,
      loadTuningTabData,
      simStartTime,
      simEndTime,
      calStartTime,
      calEndTime,
      calibrationTuningParameters,
      userSelectedCalibrationTuningParameters,
      automatic_validation,
      avSimStartTime,
      avSimEndTime,
      avCalStartTime,
      avCalEndTime,
      rangeDateFrom,
      rangeDateTo,
      saveTuningTabRequestBody,
      saveTuningTabData,
      clearCalibratableParameters,
      hardResetTuningTimeConrols,
      hardResetTuningStore,
    };
  }
);

/* Pinia supports Hot Module replacement so you can edit your stores
   and interact with them directly in your app without reloading the page,
   allowing you to keep the existing state, add, or even remove state,
   actions, and getters.
*/
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTuningStore, import.meta.hot));
}
