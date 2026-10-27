import { ThemeIcon, type ThemeIconProps } from "@mantine/core";
import type { IconProps } from "@tabler/icons-react";
import type { ComponentType } from "react";

export type TablerIconProps = ComponentType<IconProps>;

export type IconWrapperProps = {
	icon: TablerIconProps;
	iconProps?: IconProps;
	themeIconProps?: Omit<ThemeIconProps, "children">;
};

export const IconWrapper = ({
	icon: Icon,
	iconProps,
	themeIconProps,
}: IconWrapperProps) => {
	return (
		<ThemeIcon {...themeIconProps}>
			<Icon {...iconProps} />
		</ThemeIcon>
	);
};
