import { useState } from "preact/hooks";
import { Pokemon } from "../types/pokemon";

export default function PokeCard({
	pokemons,
	turns,
	setTurns,
}: {
	pokemons: Pokemon[];
	turns: number;
	setTurns: Function;
}) {
	const [flippedCards, setFlippedCards] = useState<string[]>([]);

	// handle card flip
	const handleCardFlip = (e: Event) => {
		// compare the data-name of the clicked card to the data-name of the other card
		const target = e.target as HTMLElement;
		const card = target.closest(".card-btn");
		console.log("card:", card);
		if (card) {
			const name = card.getAttribute("data-name");
			console.log(name);
			if (flippedCards.length === 0) {
				// if no card is flipped, flip the clicked card
				setFlippedCards([name]);
			} else if (flippedCards.length === 1) {
				// if one card is flipped, compare the clicked card against it
				if (flippedCards[0] === name) {
					// if the names match, set the flippedCards state to an empty array
					setFlippedCards([]);
				} else {
					// if the names don't match, flip the clicked card and reset the flippedCards state
					const flippedCard = document.querySelector(`[data-name="${flippedCards[0]}"]`);
					console.log("flippedCard: ", flippedCard);
					if (flippedCard) {
						setFlippedCards([]);
						setTimeout(() => {
							card.classList.remove("flipped");
							flippedCard.classList.remove("flipped");
						}, 2000);
					}
				}
			}
			card.classList.toggle("flipped");
			setTurns(turns + 1);
		}
	};

	return (
		<>
			{pokemons.map((pokemon) => (
				<button className={"card-btn flip"} onClick={handleCardFlip} data-name={pokemon.name}>
					<div className={"pokeCard"} key={`${pokemon.name}-${self.crypto.randomUUID()}`}>
						<img src={pokemon.sprites.front_default} alt={pokemon.name} />
						{/* <p>{clicks}</p> */}
					</div>
				</button>
			))}
		</>
	);
}
