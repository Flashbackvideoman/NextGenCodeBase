<template>
  <!-- ForecastLeftBlock.vue -->
  <div>
    <Tabs @tabNumber="tabChanged" />
    <div class="shrink-0">
      <span v-if="activeTab === 1">
        <PreviousCalibrationRuns />
      </span>
      <span v-else-if="activeTab === 2">
        <ForecastRunsTab />
      </span>
      <span v-else-if="activeTab === 3">
       <SetupForecastTab />
      </span>
      <span v-else-if="activeTab === 4">
        <StatusRunTab />
      </span>
      <span v-else-if="activeTab === 5">
        <ResultsTab />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { generalStore } from "@/stores/common/GeneralStore";

import Tabs from '@/components/Common/Tabs.vue'
import PreviousCalibrationRuns from '@/components/Forecast/PreviousCalibrationRuns.vue';
import ForecastRunsTab from '@/components/Forecast/ForecastRunsTab.vue';
import SetupForecastTab from '@/components/Forecast/SetupForecastTab.vue';
import StatusRunTab from '@/components/Forecast/StatusRunTab.vue';
import ResultsTab from '@/components/Forecast/ResultsTab.vue';

const { getForecastTabIndex, setForecastTabIndex } = generalStore();

const activeTab = ref(getForecastTabIndex());

// Activate new tab
const tabChanged = (tabNum: number) => {
  if (activeTab.value !== tabNum) {
    activeTab.value = tabNum;
    setForecastTabIndex(tabNum);
  } 
};
</script>
