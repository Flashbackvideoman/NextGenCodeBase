<template>
  <!-- LeftBlock.vue -->
  <div>
    <CommonTabs @tabNumber="tabChanged" />
    
    <div v-if="activeTab === 1">
      <CalibrationCalibrationRunsTab />
    </div> 
    <div v-else-if="activeTab === 2">
      <CalibrationHeadwaterBasinGage />
    </div>
    <div v-else-if="activeTab === 3">
      <CalibrationFormulation />
    </div>
    <div v-else-if="activeTab === 4">
      <CalibrationTuningControls />
    </div>
    <div v-else-if="activeTab === 5">
      <CalibrationOptimizationMetrics />
    </div>
    <div v-else-if="activeTab === 6">
      <CalibrationRunStatus />
    </div>
    
  </div>

</template>

<script setup lang="ts">

import { generalStore } from "@/stores/common/GeneralStore";

import CommonTabs from '@/components/Common/Tabs.vue'
import CalibrationHeadwaterBasinGage from '@/components/Calibration/HeadwaterBasinGage.vue';
import CalibrationFormulation from'@/components/Calibration/Formulation.vue';
import CalibrationTuningControls from'@/components/Calibration/TuningControls.vue';
import CalibrationOptimizationMetrics from'@/components/Calibration/OptimizationMetrics.vue';
import CalibrationRunStatus from'@/components/Calibration/RunStatus.vue';
import CalibrationCalibrationRunsTab from'@/components/Calibration/PreviousCalibrationRuns.vue';


const { getCalibrationTabIndex, setCalibrationTabIndex } = generalStore();
// Default to Tab 1, HeadwaterBasinGage
const activeTab = ref(getCalibrationTabIndex());
// Activate new tab
const tabChanged = (tabNum: number) => {
  if (activeTab.value !== tabNum) {
    activeTab.value = tabNum;
    setCalibrationTabIndex(tabNum);
  }
};
</script>
