import { useState } from "preact/hooks";
import { usePokemon, shuffle } from "../utils";
import PokeCard from "./PokeCard";
import { Pokemon } from "../types/pokemon";
import { UseQueryResult } from "@tanstack/react-query";
import confetti from "canvas-confetti";

import Loader from "./Loader";

type PokemonData = UseQueryResult<Pokemon[], Error>;

export default function Pokematch() {
	const { data, isInitialLoading, error }: PokemonData = usePokemon();

	const [turns, setTurns] = useState(0);
	const [gameWin, setGameWin] = useState(true);

	// deck is an array of objects
	const [deck, setDeck] = useState<Pokemon[]>([]);

	const omgConfetti = () => {
		confetti({
			particleCount: 200,
			startVelocity: 50,
			spread: 360,
			shapes: ["circle"],
			disableForReducedMotion: true,
			colors: ["#222E66", "#4962D6", "#FFCB05", "#CA370B"],
			origin: {
				x: Math.random() * 0.5 + 0.25,
				y: Math.random() * 0.5 + 0.25,
			},
		});
	};
	const pewpewpew = () => {
		setTimeout(omgConfetti, 0);
		setTimeout(omgConfetti, 1000);
		setTimeout(omgConfetti, 2000);
		setTimeout(omgConfetti, 3000);
		setTimeout(omgConfetti, 4000);
	};

	// grab 8 random unique pokemon from data to be used in card match game
	const randomUniquePokemon = (): Pokemon[] => {
		if (data && !isInitialLoading) {
			const randomPokemon: Pokemon[] = [];
			while (randomPokemon.length < 6) {
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
	if (data && !isInitialLoading && deck.length === 0) {
		setDeck(randomUniquePokemon());
	}

	const handleReset = () => {
		setDeck(randomUniquePokemon());
		setTurns(0);
	};

	return (
		<>
			<h1>
				Pokematch <i>GEN 1</i>
			</h1>
			{isInitialLoading ? (
				<Loader pokeball={true} />
			) : error ? (
				<div>
					Uh oh
					<br /> {error}
				</div>
			) : (
				<>
					<div className={"card-container"}>
						{deck && <PokeCard pokemons={deck} turns={turns} setTurns={setTurns} gameWin={setGameWin} />}
					</div>
					<button onClick={handleReset}>New Game?</button>
					<p>Turns: {turns}</p>
					{gameWin && pewpewpew()}
				</>
			)}
		</>
	);
}
