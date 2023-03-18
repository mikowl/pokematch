import { IconProps } from "../../types/other";

const Star = (props: IconProps) => {
	const size = props.size ?? 32;
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			version="1.1"
			width={size}
			height={size}
			style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd"
		>
			<g>
				<path
					fill={props.fill}
					d="M 41.5,2.5 C 43.5,2.5 45.5,2.5 47.5,2.5C 47.5,4.5 47.5,6.5 47.5,8.5C 48.5,8.5 49.5,8.5 50.5,8.5C 50.5,10.5 50.5,12.5 50.5,14.5C 51.5,14.5 52.5,14.5 53.5,14.5C 53.5,16.5 53.5,18.5 53.5,20.5C 54.5,20.5 55.5,20.5 56.5,20.5C 56.5,22.5 56.5,24.5 56.5,26.5C 57.5,26.5 58.5,26.5 59.5,26.5C 59.5,27.5 59.5,28.5 59.5,29.5C 67.5,29.5 75.5,29.5 83.5,29.5C 83.5,31.5 83.5,33.5 83.5,35.5C 81.5,35.5 79.5,35.5 77.5,35.5C 77.5,37.5 77.5,39.5 77.5,41.5C 75.5,41.5 73.5,41.5 71.5,41.5C 71.5,43.5 71.5,45.5 71.5,47.5C 69.5,47.5 67.5,47.5 65.5,47.5C 65.5,51.5 65.5,55.5 65.5,59.5C 66.5,59.5 67.5,59.5 68.5,59.5C 68.5,61.5 68.5,63.5 68.5,65.5C 69.5,65.5 70.5,65.5 71.5,65.5C 71.5,67.5 71.5,69.5 71.5,71.5C 72.5,71.5 73.5,71.5 74.5,71.5C 74.5,73.5 74.5,75.5 74.5,77.5C 70.5,77.5 66.5,77.5 62.5,77.5C 62.5,75.5 62.5,73.5 62.5,71.5C 59.5,71.5 56.5,71.5 53.5,71.5C 53.5,69.5 53.5,67.5 53.5,65.5C 47.5,65.5 41.5,65.5 35.5,65.5C 35.5,67.5 35.5,69.5 35.5,71.5C 32.5,71.5 29.5,71.5 26.5,71.5C 26.5,73.5 26.5,75.5 26.5,77.5C 22.5,77.5 18.5,77.5 14.5,77.5C 14.5,75.5 14.5,73.5 14.5,71.5C 15.5,71.5 16.5,71.5 17.5,71.5C 17.5,69.5 17.5,67.5 17.5,65.5C 18.5,65.5 19.5,65.5 20.5,65.5C 20.5,63.5 20.5,61.5 20.5,59.5C 21.5,59.5 22.5,59.5 23.5,59.5C 23.5,55.5 23.5,51.5 23.5,47.5C 21.5,47.5 19.5,47.5 17.5,47.5C 17.5,45.5 17.5,43.5 17.5,41.5C 15.5,41.5 13.5,41.5 11.5,41.5C 11.5,39.5 11.5,37.5 11.5,35.5C 9.5,35.5 7.5,35.5 5.5,35.5C 5.5,33.5 5.5,31.5 5.5,29.5C 13.5,29.5 21.5,29.5 29.5,29.5C 29.5,28.5 29.5,27.5 29.5,26.5C 30.5,26.5 31.5,26.5 32.5,26.5C 32.5,24.5 32.5,22.5 32.5,20.5C 33.5,20.5 34.5,20.5 35.5,20.5C 35.5,18.5 35.5,16.5 35.5,14.5C 36.5,14.5 37.5,14.5 38.5,14.5C 38.5,12.5 38.5,10.5 38.5,8.5C 39.5,8.5 40.5,8.5 41.5,8.5C 41.5,6.5 41.5,4.5 41.5,2.5 Z"
				/>
			</g>
		</svg>
	);
};

export default Star;
