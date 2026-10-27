import { DEFAULT_LOCALE_FORMAT, type LocaleFormatInfo } from "@asrr/utils";
import {
	ActionIcon,
	Alert,
	Anchor,
	Badge,
	Button,
	Card,
	Checkbox,
	ComboboxChevron,
	type CSSVariablesResolver,
	createTheme,
	DEFAULT_THEME,
	Drawer,
	HoverCard,
	Input,
	InputWrapper,
	type MantineColor,
	type MantineSize,
	type MantineTransition,
	Menu,
	Modal,
	mergeMantineTheme,
	NavLink,
	Notification,
	NumberFormatter,
	NumberInput,
	Paper,
	Popover,
	Radio,
	ScrollArea,
	SegmentedControl,
	Select,
	Skeleton,
	Switch,
	Table,
	Tabs,
	ThemeIcon,
	Title,
	Tooltip,
	type TransitionProps,
} from "@mantine/core";
import {
	DateInput,
	DatePicker,
	DatePickerInput,
	DateTimePicker,
	TimePicker,
} from "@mantine/dates";
import actionIcon from "./action-icon.module.scss";
import alert from "./alert.module.scss";
import badge from "./badge.module.scss";
import button from "./button.module.scss";
import controls from "./controls.module.scss";
import drawer from "./drawer.module.scss";
import focus from "./focus.module.scss";
import input from "./input.module.scss";
import mantineTable from "./mantine-table.module.scss";
import modal from "./modal.module.scss";
import navLink from "./navlink.module.scss";
import notification from "./notification.module.scss";
import paper from "./paper.module.scss";
import popover from "./popover.module.scss";
import segmentedControl from "./segmented-control.module.scss";
import tabs from "./tabs.module.scss";
import title from "./title.module.scss";
import tooltip from "./tooltip.module.scss";

export const appColorsKeys = {
	primary: "primary",
	primaryAccent: "cyan",
	gray1: "asrrGray.1",
	gray2: "asrrGray.2",
	gray3: "asrrGray.3",
	gray4: "asrrGray.4",
	gray5: "asrrGray.5",
	black: "black",
	dark: "dark",
	white: "white",
	error: "red.8",
	inactive: "gray.6",
	blue: "blue",
	secondary: "yellow.6",
	secondaryAccent: "yellow.4",
	orange: "orange.6",
	success: "green.6",
	yellow: "yellow.5",
	indigo: "indigo.5",
} as const satisfies Record<string, MantineColor>;

export type AppColorKey = keyof typeof appColorsKeys;
export type ThemeColor = AppColorKey | MantineColor;

/**
 * A badge theme as a plain CSS colour, for anything that needs the hue itself
 * rather than a Mantine variant — a filter chip's tint, a chart series, a dot.
 * Accepts both app keys ("success") and Mantine names ("red.8", "blue").
 */
export const toneFromTheme = (theme: string): string => {
	if (theme in APP_COLORS) return APP_COLORS[theme as AppColorKey];
	const [name, shade = "5"] = theme.split(".");
	return `var(--mantine-color-${name}-${shade})`;
};

export const APP_COLORS: Record<AppColorKey, string> = {
	//Custom asrr gray colors
	gray1: "#A3A9B6",
	gray2: "#4A4C56",
	gray3: "#363638",
	gray4: "#1D1D1F",
	gray5: "#151517",
	primary: "#0969ff",
	primaryAccent: "#60A5FA",
	black: DEFAULT_THEME.black,
	dark: DEFAULT_THEME.colors.dark[7],
	white: DEFAULT_THEME.white,
	error: DEFAULT_THEME.colors.red[8],
	inactive: DEFAULT_THEME.colors.gray[6],
	blue: DEFAULT_THEME.colors.blue[6],
	secondary: DEFAULT_THEME.colors.yellow[6],
	secondaryAccent: DEFAULT_THEME.colors.yellow[4],
	orange: DEFAULT_THEME.colors.orange[6],
	success: DEFAULT_THEME.colors.green[6],
	yellow: DEFAULT_THEME.colors.yellow[5],
	indigo: DEFAULT_THEME.colors.indigo[5],
};

const hasOwn = Object.prototype.hasOwnProperty;

