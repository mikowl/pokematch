import { pewpewpew, scoringMessages } from "../utils";
import { Pokemon, PokemonGeneration } from "../types/pokemon";

const GameOvered = ({
	gameWin,
	deck,
	handleReset,
	turns,
	gen,
}: {
	gameWin: boolean;
	deck: Pokemon[];
	handleReset: () => void;
	turns: number;
	gen: PokemonGeneration;
}) => {
	gameWin && pewpewpew();
	return (
		<>
			{gameWin && (
				<div className="gameOvered">
					<h2>You won!</h2>
					<div className="pokemonList">
						<h3>Pokemon's Caught: </h3>
						<ul className="pokesCaught">
							{deck &&
								[...new Set(deck)].map((pokemon) => (
									<li>
										<img src={pokemon.sprites.front_default} alt={pokemon.name} />
										<p>{pokemon.name}</p>
									</li>
								))}
						</ul>
					</div>
					<p className="scoringMessage">{scoringMessages(turns)}</p>
					<button className={"restartBtn"} onClick={handleReset}>
						Play Again?
					</button>
					<p className="upNext">
						(Generation <strong>{gen}</strong> is up next!)
					</p>
				</div>
			)}
		</>
	);
};

export default GameOvered;
