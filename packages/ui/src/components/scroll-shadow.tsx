import { ScrollArea, type ScrollAreaProps } from "@mantine/core";
import type React from "react";
import classes from "./scroll-shadow.module.css";

export type ScrollShadowProps = Omit<ScrollAreaProps, "children"> & {
	/** Height of the fade masks (CSS length). Example: '64px', '4rem' */
	maskHeight?: string;
	/** How far from the start/end the animation should fully settle (CSS length) */
	scrollBuffer?: string;
	/** Optional: override the mask foreground (opaque) color, default is black (#000) */
	foreground?: string;
	children: React.ReactNode;
};

/**
 * Mantine ScrollArea + CSS mask with scroll-driven animation.
 * - Top mask animates from 0 -> maskHeight at the start of the scroll.
 * - Bottom mask animates from maskHeight -> 0 near the end of the scroll.
 */
export function ScrollShadow({
	children,
	className,
	maskHeight = "80px",
	scrollBuffer = "2rem",
	foreground = "#000",
	...rest
}: ScrollShadowProps) {
	return (
		<ScrollArea
			{...rest}
			className={className}
			// Put the masking + animation on the viewport element
			viewportProps={{
				className: classes.maskedOverflow,
				style: {
					// expose easy knobs as CSS variables
					// (the CSS reads these values)
					["--mask-height" as any]: maskHeight,
					["--scroll-buffer" as any]: scrollBuffer,
					["--foreground" as any]: foreground,
				},
			}}
		>
			{children}
		</ScrollArea>
	);
}

export default ScrollShadow;
