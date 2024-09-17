import React from "react";
interface Context {
	mountedElements: Set<Element>;
}
export declare const ElementObserverContext: React.Context<Context | null>;
export {};
