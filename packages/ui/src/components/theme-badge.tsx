import { Badge, type BadgeProps } from "@mantine/core";
import { useState } from "react";
import { resolveThemeColor, type ThemeColor } from "../theme/theme";
import { DynamicTooltip } from "./dynamic-tooltip";

export type ThemeBadgeProps = Omit<BadgeProps, "color"> & {
	tooltipLabel?: React.ReactNode;
	theme?: ThemeColor;
	children?: React.ReactNode;
	onClick?: () => void;
	onMouseEnter?: React.MouseEventHandler;
	onMouseLeave?: React.MouseEventHandler;
	variantOnHover?: BadgeProps["variant"];
};

export const ThemeBadge = ({
	theme = "primary",
	variant = "light",
	variantOnHover,
	tooltipLabel,
	onClick,
	onMouseEnter,
	onMouseLeave,
	...rest
}: ThemeBadgeProps) => {
	const [isHovered, setIsHovered] = useState(false);
	const color = resolveThemeColor(theme);
	const currentVariant = isHovered && variantOnHover ? variantOnHover : variant;

	return (
		<DynamicTooltip label={tooltipLabel}>
			<Badge
				color={color}
				variant={currentVariant}
				onClick={onClick}
				onMouseEnter={(event) => {
					setIsHovered(true);
					onMouseEnter?.(event);
				}}
				onMouseLeave={(event) => {
					setIsHovered(false);
					onMouseLeave?.(event);
				}}
				{...rest}
			/>
		</DynamicTooltip>
	);
};
