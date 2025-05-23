<template>
  <div id="OptimizationMetrics" class="mt-4">
    <div class="grid grid-rows-12 gap-1">
      <div class="row-span-3">
        <div class="grid grid-cols-2 pt-3 gap-10">
          <div class="col-span-1">

            <div id="OptAlg" class="mt-2">
              <label for="OptimizationAlgorithm">Optimization Algorithm</label>
              <Select id="OptimizationAlgorithm" class="mt-1" v-model="uiOptimization"
                :options="getOptimizationAlgorithmOptionsList" filter optionLabel="name" optionValue="name"
                placeholder="" @change="optimizationSelectChange" aria-label="Optimization Algorithm"
                title="Optimization Algorithm"
                :disabled="!isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)"></Select>
            </div>

          </div>
          <div class="col-span-1">
            <div class="mt-2">
              <div class="">
                <div class="flex mt-2">
                  <div class="text-left font-bold">Algorithm Parameter(s)</div>
                  <div id="ClearTableBtn" class="ml-auto">
                    <Button id="ClrBtn" @click="resetOptimizationInputs" class="c-blue font-normal underline mr-2"
                      :disabled="!isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)"
                      aria-label="Algorithm Parameters" title="Algorithm Parameter">Clear</Button>
                  </div>
                </div>

                <div id="AlgParamtable" class="mt-1">
                  <DataTable :value="uiOptimizationInputs" scrollable editMode="cell" scroll-height="300px"
                    fixedHeader=true>
                    <Column field="name" header="Parameter" sortable></Column>
                    <Column field="value" header="Initial Value" sortable>
                      <template #editor="{ index }">
                        <InputNumber v-model="uiOptimizationInputs[index].value" inputId="locale-us" locale="en-US"
                          :minFractionDigits="2" fluid autofocus class="w-12 p-1" aria-label="Initial Value"
                          title="Initial Value">
                        </InputNumber>
                      </template>
                    </Column>
                  </DataTable>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div class="row-span-1 hr">&nbsp;</div>

      <div class="row-span-4">
        <div class="grid grid-cols-2 gap-10">
          <div class="col-span-1">
            <div id="ObjFunct">
              <label for="ObjectiveFunction<">Objective Function</label>
              <Select id="ObjectiveFunction" class="rounded-md" filter v-model="uiObjectiveFunction"
                :options="getObjectiveFunctionOptionsList" optionLabel="name" optionValue="name" placeholder=""
                @change="updateMetricFlowFieldVisibility" aria-label="Objective Function" title="Objective Function"
                :disabled="!isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)"></Select>
              <div v-if="showObjectiveFunctionStreamFlow" class="ml-3 mt-2">
                Flow Threshold <InputNumber inputId="ofCategoricalFlowThreshold" v-model="uiStreamFlowThreshold"
                  :minFractionDigits="2" class="w-24" aria-label="Flow Threshold" title="Flow Threshold"
                  :disabled="!isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)">
                </InputNumber> m3/s
              </div>
              <div v-if="showObjectiveFunctionPeakFlow" class="ml-3 mt-2">
                Peak Flow Threshold <InputNumber inputId="ofEventBasedFlowThreshold" v-model="uiPeakFlowThreshold"
                  :minFractionDigits="2" class="w-24" aria-label="Peak Flow Threshold" title="Peak Flow Threshold"
                  :disabled="!isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)"></InputNumber>
                quantile
              </div>
            </div>
          </div>

          <div class="col-span-1">
            <div id="Metrics">
              <div class="font-bold">Metrics</div><br>
              <Checkbox id="CalcCatMetCB" inputId="CalcCatMetCB" class="h-5 w-5 mr-3" style="display:inline-block"
                :binary="true" v-model="cbIsCategorical" aria-label="Calculate Categorical Metrics Checkbox"
                title="Calculate Categorical Metrics Checkbox"
                :disabled="cbCategoricalDisabled ||!isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)"
                @change="toggleMetricStreamFlowInput" />
              <label for="CalcCatMetCB" class="inline">Calculate Categorical Metrics</label>
              <div class="pl-8">
                <span class="text-sm ml-2">(POD, CSI, FAR)</span>
              </div>
              <div v-if="showMetricStreamFlow" id="FlowThreshold" class="mt-2 pl-8">

                Flow Threshold <InputNumber inputId="metricCategoricalFlowThreshold" v-model="uiStreamFlowThreshold"
                  :minFractionDigits="2" class="w-24" aria-label="Flow Threshold" title="Flow Threshold"
                  :disabled="!isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)"></InputNumber> m3/s
              </div><br />

              <Checkbox id="CalEventMetCB" inputId="CalEventMetCB" class="h-5 w-5 mr-3 inline"
                style="display:inline-block" :binary="true" v-model="cbIsEvenBased"
                aria-label="Calculate Event Based Metrics Checkbox" title="Calculate Event Based Metrics Checkbox"
                :disabled="cbEventBasedDisabled || !isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)"
                @change="toggleMetricPeakFlowInput" />
              <label for="CalEventMetCB" class="inline">Calculate Event Based Metrics</label>
              <div class="pl-8">
                <span class="text-sm ml-2">(PKBIAS, PKTE, EVBIAS)</span>
              </div>
              <div v-if="showMetricPeakFlow" id="FlowThreshold" class="mt-2 pl-8">
                Peak Flow Threshold <InputNumber inputId="metricEventBasedFlowThreshold" v-model="uiPeakFlowThreshold"
                  :minFractionDigits="2" class="w-24" aria-label=" Peak Flow Threshold" title=" Peak Flow Threshold"
                  :disabled="!isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)"></InputNumber>
                quantile
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row-span-1 hr">&nbsp;</div>

      <div class="row-span-2 mb-4">
        <div class="grid grid-cols-2 gap-10">
          <div class="col-span-1">
            <!--REVIVING LOST CONTENT HERE-->
            <div id="CalibrationStopCriteria" class="bordered">
              <label for="StopCriteria">Calibration Stop Criteria</label><br>
              <InputNumber id="StopCriteria" inputId="stopCriteria" v-model="uiStopCriteria" showButtons :min="2"
                :disabled="!isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)"
                aria-label="Calibration Stop Criteria" title="Calibration Stop Criteria">
              </InputNumber>
              <div class="ml-3 mt-1">Iterations per Worker</div>
            </div>
          </div>
          <div class="col-span-1">
            <div id="PlotGenFreq" class="bordered">
              <label for="PlotFrequency">Plot Generation Frequency (0 = off)</label><br>
              Once Every:&nbsp;&nbsp;<InputNumber id="PlotFrequency" class="w-[100px]" inputId="plotFrequency"
                v-model="uiPlotFrequency" showButtons :min="1" aria-label="Plot Generation Frequency, zero equals off"
                title="Plot Generation Frequency, zero equals off"
                :disabled="!isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.status)"></InputNumber>
              &nbsp;&nbsp;Iterations
            </div>
          </div>
        </div>
        <DynamicDialog />
      </div>
    </div>

    <div id="OptMetBottomButtons" class="absolute b-0 grid grid-cols-8 mt-6 ActionButtonsBox">
      <span v-if="userCalibrationRunData && isCalibrationJobStatusSavedOrReady(userCalibrationRunData.status)">
        <div class="col-span-1 mr-6 h-8">
          <Button class="font-normal ngenButtonDiv-green" title="Save" aria-label="Save Button"
            @click="saveOptMetData()">
            Save
          </Button>
        </div>
      </span>
      <span v-else>
        <div class="col-span-1 mr-6 h-8 whitespace-nowrap">
          Run on {{ formatDateForRunOnString(submitTimeDate as Date) }}
        </div>
      </span>
      <div class="col-span-1 mr-3">
      </div>
      <div class="col-span-4">&nbsp;</div>
      <div class="col-span-1">
        <Button class="ngenButtonDiv ml-6 font-normal h-8 float-right" title="Previous Tab Button"
          aria-label="Previous Tab Button" @click="goPrevTab()">Prev</Button>
      </div>
      <div class="col-span-1 mr-4">
        <Button class="ngenButtonDiv ml-6 font-normal h-8" title="Next Tab Button" aria-label="Next Tab Button"
          @click="goNextTab()">Next</Button>
      </div>

    </div>

    <div class="waitgif" v-if="isLoading || optimizationStore_data_loading">
      <img alt="Please wait..." src="@/assets/styles/img/wait.gif" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useToast } from "primevue/usetoast";
