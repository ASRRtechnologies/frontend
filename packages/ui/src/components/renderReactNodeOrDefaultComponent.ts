import type { ReactElement, ReactNode } from "react";

export function renderReactNodeOrDefaultComponent(
	child: ReactNode | undefined,
	wrapperElement: ReactElement,
) {
	if (!child) {
		return null;
	}
	// If the child is a string or number, return its wrapper-element otherwise, return the provided child
	return typeof child === "string" || typeof child === "number"
		? wrapperElement
		: child;
}
