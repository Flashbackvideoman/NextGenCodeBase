<template>
  <table id="EvaluationProgressTable" class="progressTable prevent-select">
    <tbody>
      <tr>
        <td><i v-if="false" class="pi pi-check font-bold  checkMark"></i></td>
        <td data-tab="1" title="Headwater Basin Gage" aria-label="Headwater Basin Gage"
          @click="tabClicked">
          Headwater Basin Gage</td>
      </tr>
      <tr>
        <td><i v-if="false" class="pi pi-check font-bold checkMark"></i></td>
        <td data-tab="2" title="Formulation" aria-label="Formulation" @click="tabClicked">Formulation</td>
      </tr>
      <tr>
        <td><i v-if="false" class="pi pi-check font-bold checkMark"></i></td>
        <td data-tab="3" title="Progress Parameters Set"
          aria-label="Progress Parameters Set" @click="tabClicked">
          Progress Parameters Set</td>
      </tr>
      <tr>
        <td><i v-if="false" class="pi pi-check font-bold checkMark"></i></td>
        <td data-tab="3" title="Calibration Output Variable"
          aria-label="Calibration Output Variable" @click="tabClicked">Calibration Output Variable</td>
      </tr>
      <tr>
        <td><i v-if="false" class="pi pi-check font-bold checkMark"></i></td>
        <td data-tab="3" title="Metrics" aria-label="Metrics" @click="tabClicked">
          Metrics</td>

      </tr>
      <tr>
        <td><i v-if="false" class="pi pi-check font-bold checkMark"></i></td>
        <td data-tab="4" title="Time Period" aria-label="Time Period"
          @click="tabClicked">Time Period</td>

      </tr>
      <tr>
        <td><i v-if="false" class="pi pi-check font-bold checkMark"></i></td>
        <td data-tab="4" title="Output Variable" aria-label="Output Variable"
          @click="tabClicked">
          Output Variable</td>
      </tr>
      <tr>
        <td><i v-if="false" class="pi pi-check font-bold checkMark"></i></td>
        <td data-tab="4" title="Reference Dataset" aria-label="Reference Dataset"
          @click="tabClicked">Reference Dataset</td>

      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { generalStore } from "@/stores/common/GeneralStore";

const { getEvaluationTabIndex, getMenuIndex } = generalStore();
const currentEvaluationTab = ref(getEvaluationTabIndex());

const emit = defineEmits(["tabNumber"]);

const tabClicked = (event: Event) => {
  event.preventDefault();
  const ele = event.currentTarget as HTMLElement;
  const allTabs = document.getElementsByClassName("tabs");
  const tabNum = Number(ele.getAttribute("data-tab")) - 1;
  const e = allTabs[tabNum] as HTMLElement;
  e.click();

  // Send the selected tab info to the active tab set with emit
  if (getMenuIndex() === 1) {
    currentEvaluationTab.value = Number(ele.getAttribute("data-tab"));
    emit("tabNumber", currentEvaluationTab.value);
  }
}
</script>