import { useDialog } from "primevue/usedialog";

import type { ToastMessageOptions } from "primevue/toast";

import { useOptimizationStore } from '@/stores/calibration/OptimizationStore';
import { useUserDataStore } from "@/stores/common/UserDataStore"
import { useRunStatusStore } from "@/stores/calibration/RunStatusStore";
import { generalStore } from "~/stores/common/GeneralStore";

import MoveNextPrevDialog from "../Common/MoveNextPrevDialog.vue";

import { formatDateForRunOnString } from "@/utils/TimeHelpers";
import { hilightTab } from '@/composables/TabHilight';
import { isCalibrationJobStatusSavedOrReady } from "@/utils/CommonHelpers";

const dialog = useDialog();
const nextPrevDialogOpened = ref<boolean>(false);

const optimizationStore = useOptimizationStore();
const {
  uiObjectiveFunction,
  uiOptimization,
  uiOptimizationInputs,
  uiPeakFlowThreshold,
  uiPlotFrequency,
  uiStopCriteria,
  uiStreamFlowThreshold,
  optimizationStore_data_loading,
  getOptimizationAlgorithmOptionsList,
  getObjectiveFunctionOptionsList,
  showObjectiveFunctionPeakFlow,
  showObjectiveFunctionStreamFlow,
  getSelectedMetricInfo,
  getOptimizationInputUserData,
  saveOptMetPayload
} = storeToRefs(optimizationStore);

