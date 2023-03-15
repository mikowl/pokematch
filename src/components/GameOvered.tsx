import { scoringMessages, pewpewpew, TOTAL_GENS } from "../utils";
import { Pokemon } from "../types/pokemon";
import { GameData } from "../types/other";
import { useEffect, useState } from "preact/hooks";

const GameOvered = ({
	gameState,
	deck,
	handleNextGame,
	handleRestart,
	boardSize,
	roundTime,
}: {
	gameState: GameData;
	deck: Pokemon[];
	handleNextGame: () => void;
	handleRestart: () => void;
	boardSize: number;
	roundTime: number | string;
}) => {
	const [activeIndex, setActiveIndex] = useState(-1);
	const successSound = new Audio("/success.mp3");

	useEffect(() => {
		if (gameState.gameWin && !gameState.mute) {
			successSound.currentTime = 0;
			successSound.play();
		}
		{
			gameState.gen === TOTAL_GENS && pewpewpew();
		}
		const lis = document.querySelectorAll(".pokeCaught");
		let i = 0;
		const intervalId = setInterval(() => {
			setTimeout(() => {
				if (i >= lis.length) {
					clearInterval(intervalId);
					return;
				}
				lis[i].classList.add("active");
				setActiveIndex(activeIndex + 1);
				i++;
			}, 500);
		}, 300);
		return () => clearInterval(intervalId);
	}, [deck, gameState.gameWin]);

	const averageScore = ((TOTAL_GENS * deck.length) / 2 / gameState.totalTurns) * 100;

	return (
		<>
			<div className={`gameOvered ${gameState.gen === 9 ? "game-complete" : ""}`}>
				<h2>{gameState.gen === TOTAL_GENS ? "Game Over!" : "You caught 'em all!"}</h2>
				<div className="pokemonList">
					<h3>Pokemon's Caught: </h3>
					<ul className={`pokesCaught bs-${boardSize}`}>
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
				<p className="scoringMessage">{scoringMessages(gameState.turns)}</p>

				{gameState.gen === TOTAL_GENS ? (
					<p className="gameOveredMessage">
						You have completed all 9 generations of Pokemon! <br /> score:{" "}
						<strong>{(averageScore * 1.5).toFixed()}%</strong>
						<button className={"btn restart"} onClick={handleRestart}>
							Play again?
						</button>
					</p>
				) : (
					<>
						<small className="time">Time: {roundTime}</small>
						<button className={"btn nextGame"} onClick={handleNextGame}>
							Start Gen {gameState.gen + 1}!
						</button>
					</>
				)}
			</div>
		</>
	);
};

export default GameOvered;
