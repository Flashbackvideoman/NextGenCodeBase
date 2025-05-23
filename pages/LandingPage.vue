<template>
  <client-only>
    <div class="h-full">
      <div class="grid grid-rows-3 h-full">
        <div class="row-span-1">
          <div>
            <AppHeader />
          </div>
        </div>
        <div class="row-span-1">
          <div id="CenterBox" class="bg-white mx-auto px-8 py-8 rounded-[10px] max-w-screen-lg">
            <div class="mx-auto px-8 text-center text-2xl mt-8 mb-8 ">
              <h1 class="text-4xl font-bold">Next Generation Water Prediction Capability</h1>
              <div class="pt-8 pb-8">Welcome <strong>{{ getUserFullName() }}</strong></div>
              <div>You have {{ runningCalibrationJobs }} current processes running</div>
              <div>You have {{ savedCalibrationJobs }} calibration setups to complete</div>
            </div>
          </div>
        </div>
      </div>
      <div class="row-span-1">
        <AppFooter />
      </div>
    </div>
  </client-only>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import { storeToRefs } from "pinia";

import AppHeader from '@/components/Common/AppHeader.vue';
import AppFooter from '@/components/Common/AppFooter.vue';

import { useUserDataStore } from '@/stores/common/UserDataStore';
import { useCalibrationJobStore } from "@/stores/common/CalibrationJobStore";
import { useGageStore } from "@/stores/calibration/GageStore";
import { useFormulationStore } from "@/stores/calibration/FormulationStore";
import { useOptimizationStore } from "@/stores/calibration/OptimizationStore";
import { useRunStatusStore } from "@/stores/calibration/RunStatusStore";
import { useTuningStore } from "@/stores/calibration/TuningStore";
import { generalStore } from "~/stores/common/GeneralStore";

import { useToast } from "primevue/usetoast";
import type { ToastMessageOptions } from "primevue/toast";
import { ToastTimeout } from "@/composables/NextgenEnums";
const toast = useToast();

const { popupActive } = storeToRefs(generalStore());

const { resetGageStore } = useGageStore();
const { resetFormulationStore, loadFormulationModels } = useFormulationStore();
const { resetOptimizationStore } = useOptimizationStore();
const { hardResetRunStatusStore } = useRunStatusStore();
const { hardResetTuningStore } = useTuningStore();
const { addToastRecord } = generalStore();

const formulationStore = useFormulationStore;
const { formulationTabData } = storeToRefs(formulationStore())

const { savedCalibrationJobs, runningCalibrationJobs } = storeToRefs(useCalibrationJobStore());
const { fetchUserCalibrationJobsListData, getUserFullName } = useUserDataStore()

onMounted(async () => {
  popupActive.value = false;
  resetGageStore();
  resetFormulationStore();
  resetOptimizationStore();
  hardResetRunStatusStore();
  hardResetTuningStore();
  await loadFormulationModels();
  await fetchUserCalibrationJobsListData();
  if (!formulationTabData.value) {
    const tMsg: ToastMessageOptions = { severity: "error", summary: 'Server Error', detail: "Unable to Retrieve Module List", life: ToastTimeout.timeout10000 };
    toast.add(tMsg); addToastRecord(tMsg);
  }
})

</script>
