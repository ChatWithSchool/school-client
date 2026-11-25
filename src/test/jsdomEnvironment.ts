import { builtinEnvironments, type Environment } from 'vitest/environments';

const jsdomEnvironment = builtinEnvironments.jsdom;

const environment: Environment = {
  ...jsdomEnvironment,
  async setup(global, options) {
    const nodeAbortController = global.AbortController;
    const nodeAbortSignal = global.AbortSignal;
    const setupResult = await jsdomEnvironment.setup(global, options);

    global.AbortController = nodeAbortController;
    global.AbortSignal = nodeAbortSignal;

    return setupResult;
  },
};

export default environment;
