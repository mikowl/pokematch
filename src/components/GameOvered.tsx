import { scoringMessages, convertScoreToGrade, pewpewpew, timeClass } from "../utils";
import { TOTAL_GENS } from "../api";
import { Pokemon } from "../types/pokemon";
import { GameData } from "../types/other";
import { useEffect, useState } from "preact/hooks";
import ClockIcon from "./Icons/Clock";
import { playSoundEffect } from "../sounds";
import { randomPower } from "./Powerups";

const GameOvered = ({
	gameState,
	setGameState,
	deck,
	handleRestart,
	roundTime,
}: {
	gameState: GameData;
	setGameState: Function;
	deck: Pokemon[];
	handleRestart: () => void;
	roundTime: number | string;
}) => {
	const { boardSize, gen, mute, powerUps, totalTurns, turns } = gameState;
	// 0 = no guess, 1 = correct guess, 2 = incorrect guess
	const [batttleGuess, setBattleGuess] = useState<number>(0);
	// const [averageTime, setAverageTime] = useState<string[]>([]);

	const averageScore: number = ((TOTAL_GENS * deck.length) / 2 / totalTurns) * 100 * 1.5;

	useEffect(() => {
		// if (gen !== TOTAL_GENS) {
		// 	playSoundEffect("success", mute);
		// }
		// game over music and fireworks
		if (gen === TOTAL_GENS) {
			pewpewpew();
			playSoundEffect("gameOver", mute);
		}
		// setAverageTime((prev) => [...prev, String(roundTime)]);
		// console.log(averageTime);
		const lis = document.querySelectorAll<HTMLLIElement>(".pokeCaught");

		// add winner class to poke with highest stats
		let highestStat = -Infinity;
		let winner: HTMLLIElement | undefined;
		for (const pc of lis) {
			const stats = pc.dataset.stats;
			if (stats) {
				const statNum = parseInt(stats, 10);
				if (statNum > highestStat) {
					highestStat = statNum;
					winner = pc;
				}
			}
		}
		if (winner) {
			winner.dataset.winner = "true";
		}

		let i = 0;
		const intervalId = setInterval(() => {
			setTimeout(() => {
				if (i >= lis.length) {
					clearInterval(intervalId);
					return;
				}
				lis[i].classList.add("active");
				i++;
			}, 500);
		}, 300);
		return () => clearInterval(intervalId);
	}, [gameState, gen, mute]);

	const handleWinnerGuess = (e: MouseEvent) => {
		const currentTarget = e.currentTarget as HTMLLIElement;
		if (currentTarget && currentTarget.dataset.winner === "true") {
			currentTarget.classList.add("animate-contrast", "winner");
			// play success2 sound
			playSoundEffect("success2", mute);
			setBattleGuess(1);
			setTimeout(() => {
				setGameState({
					...gameState,
					gameWin: false,
					gen: gen + 1,
					powerUps: [...powerUps, randomPower()],
				});
			}, 3000);
		} else {
			playSoundEffect("fail", mute);
			// user can only guess once
			setTimeout(() => {
				setGameState({
					...gameState,
					gameWin: false,
					gen: gen + 1,
				});
			}, 3000);
			setBattleGuess(2);
		}
	};

	const getBattleMessage = () => {
		if (batttleGuess === 0) {
			return (
				<p className="guess guessimate wave">
					<i>Guess</i> <i>who'd</i> <i>win</i> <i>in</i> <i>a</i> <i>battle</i> <i>to</i>{" "}
					<i>receive</i> <i>a</i> <i>powerup</i>
				</p>
			);
		}
		if (batttleGuess === 1) {
			return (
				<p className="guess correct">
					Correct!
					<br /> Reveal powerup obtained!
				</p>
			);
		}
		return (
			<p className="guess incorrect">
				Incorrect.
				<br /> Try again next round!
			</p>
		);
	};

	// we need to do this funky thing to ensure we only show unique pokemon
	// we stringify the pokemon object and then parse it back to an object
	// this way we can compare the objects
	const uniquePokemon = [...new Set(deck.map((pokemon) => JSON.stringify(pokemon)))].map(
		(pokemon) => JSON.parse(pokemon)
	);

	return (
		<>
			<div className={`gameOvered ${gen === 9 ? "game-complete" : ""}`}>
				<h2>{gen === TOTAL_GENS ? "Game Over!" : "You caught 'em all!"}</h2>
				<div className="pokemonList">
					<h3>Pokemon's Caught: </h3>
					<div
						className={`battle ${batttleGuess === 2 || gen === TOTAL_GENS ? "not-allowed" : ""}`}
					>
						{gen !== TOTAL_GENS && getBattleMessage()}
						<ul className={`pokesCaught bs-${boardSize}`}>
							{uniquePokemon.map((pokemon, i) => (
								<li
									key={`${pokemon.id}-${i}`}
									className={`pokeCaught`}
									data-stats={pokemon.stats.reduce(
										(acc: number, curr: { base_stat: number }) => acc + curr.base_stat,
										0
									)}
									onClick={batttleGuess === 0 && TOTAL_GENS !== gen ? handleWinnerGuess : undefined}
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
				</div>
				<p
					className="scoringMessage"
					// eslint-disable-next-line react/no-danger
					dangerouslySetInnerHTML={{ __html: scoringMessages(turns, boardSize) }}
				/>
				<small className={`time ${timeClass(boardSize, roundTime)}`}>
					<ClockIcon size={24} fill="#FFF" />
					{roundTime}
				</small>
				{/* GAME COMPLETE */}
				{gen === TOTAL_GENS && (
					<p className="gameOveredMessage">
						All 9 generations complete! <br /> score:{" "}
						<strong>{convertScoreToGrade(averageScore)}</strong>
						<button className={"btn restart"} onClick={handleRestart}>
							Play again?
						</button>
					</p>
				)}
			</div>
		</>
	);
};

export default GameOvered;
