<template>
  <div v-if="totalPages > 1">
      <div class="text-center pagination-pages" v-if="totalPages > 1">
          <!-- Previous page -->
          <span v-if="currentPage > 1" class="pagingLink">
              <a @click="gotoPage(currentPage-1)">
              &lt;
              </a>
          </span>
          <span v-for="p in Array.from({ length: totalPages }, (_, i) => i + 1)" :key="p">
              <!-- Current page -->
              <span v-if="p == currentPage"
              class="pagingLink active">
              {{ p }}
              </span>
              
              <!--- Other page numbers to show-->
              <span v-else-if="(p >= 1 && p <= 2) ||
                  (p >= (currentPage-1) && p <= (currentPage+1)) ||
                  (p >= (totalPages-1) && p <= totalPages)"
                  class="pagingLink">
              <a @click="gotoPage(p)">
                  {{ p }}
              </a>
              </span>
              
              <!-- Show "..." in gaps where page numbers are not sequential - this should only happen if current page +/-2 doesn't fit the above criteria -->
              <span v-else-if="p == (currentPage-2) ||
                  p == (currentPage+2)" class="pagingLink">
              ...
              </span>
          </span>
          <!-- Next page -->
          <span v-if="currentPage < totalPages" class="pagingLink">
              <a @click="gotoPage(currentPage+1)">
              &gt;
              </a>
          </span>
      </div>
      <div class="pagination-go-to-page">
          <label for="PlotTablePageNumber" class="pr-2 pt-3">Page:</label>
          <input type="number" min="1" :max="totalPages" :value="currentPage" @input="gotoPage(parseInt(($event.target as HTMLInputElement).value))">
      </div>
  </div>
</template>

<script setup lang="ts">

const props = defineProps([
  'currentPage',
  'totalPages'
])

const emit = defineEmits(['update:currentPage']);

function gotoPage(page: number) {
emit('update:currentPage', page);
}
</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

.pagingLink {
padding-left: 4px;
padding-right: 4px;
padding-top: 8px;
}
.pagingLink a:hover {
text-decoration: underline;
cursor: pointer;
}
.pagingLink.active {
font-weight: bold;
}
</style>