function isAppColorKey(color: unknown): color is AppColorKey {
	return typeof color === "string" && hasOwn.call(appColorsKeys, color);
}

export function resolveThemeColor(color: ThemeColor = "primary"): MantineColor {
	return isAppColorKey(color) ? appColorsKeys[color] : color;
}

/* The component board's motion: 120ms hover, 180ms open/close, one curve —
   and "only fades and 4px slides". Overlays therefore fade in from 4px below
   rather than popping. */
const BOARD_EASE = "cubic-bezier(0.2, 0, 0, 1)";

const boardFade: MantineTransition = {
	in: { opacity: 1, transform: "translateY(0)" },
	out: { opacity: 0, transform: "translateY(4px)" },
	transitionProperty: "opacity, transform",
};

const transitionProps: Partial<TransitionProps> = {
	transition: boardFade,
	duration: 180,
	timingFunction: BOARD_EASE,
	exitDuration: 120,
};

const FONT_FAMILY = "Poppins, system-ui, sans-serif";

const defaultInputSize: MantineSize = "sm";

/* Button measurements per board size. The board's "md" is the 36px control
   that lines up with a field — Mantine's `sm`, the theme default — so the
   board's sm / md / lg sit on Mantine's xs / sm / md. Radius grows with the
   size (8 / 10 / 12) but yields to an explicit `radius` prop. */
const BUTTON_SIZES: Record<string, Record<string, string>> = {
	xs: {
		"--button-height": "28px",
		"--button-padding-x": "12px",
		"--button-fz": "12px",
		"--button-radius": "8px",
	},
	sm: {
		"--button-height": "36px",
		"--button-padding-x": "16px",
		"--button-fz": "13px",
		"--button-radius": "10px",
	},
	md: {
		"--button-height": "44px",
		"--button-padding-x": "22px",
		"--button-fz": "15px",
		"--button-radius": "12px",
	},
	xxs: {
		"--button-height": "32px",
		"--button-padding-x": "16px",
		"--button-padding-y": "8px",
		"--button-fz": "10px",
	},
	xxxs: {
		"--button-height": "24px",
		"--button-padding-x": "16px",
		"--button-padding-y": "4px",
		"--button-fz": "10px",
	},
};

/* The board's status pill is a 14% wash of the hue with the design's coloured
   *text* token on top (--green-tx, --amber-tx, …), where Mantine's light
   variant puts the saturated hue itself — which disappears on the near-black
   card. Hues the board does not name fall through to Mantine's own. */
const BADGE_TEXT_TOKEN: Record<string, string> = {
	primary: "--blue-tx",
	blue: "--blue-tx",
	cyan: "--cyan-tx",
	teal: "--teal-tx",
	green: "--green-tx",
	red: "--red-tx",
	pink: "--pink-tx",
	orange: "--amber-tx",
	yellow: "--amber-tx",
	violet: "--violet-tx",
	grape: "--violet-tx",
	indigo: "--indigo-tx",
};

/* Mantine's outline pill is a full-strength 1px ring in the saturated hue,
   which on the dark card reads louder than the filled pill next to it. The
   board's outline keeps the text token and draws the ring at 35% of the hue. */
function lightBadgeTint(props: { color?: string; variant?: string }) {
	if (props.variant !== "light" && props.variant !== "outline") return {};
	const outline = props.variant === "outline";
	const [name, shade = "6"] = (props.color ?? "primary").split(".");
	if (name === "gray" || name === "asrrGray") {
		return outline
			? { "--badge-bd": "1px solid var(--w12)", "--badge-color": "var(--tx2)" }
			: { "--badge-bg": "var(--w05)", "--badge-color": "var(--tx2)" };
	}
	const token = BADGE_TEXT_TOKEN[name];
	if (!token) return {};
	const hue = `var(--mantine-color-${name}-${shade})`;
	return outline
		? {
				"--badge-bd": `1px solid color-mix(in srgb, ${hue} 35%, transparent)`,
				"--badge-color": `var(${token})`,
			}
		: {
				"--badge-bg": `color-mix(in srgb, ${hue} 14%, transparent)`,
				"--badge-color": `var(${token})`,
			};
}

