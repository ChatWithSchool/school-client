import type { StorybookConfig } from '@storybook/react-vite';

/** Storybook: every component in src/components/ui, with all its variants and states. */
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-a11y'],
  framework: { name: '@storybook/react-vite', options: {} },
  core: { disableTelemetry: true },
};

export default config;
