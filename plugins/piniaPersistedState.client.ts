// plugins/piniaPersistedState.client.ts
import { defineNuxtPlugin } from '#app';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.$pinia.use(piniaPluginPersistedstate);
});
