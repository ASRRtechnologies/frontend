import s from "./bar-loader.module.scss";

type BarLoaderProps = {
	isLoading?: boolean;
	type?: "relative" | "absolute";
};

export const BarLoader = ({ isLoading, type = "absolute" }: BarLoaderProps) => {
	return (
		<span
			data-type={type}
			data-is-loading={isLoading}
			className={s.container}
		/>
	);
};
