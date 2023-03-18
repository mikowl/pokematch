import { scoringMessages, pewpewpew, timeToSeconds } from "../utils";
import { TOTAL_GENS } from "../api";
import { Pokemon } from "../types/pokemon";
import { GameData } from "../types/other";
import { useEffect, useState } from "preact/hooks";
import ClockIcon from "./Icons/Clock";

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
	const { boardSize, powerUps, gen, turns } = gameState;
	// 0 = no guess, 1 = correct guess, 2 = incorrect guess
	const [batttleGuess, setBattleGuess] = useState<number>(0);
	const averageScore: number = ((TOTAL_GENS * deck.length) / 2 / gameState.totalTurns) * 100 * 1.5;
	const convertScoreToGrade = (score: number) => {
		if (score >= 96) return "A+";
		if (score >= 93) return "A";
		if (score >= 90) return "A-";
		if (score >= 86) return "B+";
		if (score >= 83) return "B";
		if (score >= 80) return "B-";
		if (score >= 76) return "C+";
		if (score >= 73) return "C";
		if (score >= 70) return "C-";
		if (score >= 66) return "D+";
		if (score >= 63) return "D";
		if (score >= 60) return "D-";
		return "F";
	};

	useEffect(() => {
		const gameOverSound = new Audio("/gameover.mp3");
		if (gameState.gen === TOTAL_GENS) {
			pewpewpew();
			if (!gameState.mute) {
				gameOverSound.currentTime = 0;
				gameOverSound.play();
			}
		}

		const successSound = new Audio("/success.mp3");
		if (gameState.gameWin && !gameState.mute && gameState.gen !== TOTAL_GENS) {
			successSound.currentTime = 0;
			successSound.play();
		}
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
	}, [gameState]);

	const timeClass = () => {
		if (boardSize <= 12) {
			if (timeToSeconds(roundTime) <= 20) return "fiyahhh flash";
			if (timeToSeconds(roundTime) <= 26) return "flash";
			return;
		}
		if (boardSize <= 16) {
			if (timeToSeconds(roundTime) < 40) return "fiyahhh flash";
			if (timeToSeconds(roundTime) <= 43) return "flash";
		}
	};

	const handleWinnerGuess = (e: MouseEvent) => {
		const currentTarget = e.currentTarget as HTMLLIElement;
		if (currentTarget && currentTarget.dataset.winner === "true" && batttleGuess === 0) {
			currentTarget.classList.add("animate-contrast", "winner");
			setBattleGuess(1);
			// play success2 sound
			const successSound = new Audio("/success2.mp3");
			if (!gameState.mute) {
				successSound.currentTime = 0;
				successSound.play();
			}
			setTimeout(() => {
				setGameState({
					...gameState,
					startTime: Date.now(),
					gen: gen + 1,
					powerUps: powerUps + 1,
				});
			}, 3000);
		} else {
			// user can only guess once
			setTimeout(() => {
				setGameState({
					...gameState,
					startTime: Date.now(),
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

	return (
		<>
			<div className={`gameOvered ${gameState.gen === 9 ? "game-complete" : ""}`}>
				<h2>{gameState.gen === TOTAL_GENS ? "Game Over!" : "You caught 'em all!"}</h2>
				<div className="pokemonList">
					<h3>Pokemon's Caught: </h3>
					<div className={`battle ${batttleGuess === 2 ? "not-allowed" : ""}`}>
						{gameState.gen !== TOTAL_GENS && getBattleMessage()}
						<ul className={`pokesCaught bs-${boardSize}`}>
							{deck &&
								[...new Set(deck)].map((pokemon) => (
									<li
										key={pokemon.id}
										className={`pokeCaught`}
										data-stats={pokemon.stats.reduce((acc, curr) => acc + curr.base_stat, 0)}
										onClick={handleWinnerGuess}
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
					dangerouslySetInnerHTML={{ __html: scoringMessages(turns, boardSize) }}
				/>
				<small className={`time ${timeClass()}`}>
					<ClockIcon size={24} fill="#FFF" />
					{roundTime}
				</small>
				{/* GAME COMPLETE */}
				{gameState.gen === TOTAL_GENS && (
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