function isTouchDevice() {
	return (
		typeof window !== "undefined" &&
		window.matchMedia?.("(pointer: coarse)").matches === true
	);
}

/**
 * Mantine's `TimePicker` — the time half of every `DateTimePicker` too — is two
 * `inputMode="numeric"` text fields. On a phone that means a keyboard and no way
 * to scroll to a time, while the date half has a full calendar: reported from
 * the field as "de tijd geen scroll optie".
 *
 * `withDropdown` adds the scrollable hour/minute list. On a touch device the
 * fields also get `inputMode: "none"`, because the on-screen keyboard would
 * otherwise slide up over that list — leaving typing as the only option again.
 * Pointer devices keep typing; they just gain the list as well.
 */
function timePickerDefaults() {
	if (!isTouchDevice()) return { withDropdown: true } as const;

	const noKeyboard = { inputMode: "none" } as const;
	return {
		withDropdown: true,
		hoursInputProps: noKeyboard,
		minutesInputProps: noKeyboard,
		secondsInputProps: noKeyboard,
	} as const;
}

export function createAppTheme(
	formatInfo: LocaleFormatInfo = DEFAULT_LOCALE_FORMAT,
	accentColor?: string,
) {
	return mergeMantineTheme(
		DEFAULT_THEME,
		createAppThemePartial(formatInfo, accentColor),
	);
}

