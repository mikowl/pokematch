import { useEffect, useState } from "preact/hooks";
import { usePokemon, TOTAL_GENS, formatTime } from "../utils";
import PokeCard from "./PokeCard";
import { Pokemon } from "../types/pokemon";
import { GameData } from "../types/other";
import { UseQueryResult } from "@tanstack/react-query";
import Loader from "./Loader";
import GameOvered from "./GameOvered";
import MuteButton from "./MuteButton";

type PokemonData = UseQueryResult<Pokemon[], Error>;

export default function Pokematch() {
	const getInitialGameState = (): GameData => {
		const gameStateFromLocalStorage = localStorage.getItem("gameState");
		if (gameStateFromLocalStorage !== null) {
			return JSON.parse(gameStateFromLocalStorage);
		}
		return {
			turns: 0,
			totalTurns: 0,
			gameWin: false,
			gen: 1,
			mute: false,
			difficulty: 0,
			boardSize: 0,
			startTime: 0,
		};
	};

	const [gameState, setGameState] = useState<GameData>(getInitialGameState());
	const { gen, turns, gameWin, boardSize } = gameState;

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
		if (data) setDeck(data);
	};

	// after difficulty is chosen and board size is set, get data
	useEffect(() => {
		refetchData().then(() => {
			reset();
		});
	}, [boardSize]);

	const reset = () => {
		if (data) setDeck(data);
		setGameState({
			...gameState,
			turns: 0,
			gameWin: false,
		});
		const cards = document.querySelectorAll(".card-btn");
		cards.forEach((card) => card.classList.remove("flipped"));
	};

	const handleNextGame = () => {
		setGameState({
			...gameState,
			startTime: Date.now(),
			gen: gen + 1,
		});
	};

	const handleRestart = () => {
		setGameState({
			...gameState,
			difficulty: 0,
			totalTurns: 0,
			gen: 1,
			boardSize: 0,
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
	}, [gameWin]);

	let content;

	if (boardSize === 0) {
		content = (
			<div className={"difficulty"}>
				<h2>Choose Difficulty:</h2>
				<button className={"btn easy"} onClick={handleDifficulty} value="12">
					Easy
				</button>
				<button className={"btn hard"} onClick={handleDifficulty} value="16">
					Hard
				</button>
			</div>
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
				{deck && <p className={`turns ${gameWin ? "hide" : ""}`}>Turns: {turns}</p>}
				{gameWin && (
					<GameOvered
						gameState={gameState}
						deck={deck}
						handleNextGame={handleNextGame}
						handleRestart={handleRestart}
						boardSize={boardSize}
						roundTime={roundTime}
					/>
				)}
			</>
		);
	}

	return (
		<div className={`gcolor${gen}`}>
			<MuteButton gameState={gameState} setGameState={setGameState} />
			<h1>
				Pokematch{" "}
				<i class={`gcolor${gen}`}>
					GEN <span>{gen}</span>
				</i>
			</h1>
			<p className={"instructions"}>
				Match the Pokemon, complete all {TOTAL_GENS} generations to win!
				<br />
				Every round is unique!
			</p>
			{content}
		</div>
	);
}
