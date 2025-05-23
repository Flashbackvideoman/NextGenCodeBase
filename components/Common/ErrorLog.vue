<template>
  <div id="ErrorLog" ref="errorLog" class="rounded-lg">
    <div id="ErrorContent">
      <div class="grid grid-rows-12">
        <div id="Row1" class="row-span-1 h-[48px] mt-2">
          <div class="grid grid-cols-4">
            <div class="col-span-1">
              <div class="inline text-xl font-bold text-right ml-5 mt-5">Notifications</div>
            </div>

            <div class="col-span-2">
              <div v-if="toastRecords.length === 0" class="text-center">
                There are no saved notifications at this time.
              </div>
            </div>

            <div class="col-span-1">
              <img alt="Close" title="Close" aria-label="Close" src="@/assets/styles/img/xclose.png" width="40"
                class="absolute cursor-pointer right-0 boxed mt-1 mr-1 inline-block" @click="closeErroLogBox" />
            </div>
          </div>
        </div>
        <!-- <hr /> -->

        <div id="Row 2" class="row-span-1 h-[48px]">
          <div class="flex flex-wrap gap-4 mb-5">
            <div class="flex items-center ml-5">
              Show notifications for
            </div>
            <div class="flex items-center gap-2">
              <Checkbox v-model="infoToast" inputId="infoToast" name="infoToast" value="info" binary />
              <label for="infoToast">Information</label>
            </div>
            <div class="flex items-center gap-2">
              <Checkbox v-model="warnToast" inputId="warnToast" name="warnToast" value="warn" binary />
              <label for="warnToast">Warnings</label>
            </div>
            <div class="flex items-center gap-2">
              <Checkbox v-model="errorToast" inputId="errorToast" name="errorToast" value="error" binary />
              <label for="errorToast">Errors</label>
            </div>
            <div class="flex items-center gap-2">
              <Checkbox v-model="successToast" inputId="successToast" name="successToast" value="success" binary />
              <label for="successToast">Success</label>
            </div>
          </div>
        </div>

        <div id="Row 3" class="row-span-10">
          <div id="TableWrapper">
            <DataTable id="ErrorTable" :value="getToastArray" class="p-datatable-striped" scrollable scroller="true"
              :scroll-height="scrollHeight" :sortOrder="-1" :sortField="'datetime'">

              <Column :pt="ptColumn" header="" class="" style="width: 1%; text-align:center; vertical-align: top;">
                <template #body="scope">
                  <div :style="{ backgroundColor: getColor(scope.data.severity) }">&nbsp;</div>
                </template>
              </Column>
              <Column :pt="ptColumn" field="datetime" header="Date" class="columnClass" sortable
                style="width: 19%; text-align:center; vertical-align: top;">
              </Column>
              <Column :pt="ptColumn" field="severity" header="Severity" class="columnClass text-center" sortable
                style="width: 8%; text-align:center; vertical-align: top;">
              </Column>
              <Column :pt="ptColumn" field="summary" header="Summary" class="columnClass text-center"
                style="width: 29%; text-align:left; vertical-align: top;">
              </Column>
              <Column :pt="ptColumn" field="detail" header="Detail" class="columnClass text-left"
                style="width: 43%; vertical-align: top;">
              </Column>
            </DataTable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Checkbox from 'primevue/checkbox';
import { generalStore } from '~/stores/common/GeneralStore';

const { toastRecords } = storeToRefs(generalStore());

const infoToast = ref<boolean>(true);
const warnToast = ref<boolean>(true);
const errorToast = ref<boolean>(true);
const successToast = ref<boolean>(true);

const toastsToDisplay = ref();

const scrollHeight = ref<string>(); // Default height

const errorLog = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

onMounted(() => {
  if (errorLog.value) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Resize when visible
            resizeNotifications();
          }
        });
      },
      { threshold: 0.5 } // Triggers when at least 50% of the div is visible
    );
    observer.observe(errorLog.value);
  }

  window.addEventListener('resize', function (event) {
    resizeNotifications();
  });

  setTimeout(() => {
    const resizeEvent = new Event('resize');
    window.dispatchEvent(resizeEvent);
  }, 250);

  setTimeout(() => {
    if (errorLog.value) {
      const el = errorLog.value
      if (!el.style.width) {
        el.style.width = '900px' // Initial width
      }
    }
  }, 0)
})

onUnmounted(() => {
  window.removeEventListener('resize', function (event) {
    //
  });
})

const resizeNotifications = () => {
  let box = document.getElementById("ErrorLog")?.clientHeight ?? 0;
  let row1 = document.getElementById("Row1")?.clientHeight ?? 0;
  let row2 = document.getElementById("Row2")?.clientHeight ?? 0;
  let h = box - row1 - row2;
  scrollHeight.value = h + "px";
}

const getToastArray = computed(() => {
  toastsToDisplay.value = [];
  toastRecords.value.forEach((item) => {
    if ((infoToast.value && item.severity === "info") ||
      (warnToast.value && item.severity === "warn") ||
      (errorToast.value && item.severity === "error") ||
      (successToast.value && item.severity === "success")
    ) {
      toastsToDisplay.value.push(item);
    }
  })
  return toastsToDisplay.value;
});

const getColor = (s: string) => {
  if (s === 'info') return "#3498db";
  else if (s === 'warn') return "#f1c40f";
  else if (s === 'error') return "#e74c3c";
  else if (s === 'success') return "#07bc0c";
}

const ptColumn = ref({
  columnHeaderContent: { style: { "justify-content": "center" } },
  //bodyCell: { style: { "text-align": "center" } }
});

const closeErroLogBox = () => {
  useAccountEvent("errorLogEvent", "");
}

</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

#ErrorLog {
  position: absolute;
  right: 5px;
  border: 5px solid #ccc;
  z-index: 9999;
  background-color: white;
  border-radius: 8px;
  width: auto;
  resize: both;
  overflow: auto;
  direction: rtl;
  min-width: 700px;
  min-height: 200px;
}

#ErrorContent {
  direction: ltr;
}

#ErrorTable {
  width: 100%;
}

.columnClass {
  vertical-align: top;
}
</style>