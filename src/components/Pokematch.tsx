import { useCallback, useEffect, useState } from "preact/hooks";
import { formatTime, range } from "../utils";
import { usePokemon, TOTAL_GENS } from "../api";
import PokeCard from "./PokeCard";
import { Pokemon } from "../types/pokemon";
import { GameData } from "../types/other";
import { UseQueryResult } from "@tanstack/react-query";
import Loader from "./Loader";
import GameOvered from "./GameOvered";
import MuteButton from "./MuteButton";
import Pokeball from "./Icons/Pokeball";
import Refresh from "./Icons/Refresh";
import Header from "./Header";

type PokemonData = UseQueryResult<Pokemon[], Error>;

export default function Pokematch() {
	const getInitialGameState = (): GameData => {
		const APP_VERSION = "1.7";
		if (localStorage.getItem("appVersion") !== String(APP_VERSION)) {
			// Clear localStorage
			localStorage.clear();
			console.log("game updated, clearing local storage...");
			// Update app version
			localStorage.setItem("appVersion", String(APP_VERSION));
		}
		const gameStateFromLocalStorage = localStorage.getItem("gameState");
		if (gameStateFromLocalStorage !== null) {
			return JSON.parse(gameStateFromLocalStorage);
		}

		return {
			turns: 0,
			totalTurns: 0,
			totalCaught: 0,
			gameWin: false,
			gen: 1,
			mute: false,
			difficulty: 0,
			boardSize: 0,
			startTime: 0,
			powerUps: 0,
		};
	};

	const [gameState, setGameState] = useState<GameData>(getInitialGameState());
	const { gen, gameWin, boardSize, powerUps } = gameState;

	const { data, isLoading, isFetching, error, refetch }: PokemonData = usePokemon(gen, boardSize);
	const [deck, setDeck] = useState<Pokemon[]>([]);

	const [roundTime, setRoundTime] = useState<number | string>(0);
	console.log("is fetching: ", isFetching, "is loading: ", isLoading);
	const refetchData = async () => {
		await refetch();
	};

	if (data && !isLoading) {
		setDeck(data);
	}

	const handleDifficulty = (e: MouseEvent) => {
		const target = e.target as HTMLInputElement;
		const board_size = parseInt(target.value, 10);
		setGameState({
			...gameState,
			startTime: Date.now(),
			boardSize: board_size,
		});
	};

	const reset = () => {
		if (data) setDeck(data);
		setGameState({
			...gameState,
			startTime: Date.now(),
			turns: 0,
			gameWin: false,
		});
		const cards = document.querySelectorAll(".card-btn");
		cards.forEach((card) => card.classList.remove("flipped"));
	};

	// after difficulty is chosen and board size is set, get data
	useEffect(() => {
		refetchData().then(() => {
			reset();
		});
	}, [boardSize]);

	const handleRestart = () => {
		setGameState({
			...gameState,
			difficulty: 0,
			turns: 0,
			totalTurns: 0,
			totalCaught: 0,
			gen: 1,
			boardSize: 0,
			powerUps: 0,
		});
	};

	useEffect(() => {
		refetchData().then(() => {
			reset();
		});
		// update game state in local storage
		localStorage.setItem("gameState", JSON.stringify(gameState));
	}, [gen]);

	useEffect(() => {
		const roundTime = formatTime(Date.now() - gameState.startTime);
		setRoundTime(roundTime);
		const body = document.querySelector("body");
		gameWin ? body?.classList.add("game-over") : body?.classList.remove("game-over");
	}, [gameState.startTime, gameWin]);

	const handlePowerUp = useCallback(() => {
		// power up will temporarily show all cards
		const cards = document.querySelectorAll(".card-btn");
		// only add reveal class to cards that are not flipped
		cards.forEach((card) => {
			if (!card.classList.contains("flipped")) {
				card.classList.add("reveal");
			}
		});
		setGameState({
			...gameState,
			powerUps: powerUps - 1,
		});

		setTimeout(() => {
			cards.forEach((card) => card.classList.remove("reveal"));
		}, 1500);
	}, [gameState, powerUps]);

	// use power up on spacebar press
	useEffect(() => {
		const handleSpacebar = (e: KeyboardEvent) => {
			if (e.code === "Space" && powerUps > 0 && gameWin === false) {
				e.preventDefault();
				handlePowerUp();
			}
		};
		document.addEventListener("keydown", handleSpacebar);
		return () => {
			document.removeEventListener("keydown", handleSpacebar);
		};
	}, [gameWin, handlePowerUp, powerUps]);

	let content;

	if (boardSize === 0) {
		content = (
			<>
				<p className={"instructions"}>
					Match the Pokemon, complete all {TOTAL_GENS} generations to win!
					<br />
					Every round is unique!
					<br />
				</p>
				<div className={"difficulty"}>
					<h2 className={"blue-flash"}>Choose Difficulty:</h2>
					<button className={"btn easy"} onClick={handleDifficulty} value="12">
						Easy
					</button>
					<button className={"btn medium"} onClick={handleDifficulty} value="16">
						Medium
					</button>
					<button className={"btn hard"} onClick={handleDifficulty} value="20">
						Hard
					</button>
					<p>Hard recommended for desktop only</p>
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
					<p className="tip">Tip: Press spacebar to use power ups</p>
				</div>
			</>
		);
	} else if (isFetching || isLoading) {
		content = <Loader pokeball={true} />;
	} else if (error) {
		content = (
			<p className={"error"}>
				{" "}
				Oh dang, something went wrong <br /> {error}{" "}
			</p>
		);
	} else {
		content = (
			<>
				<div className={`card-container deckgen-${gen} bs-${boardSize}`}>
					{deck && <PokeCard pokemons={deck} gameState={gameState} setGameState={setGameState} />}
				</div>
				{deck && (
					<div className={`footerkinda ${gameWin ? "hide" : ""}`}>
						<button
							className={"power-ups"}
							onClick={handlePowerUp}
							{...(powerUps === 0 ? { disabled: true } : {})}
						>
							<span>Powerups</span>
							{powerUps > 0 ? (
								<>
									{range(powerUps).map((i) => (
										<Pokeball key={i + 1} />
									))}
								</>
							) : (
								0
							)}
						</button>
						<div class="restart-container">
							<button className={"btn refresh"} onClick={handleRestart}>
								<Refresh size={26} fill="#fff" />
								<br />
							</button>
							<span>Restart</span>
						</div>
						<MuteButton gameState={gameState} setGameState={setGameState} />
					</div>
				)}
				{gameWin && (
					<GameOvered
						gameState={gameState}
						setGameState={setGameState}
						deck={deck}
						handleRestart={handleRestart}
						roundTime={roundTime}
					/>
				)}
			</>
		);
	}

	return (
		<>
			<Header gameState={gameState} isFetching={isFetching} />
			<div className={`gcolor${gen}`}>
				<h1>
					Pokematch{" "}
					<i class={`gcolor${gen}`}>
						GEN <span>{gen}</span>
					</i>
				</h1>
				{content}
			</div>
		</>
	);
}