function createAppThemePartial(
	formatInfo: LocaleFormatInfo,
	accentColor?: string,
) {
	const primaryColors = accentColor
		? generateColorPalette(accentColor)
		: undefined;
	return createTheme({
		cursorType: "pointer",
		defaultRadius: "10px",
		autoContrast: true,
		luminanceThreshold: 0.4,
		fontFamily: FONT_FAMILY,
		focusClassName: focus.focus,
		// The board's scale: 6 sm / 10 md / 14 lg. `xl` stays Mantine's 2rem —
		// it is what avatars and theme icons use to mean "round".
		radius: {
			xs: "4px",
			sm: "6px",
			md: "10px",
			lg: "14px",
			xl: "2rem",
		},
		// Elevation is for overlays only; cards carry a hairline instead. The
		// values live in globals.scss so they lose weight on light with the
		// rest of the token layer.
		shadows: {
			xs: "var(--shadow-xs)",
			sm: "var(--shadow-xs)",
			md: "var(--shadow-md)",
			lg: "var(--shadow-lg)",
			xl: "var(--shadow-lg)",
		},
		headings: {
			fontFamily: FONT_FAMILY,
			fontWeight: "600",
			sizes: {
				// Page title 24, section title 20, card title 16 — per the board.
				h1: { fontSize: "1.5rem", lineHeight: "1.2" },
				h2: { fontSize: "1.25rem", lineHeight: "1.25" },
				h3: { fontSize: "1rem", lineHeight: "1.3" },
				h4: { fontSize: "0.875rem" },
				h5: { fontSize: "0.75rem" },
				h6: { fontSize: "0.625rem" },
			},
		},
		fontSizes: {
			xxs: "0.625rem",
			xs: "0.75rem",
			sm: "0.875rem",
			md: "1rem",
			lg: "1.125rem",
			xl: "1.25rem",
		},
		breakpoints: {
			xs: "32rem",
			sm: "40rem",
			md: "48rem",
			lg: "64rem",
			xl: "80rem",
			xxl: "96rem",
		},
		colors: {
			primary: primaryColors ?? [
				"#e5f4ff",
				"#cde2ff",
				"#9bc2ff",
				"#64a0ff",
				"#3984fe",
				"#1d72fe",
				"#0969ff",
				// Shade 7 is what a filled button hovers to: the board's #0353d6.
				"#0353d6",
				"#004ecc",
				"#0043b5",
			],
			asrrGray: [
				"#FFFFFF",
				"#A3A9B6",
				"#4A4C56",
				"#363638",
				"#1D1D1F",
				"#151517",
				"#08090C",
				"#060709",
				"#040406",
				"#000000",
			],
			// Tailwind-derived scales so green/red/orange land on the design's
			// #22c55e / #ef4444 / #f59e0b accents instead of Mantine's defaults.
			green: [
				"#f0fdf4",
				"#dcfce7",
				"#bbf7d0",
				"#86efac",
				"#4ade80",
				"#22c55e",
				"#16a34a",
				"#15803d",
				"#166534",
				"#14532d",
			],
			red: [
				"#fef2f2",
				"#fee2e2",
				"#fecaca",
				"#fca5a5",
				"#f87171",
				"#ef4444",
				"#dc2626",
				"#b91c1c",
				"#991b1b",
				"#7f1d1d",
			],
			orange: [
				"#fffbeb",
				"#fef3c7",
				"#fde68a",
				"#fcd34d",
				"#fbbf24",
				"#f59e0b",
				"#d97706",
				"#b45309",
				"#92400e",
				"#78350f",
			],
		},
		primaryColor: "primary",
		primaryShade: 6,
		components: {
			ActionIcon: ActionIcon.extend({
				defaultProps: { size: defaultInputSize, variant: "subtle" },
				classNames: actionIcon,
			}),
			Alert: Alert.extend({
				defaultProps: { variant: "light", radius: "10px" },
				classNames: alert,
			}),
			Anchor: Anchor.extend({
				defaultProps: { c: "primary" },
				/* Anchor is a Text, so without a size Mantine renders it at `md`,
				   bigger than the sentence it sits in (an Alert, a `size="sm"`
				   Typography). Without a size it takes its surroundings' size. */
				vars: (_, props) => ({
					root: props.size === undefined ? { "--text-fz": "1em" } : {},
				}),
			}),
			Badge: Badge.extend({
				/* Sentence case — "Geaccepteerd", not "GEACCEPTEERD" — is set in
				   badge.module.scss; Mantine uppercases by default. */
				defaultProps: { size: "md" },
				classNames: badge,
				vars: (_, props) => {
					/* The board's pill: 4px 10px at 11px. Mantine's own `md` is a size
					   up from that, so the default carries the board's measurements
					   rather than every call site passing a size. */
					const size =
						props.size === "xxs"
							? {
									"--badge-height": "18px",
									"--badge-padding-x": "7px",
									"--badge-fz": "10px",
								}
							: {
									"--badge-height": "22px",
									"--badge-padding-x": "10px",
									"--badge-fz": "11px",
								};
					return { root: { ...size, ...lightBadgeTint(props) } };
				},
			}),
			Button: Button.extend({
				// A rounded rectangle is the board's default shape; a pill is
				// something a call site asks for with radius="xl".
				defaultProps: { size: "sm" },
				classNames: button,
				vars: (_, props) => {
					const { "--button-radius": radius, ...rest } =
						BUTTON_SIZES[props.size ?? defaultInputSize] ?? {};
					return {
						root:
							props.radius === undefined && radius
								? { ...rest, "--button-radius": radius }
								: rest,
					};
				},
			}),
			Checkbox: Checkbox.extend({
				classNames: { input: controls.checkboxInput },
				vars: (_, props) =>
					props.size
						? { root: {} }
						: {
								root: {
									"--checkbox-size": "17px",
									"--checkbox-radius": "5px",
								},
							},
			}),
			Radio: Radio.extend({
				classNames: { radio: controls.radioRadio },
				vars: (_, props) =>
					props.size
						? { root: {} }
						: {
								root: {
									"--radio-size": "17px",
									"--radio-icon-size": "7px",
								},
							},
			}),
			Switch: Switch.extend({
				classNames: {
					input: controls.switchInput,
					track: controls.switchTrack,
					thumb: controls.switchThumb,
				},
				vars: (_, props) =>
					props.size
						? { root: {} }
						: {
								root: {
									"--switch-width": "38px",
									"--switch-height": "22px",
									"--switch-thumb-size": "18px",
									"--switch-track-label-padding": "2px",
								},
							},
			}),
			// Every picker marks today (Mantine leaves it off): without it you
			// hunt for today's date in the grid each time you pick one. The
			// marking itself is styled in _mantine.scss.
			DatePicker: DatePicker.extend({
				defaultProps: {
					size: defaultInputSize,
					highlightToday: true,
				},
				classNames: input,
			}),
			DatePickerInput: DatePickerInput.extend({
				defaultProps: { highlightToday: true },
			}),
			DateInput: DateInput.extend({
				defaultProps: {
					size: defaultInputSize,
					highlightToday: true,
					rightSection: <ComboboxChevron />,
				},
				classNames: input,
			}),
			TimePicker: TimePicker.extend({
				defaultProps: {
					size: defaultInputSize,
					...timePickerDefaults(),
				},
			}),
			DateTimePicker: DateTimePicker.extend({
				defaultProps: {
					size: defaultInputSize,
					highlightToday: true,
					// A popover anchored under the field runs off the bottom of a phone
					// screen — calendar plus time row is taller than what is left below
					// the input, and the popover is fixed, so the time row cannot be
					// scrolled to. A centred modal keeps the whole picker reachable.
					dropdownType: isTouchDevice() ? "modal" : "popover",
					// Pickers are usually opened from inside a form modal, and two
					// Mantine modals share the same default z-index — without this the
					// picker renders *behind* the form it belongs to.
					modalProps: { zIndex: 400 },
					// Inside a DateTimePicker the time dropdown must NOT be portalled:
					// the calendar popover closes on any mousedown/touchstart outside
					// its own subtree, so a portalled time list would dismiss the whole
					// picker on the first tap — before you ever reach the minutes.
					timePickerProps: {
						...timePickerDefaults(),
						popoverProps: { withinPortal: false },
					},
				},
				classNames: input,
			}),
			Drawer: Drawer.extend({
				classNames: drawer,
				defaultProps: { position: "right" },
			}),
			Input: Input.extend({ classNames: input }),
			InputWrapper: InputWrapper.extend({
				// Label above the field, help text under it; an error replaces the
				// help text. Mantine's default puts the description above the field.
				defaultProps: {
					inputWrapperOrder: ["label", "input", "description", "error"],
				},
				classNames: {
					label: input.label,
					description: input.description,
					error: input.error,
				},
			}),
			// Cards sit on the default 10px radius; Card renders through Paper's
			// root styles, so one classNames covers both.
			Paper: Paper.extend({ classNames: paper }),
			Card: Card.extend({}),
			Modal: Modal.extend({
				defaultProps: {
					transitionProps: { ...transitionProps },
					centered: true,
					size: "xl",
					radius: "14px",
					scrollAreaComponent: ScrollArea.Autosize,
				},
				classNames: modal,
			}),
			Notification: Notification.extend({ classNames: notification }),
			NumberFormatter: NumberFormatter.extend({
				defaultProps: {
					decimalScale: 2,
					decimalSeparator: formatInfo.decimalSeparator,
					thousandSeparator: formatInfo.thousandSeparator,
				},
			}),
			// IMPORTANT: decimalSeparator and thousandSeparator are set here globally via locale.
			// Do NOT override these on individual NumberInput instances — mismatched separators crash the app.
			NumberInput: NumberInput.extend({
				defaultProps: {
					size: defaultInputSize,
					decimalScale: 2,
					decimalSeparator: formatInfo.decimalSeparator,
					thousandSeparator: formatInfo.thousandSeparator,
				},
				classNames: input,
			}),
			Popover: Popover.extend({
				defaultProps: { transitionProps },
				classNames: popover,
			}),
			HoverCard: HoverCard.extend({
				defaultProps: { transitionProps },
				classNames: popover,
			}),
			Menu: Menu.extend({
				defaultProps: { transitionProps },
				classNames: popover,
			}),
			NavLink: NavLink.extend({ classNames: navLink }),
			ScrollArea: ScrollArea.extend({
				defaultProps: {
					type: "hover",
					scrollbarSize: 8,
					offsetScrollbars: false,
				},
			}),
			SegmentedControl: SegmentedControl.extend({
				classNames: segmentedControl,
				defaultProps: { size: defaultInputSize },
				vars: (_, props) => {
					if (props.size === "xxs") {
						return {
							root: {
								"--sc-padding": "8px",
								"--sc-font-size": "10px",
							},
						};
					}
					// The board's segmented control: 3px inset, 12px labels, radius 10.
					return {
						root: {
							"--sc-padding": "3px",
							"--sc-font-size": "12px",
							"--sc-radius": "10px",
						},
					};
				},
			}),
			Skeleton: Skeleton.extend({ defaultProps: { radius: "6px" } }),
			Table: Table.extend({ classNames: mantineTable }),
			Tabs: Tabs.extend({ classNames: tabs }),
			Title: Title.extend({ classNames: title }),
			Select: Select.extend({
				defaultProps: {
					size: defaultInputSize,
					comboboxProps: { transitionProps },
					rightSection: <ComboboxChevron />,
				},
				classNames: input,
				vars: (_, props) => {
					if (props.size === "xxs") {
						return {
							root: {},
							input: {
								"--input-padding-y": "4px",
								"--input-height": "24px",
								"--input-padding-inline-start": "8px",
								"--input-padding-inline-end": "8px",
							},
						};
					}
					return { root: {} };
				},
			}),
			ThemeIcon: ThemeIcon.extend({
				defaultProps: {
					size: "xs",
					variant: "transparent",
					color: "gray",
				},
			}),
			Tooltip: Tooltip.extend({
				defaultProps: {
					//Prevent mantine overlapping tool tip issue
					openDelay: 200,
					closeDelay: 100,
					transitionProps: {
						transition: "fade",
						duration: 120,
						timingFunction: BOARD_EASE,
					},
				},
				classNames: tooltip,
			}),
		},
	});
}

