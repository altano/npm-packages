import React from 'react';
import Observer from 'intersection-spy';

type ObserverOptions = ConstructorParameters<typeof Observer>[0];

function useIntersectionSpy(options: ObserverOptions) {
  React.useEffect(() => {
    const observer = new Observer(options);
    return () => {
      observer.destroy();
    };
  });
}

export default useIntersectionSpy;
