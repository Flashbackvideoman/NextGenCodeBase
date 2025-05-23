<template>
  <!-- ForecastRightBlock -->
  <div id="ForecastRightBlock" class="grid grid-cols-1">
    <div class="grid-rows-12" v-if="userCalibrationRunData?.calibration_run_id">
      <div id="TopRightBlock" class="row-span-5">
        <div class="grid grid-cols-5">
          <div class="col-span-5 mb-3">
            <h2>Progress</h2>
          </div>
          <div id="ProgressGroup" class="col-span-3">
            <ForecastProgressGroup />
          </div>
          <div id="GageCutout" class="col-span-2">
            <GageCutout />
          </div>
        </div>
      </div>
      <div id="BottomRightBlock" class="row-span-7">
        <div id="MessagesGroup">
          <MessagesGroup />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useUserDataStore } from "@/stores/common/UserDataStore";
import ForecastProgressGroup from "./ForecastProgressGroup.vue";
import MessagesGroup from "../Common/MessagesGroup.vue";
import GageCutout from "../Common/GageCutout.vue";

const { userCalibrationRunData } = storeToRefs( useUserDataStore() );
</script>
