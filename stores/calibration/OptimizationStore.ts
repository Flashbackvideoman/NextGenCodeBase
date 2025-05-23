// @ts-check

import { defineStore, storeToRefs } from "pinia";

import type {
  OptimizationTabData,
  SelectOption,
  UserCalibrationRunOptimizationInputData,
  GeneralApiSaveResponse,
  SaveOptimizationPayload,
} from "@/composables/NextGenModel";

import { useUserDataStore } from "@/stores/common/UserDataStore";
import { generalStore } from "../common/GeneralStore";

import { makeProtectedApiCall } from "@/composables/UserAuth";
import { useBackendConfig } from "@/composables/UseBackendConfig";

export const useOptimizationStore = defineStore(
  "OptimizationStore",
  () => {
    /**
     * ref section
     */
    const { calibrationJobId } = storeToRefs(generalStore());
    const { ngencerfBaseUrl } = useBackendConfig();
    const { getAccessToken } = useUserDataStore();
    const userDataStore = useUserDataStore();
    const { userCalibrationRunData } = storeToRefs(userDataStore);
    /**
     * ref ui user input
     */
    const optimizationStore_data_loading = ref<boolean>(true);

    const optimizationTabData = ref<OptimizationTabData>();
    const uiStreamFlowThreshold = ref<number>();
    const uiPeakFlowThreshold = ref<number>();
    const uiOptimizationInputs = ref<UserCalibrationRunOptimizationInputData[]>(
      []
    );
    const uiOptimization = ref<string>("");
    const uiObjectiveFunction = ref<string>("");
    const uiPlotFrequency = ref<number>();
    const uiStopCriteria = ref<number>();
    const optimizationAlgorithmOptionsList = ref<SelectOption[]>([]);
    const objectiveFunctionOptionsList = ref<SelectOption[]>([]);
    const showObjectiveFunctionPeakFlow = ref<boolean>(false);
    const showObjectiveFunctionStreamFlow = ref<boolean>(false);

    const saveOptMetPayload = ref<SaveOptimizationPayload>({});

    /**
     * load static optimization tab data with provided calibration job id and initialize ui field data
     * @return {void}
     */
    const loadOptimizationTabStaticData = () => {
      optimizationStore_data_loading.value = true;
      makeProtectedApiCall<any>(
        `${ngencerfBaseUrl}/calibration/load_optimization_tab/`,
        {
          method: "POST",
          mode: 'cors',
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ calibration_run_id: calibrationJobId.value }),
        }
      ).then((optimizationTabDataResult) => {
        optimizationTabData.value =
          optimizationTabDataResult?._data ?? undefined;
        optimizationStore_data_loading.value = false;

        setUserSelection();
      });
    };

    const setUserSelection = (): void => {
      uiStreamFlowThreshold.value =
        userCalibrationRunData.value?.streamflow_threshold ?? undefined;
      uiPeakFlowThreshold.value =
        userCalibrationRunData.value?.peak_flow_threshold ?? undefined;
      uiObjectiveFunction.value =
        userCalibrationRunData.value?.objective_function ?? "";
      uiOptimization.value = userCalibrationRunData.value?.optimization ?? "";
      uiPlotFrequency.value =
        userCalibrationRunData.value?.save_plot_iteration_frequency ?? 1;
      uiStopCriteria.value = userCalibrationRunData.value?.stop_criteria ?? 2;
      uiOptimizationInputs.value = getOptimizationInputUserData.value ?? [];
    };

    /**
     * return select options for optimization algorithm field
     * @returns {SelectOption[]}
     */
    const getOptimizationAlgorithmOptionsList = computed(() => {
      optimizationAlgorithmOptionsList.value = [];
      optimizationTabData.value?.optimizations.forEach((optimization_value) => {
        optimizationAlgorithmOptionsList.value.push({
          name: optimization_value.name,
          description: optimization_value.name,
          selected: false,
          groups: [],
        });
      });

      return optimizationAlgorithmOptionsList.value;
    });

    const getObjectiveFunctionOptionsList = computed(() => {
      objectiveFunctionOptionsList.value = [];
      optimizationTabData.value?.metrics.forEach((metric_option) => {
        objectiveFunctionOptionsList.value.push({
          name: metric_option.name,
          description: metric_option.name,
          selected: false,
          groups: [],
        });
      });

      return objectiveFunctionOptionsList.value;
    });

    /**
     * return computed array of UserCalibrationRunOptimizationInputData type
     * @return {UserCalibrationRunOptimizationInputData[]}
     */
    const getOptimizationInputUserData = computed(() => {
      let data_items: UserCalibrationRunOptimizationInputData[] = [];
      let optimization_data = optimizationTabData.value?.optimizations.filter(
        (optimization_option) =>
          optimization_option.name === uiOptimization.value
      );

      optimization_data?.forEach((data) => {
        data.inputs.forEach((data_input) => {
          let data_item = {
            name: data_input.name,
            value: data_input.default_value,
          };
          let user_optimization_input = filterCalRunData(data_input.name);

          if (user_optimization_input && user_optimization_input.length !== 0) {
            data_item.value = user_optimization_input[0].value;
          }

          data_items.push(data_item);
        });
      });
      return data_items;
    });

    const filterCalRunData = (dinput: string) => {
      return userCalibrationRunData.value?.optimization_inputs.filter(
        (optimization_input) => optimization_input.name === dinput
      );
    };

    /**
     * return save formulation tab response from the server
     * @returns {GeneralApiSaveResponse}
     */
    async function saveOptimizationTabData() {
      saveOptMetPayload.value = <SaveOptimizationPayload>{};
      if (uiOptimizationInputs.value.length > 0)
        saveOptMetPayload.value["optimization_inputs"] =
          uiOptimizationInputs.value;
      if (uiOptimization.value)
        saveOptMetPayload.value["optimization"] = uiOptimization.value;
      if (uiObjectiveFunction.value)
        saveOptMetPayload.value["objective_function"] =
          uiObjectiveFunction.value;
      if (
        uiStreamFlowThreshold.value !== undefined &&
        uiStreamFlowThreshold.value > 0
      )
        saveOptMetPayload.value["streamflow_threshold"] =
          uiStreamFlowThreshold.value;
      if (
        uiPeakFlowThreshold.value !== undefined &&
        uiPeakFlowThreshold.value > 0
      )
        saveOptMetPayload.value["peak_flow_threshold"] =
          uiPeakFlowThreshold.value;
      if (uiStopCriteria.value !== undefined && uiStopCriteria.value > 0)
        saveOptMetPayload.value["stop_criteria"] = uiStopCriteria.value;
      if (uiPlotFrequency.value !== undefined && uiPlotFrequency.value > 0)
        saveOptMetPayload.value["save_plot_iteration_frequency"] =
          uiPlotFrequency.value;

      if (Object.keys(saveOptMetPayload.value).length > 0) {
        saveOptMetPayload.value["calibration_run_id"] = calibrationJobId.value;
        saveOptMetPayload.value["save_output_iteration"] = true;
        return await makeProtectedApiCall<GeneralApiSaveResponse>(
          `${ngencerfBaseUrl}/calibration/save_optimization_tab/`,
          {
            method: "POST",
            mode: 'cors',
            headers: {
              Authorization: `Bearer ${getAccessToken()}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(saveOptMetPayload.value),
          }
        );
      } else {
        return Promise.resolve({
          _data: {
            respone_type: "exception",
            message: "Error saving Optimization Data",
            validation_errors: {
              "Tab Error": ["Please select at least 1 field before saving."],
            },
            calibration_run_id: calibrationJobId.value,
            status: "error",
          },
          status: 400,
        });
      }
    }

    const getSelectedMetricInfo = computed(() => {
      const selectedMetric = optimizationTabData.value?.metrics.filter(
        (metric_data) => metric_data.name === uiObjectiveFunction.value
      );
      return selectedMetric;
    });

    const resetOptimizationInputs = () => {
      uiOptimizationInputs.value.forEach((input_data) => {
        input_data.value = 0;
      });
    };

    /**
     * @returns {void}
     */
    const resetUserSelectionOptimization = (): void => {
      if (userCalibrationRunData.value?.gage) {
        setUserSelection();
      } else {
        resetOptimizationStore();
      }
    };

    useLogoutListen("logoutEvent", (evStr: string) => {
      if (evStr === "logout") {
        resetOptimizationStore();
      }
    });

    /**
     * @returns {void}
     */
    const resetOptimizationStore = (): void => {
      uiStreamFlowThreshold.value = undefined;
      uiPeakFlowThreshold.value = undefined;
      uiObjectiveFunction.value = "";
      uiOptimization.value = "";
      uiPlotFrequency.value = 1;
      uiStopCriteria.value = 2;
      uiOptimizationInputs.value = [];
    };

    return {
      optimizationTabData,
      optimizationStore_data_loading,
      uiObjectiveFunction,
      uiOptimization,
      uiOptimizationInputs,
      uiPeakFlowThreshold,
      uiPlotFrequency,
      uiStopCriteria,
      uiStreamFlowThreshold,
      userCalibrationRunData,
      getOptimizationAlgorithmOptionsList,
      getObjectiveFunctionOptionsList,
      showObjectiveFunctionPeakFlow,
      showObjectiveFunctionStreamFlow,
      getSelectedMetricInfo,
      getOptimizationInputUserData,
      saveOptimizationTabData,
      resetOptimizationInputs,
      resetUserSelectionOptimization,
      resetOptimizationStore,
      loadOptimizationTabStaticData,
      saveOptMetPayload,
    };
  }
);

/* Pinia supports Hot Module replacement so you can edit your stores
  and interact with them directly in your app without reloading the page,
  allowing you to keep the existing state, add, or even remove state,
  actions, and getters.
*/
if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useOptimizationStore, import.meta.hot)
  );
}
