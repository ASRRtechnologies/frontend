import { clsx } from "clsx";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import surface from "../theme/surface.module.scss";

type EyebrowTag = "span" | "div" | "p" | "h2" | "h3" | "h4" | "label";

export type EyebrowProps = Omit<
	ComponentPropsWithoutRef<"span">,
	"children"
> & {
	/** Element to render; a heading tag when the label titles a region. */
	as?: EyebrowTag;
	children: ReactNode;
};

/**
 * The design's signature label: 10px / 600 / .14em uppercase in --tx3, sitting
 * above a card title, a KPI value or a section (component board, 02 —
 * Typografie). One component instead of every page re-declaring `.eyebrow` in
 * its own module.
 */
export const Eyebrow = ({ as = "span", className, ...rest }: EyebrowProps) => {
	const Tag = as;
	return <Tag className={clsx(surface.eyebrow, className)} {...rest} />;
};
