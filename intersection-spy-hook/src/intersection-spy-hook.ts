import React from 'react';
import Observer from 'intersection-spy';

type ObserverOptions = ConstructorParameters<typeof Observer>[0];
export type ObserverHookOptions = Omit<ObserverOptions, 'rootElement'>;

function useIntersectionSpy(options: ObserverHookOptions) {
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

export {useIntersectionSpy};