export const theme = createAppTheme(DEFAULT_LOCALE_FORMAT);

/**
 * Generates a 10-shade Mantine color tuple from a single hex color.
 * Produces lighter shades (index 0) to darker shades (index 9) with the input color at index 6.
 */
export function generateColorPalette(
	hex: string,
): [
	string,
	string,
	string,
	string,
	string,
	string,
	string,
	string,
	string,
	string,
] {
	const r = Number.parseInt(hex.slice(1, 3), 16);
	const g = Number.parseInt(hex.slice(3, 5), 16);
	const b = Number.parseInt(hex.slice(5, 7), 16);

	const lighten = (value: number, factor: number) =>
		Math.round(value + (255 - value) * factor);
	const darken = (value: number, factor: number) =>
		Math.round(value * (1 - factor));
	const toHex = (rv: number, gv: number, bv: number) =>
		`#${rv.toString(16).padStart(2, "0")}${gv.toString(16).padStart(2, "0")}${bv.toString(16).padStart(2, "0")}`;

	const lightFactors = [0.9, 0.78, 0.65, 0.5, 0.35, 0.2];
	const darkFactors = [0.0, 0.12, 0.25, 0.4];

	return [
		...lightFactors.map((f) =>
			toHex(lighten(r, f), lighten(g, f), lighten(b, f)),
		),
		...darkFactors.map((f) => toHex(darken(r, f), darken(g, f), darken(b, f))),
	] as [
		string,
		string,
		string,
		string,
		string,
		string,
		string,
		string,
		string,
		string,
	];
}

