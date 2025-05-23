<template>
  <div class="h-full min-h-screen ">
    <div class="grid grid-rows-12">
      <div class="row-span-1">
        <div>
          <AppHeader />
        </div>
      </div>
      <div v-if="getMenuIndex() === 1 && getCalibrationTabIndex() === 1" class="grid row-span-10 gap-2 mx-2">
        <div class="grid grid-cols-12">
          <div class="col-span-12">
            <div class="grid grid-rows-12 mx-auto px-2 py-2">
              <div class="grid row-span-12 white-tall-content-box">
                <div id="MainLeftDataArea" class="overflow-auto"> 
                  <CalibrationLeftBlock />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="grid row-span-10 gap-2 mx-2">
        <div class="grid grid-cols-12">
          <div class="col-span-8">
            <div class="grid grid-rows-12 mx-auto px-2 py-2">
              <div class="grid row-span-12 white-tall-content-box">
                <div id="MainLeftDataArea" class="overflow-auto"> 
                  <CalibrationLeftBlock />
                </div>
              </div>
            </div>
          </div>
          <div class="col-span-4">
            <div class="grid grid-rows-12 mx-auto px-2 py-2">
              <div class="grid row-span-12 white-tall-content-box">
                <div id="MainRightDataArea" class="overflow-auto"> 
                  <CalibrationRightBlock />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row-span-1">
        <AppFooter />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppFooter from "@/components/Common/AppFooter.vue";
import AppHeader from "@/components/Common/AppHeader.vue";
import CalibrationRightBlock from "@/components/Calibration/CalibrationRightBlock.vue";
import CalibrationLeftBlock from "@/components/Calibration/CalibrationLeftBlock.vue";
import { generalStore } from "@/stores/common/GeneralStore";

const { getMenuIndex, getCalibrationTabIndex } = generalStore();
</script>

