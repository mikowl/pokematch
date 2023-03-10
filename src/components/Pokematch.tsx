import { useEffect, useState } from "preact/hooks";
import { usePokemon, shuffle, TOTAL_GENS, BOARD_SIZE } from "../utils";
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
			};
		}
	};
	const [gameState, setGameState] = useState<GameData>(getInitialGameState());

	// set game state in local storage
	useEffect(() => {
		localStorage.setItem("gameState", JSON.stringify(gameState));
	}, [gameState]);

	const { data, isLoading, error, refetch }: PokemonData = usePokemon(gameState.gen);

	const [deck, setDeck] = useState<Pokemon[]>([]);

	// grab 8 random unique pokemon from data to be used in card match game
	const randomUniquePokemon = (): Pokemon[] => {
		if (data && !isLoading) {
			const randomPokemon: Pokemon[] = [];
			while (randomPokemon.length < BOARD_SIZE / 2) {
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
	if (data && !isLoading && deck.length === 0) {
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
			gen: gameState.gen + 1,
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
	}, [gameState.gen]);

	useEffect(() => {
		const body = document.querySelector("body");
		gameState.gameWin ? body?.classList.add("game-over") : body?.classList.remove("game-over");
	}, [gameState.gameWin]);

	return (
		<div className={`gcolor${gameState.gen}`}>
			<MuteButton gameState={gameState} setGameState={setGameState} />
			<h1>
				Pokematch{" "}
				<i class={`gcolor${gameState.gen}`}>
					GEN <span>{gameState.gen}</span>
				</i>
			</h1>
			<p className={"instructions"}>
				Match the Pokemon, complete all {TOTAL_GENS} generations to win!
			</p>
			{isLoading ? (
				<Loader pokeball={true} />
			) : error ? (
				<p className={"error"}>
					Oh dang, something went wrong <br /> {error}
				</p>
			) : (
				<>
					<div className={`card-container deckgen-${gameState.gen}`}>
						{deck && <PokeCard pokemons={deck} gameState={gameState} setGameState={setGameState} />}
					</div>
					<p className={`turns ${gameState.gameWin ? "hide" : ""}`}>Turns: {gameState.turns}</p>
					{gameState.gameWin && (
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
