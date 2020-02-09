import Observer from 'intersection-spy';
type ObserverOptions = ConstructorParameters<typeof Observer>[0];
declare function useIntersectionSpy(options: ObserverOptions): void;
export { useIntersectionSpy as default };
