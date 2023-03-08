import { useState } from "preact/hooks";
import { Pokemon } from "../types/pokemon";

export default function PokeCard({
	pokemons,
	turns,
	setTurns,
	gameWin,
	setGameWin,
}: {
	pokemons: Pokemon[];
	turns: number;
	setTurns: Function;
	gameWin: boolean;
	setGameWin: Function;
}) {
	type CardElement = HTMLButtonElement | string;
	type Cards = CardElement[] | HTMLButtonElement[];
	const [flippedCards, setFlippedCards] = useState<HTMLButtonElement[]>([]);
	const [matchedCards, setMatchedCards] = useState<Cards>([]);

	// handle card flip
	const handleCardFlip = (e: MouseEvent) => {
		const target = e.target as HTMLElement;
		const card = target.closest(".card-btn") as HTMLButtonElement;
		// play sound on click
		const audio = new Audio("/beep.mp3");
		audio.play();

		if (card && !Array.isArray(card) && flippedCards.length < 2 && !matchedCards.includes(card)) {
			const cardElement = card as HTMLButtonElement;
			cardElement.classList.add("flipped");
			setFlippedCards([...flippedCards, cardElement]);

			if (flippedCards.length === 1) {
				const [card1] = flippedCards;
				const name1 = card1.getAttribute("data-name");
				const name2 = cardElement.getAttribute("data-name");

				if (name1 === name2) {
					setMatchedCards([...matchedCards, card, card1]);
					setFlippedCards([]);
					// # Game win stuff here
					if (matchedCards.length === pokemons.length - 2) {
						setTimeout(() => {
							setGameWin(true);
							setMatchedCards([]);
							setFlippedCards([]);
						}, 1000);
					}
				} else {
					setTimeout(() => {
						card1.classList.remove("flipped");
						cardElement.classList.remove("flipped");
						setFlippedCards([]);
					}, 1000);
				}
				setTurns(turns + 1);
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
								<img src={"/pokeball.svg"} alt="Pokeball" width="73" height="73" />
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
