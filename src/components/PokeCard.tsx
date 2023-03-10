import { useState, useRef } from "preact/hooks";
import { Pokemon } from "../types/pokemon";

export default function PokeCard({
	pokemons,
	turns,
	setTurns,
	setTotalTurns,
	totalTurns,
	setGameWin,
	mute,
}: {
	pokemons: Pokemon[];
	turns: number;
	setTurns: Function;
	setTotalTurns: Function;
	totalTurns: number;
	setGameWin: Function;
	mute: boolean;
}) {
	type CardElement = HTMLButtonElement | string;
	type Cards = CardElement[] | HTMLButtonElement[];
	const [flippedCards, setFlippedCards] = useState<HTMLButtonElement[]>([]);
	const [matchedCards, setMatchedCards] = useState<Cards>([]);
	const [isProcessing, setIsProcessing] = useState<boolean>(false);
	const beep = new Audio("/beepalt.mp3");

	const handleCardFlip = (e: MouseEvent) => {
		// Get the clicked card
		const target = e.target as HTMLElement;
		const card = target.closest(".card-btn") as HTMLButtonElement;
		if (isProcessing || flippedCards.includes(card)) return;

		// Play sound on card flip
		if (!mute) {
			beep.currentTime = 0;
			beep.play();
		}
		// Only flip the card if it's not already flipped, and there are fewer than 2 flipped cards
		if (card && !Array.isArray(card) && flippedCards.length < 2 && !matchedCards.includes(card)) {
			card.classList.add("flipped");
			setFlippedCards([...flippedCards, card]);

			// Check for a match if there are now 2 flipped cards
			if (flippedCards.length === 1) {
				const [card1] = flippedCards;
				const name1 = card1.getAttribute("data-name");
				const name2 = card.getAttribute("data-name");

				if (name1 === name2) {
					// Match found
					setMatchedCards([...matchedCards, card, card1]);
					setFlippedCards([]);
					// Check if the game has been won
					if (matchedCards.length === pokemons.length - 2) {
						setTimeout(() => {
							setGameWin(true);
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
				setTurns(turns + 1);
				setTotalTurns(totalTurns + 1);
			}
		}
	};

	return (
		<>
			{pokemons.map((pokemon) => (
				<button className={"card-btn flip"} onClick={handleCardFlip} data-name={pokemon.name}>
					<div className="front">
						<div className="pokeCard">
							<div className="inner">
								<img src={"/pokeball.png"} alt="Pokeball" width="73" height="73" />
							</div>
						</div>
					</div>
					<div className="back">
						<div className={"pokeCard"} key={`${pokemon.name}-${self.crypto.randomUUID()}`}>
							<div className="inner">
								<img
									src={pokemon.sprites.front_default}
									alt={pokemon.name}
									width="96"
									height="96"
								/>
								{/* <p>{clicks}</p> */}
							</div>
						</div>
					</div>
				</button>
			))}
		</>
	);
}
