import { useState } from "preact/hooks";
import { GameData } from "../types/other";
import { Pokemon } from "../types/pokemon";
import { Fragment } from "preact/jsx-runtime";

export default function PokeCard({
	pokemons,
	setGameState,
	gameState,
}: {
	pokemons: Pokemon[];
	setGameState: Function;
	gameState: GameData;
}) {
	type CardElement = HTMLButtonElement | string;
	type Cards = CardElement[] | HTMLButtonElement[];
	const [flippedCards, setFlippedCards] = useState<HTMLButtonElement[]>([]);
	const [matchedCards, setMatchedCards] = useState<Cards>([]);
	const [isProcessing, setIsProcessing] = useState<boolean>(false);
	const { turns, totalTurns, mute } = gameState;
	const beep = new Audio("/beepalt.mp3");

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
					// Play sound on card match
					if (!mute) {
						// delay the sound so it doesn't play too fast
						setTimeout(() => {
							beep.currentTime = 0;
							beep.play();
						}, 300);
					}
					// Check if the game has been won
					if (matchedCards.length === pokemons.length - 2) {
						setTimeout(() => {
							setGameState({
								...gameState,
								turns: turns + 1,
								totalTurns: totalTurns + 1,
								gameWin: true,
							});
							setMatchedCards([]);
							setFlippedCards([]);
						}, 1000);
					}
				} else {
					// No match found
					setIsProcessing(true);
					setTimeout(() => {
						card1.classList.remove("flipped");
						card.classList.remove("flipped");
						setFlippedCards([]);
						setIsProcessing(false);
					}, 1000);
				}
				setGameState({
					...gameState,
					turns: turns + 1,
					totalTurns: totalTurns + 1,
				});
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
									<img src={"/pokeball.png"} alt="Pokeball" width="73" height="73" />
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
								</div>
							</div>
						</div>
					</button>
				</Fragment>
			))}
		</>
	);
}