export const resolver: CSSVariablesResolver = (_theme) => ({
	variables: {},
	light: {
		"--mantine-color-body": "var(--light-bg-primary)",
		// The board's "default" surface — a secondary button, a default action
		// icon — is transparent with a hairline, and hovers to a --w05 wash.
		"--mantine-color-default-border": "var(--w07)",
		"--mantine-color-default-hover": "var(--w05)",
		"--mantine-color-default": "transparent",
		"--mantine-color-text": "var(--light-text-primary)",
		"--mantine-color-dimmed": "var(--light-text-tertiary)",
		// Mantine defaults this to its own gray-5 (#adb5bd) — 2.07:1 on a white
		// field, i.e. gone on a poor screen. --input-placeholder is the design's
		// own field-affordance colour, nudged just far enough down the --tx3 →
		// --tx2 ramp to clear AA on the tinted field (see input.module.scss).
		"--mantine-color-placeholder": "var(--input-placeholder)",
	},
	dark: {
		"--mantine-color-body": "var(--gray-9)",
		// Hairlines are --w07 everywhere on the board; `--mantine-color-default`
		// used to point at --gray-6, which globals.scss never defines.
		"--mantine-color-default-border": "var(--w07)",
		"--mantine-color-default-hover": "var(--w05)",
		"--mantine-color-default": "transparent",
		// Primary text is --tx (#E8EAED), not pure white.
		"--mantine-color-text": "var(--tx)",
		"--mantine-color-dimmed": "var(--gray-1)",
	},
});
