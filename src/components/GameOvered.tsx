import { scoringMessages, pewpewpew, TOTAL_GENS } from "../utils";
import { Pokemon, PokemonGeneration } from "../types/pokemon";
import { useEffect, useState } from "preact/hooks";

const GameOvered = ({
	gameWin,
	deck,
	handleNextGame,
	handleRestart,
	turns,
	totalTurns,
	gen,
	mute,
}: {
	gameWin: boolean;
	deck: Pokemon[];
	handleNextGame: () => void;
	handleRestart: () => void;
	turns: number;
	totalTurns: number;
	gen: PokemonGeneration;
	mute: boolean;
}) => {
	const [activeIndex, setActiveIndex] = useState(-1);
	const successSound = new Audio("/success.mp3");

	useEffect(() => {
		if (gameWin && !mute) {
			successSound.currentTime = 0;
			successSound.play();
		}
		{
			gen === TOTAL_GENS && pewpewpew();
		}
		const lis = document.querySelectorAll(".pokeCaught");
		let i = 0;
		const intervalId = setInterval(() => {
			if (i >= lis.length) {
				clearInterval(intervalId);
				return;
			}
			lis[i].classList.add("active");
			setActiveIndex((prevIndex) => i);
			i++;
		}, 500);
		return () => clearInterval(intervalId);
	}, [deck, gameWin]);

	const averageScore = ((TOTAL_GENS * deck.length) / 2 / totalTurns) * 100;

	return (
		<>
			<div className={`gameOvered ${gen === 9 ? "game-complete" : ""}`}>
				<h2>
					You caught <span>em</span> all!
				</h2>
				<div className="pokemonList">
					<h3>Pokemon's Caught: </h3>
					<ul className="pokesCaught">
						{deck &&
							[...new Set(deck)].map((pokemon) => (
								<li
									key={pokemon.id}
									className={`pokeCaught${activeIndex === pokemon.id ? " active" : ""}`}
								>
									<img
										src={pokemon.sprites.front_default}
										alt={pokemon.name}
										width="96"
										height="96"
									/>
									<p>{pokemon.name}</p>
								</li>
							))}
					</ul>
				</div>
				<p className="scoringMessage">{scoringMessages(turns)}</p>

				{gen === TOTAL_GENS ? (
					<p className="gameOveredMessage">
						You have completed all 9 generations of Pokemon! Your score:{" "}
						<strong>{(averageScore * 1.5).toFixed()}%</strong>
						<button className={"btn restart"} onClick={handleRestart}>
							Play again?
						</button>
					</p>
				) : (
					<>
						<button className={"btn nextGame"} onClick={handleNextGame}>
							Start Gen {gen + 1}!
						</button>
					</>
				)}
			</div>
		</>
	);
};

export default GameOvered;
