import { TOTAL_GENS } from "../api";
import Pokeball from "./Icons/Pokeball";
import { JSX } from "preact";

const StartScreen = ({
	handleDifficulty,
}: {
	handleDifficulty: JSX.MouseEventHandler<HTMLButtonElement>;
}) => {
	return (
		<>
			<p className={"instructions"}>
				Match the Pokemon, complete all {TOTAL_GENS} generations to win!
				<br />
				Every round is unique!
				<br />
			</p>
			<div className={"difficulty"}>
				<h2 className={"gor-animation"}>Choose Difficulty:</h2>
				{/* <p>Hard recommended for desktop only</p> */}
				<button className={"btn easy"} onClick={handleDifficulty} value="12">
					Easy
				</button>
				<button className={"btn medium"} onClick={handleDifficulty} value="16">
					Medium
				</button>
				<button className={"btn hard"} onClick={handleDifficulty} value="20">
					Hard
				</button>
				<div className="powerup-descriptions">
					<div>
						<Pokeball className="turns-color" />
						<p>-2 turns</p>
					</div>
					<div>
						<Pokeball className="reveal-color" />
						<p>Reveal all</p>
					</div>
					<div>
						<Pokeball className="time-color" />
						<p>-7 seconds</p>
					</div>
					<div>
						<Pokeball className="matchSet-color" />
						<p>Match a set</p>
					</div>
					<div>
						<Pokeball className="flipAllCards-color" />
						<p>Flip all cards</p>
					</div>
				</div>
				{import.meta.env.VITE_DEBUG == "TRUE" && (
					<>
						<br />
						<br />
						<br />
						<button className={"btn dbg"} onClick={handleDifficulty} value="4">
							Debug
						</button>
					</>
				)}
			</div>
		</>
	);
};

export default StartScreen;
