import React from "react";
export interface Options {
	selector: string;
	tree: React.ReactNode;
	useWrapperDiv?: boolean;
}
export declare function useElementObserver({ tree, selector, useWrapperDiv }: Options): [Set<Element>, React.ReactElement];
