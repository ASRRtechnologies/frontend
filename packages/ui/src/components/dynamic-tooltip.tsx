import { Tooltip, type TooltipProps } from "@mantine/core";

export type DynamicTooltipProps = TooltipProps & {
	label?: React.ReactNode | undefined;
	children: React.ReactNode;
};

export const DynamicTooltip = ({
	children,
	label,
	withinPortal = true,
	...rest
}: DynamicTooltipProps) => {
	if (!label) {
		return children;
	}

	return (
		<Tooltip withinPortal={withinPortal} label={label} {...rest}>
			{children}
		</Tooltip>
	);
};
