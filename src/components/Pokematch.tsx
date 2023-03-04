import { usePokemon, shuffle } from "../utils";
import PokeCard from "./PokeCard";
import { Pokemon } from "../types/pokemon";

export default function Pokematch() {
	const { data, isInitialLoading, error } = usePokemon();
	console.log(data);
	// grab 8 random unique pokemon from data to be used in card match game
	const randomUniquePokemon = () => {
		if (data && !isInitialLoading) {
			const randomPokemon: Pokemon[] = [];
			while (randomPokemon.length < 8) {
				const randomIndex = Math.floor(Math.random() * data.length);
				// ensure there are no duplicates
				if (!randomPokemon.includes(data[randomIndex])) {
					randomPokemon.push(data[randomIndex]);
				}
			}
			//  duplicate randomPokemon array and shuffle
			return shuffle([...randomPokemon, ...randomPokemon]);
		}
	};

	const shuffledDeck = randomUniquePokemon();

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
				<div className={"card-container"}>{shuffledDeck && <PokeCard pokemons={shuffledDeck} />}</div>
			)}
		</>
	);
}
