<template>
  <NuxtLayout>
    <!-- severity "error" | "secondary" | "info" | "success" | "warn" | "contrast" info Severity level of the message.
    summary string null Summary content of the message.
    detail any null Detail content of the message. -->
    <Toast position="bottom-right">
      <!-- <template #message="slotProps">
        <div class="custom-toast">
          <i class="pi pi-check-circle" style="font-size: 1.5em"></i>&nbsp;{{ slotProps.message.summary }}
          <div class="ml-2">
            <div>{{ slotProps.message.detail }}</div>
          </div>
        </div>
      </template> -->
    </Toast>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const title = ref('ngenCERF')
const description = ref('')

// This will be reactive when you change title/description above
useHead({
  title,
  meta: [{
    name: '',
    content: description
  }]
})
</script>