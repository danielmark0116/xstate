import { IS_PRODUCTION } from '../environment.ts';
import { AnyInterpreter, DevToolsAdapter } from '../types.ts';

interface DevInterface {
  services: Set<AnyInterpreter>;
  register(service: AnyInterpreter): void;
  onRegister(listener: ServiceListener): void;
}
type ServiceListener = (service: AnyInterpreter) => void;

export interface XStateDevInterface {
  register: (service: AnyInterpreter) => void;
  unregister?: (service: AnyInterpreter) => void;
  onRegister?: (listener: ServiceListener) => {
    unsubscribe: () => void;
  };
  services: Set<AnyInterpreter>;
}

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis
export function getGlobal(): typeof globalThis | undefined {
  if (typeof globalThis !== 'undefined') {
    return globalThis;
  }
  if (typeof self !== 'undefined') {
    return self;
  }
  if (typeof window !== 'undefined') {
    return window;
  }
  if (typeof global !== 'undefined') {
    return global;
  }
  if (!IS_PRODUCTION) {
    console.warn(
      'XState could not find a global object in this environment. Please let the maintainers know and raise an issue here: https://github.com/statelyai/xstate/issues'
    );
  }
}

function getDevTools(): DevInterface | undefined {
  const w = getGlobal();
  if (!!(w as any).__xstate__) {
    return (w as any).__xstate__;
  }

  return undefined;
}

export const devToolsAdapter: DevToolsAdapter = (service) => {
  if (typeof window === 'undefined') {
    return;
  }

  getDevTools()?.register(service);
};
