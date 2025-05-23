// /error.vue
<template>
  <ErrorLayout>
    <div class="flex flex-col items-center">
            <div class="text-indigo-500 font-bold text-4xl">
                404 Error -  The requested  page does not exist
            </div>

            <div class="text-gray-400 font-medium text-sm md:text-xl lg:text-2xl mt-8">
                Redirecting you to the Login page...
            </div>
    </div>
  </ErrorLayout>
</template>

<script setup lang="ts">
import ErrorLayout from './layouts/ErrorLayout.vue';

onMounted( () => {
  gotoLogin();
})

const gotoLogin = () => {
  setTimeout( () => navigateTo("login"), 1000);
}

</script>