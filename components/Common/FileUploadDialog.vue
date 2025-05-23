<template>
  <div class="file-upload">
    <FileUpload :name="inputName" :customUpload="true" @uploader="onUpload($event)" :multiple="selectMultiple"
      :accept="fileExtension" />
  </div>
</template>

<script lang="ts" setup>
import { inject, onMounted } from 'vue';

const dialogRef = inject<any>('dialogRef')
const inputName = ref<string>("")
const selectMultiple = ref<boolean>(false)
const fileExtension = ref<string>(".csv")

const onUpload = (event: any) => {
  const formData = new FormData();

  event.files.forEach((file: File) => {
    formData.append(dialogRef.value.data.formFileField, file)
  });

  formData.append('calibration_run_id', String(dialogRef.value.data.calibrationRunId))

  const saveFileResponse = dialogRef.value.data.saveFunction(formData)

  saveFileResponse.then((result: any) => {
    dialogRef.value.close({
      saveFileResponseResult: result
    });
  })
};

onMounted(() => {
  inputName.value = dialogRef.value.data?.inputName ?? ""
  selectMultiple.value = dialogRef.value.data?.selectMultiple ?? false
  fileExtension.value = dialogRef.value.data?.fileExtension ?? ".csv"
})
</script>