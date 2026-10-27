import { Button, type ButtonProps } from "@mantine/core";
import { resolveThemeColor, type ThemeColor } from "../theme/theme";
import { DynamicTooltip } from "./dynamic-tooltip";

export type ThemeButtonProps = Omit<ButtonProps, "color"> & {
	tooltipLabel?: React.ReactNode;
	theme?: ThemeColor;
	onClick?: () => void;
	type?: "button" | "submit" | "reset";
	component?: React.ElementType;
	href?: string;
	/**
	 * Destination for `component={Link}`. TanStack Router's Link routes off `to`
	 * and ignores `href`, so a button given only `href` renders a link back to
	 * the page it is already on — pass `to` whenever the component is a Link.
	 */
	to?: string;
	target?: string;
	rel?: string;
};

export const ThemeButton = ({
	theme = "primary",
	tooltipLabel,
	type = "button",
	component,
	href,
	to,
	target,
	...rest
}: ThemeButtonProps) => {
	const color = resolveThemeColor(theme);

	// Build props object to avoid TypeScript issues with polymorphic component
	const buttonProps: Record<string, unknown> = {
		color,
		type,
		...rest,
	};

	if (component) buttonProps.component = component;
	if (href) buttonProps.href = href;
	if (to) buttonProps.to = to;
	if (target) buttonProps.target = target;

	return (
		<DynamicTooltip label={tooltipLabel}>
			<Button {...(buttonProps as ButtonProps)} />
		</DynamicTooltip>
	);
};
