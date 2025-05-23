<template>
  <div>You may lose data if you do not save.</div>
  <div>&nbsp;</div>
  <div v-for="line in params">
    {{ line }}
  </div>
  <div>&nbsp;</div>
    <Button class="ngenButtonDiv" @click="stayOnTab(false)">
      Stay on tab
    </Button> &nbsp;
    <Button class="ngenButtonDiv" @click="stayOnTab(true)">
      Discard changes
    </Button>

</template>

<script lang="ts" setup>
import { inject, onMounted } from 'vue';

const dialogRef = inject<any>('dialogRef')
const params = ref<string>("");
const goNext = ref<boolean>();

onMounted(() => {
  params.value = dialogRef.value.data.body;
  goNext.value = dialogRef.value.data.direction;
})

const stayOnTab = (w: boolean) => {
  dialogRef.value.data = true;
    dialogRef.value.close({
      moveToNextResponse: w,
      goNext: goNext.value
    });
}

</script>
<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";
</style>