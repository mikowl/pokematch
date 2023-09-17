import { useState } from "preact/hooks";
import useSound from "use-sound";
import { GameData } from "../types/other";
import { Pokemon } from "../types/pokemon";
import { Fragment } from "preact/jsx-runtime";
import success from "/sounds/success.mp3";
import click from "/sounds/click.mp3";
import Pokeball2 from "./Icons/Pokeball2";
import { isMobile } from "../utils";
type CardElement = HTMLButtonElement | string;
export default function PokeCard({
	pokemons,
	setGameState,
	gameState,
	matchedCards,
	setMatchedCards,
}: {
	pokemons: Pokemon[];
	setGameState: Function;
	gameState: GameData;
	matchedCards: CardElement[];
	setMatchedCards: Function;
}) {
	const [flippedCards, setFlippedCards] = useState<HTMLButtonElement[]>([]);
	// const [matchedCards, setMatchedCards] = useState<Cards>([]);
	const [isProcessing, setIsProcessing] = useState<boolean>(false);
	const { mute, totalCaught, totalTurns, turns } = gameState;
	const [playClick] = useSound(click, { volume: 0.8 });
	const [playSuccess] = useSound(success, { volume: 0.8 });

	const handleCardFlip = (e: MouseEvent) => {
		// Get the clicked card
		const target = e.target as HTMLElement;
		const card = target.closest(".card-btn") as HTMLButtonElement;
		if (isProcessing || flippedCards.includes(card)) return;

		// Only flip the card if it's not already flipped, and there are fewer than 2 flipped cards
		if (card && !Array.isArray(card) && !matchedCards.includes(card)) {
			card.classList.add("flipped");
			setFlippedCards([...flippedCards, card]);

			// Check for a match if there are now 2 flipped cards
			if (flippedCards.length === 1) {
				const [card1] = flippedCards;
				const name1 = card1.dataset.name;
				const name2 = card.dataset.name;

				if (name1 === name2) {
					// Match found
					setMatchedCards([...matchedCards, card, card1]);
					setFlippedCards([]);
					// add matched animation to the matching cards
					card.classList.add("animate-matched");
					card1.classList.add("animate-matched");
					setTimeout(() => {
						card.classList.remove("animate-matched");
						card1.classList.remove("animate-matched");
					}, 500);
					setGameState({
						...gameState,
						turns: turns + 1,
						totalTurns: totalTurns + 1,
						totalCaught: totalCaught + 1,
					});

					// Play sound on card match
					// don't play sound if last match
					if (matchedCards.length !== pokemons.length - 2) {
						const isMob = isMobile();
						if (isMob && !mute) {
							playClick();
						} else {
							setTimeout(() => {
								if (!mute) playClick();
							}, 300);
						}
					}

					// Check if the game has been won
					if (matchedCards.length === pokemons.length - 2) {
						setTimeout(() => {
							if (!mute) playSuccess();
						}, 500);
						setTimeout(() => {
							setGameState({
								...gameState,
								turns: turns + 1,
								totalTurns: totalTurns + 1,
								totalCaught: totalCaught + 1,
								gameWin: true,
							});
							setMatchedCards([]);
							setFlippedCards([]);
						}, 1000);
					}
				} else {
					// No match found
					setGameState({
						...gameState,
						turns: turns + 1,
						totalTurns: totalTurns + 1,
					});
					setIsProcessing(true);
					setTimeout(() => {
						card1.classList.remove("flipped");
						card.classList.remove("flipped");
						setFlippedCards([]);
						setIsProcessing(false);
					}, 1000);
				}
			}
		}
	};

	return (
		<>
			{pokemons.map((pokemon, i) => (
				// encrypt pokemon.name so users can't view the name in the DOM
				<Fragment key={`${pokemon.name}-${i}`}>
					<button
						className={"card-btn flip"}
						onClick={handleCardFlip}
						data-name={btoa(pokemon.name)}
					>
						<div className="front">
							<div className="pokeCard">
								<div className="inner">
									{/* <img src={"/pokeball.png"} alt="Pokeball" width="73" height="73" /> */}
									<Pokeball2 size={73} />
								</div>
							</div>
						</div>
						<div className="back">
							<div className={"pokeCard"}>
								<div className="inner">
									<img
										src={pokemon.sprites.front_default}
										alt={pokemon.name}
										width="96"
										height="96"
									/>
									<p className="pokename">{pokemon.name}</p>
								</div>
							</div>
						</div>
					</button>
				</Fragment>
			))}
		</>
	);
}
