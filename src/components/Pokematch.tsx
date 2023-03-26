import { useEffect, useState } from "preact/hooks";
import { formatTime } from "../utils";
import { usePokemon, TOTAL_GENS } from "../api";
import PokeCard from "./PokeCard";
import { Pokemon } from "../types/pokemon";
import { GameData } from "../types/other";
import { UseQueryResult } from "@tanstack/react-query";
import Loader from "./Loader";
import GameOvered from "./GameOvered";
import MuteButton from "./MuteButton";
import Refresh from "./Icons/Refresh";
import Header from "./Header";
import { createContext } from "preact";
import Powerups from "./Powerups";

type PokemonData = UseQueryResult<Pokemon[], Error>;

export const GameStateContext = createContext({} as GameData);

export default function Pokematch() {
	const getInitialGameState = (): GameData => {
		const APP_VERSION = "2.3";
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
			boardSize: 0,
			difficulty: 0,
			gameWin: false,
			gen: 1,
			mute: false,
			powerUps: [],
			startTime: 0,
			totalCaught: 0,
			totalTurns: 0,
			turns: 0,
		};
	};

	const [gameState, setGameState] = useState<GameData>(getInitialGameState());
	const { boardSize, gameWin, gen, startTime } = gameState;

	const { data, isLoading, isFetching, error, refetch }: PokemonData = usePokemon(gen, boardSize);
	const [deck, setDeck] = useState<Pokemon[]>([]);

	const [roundTime, setRoundTime] = useState<number | string>(0);
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

	const nextGame = () => {
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
			nextGame();
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
			powerUps: [],
		});
	};

	useEffect(() => {
		refetchData().then(() => {
			nextGame();
		});
		// update game state in local storage
		localStorage.setItem("gameState", JSON.stringify(gameState));
	}, [gen]);

	useEffect(() => {
		const roundTime = formatTime(Date.now() - startTime);
		setRoundTime(roundTime);
		const body = document.querySelector("body");
		gameWin ? body?.classList.add("game-over") : body?.classList.remove("game-over");
	}, [startTime, gameWin]);

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
					{/* <p className="tip">Tip: Press spacebar to use power ups</p> */}
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
						<Powerups gameState={gameState} setGameState={setGameState} />
						<div class="restart-container">
							<button className={"btn refresh"} onClick={handleRestart}>
								<Refresh size={26} fill="#fff" />
								<br />
							</button>
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
