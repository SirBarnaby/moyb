import { ref } from 'vue'

// Global state to track user's choice after intro sequence
const useMobileView = ref<boolean | null>(null)

export const useViewModeStore = () => ({
  useMobileView,
  setMobileView: (value: boolean) => {
    useMobileView.value = value
  },
  getCurrentView: () => {
    return useMobileView.value
  }
})
