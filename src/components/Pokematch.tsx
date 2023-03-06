import { useState } from "preact/hooks";
import { usePokemon, shuffle } from "../utils";
import PokeCard from "./PokeCard";
import { Pokemon } from "../types/pokemon";
import { UseQueryResult } from "@tanstack/react-query";
import { pewpewpew } from "../utils";
import Loader from "./Loader";

type PokemonData = UseQueryResult<Pokemon[], Error>;

export default function Pokematch() {
	const { data, isInitialLoading, error }: PokemonData = usePokemon();

	const [turns, setTurns] = useState<number>(0);
	const [gameWin, setGameWin] = useState<boolean>(false);

	// deck is an array of objects
	const [deck, setDeck] = useState<Pokemon[]>([]);

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
		setGameWin(false);
		const cards = document.querySelectorAll(".card-btn");
		cards.forEach((card) => card.classList.remove("flipped"));
	};

	const scoringMessages = () => {
		if (turns <= 8) {
			return "You're a Pokematch Master!";
		} else if (turns > 8 && turns <= 12) {
			return "You're a Pokematch Trainer!";
		} else if (turns > 12 && turns <= 17) {
			return "You're a Pokematch Rookie!";
		} else {
			return "You're a Pokematch Noob!";
		}
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
						{deck && (
							<PokeCard
								pokemons={deck}
								turns={turns}
								setTurns={setTurns}
								setGameWin={setGameWin}
								gameWin={gameWin}
							/>
						)}
					</div>
					<p className={"turns"}>Turns: {turns}</p>
					{gameWin && pewpewpew()}
					{gameWin && (
						<div className="gameOvered ">
							<h2>You won!</h2>
							{/* <p>You completed the game in {turns} turns</p> */}
							<p>{scoringMessages()}</p>
							<button className={"restartBtn"} onClick={handleReset}>
								New Game?
							</button>
						</div>
					)}
				</>
			)}
		</>
	);
}
