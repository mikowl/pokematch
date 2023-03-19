import { IconProps } from "../../types/other";

const Refresh = (props: IconProps) => {
	const size = props.size ?? 32;
	return (
		<svg
			version="1.0"
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox="0 0 297.000000 297.000000"
			preserveAspectRatio="xMidYMid meet"
		>
			<g
				transform="translate(0.000000,297.000000) scale(0.100000,-0.100000)"
				fill={props.fill}
				stroke="none"
			>
				<path d="M0 2335 l0 -635 635 0 635 0 0 210 0 210 -212 2 -213 3 -3 213 -2 212 645 0 645 0 0 -210 0 -210 210 0 210 0 0 -645 0 -645 -210 0 -210 0 0 -210 0 -210 -645 0 -645 0 0 210 0 210 -210 0 -210 0 0 -210 0 -210 210 0 210 0 0 -210 0 -210 645 0 645 0 0 210 0 210 210 0 210 0 0 210 0 210 210 0 210 0 0 645 0 645 -210 0 -210 0 0 210 0 210 -210 0 -210 0 0 210 0 210 -645 0 -645 0 0 -210 0 -210 -210 0 -210 0 0 210 0 210 -210 0 -210 0 0 -635z" />
			</g>
		</svg>
	);
};

export default Refresh;
