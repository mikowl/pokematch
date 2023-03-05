import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Pokemon, Result } from "./types/pokemon";
import axios from "axios";

const POKE_API_URL = "https://pokeapi.co/api/v2/pokemon";

const getPokemonList = async () => {
	const limit = 151;
	const url = `${POKE_API_URL}/?limit=${limit}`;

	try {
		//fetch pokemon list
		const { data } = await axios.get(url);

		// get all pokemons data
		const promises = data.results.map(async (pokemon: Result) => {
			try {
				const { data } = await axios.get(pokemon.url);
				return data;
			} catch (error) {
				console.log(error);
			}
		});
		const results = await Promise.all(promises);
		console.log("results", results);
		return results;
	} catch (error) {
		console.warn("error", error);
	}
};

const usePokemon = (): UseQueryResult<Pokemon[], Error> => {
	return useQuery({
		queryKey: ["pokemonList"],
		queryFn: () => getPokemonList(),
		keepPreviousData: true,
		staleTime: 1000 * 60 * 60 * 24,
	});
};

const shuffle = (array: any[]) => {
	return array.sort(() => Math.random() - 0.5);
};

export { getPokemonList, usePokemon, shuffle };
