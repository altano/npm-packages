import React from "react";
export interface Callbacks<T> {
	onMount: (e: T) => void;
	onUnmount: (e: T) => void;
}
export declare function useMountRef<T>({ onMount, onUnmount }: Callbacks<T>): React.Ref<T>;
