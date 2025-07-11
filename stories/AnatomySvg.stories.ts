import AnatomySvg from '../app/src/ui/AnatomySvg.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof AnatomySvg> = {
  title: 'UI/AnatomySvg',
  component: AnatomySvg,
  args: {
    muscleClasses: {
      chest: { selected: true },
    },
    muscleStyles: {
      chest: { fill: '#FF6666' },
    },
  },
};
export default meta;

export const Default: StoryObj<typeof AnatomySvg> = {};
