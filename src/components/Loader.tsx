import { type FunctionalComponent } from "preact";

type LoaderProps = {
	pokeball?: boolean;
};

const Loader: FunctionalComponent<LoaderProps> = ({ pokeball = true }) => {
	if (pokeball) {
		return (
			<>
				<img
					src="/img/pokeball.svg"
					alt="Loading..."
					className="poke-load animate-spin"
					width="32"
					height="32"
				/>
			</>
		);
	}
	return (
		<div role="status">
			<svg className="spinner" viewBox="0 0 50 50">
				<circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="6" />
			</svg>
		</div>
	);
};
export default Loader;
