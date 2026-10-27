import {
	Card,
	type CardProps,
	ScrollArea,
	type ScrollAreaProps,
	UnstyledButton,
} from "@mantine/core";
import { clsx } from "clsx";
import { forwardRef, type ReactNode } from "react";
import s from "./app-card.module.scss";
import { BarLoader } from "./bar-loader";
import { renderReactNodeOrDefaultComponent } from "./renderReactNodeOrDefaultComponent";
import { Typography } from "./typography";

function MaybeScrollArea({
	enabled,
	children,
	scrollAreaProps,
}: {
	enabled?: boolean;
	children: React.ReactNode;
	scrollAreaProps?: ScrollAreaProps;
}) {
	if (!enabled) return <>{children}</>;
	return (
		<ScrollArea
			{...scrollAreaProps}
			classNames={{
				...scrollAreaProps?.classNames,
				root: s.scrollAreaRoot,
				viewport: s.scrollAreaViewport,
				content: s.scrollAreaContent,
			}}
		>
			{children}
		</ScrollArea>
	);
}

export type AppCardProps = CardProps & {
	withHover?: boolean;
	withPadding?: boolean;
	asButton?: boolean;
	isLoading?: boolean;
	withOverflow?: boolean;
	scrollAreaProps?: ScrollAreaProps;
	title?: ReactNode;
	rightSection?: ReactNode;
	onClick?: React.MouseEventHandler<HTMLDivElement>;
	isActive?: boolean;
};

export const AppCard = forwardRef<HTMLDivElement, AppCardProps>(
	(
		{
			withHover,
			asButton,
			className,
			isLoading,
			children,
			withOverflow = true,
			scrollAreaProps,
			title,
			rightSection,
			withPadding = true,
			onClick,
			isActive,
			...rest
		},
		ref,
	) => {
		const commonProps = {
			ref,
			"data-with-padding": withPadding?.valueOf(),
			"data-is-loading": isLoading,
			"data-with-hover": withHover?.valueOf(),
			"data-has-scroll": withOverflow?.valueOf(),
			"data-is-active": isActive?.valueOf(),
			onClick,
			className: clsx(s.card, className),
			...rest,
		};

		const content = (
			<>
				<BarLoader isLoading={isLoading} />
				<MaybeScrollArea
					enabled={withOverflow}
					scrollAreaProps={scrollAreaProps}
				>
					{children}
				</MaybeScrollArea>
			</>
		);

		const titleContent =
			title || rightSection ? (
				<div className={s.titleContainer}>
					{renderReactNodeOrDefaultComponent(
						title,
						<Typography desktop={"lg"} desktopFw={"bold"}>
							{title}
						</Typography>,
					)}
					{rightSection && <div className={s.rightSection}>{rightSection}</div>}
				</div>
			) : null;

		if (asButton) {
			return (
				<Card {...commonProps} component={UnstyledButton}>
					{titleContent}
					{content}
				</Card>
			);
		}

		return (
			<Card {...commonProps}>
				{titleContent}
				{content}
			</Card>
		);
	},
);

AppCard.displayName = "AppCard";
