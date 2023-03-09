import confetti from "canvas-confetti";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Pokemon, Result, PokemonGeneration, PokemonGenerationData } from "./types/pokemon";

const TOTAL_GENS = 9;
const POKE_API_URL = "https://pokeapi.co/api/v2/pokemon";

const pokemonGenerationData: PokemonGenerationData = {
	1: { offset: 0, limit: 151 },
	2: { offset: 151, limit: 100 },
	3: { offset: 251, limit: 135 },
	4: { offset: 386, limit: 107 },
	5: { offset: 493, limit: 156 },
	6: { offset: 649, limit: 72 },
	7: { offset: 721, limit: 88 },
	8: { offset: 809, limit: 96 },
	9: { offset: 905, limit: 105 },
};

const getPokemonList = async (gen: PokemonGeneration) => {
	const { offset, limit } = pokemonGenerationData[gen];
	const url = `${POKE_API_URL}/?offset=${offset}&limit=${limit}`;

	try {
		const response = await fetch(url);
		const data = await response.json();

		const promises = data.results.map(async (pokemon: Result) => {
			try {
				const response = await fetch(pokemon.url);
				const data = await response.json();
				return data;
			} catch (error) {
				console.log(error);
			}
		});

		const results = await Promise.all(promises);
		return results;
	} catch (error) {
		console.warn("error", error);
	}
};

const usePokemon = (gen: PokemonGeneration): UseQueryResult<Pokemon[], Error> => {
	return useQuery({
		queryKey: ["pokemonList"],
		queryFn: () => getPokemonList(gen),
		staleTime: 1000 * 60 * 60 * 24,
	});
};

const shuffle = (array: any[]) => {
	return array.sort(() => Math.random() - 0.5);
};

const omgConfetti = () => {
	confetti({
		particleCount: 300,
		startVelocity: 50,
		spread: 360,
		shapes: ["circle"],
		disableForReducedMotion: true,
		colors: ["#222E66", "#4962D6", "#FFCB05", "#CA370B", "#5e3f89", "#f0b7bc", "#b0e0e6"],
	});
};
const pewpewpew = () => {
	setTimeout(omgConfetti, 1000);
};

	const scoringMessages = (turns: number) => {
		// const score = 100 - turns;
		const rating = (star: number): string => "★".repeat(Math.max(0, Math.min(star, 5))).padEnd(5,"☆" );
		const score = (12 * 2) - (turns * 2);
		if (turns <= 9) {
			return `${rating(5)} -Pokematch Master-`;
		} else if (turns > 9 && turns <= 13) {
			return `${rating(4)} -Pokematch Trainer-`;
		} else if (turns > 13 && turns <= 16) {
			return `${rating(3)} -Pokematch Rookie-`;
		} else if (turns > 16 && turns <= 18) {
			return `${rating(2)} -Pokematch Beginner-`;
		} else {
			return `${rating(1)} -Pokematch Noob-`;
		}
	};
export { getPokemonList, usePokemon, shuffle, pewpewpew, scoringMessages, TOTAL_GENS };
