import { useEffect, useState } from "preact/hooks";
import { usePokemon, shuffle, TOTAL_GENS, BOARD_SIZES } from "../utils";
import PokeCard from "./PokeCard";
import { Pokemon } from "../types/pokemon";
import { GameData } from "../types/other";
import { UseQueryResult } from "@tanstack/react-query";
import Loader from "./Loader";
import GameOvered from "./GameOvered";
import MuteButton from "./MuteButton";

type PokemonData = UseQueryResult<Pokemon[], Error>;

export default function Pokematch() {
	// const [gen, setGen] = useState<PokemonGeneration>(1);
	const getInitialGameState = (): GameData => {
		const gameStateFromLocalStorage = localStorage.getItem("gameState");
		if (gameStateFromLocalStorage !== null) {
			return JSON.parse(gameStateFromLocalStorage);
		} else {
			return {
				turns: 0,
				totalTurns: 0,
				gameWin: false,
				gen: 1,
				mute: false,
				difficulty: 0,
				boardSize: 0,
			};
		}
	};

	const [gameState, setGameState] = useState<GameData>(getInitialGameState());
	const { gen, turns, gameWin, boardSize } = gameState;

	// set game state in local storage
	useEffect(() => {
		localStorage.setItem("gameState", JSON.stringify(gameState));
		console.log("%cSaving...", "color: green; font-size: 14px; font-family: monospace;");
	}, [gameState]);

	const { data, isLoading, error, refetch }: PokemonData = usePokemon(gen);

	const [deck, setDeck] = useState<Pokemon[]>([]);

	const handleDifficulty = (e: Event) => {
		const target = e.target as HTMLInputElement;
		const difficulty = parseInt(target.value);
		setGameState({
			...gameState,
			difficulty,
			boardSize: BOARD_SIZES[difficulty],
		});
	};

	// grab 8 random unique pokemon from data to be used in card match game
	const randomUniquePokemon = (): Pokemon[] => {
		if (data && !isLoading) {
			const randomPokemon: Pokemon[] = [];
			while (randomPokemon.length < boardSize / 2) {
				console.log(boardSize);
				const randomIndex = Math.floor(Math.random() * data.length);
				// ensure there are no duplicates
				if (!randomPokemon.includes(data[randomIndex])) {
					randomPokemon.push(data[randomIndex]);
				}
			}
			//  duplicate randomPokemon array and shuffle
			return shuffle([...randomPokemon, ...randomPokemon]);
		}
		return [];
	};

	// set deck state to randomUniquePokemon
	if (data && !isLoading && deck.length === 0 && gameState.difficulty !== 0) {
		setDeck(randomUniquePokemon());
	}

	const refetchData = async () => {
		await refetch();
	};

	const reset = () => {
		setDeck(randomUniquePokemon());
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
			gen: gen + 1,
		});
	};

	const handleRestart = () => {
		setGameState({
			...gameState,
			gen: 1,
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
		const body = document.querySelector("body");
		gameWin ? body?.classList.add("game-over") : body?.classList.remove("game-over");
	}, [gameWin]);

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
			{/* Choose difficulty */}
			{gameState.difficulty === 0 ? (
				<div className={"difficulty"}>
					<p>Choose Difficulty:</p>
					<button onClick={handleDifficulty} value="1">
						Easy
					</button>
					<button onClick={handleDifficulty} value="2">
						Hard
					</button>
				</div>
			) : isLoading ? (
				<Loader pokeball={true} />
			) : error ? (
				<p className={"error"}>
					{" "}
					Oh dang, something went wrong <br /> {error}{" "}
				</p>
			) : (
				<>
					<div className={`card-container deckgen-${gen}`}>
						{deck && <PokeCard pokemons={deck} gameState={gameState} setGameState={setGameState} />}
					</div>
					<p className={`turns ${gameWin ? "hide" : ""}`}>Turns: {turns}</p>
					{gameWin && (
						<GameOvered
							gameState={gameState}
							deck={deck}
							handleNextGame={handleNextGame}
							handleRestart={handleRestart}
						/>
					)}
				</>
			)}
		</div>
	);
}
