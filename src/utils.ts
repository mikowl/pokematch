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
	9: { offset: 905, limit: 103 },
};

const getRandomPokemon = async (gen: PokemonGeneration, BOARD_SIZES: number) => {
	const { offset, limit } = pokemonGenerationData[gen];
	const url = `${POKE_API_URL}/?offset=${offset}&limit=${limit}`;

	try {
		const response = await fetch(url);
		const { results } = await response.json();
		const randomPokemon = results.sort(() => Math.random() - 0.5).slice(0, BOARD_SIZES / 2);

		const promises = randomPokemon.map(async ({ url }: Result) => {
			const response = await fetch(url);
			return await response.json();
		});

		const pokemonData = await Promise.all(promises);
		const shuffledCards = shuffle([...pokemonData, ...pokemonData]);
		return shuffledCards;
	} catch (error) {
		console.warn("error", error);
	} 
};

const usePokemon = (gen: PokemonGeneration, BOARD_SIZES: number): UseQueryResult<Pokemon[], Error> => {
	return useQuery({
		queryKey: ["pokemonList", gen],
		queryFn: () => getRandomPokemon(gen, BOARD_SIZES),
		staleTime: 1000 * 60 * 60 * 24,
	});
};

export const getPokemonById = async (id: number) => {
	const pokemon = await fetch(`${POKE_API_URL}/${id}`).then(
		(res) => res.json()
	);
	return pokemon as Pokemon;
};

const usePokemonById = (id: number) => {
	return useQuery({
		queryKey: ["pokemon", id],
		queryFn: () => getPokemonById(id),
	});
};

const shuffle = (array: any[]) => {
	return array.sort(() => Math.random() - 0.5);
};

// range utility
// example:
// {range(5).map((i) => (
// 	<Comp key={i + 1} value={squares[i]} /> 
// ))}
const range = (start: number, end?: number, step = 1) => {
	const output = [];
	if (typeof end === 'undefined') {
		end = start;
		start = 0;
	}
	for (let i = start; i < end; i += step) {
		output.push(i);
	}
	return output;
};

// format time to minutes and seconds function
function formatTime(timestamp:number) {
	const minutes = Math.floor(timestamp / 60000); // 1 minute = 60000 ms
	const seconds = Math.floor((timestamp - minutes * 60000) / 1000); // 1 second = 1000 ms
	const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
	return `${minutes}:${formattedSeconds}`;
}

function timeToSeconds(time: number | string): number {
	if (typeof time === 'string') {
		const [minutes, seconds] = time.split(':');
		return Number(minutes) * 60 + Number(seconds);
	} 
	return time;
}

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
	setTimeout(omgConfetti, 2000);
};

type Rating = {
	turns: number;
	rating: string;
	title: string;
};

const ratingThresholds: { [key: number]: Rating[] } = {
	4: [
		{ turns: 2, rating: "★★★★★", title: "-Pokematch Master-" },
		{ turns: 4, rating: "★★★☆☆", title: "-Pokematch Rookie-" },
		{ turns: Infinity, rating: "★☆☆☆☆", title: "-Pokematch Noob-" },
	],
	12: [
		{ turns: 9, rating: "★★★★★", title: "-Pokematch Master-" },
		{ turns: 13, rating: "★★★★☆", title: "-Pokematch Trainer-" },
		{ turns: 15, rating: "★★★☆☆", title: "-Pokematch Rookie-" },
		{ turns: 17, rating: "★★☆☆☆", title: "-Pokematch Beginner-" },
		{ turns: Infinity, rating: "★☆☆☆☆", title: "-Pokematch Noob-" },
	],
	16: [
		{ turns: 12, rating: "★★★★★", title: "-Pokematch Master-" },
		{ turns: 18, rating: "★★★★☆", title: "-Pokematch Trainer-" },
		{ turns: 21, rating: "★★★☆☆", title: "-Pokematch Rookie-" },
		{ turns: 24, rating: "★★☆☆☆", title: "-Pokematch Beginner-" },
		{ turns: Infinity, rating: "★☆☆☆☆", title: "-Pokematch Noob-" },
	]
};

const scoringMessages = (turns: number, boardSize: number): string => {
	const size = boardSize === 12 ? 12 : 16;
	const { rating, title } = ratingThresholds[size].find(
		(threshold) => turns <= threshold.turns
	)!;
	return `${rating.padEnd(5, "☆")} ${title}`;
};


export { usePokemon, usePokemonById, range, shuffle, pewpewpew, scoringMessages, formatTime, timeToSeconds, TOTAL_GENS };
