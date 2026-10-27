import { ActionIcon, type ActionIconProps } from "@mantine/core";
import {
	IconArrowLeft,
	IconArrowRight,
	IconBan,
	IconBolt,
	IconBuilding,
	IconChartBar,
	IconCheck,
	IconChevronDown,
	IconChevronUp,
	IconCopy,
	IconDotsVertical,
	IconDownload,
	IconEdit,
	IconExternalLink,
	IconEye,
	IconEyeOff,
	IconFilter,
	IconKey,
	IconLayoutSidebarRightCollapse,
	IconLayoutSidebarRightExpand,
	IconLink,
	IconLock,
	IconLogout,
	IconMail,
	IconMailForward,
	IconPencil,
	IconPlus,
	IconRefresh,
	IconSearch,
	IconSend,
	IconTrash,
	IconUpload,
	IconUserCog,
	IconUserPlus,
	IconX,
} from "@tabler/icons-react";
import type React from "react";
import { resolveThemeColor, type ThemeColor } from "../theme/theme";
import { DynamicTooltip } from "./dynamic-tooltip";
import { IconWrapper, type IconWrapperProps } from "./icon-wrapper";
import { ThemeButton, type ThemeButtonProps } from "./theme-button";

const icons = {
	building: IconBuilding,
	plus: IconPlus,
	delete: IconTrash,
	pencil: IconPencil,
	edit: IconEdit,
	search: IconSearch,
	download: IconDownload,
	arrowRight: IconArrowRight,
	arrowLeft: IconArrowLeft,
	sidebarRightCollapse: IconLayoutSidebarRightCollapse,
	sidebarRightExpand: IconLayoutSidebarRightExpand,
	trash: IconTrash,
	externalLink: IconExternalLink,
	chevronDown: IconChevronDown,
	chevronUp: IconChevronUp,
	x: IconX,
	eye: IconEye,
	eyeOff: IconEyeOff,
	filter: IconFilter,
	upload: IconUpload,
	userPlus: IconUserPlus,
	userCog: IconUserCog,
	mailForward: IconMailForward,
	refresh: IconRefresh,
	dotsVertical: IconDotsVertical,
	mail: IconMail,
	key: IconKey,
	lock: IconLock,
	logout: IconLogout,
	copy: IconCopy,
	link: IconLink,
	check: IconCheck,
	send: IconSend,
	iconChartBar: IconChartBar,
	ban: IconBan,
	bolt: IconBolt,
};

type IconThemeButtonProps = ThemeButtonProps & {
	icon: keyof typeof icons;
	iconPosition?: "right" | "left";
	children: React.ReactNode;
	iconSize?: number;
	"data-testid"?: string;
};

export const IconThemeButton = ({
	icon,
	theme,
	onClick,
	children,
	iconPosition = "left",
	iconSize = 14,
	...rest
}: IconThemeButtonProps) => {
	const IconComponent = icons[icon];

	return (
		<ThemeButton
			leftSection={iconPosition === "left" && <IconComponent size={iconSize} />}
			rightSection={
				iconPosition === "right" && <IconComponent size={iconSize} />
			}
			theme={theme}
			onClick={onClick}
			{...rest}
		>
			{children}
		</ThemeButton>
	);
};

export type ThemeActionIconProps = Omit<IconWrapperProps, "icon"> &
	ActionIconProps & {
		icon: keyof typeof icons;
		tooltipLabel?: React.ReactNode;
		theme?: ThemeColor;
		onClick?: () => void;
	};

export const ThemeActionIcon = ({
	icon,
	theme,
	onClick,
	tooltipLabel,
	iconProps,
	themeIconProps,
	...rest
}: ThemeActionIconProps) => {
	const IconComponent = icons[icon as keyof typeof icons];
	const color = resolveThemeColor(theme);

	return (
		<DynamicTooltip label={tooltipLabel}>
			<ActionIcon color={color} onClick={onClick} {...rest}>
				<IconWrapper
					themeIconProps={themeIconProps}
					icon={IconComponent}
					{...iconProps}
				/>
			</ActionIcon>
		</DynamicTooltip>
	);
};
