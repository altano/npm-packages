import React from 'react';
import Observer from 'regarded-element-observer';

type ObserverOptions = ConstructorParameters<typeof Observer>[0];
export type ObserverHookOptions = Omit<ObserverOptions, 'rootElement'>;

function useRegardedElement(options: ObserverHookOptions) {
  const rootElementRef = React.useRef(null);
  React.useEffect(() => {
    if (rootElementRef.current == null) {
      // @TODO Warn?
      return;
    }
    const observer = new Observer({
      ...options,
      rootElement: rootElementRef.current ?? undefined,
    });
    return () => {
      observer.destroy();
    };
  }, [rootElementRef]);
  return rootElementRef;
}

export {useRegardedElement};
