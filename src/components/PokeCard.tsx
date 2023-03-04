import { Pokemon } from "../types/pokemon";

export default function PokeCard({ pokemons }: { pokemons: Pokemon[] }) {
	return (
		<>
			{pokemons.map((pokemon) => (
				<div className={"pokeCard"} key={`${pokemon.name}-${self.crypto.randomUUID()}`}>
					<img src={pokemon.sprites.front_default} alt={pokemon.name} />
					{/* <p>{pokemon.name}</p> */}
				</div>
			))}
		</>
	);
}
