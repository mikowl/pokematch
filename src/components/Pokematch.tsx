import { useState } from "preact/hooks";
import { usePokemon, shuffle } from "../utils";
import PokeCard from "./PokeCard";
import { Pokemon } from "../types/pokemon";
import { UseQueryResult } from "@tanstack/react-query";

type PokemonData = UseQueryResult<Pokemon[], Error>;

export default function Pokematch() {
	const { data, isInitialLoading, error }: PokemonData = usePokemon();

	const [turns, setTurns] = useState(0);
	// deck is an array of objects
	const [deck, setDeck] = useState<Pokemon[]>([]);

	console.log(data);
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
	console.log("deck", deck);

	const handleReset = () => {
		setDeck(randomUniquePokemon());
		setTurns(0);
	};

	return (
		<>
			<h1>Pokematch</h1>
			{isInitialLoading ? (
				<div>Loading...</div>
			) : error ? (
				<div>
					Uh oh
					<br /> {error}
				</div>
			) : (
				<>
					<div className={"card-container"}>
						{deck && <PokeCard pokemons={deck} turns={turns} setTurns={setTurns} />}
					</div>
					<button onClick={handleReset}>New Game?</button>
					<p>Turns: {turns}</p>
				</>
			)}
		</>
	);
}