const { saveOptimizationTabData, resetOptimizationInputs } = optimizationStore;
const { userCalibrationRunData } = storeToRefs(useUserDataStore());
const { submitTimeDate } = storeToRefs(useRunStatusStore());
const toast = useToast();

const { isLoading } = storeToRefs(generalStore());
const { addToastRecord } = generalStore();

const cbCategoricalDisabled = ref<boolean>(false);
const cbEventBasedDisabled = ref<boolean>(false);
const cbIsCategorical = ref<boolean>(false);
const cbIsEvenBased = ref<boolean>(false);
const showMetricPeakFlow = ref<boolean>(false);
const showMetricStreamFlow = ref<boolean>(false);
const ele = document.getElementById("MainLeftDataArea") as HTMLElement;

onMounted(() => {
  hilightTab(CalibrationTabs.tab_optimizationMetrics);
  toast.removeAllGroups();
  if (ele) { ele.scrollTo(0, 0); }
  if (userCalibrationRunData.value?.streamflow_threshold) {
    cbIsCategorical.value = true;
    showMetricStreamFlow.value = true;
    uiStreamFlowThreshold.value = userCalibrationRunData.value?.streamflow_threshold
  }

  if (userCalibrationRunData.value?.peak_flow_threshold) {
    cbIsEvenBased.value = true;
    showMetricPeakFlow.value = true;
    uiPeakFlowThreshold.value = userCalibrationRunData.value?.peak_flow_threshold
  }
  isLoading.value = false;
})

/**
 * update objective function and metric peak flow/stream flow field visibility
 */
const updateMetricFlowFieldVisibility = () => {
  if (getSelectedMetricInfo.value) {
    //reset toggleable field available property
    cbCategoricalDisabled.value = false;
    cbEventBasedDisabled.value = false;
    showObjectiveFunctionStreamFlow.value = false;
    showObjectiveFunctionPeakFlow.value = false;
    uiStreamFlowThreshold.value = undefined;
    uiPeakFlowThreshold.value = undefined;
    showMetricStreamFlow.value = false;
    showMetricPeakFlow.value = false;

    const metricInfo = getSelectedMetricInfo.value?.pop();

    cbIsCategorical.value = metricInfo?.categorical ?? false;
    cbIsEvenBased.value = metricInfo?.event_based ?? false;

    if (metricInfo?.categorical === true) {
      showObjectiveFunctionStreamFlow.value = true;
      cbCategoricalDisabled.value = true;
    }
    if (metricInfo?.event_based === true) {
      showObjectiveFunctionPeakFlow.value = true;
      cbEventBasedDisabled.value = true;
    }
  }
};

/**
 * metric stream flow field visibility toggle 
 */
const toggleMetricStreamFlowInput = () => {
  if (!cbCategoricalDisabled.value && cbIsCategorical.value) {
    showMetricStreamFlow.value = true;
  } else if (!cbIsCategorical.value) {
    showMetricStreamFlow.value = false;
    uiStreamFlowThreshold.value = undefined;
  }
};

