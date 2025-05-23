// composables/useElementSize.ts
import { ref, onUnmounted, watchEffect } from 'vue';

export function useElementSize() {
  const target = ref<HTMLElement | null>(null);
  const height = ref(0);
  const isItVisible = ref(false);

  let observer: IntersectionObserver | null = null;
  let resizeObserver: ResizeObserver | null = null;

  watchEffect(() => {
    if (target.value) {
      // Intersection Observer
      observer = new IntersectionObserver(
        ([entry]) => {
          isItVisible.value = entry.isIntersecting;
        },
        { threshold: 0.1 }
      );

      observer.observe(target.value);

      // Resize Observer
      resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          height.value = entry.contentRect.height;
        }
      });

      resizeObserver.observe(target.value);
    }
  });

  onUnmounted(() => {
    if (observer) observer.disconnect();
    if (resizeObserver) resizeObserver.disconnect();
  });

  return { target, height, isItVisible };
}
