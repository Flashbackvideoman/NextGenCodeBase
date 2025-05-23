<template>
  <div id="CalRunsFilterDialog" class="mb-2 mt-4">

    <div id="FilterDialog">

      <div class="grid grid-cols-12 gap-2 text-sx">
        <div class="col-span-2">
          <label class="block text-left w-[90%]" for="HeadwaterBasinGage" aria-label="Headwater Basin Gage"
            title="Headwater Basin Gage">Headwater Basin Gage</label>
          <Select id="HeadwaterBasinGage" class="mt-2 basin-gage-filter text-left" v-model="uiGageId"
            :options="evaluationCalibrationRunGageList" filter optionLabel="name" optionValue="name" placeholder="All"
            aria-label="Headwater Basin Gage Filter Select" title="Headwater Basin Gage Filter Select"
            :disabled="disableAll">
          </Select>
        </div>

        <div class="col-span-2">
          <div>
            <label for="ModuleList" class="block text-left mb-1" aria-label="Module Filter"
              title="Module Filter">Modules</label>
            <MultiSelect id="ModuleList" v-model="modulesFilterList" :options="fetchFormulationModuleOptions"
              optionLabel="name" optionValue="name" :maxSelectedLabels="3" class="w-full" aria-label="Module Filter"
              title="Module Filter" :disabled="disableAll">
              <template #header>
                <div class="absolute cursor-pointer top-2 left-[58px]">&nbsp; Select All Items</div>
              </template>
              <template #option="slotProps">
                <div class="font-ui pl-2 leading-none" :aria-label="slotProps.option.name"
                  :title="slotProps.option.name">
                  {{ slotProps.option.name }}&nbsp;
                </div>
              </template>
            </MultiSelect>
          </div>
        </div>
        <div class="col-span-6">
          <div class="grid grid-cols-12">
            <div class="col-span-4">
              <Checkbox v-model="includeArchivedJobs" inputId="ShowArchiveToggle" class="text-xs mt-[45px] ml-[28px]"
                aria-label="Include Archived Jobs" title="Include Archived Jobs" binary variant="filled" size="large"
                :pt="ptCheckbox" :disabled="disableAll">
              </Checkbox>
              <label class="cursor-pointer align-center ml-2" for="ShowArchiveToggle" aria-label="Include Archived Jobs"
                title="Include Archived Jobs">Include Archived</label>
            </div>
            <div class="col-span-4">
              <div class="col-span-1">
                <Button class="ngenButtonDiv mt-[41px] ml-[9px] align-center" label="Apply Filters"
                  @click="sendApply($event)" aria-label="Apply and close" title="Apply and close"
                  :disabled="disableAll">
                </Button>
              </div>
            </div>
          </div>
        </div>


        <div class="col-span-2 text-right mr-3">
          <Button id="CleareFiltersButton" class="c-blue mt-[22px]" label="Clear Filters" @click="resetFilters($event)"
            aria-label="Clear filters" title="Clear filters" :disabled="filterActive">
          </Button><br />
          <Button id="RefreshJobList" class="c-blue mt-[5px]" label="Refresh List" @click="refreshJobList()"
            aria-label="Refresh Job List" title="Refresh Job List" :disabled="disableAll">
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Button from "primevue/button";
import MultiSelect from 'primevue/multiselect';
import Select from "primevue/select";

import type { CalibrationJobListItem } from "@/composables/NextGenModel"

import { useFormulationStore } from "@/stores/calibration/FormulationStore";
import { useUserDataStore } from "@/stores/common/UserDataStore";
import { useEvaluationCalibrationRunStore } from "@/stores/evaluation/EvaluationCalibrationRunStore";

const { fetchFormulationModuleOptions } = useFormulationStore();

const { modulesFilterList, statusTypeFilterList, includeArchivedJobs } = storeToRefs(useUserDataStore());

const { uiGageId, evaluationCalibrationRunGageList } = storeToRefs(useEvaluationCalibrationRunStore());

const emit = defineEmits(["ApplyJobFilters", "RefreshJobList"]);

const ptCheckbox = ref({
  box: { style: { "border": "2px solid #0c5274" } },
});

const props = defineProps<{
  calJobs: CalibrationJobListItem[];
  disableAll: boolean;
}>();


const filterActive = computed(() => {
  return (modulesFilterList.value.length === 0 && (uiGageId.value === 'All' || uiGageId.value === '') && includeArchivedJobs.value === false);
});

const refreshJobList = () => {
  emit("RefreshJobList");
}

/**
 * Let the caller APPLLY the dialog
 * @param: MouseEvent
 */
const sendApply = (e: MouseEvent) => {
  e.stopPropagation();
  e.stopImmediatePropagation();
  emit("ApplyJobFilters");
};

/**
 * Define a method to be called by the parent
 * to reset the filters
 */
const externalResetFilters = () => {
  const mouseEvent = new MouseEvent('click', {
    'view': window,
    'bubbles': true,
    'cancelable': true,
  });
  resetFilters(mouseEvent);
};

// Expose the method to the parent
defineExpose({
  externalResetFilters
});

/**
 * Reset filters
 */
const resetFilters = (e: MouseEvent) => {
  e.stopPropagation();
  e.stopImmediatePropagation();
  uiGageId.value = 'All';
  modulesFilterList.value = [];
  statusTypeFilterList.value = [];
  includeArchivedJobs.value = false;
  emit("ApplyJobFilters");
}

</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

#Header {
  background-color: global.$ngwcp_primary3;
}

#CalRunsFilterDialog {
  background-color: white;
  padding-bottom: 5px;
}

#ModuleList,
#StatusList {
  border: 1px solid #888888;
}

.c-blue {
  text-decoration: underline;
  color: blue;
  font-weight: normal !important;
}

.c-blue:hover {
  color: blue !important;
  background-color: transparent;
  font-weight: bold;
  border: none;
}

.c-blue:disabled {
  color: #555 !important;
}

label {
  cursor: default;
}
</style>