/**
 * metric peak flow field visibility toggle 
 */
const toggleMetricPeakFlowInput = () => {
  if (!cbEventBasedDisabled.value && cbIsEvenBased.value) {
    showMetricPeakFlow.value = true;
  } else if (!cbIsEvenBased.value) {
    showMetricPeakFlow.value = false;
    uiPeakFlowThreshold.value = undefined;
  }
};

/**
 * explicitly reload optimization input table data
 */
const optimizationSelectChange = () => {
  uiOptimizationInputs.value = getOptimizationInputUserData.value;
};

/**
 * explicitly watching loading status, as onmount happen prior to store loading. 
 * make sure we manage the display base on user input AFTER data loading has completed 
 */
watch(() => optimizationStore_data_loading.value, (loading_status) => {
  const metricInfo = getSelectedMetricInfo.value?.pop();

  if (metricInfo?.categorical === true) {
    showObjectiveFunctionStreamFlow.value = true;
    cbCategoricalDisabled.value = true;
    cbIsCategorical.value = true;
  } else if (!metricInfo?.categorical && uiStreamFlowThreshold.value) {
    showMetricStreamFlow.value = true;
    cbIsCategorical.value = true;
  }

  if (metricInfo?.event_based === true) {
    showObjectiveFunctionPeakFlow.value = true;
    cbEventBasedDisabled.value = true;
    cbIsEvenBased.value = true;
  } else if (!metricInfo?.event_based && uiPeakFlowThreshold.value) {
    showMetricPeakFlow.value = true;
    cbIsEvenBased.value = true;
  }
})

/**
* event bus for calibration button group click
*/
const saveOptMetData = () => {
  isLoading.value = true;
  if (!isCalibrationJobStatusSavedOrReady(userCalibrationRunData?.value?.status)) {
    const tMsg: ToastMessageOptions = { severity: 'warn', summary: 'Unable to Save', detail: 'Update of a job already run is not allowed. Please clone to make any changes for a new calibration' };
    toast.add(tMsg); addToastRecord(tMsg);
  } else {
    toast.removeAllGroups();
    saveOptimizationTabData().then(response => {
      if (response.status === 200) {
        const tMsg: ToastMessageOptions = { severity: 'info', summary: 'Optimization Metrics Data Saved', detail: response?._data?.message };
        toast.add(tMsg); addToastRecord(tMsg);
      } else {
        useApiErrorResponsePreprocess(response).forEach(message => {
          const tMsg: ToastMessageOptions = { severity: useApiResponseToastSeverityCode(response?.status), summary: 'Save Optimization Metrics Data Failed.', detail: message };
          toast.add(tMsg); addToastRecord(tMsg);
        });
      }
      updateJobData();
      isLoading.value = false;
    });
  }
};

const updateJobData = () => {
  if (userCalibrationRunData.value) {
    userCalibrationRunData.value.optimization_inputs = saveOptMetPayload.value.optimization_inputs as [];
    userCalibrationRunData.value.optimization = saveOptMetPayload.value.optimization ?? '';
    userCalibrationRunData.value.objective_function = saveOptMetPayload.value.objective_function as string;
    userCalibrationRunData.value.streamflow_threshold = saveOptMetPayload.value.streamflow_threshold as number
    userCalibrationRunData.value.peak_flow_threshold = saveOptMetPayload.value.peak_flow_threshold as number
    userCalibrationRunData.value.stop_criteria = saveOptMetPayload.value.stop_criteria as number
    userCalibrationRunData.value.save_plot_iteration_frequency = saveOptMetPayload.value.save_plot_iteration_frequency as number
    userCalibrationRunData.value.save_output_iteration = saveOptMetPayload.value.save_output_iteration as boolean
  }
};

