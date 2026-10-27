import {
	createPolymorphicComponent,
	Text,
	type TextProps,
} from "@mantine/core";
import { forwardRef } from "react";
import s from "./typography.module.scss";

type Size =
	| "xxs"
	| "xs"
	| "sm"
	| "md"
	| "lg"
	| "xl"
	| "h6"
	| "h5"
	| "h4"
	| "h3"
	| "h2"
	| "h1";

export interface TypographyProps extends Omit<TextProps, "size" | "fw"> {
	fw?: never;
	mobile?: Size;
	tablet?: Size;
	//xxs - 10px | xs - 12px | sm - 14px | md - 16px | lg - 18px | xl - 20px | h6 - 10px | h5 - 14px | h4 - 16px | h3 - 18px | h2 - 20px | h1 - 24px
	desktop?: Size;
	tabletFw?: TextProps["fw"];
	mobileFw?: TextProps["fw"];
	desktopFw?: TextProps["fw"];
	font?: "poppins";
}

const fontMap = {
	poppins: s.fontPoppins,
};

const allowedFontWeights = new Set([
	100, 200, 300, 400, 500, 600, 700, 800, 900,
]);

const fontWeightAliases: Record<string, number> = {
	thin: 100,
	extralight: 200,
	"extra-light": 200,
	"ultra-light": 200,
	light: 300,
	lighter: 300,
	regular: 400,
	normal: 400,
	medium: 500,
	semibold: 600,
	"semi-bold": 600,
	demibold: 600,
	"demi-bold": 600,
	bold: 700,
	bolder: 700,
	extrabold: 800,
	"extra-bold": 800,
	black: 900,
	heavy: 900,
};

function normalizeFontWeight(weight?: TextProps["fw"]) {
	if (weight === undefined || weight === null) {
		return undefined;
	}

	if (typeof weight === "number") {
		return allowedFontWeights.has(weight) ? String(weight) : undefined;
	}

	const normalizedInput = `${weight}`.trim().toLowerCase();
	if (!normalizedInput.length) {
		return undefined;
	}

	const aliasValue = fontWeightAliases[normalizedInput];
	if (aliasValue) {
		return String(aliasValue);
	}

	const numericValue = Number(normalizedInput);
	if (!Number.isNaN(numericValue) && allowedFontWeights.has(numericValue)) {
		return String(numericValue);
	}

	return undefined;
}

function isHeadingSize(size: Size | undefined) {
	if (!size) return false;

	return ["h1", "h2", "h3", "h4", "h5", "h6"].includes(size);
}

const _Typography = forwardRef<HTMLDivElement, TypographyProps>(
	(
		{
			mobile,
			tablet,
			desktop = "md",
			font = "poppins",
			mobileFw,
			tabletFw,
			desktopFw,
			className,
			fw: _deprecatedFw,
			...rest
		},
		ref,
	) => {
		void _deprecatedFw;

		const hasMobile = !!mobile;
		const hasTablet = !!tablet;

		// NEW LOGIC:
		// If mobile/tablet are missing → desktop is used for all breakpoints.
		const finalMobile = hasMobile ? mobile : desktop;
		const finalTablet = hasTablet ? tablet : desktop;
		const finalDesktop = desktop;

		const isHeading =
			isHeadingSize(finalMobile) ||
			isHeadingSize(finalTablet) ||
			isHeadingSize(finalDesktop);

		const fallbackHeadingWeight = normalizeFontWeight(
			isHeading ? 700 : undefined,
		);

		const normalizedMobileFw = normalizeFontWeight(mobileFw);
		const resolvedMobileFw = normalizedMobileFw ?? fallbackHeadingWeight;

		const normalizedTabletFw = normalizeFontWeight(tabletFw);
		const resolvedTabletFw = normalizedTabletFw ?? resolvedMobileFw;

		const normalizedDesktopFw = normalizeFontWeight(desktopFw);
		const resolvedDesktopFw =
			normalizedDesktopFw ?? resolvedTabletFw ?? resolvedMobileFw;

		return (
			<Text
				ref={ref}
				className={[fontMap[font], className].filter(Boolean).join(" ")}
				data-size-mobile={finalMobile}
				data-size-tablet={finalTablet}
				data-size-desktop={finalDesktop}
				data-fw-mobile={resolvedMobileFw}
				data-fw-tablet={resolvedTabletFw}
				data-fw-desktop={resolvedDesktopFw}
				{...rest}
			/>
		);
	},
);

_Typography.displayName = "Typography";

export const Typography = createPolymorphicComponent<"p", TypographyProps>(
	_Typography,
);
