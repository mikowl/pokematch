import { IconProps } from "../../types/other";

const UnmuteIcon = (props: IconProps) => {
	const size = props.size ?? 32;
	return (
		<svg
			className="icon-mute"
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox={`0 0 512 512`}
		>
			<title>Unmute</title>
			<path
				fill={props.fill}
				d="M211 0L211 33L178 33L178 66L144 66L144 100L111 100L111 133L33 133L33 166L0 166L0 346L33 346L33 379L111 379L111 412L144 412L144 446L178 446L178 479L211 479L211 512L279 512L279 479L312 479L312 33L279 33L279 0L211 0z"
			/>
			<path
				fill={props.fill}
				d="M478 77L478 435L512 435L512 77L478 77M411 122L411 390L446 390L446 122L411 122M345 178L345 334L379 334L379 178L345 178z"
			/>
		</svg>
	);
};

export default UnmuteIcon;
