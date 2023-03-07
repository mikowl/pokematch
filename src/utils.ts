import confetti from "canvas-confetti";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Pokemon, Result, PokemonGeneration, PokemonGenerationData } from "./types/pokemon";
import axios from "axios";

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
	console.log("offset", offset);
	console.log("limit", limit);
	const url = `${POKE_API_URL}/?offset=${offset}&limit=${limit}`;

	try {
		const { data } = await axios.get(url);

		const promises = data.results.map(async (pokemon: Result) => {
			try {
				const { data } = await axios.get(pokemon.url);
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
};

export { getPokemonList, usePokemon, shuffle, pewpewpew };