const validateTab = () => {
  let error = false;
  let text = [];
  let savedName = userCalibrationRunData?.value?.optimization ? userCalibrationRunData?.value?.optimization : '';
  let newName = uiOptimization.value ? uiOptimization.value : '';
  if (savedName !== newName) {
    error = true;
    text.push("Optimization Algorithm has been changed");
  }
  savedName = userCalibrationRunData?.value?.objective_function ? userCalibrationRunData?.value?.objective_function : '';
  newName = uiObjectiveFunction.value ? uiObjectiveFunction.value : '';
  if (savedName !== newName) {
    error = true;
    text.push("Objective Function has been changed");
  }
  if ((userCalibrationRunData?.value?.stop_criteria || 0) !== uiStopCriteria.value) {
    error = true;
    text.push("Calibration Stop Criteria has been changed");
  }
  if ((userCalibrationRunData?.value?.save_plot_iteration_frequency || 0) !== uiPlotFrequency.value) {
    error = true;
    text.push("Plot Generation Frequency has been changed");
  }
  if (userCalibrationRunData?.value?.optimization_inputs.length !== uiOptimizationInputs.value.length) {
    error = true;
    text.push("Algorithm Parameters have been changed");
  }

  if ((userCalibrationRunData?.value?.streamflow_threshold || 0) !== (uiStreamFlowThreshold.value || 0)) {
    error = true;
    text.push("Calculate Categorical Metrics (Flow Threshold) has been changed");
  }

  if ((userCalibrationRunData?.value?.peak_flow_threshold || 0) !== (uiPeakFlowThreshold.value || 0)) {
    error = true;
    text.push("Calculate Event Based Metrics (Peak Flow Threshold) has been changed");
  }

  if (userCalibrationRunData?.value?.optimization_inputs && userCalibrationRunData?.value?.optimization_inputs.length > 0)
    uiOptimizationInputs.value.every((module, index) => {
      if (userCalibrationRunData?.value?.optimization_inputs[index].name !== module.name ||
        userCalibrationRunData?.value?.optimization_inputs[index].value !== module.value) {
        error = true;
        text.push("Algorithm Parameter(s) have been added or changed");
      }
    })
  return { error: error, text: text }
}

const restorePage = async () => {
  if (userCalibrationRunData.value) {
    uiOptimization.value = userCalibrationRunData?.value?.optimization;
    uiObjectiveFunction.value = userCalibrationRunData?.value?.objective_function;
    uiStopCriteria.value = userCalibrationRunData?.value?.stop_criteria || 0;
    uiPlotFrequency.value = userCalibrationRunData?.value?.save_plot_iteration_frequency || 0;
    uiOptimizationInputs.value = userCalibrationRunData?.value?.optimization_inputs;
  }
}

const goNextTab = () => {
  const errors = validateTab();
  if (errors.error) {
    showPrevNextDialog(errors.text, true);
  } else {
    gotoNext();
  }
};

const goPrevTab = () => {
  const errors = validateTab();
  if (errors.error) {
    showPrevNextDialog(errors.text, false);
  } else {
    gotoPrev();
  }
};

const gotoNext = () => {
  const tabs = document.getElementsByClassName("tabs");
  const e = <HTMLElement>tabs[CalibrationTabs.tab_statusRun];
  e.click();
}

const gotoPrev = () => {
  const tabs = document.getElementsByClassName("tabs");
  const e = <HTMLElement>tabs[CalibrationTabs.tab_tuningControls];
  e.click();
}

const showPrevNextDialog = (body: string[], next: boolean) => {
  if (!nextPrevDialogOpened.value) {
    dialog.open(MoveNextPrevDialog, {
      props: {
        header: "Unsaved changes!",
        style: {
          width: 'auto',
        },
        modal: true,
      },
      data: {
        body: body,
        direction: next
      },
      onClose: (opt) => {
        nextPrevDialogOpened.value = false;
        handleNextPrevDialogClose(opt);
      },

    })
    nextPrevDialogOpened.value = true
  }
}

const handleNextPrevDialogClose = (opt: any) => {
  if (opt.data && opt.data.moveToNextResponse) {
    restorePage();
    if (opt.data.goNext) {
      gotoNext();
    } else {
      gotoPrev();
    }
  }
  if (opt.type && opt.type === 'dialog-close') {
    return;
  }
}
</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

#ObjectiveFunction_list,
.p-select-list-container {
  position: relative;
  z-index: 2;
  max-height: 8rem !important;
}

#OptMetBottomButtons {
  z-index: 9999;
}

#ClrBtn {
  font-weight: bold;
}
#ClrBtn:hover {
  background-color: transparent;
  border: none;
  color: global.$ngwcp_primary3 !important;
}
</style>
