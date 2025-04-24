export const ANIMATION_CONFIG = {
  intro: {
    fadeIn: {
      duration: 0.2, // seconds
      timing: 'ease-out'
    },
    fadeOut: {
      duration: 0.6, // seconds
      timing: 'ease-out'
    },
    displayDuration: 3 // seconds
  },
  mainContent: {
    fadeIn: {
      duration: 0.3, // seconds
      timing: 'ease-out'
    }
  }
} as const; 