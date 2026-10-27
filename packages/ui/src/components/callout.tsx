import { Alert, type AlertProps, type MantineColor } from "@mantine/core";
import {
	IconAlertTriangle,
	IconCircleCheck,
	IconCircleX,
	IconInfoCircle,
	type IconProps,
} from "@tabler/icons-react";
import type { ComponentType, ReactNode } from "react";

/** The four callout meanings on the component board (07 — Feedback). */
export type CalloutTone = "info" | "warning" | "danger" | "success";

const TONE: Record<
	CalloutTone,
	{ color: MantineColor; icon: ComponentType<IconProps> }
> = {
	info: { color: "primary", icon: IconInfoCircle },
	warning: { color: "orange", icon: IconAlertTriangle },
	danger: { color: "red", icon: IconCircleX },
	success: { color: "green", icon: IconCircleCheck },
};

export type CalloutProps = Omit<AlertProps, "color" | "variant" | "icon"> & {
	tone?: CalloutTone;
	/** Overrides the tone's default icon. */
	icon?: ReactNode;
	children?: ReactNode;
};

/**
 * Inline callout per the component board: a 9% wash of its tone behind a 28%
 * hairline, an 18px icon, a 13px title and 12px body. The look comes from the
 * themed `Alert`; this maps a meaning to a hue and picks the icon, so a page
 * never writes `color="orange"` or a tinted rgba() of its own.
 */
export const Callout = ({
	tone = "info",
	icon,
	children,
	...rest
}: CalloutProps) => {
	const { color, icon: Icon } = TONE[tone];
	return (
		<Alert color={color} icon={icon ?? <Icon size={18} />} {...rest}>
			{children}
		</Alert>
	);
};
