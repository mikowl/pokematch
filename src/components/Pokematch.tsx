import { useEffect, useState } from "preact/hooks";
import { usePokemon, TOTAL_GENS } from "../api";
import PokeCard from "./PokeCard";
import { Pokemon, PokemonData } from "../types/pokemon";
import { GameData, Cards } from "../types/other";
import Loader from "./Loader";
import GameOvered from "./GameOvered";
import MuteButton from "./MuteButton";
import Refresh from "./Icons/Refresh";
import Header from "./Header";
import { Powerups, powerUpInfo } from "./Powerups";
import StartScreen from "./StartScreen";

export default function Pokematch() {
	const getInitialGameState = (): GameData => {
		const APP_VERSION = "2.4.3";
		if (localStorage.getItem("appVersion") !== String(APP_VERSION)) {
			// Clear localStorage
			localStorage.clear();
			console.log("game updated, clearing local storage...");
			// Update app version
			localStorage.setItem("appVersion", String(APP_VERSION));
		}
		const gameStateFromLocalStorage = localStorage.getItem("gameState");
		if (gameStateFromLocalStorage !== null) {
			return JSON.parse(gameStateFromLocalStorage);
		}

		let startPowers: string[] = [];
		if(import.meta.env.VITE_DEBUG == "TRUE") {
			startPowers = Object.keys(powerUpInfo);
			console.log('pui: ', Object.keys(powerUpInfo));
		} else {
			startPowers = [];
		}
		
		return {
			boardSize: 0,
			difficulty: 0,
			gameWin: false,
			gen: 1,
			mute: false,
			powerUps: startPowers,
			startTime: 0,
			totalCaught: 0,
			totalTurns: 0,
			turns: 0,
		};
	};

	const [gameState, setGameState] = useState<GameData>(getInitialGameState());
	const { boardSize, gameWin, gen, startTime } = gameState;
	const { data, isFetching, error, refetch }: PokemonData = usePokemon(gen, boardSize);

	const [deck, setDeck] = useState<Pokemon[]>([]);
	const [seconds, setSeconds] = useState<number>(0);
	const [minutes, setMinutes] = useState<number>(0);
	const [roundTime, setRoundTime] = useState<number | string>(0);
	const [matchedCards, setMatchedCards] = useState<Cards>([]);
	const [averageTime, setAverageTime] = useState<string[]>([]);

	const refetchData = async () => {
		await refetch();
	};

	if (data) setDeck(data); 

	const handleDifficulty = (e: MouseEvent) => {
		const target = e.target as HTMLInputElement;
		const board_size = parseInt(target.value, 10);
		setGameState((prevState: GameData) => ({
			...prevState,
			boardSize: board_size,
		}));
	};

	const nextGame = () => {
		refetchData();
		if (data) setDeck(data);
		setGameState((prevState) => ({
			...prevState,
			startTime: Date.now(),
			turns: 0,
			gameWin: false,
		}));
		setMinutes(0);
		setSeconds(0);
		const cards = document.querySelectorAll(".card-btn");
		cards.forEach((card) => card.classList.remove("flipped"));
		localStorage.setItem("gameState", JSON.stringify(gameState));
	};

	const handleRestart = () => {
		setGameState({
			...gameState,
			difficulty: 0,
			turns: 0,
			totalTurns: 0,
			totalCaught: 0,
			gen: 1,
			boardSize: 0,
			powerUps: [],
		});
	};

	// next game on board size or gen change
	useEffect(() => {
		nextGame();
	}, [gen, boardSize]);

	// update round time
	useEffect(() => {
		const roundTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;
		setRoundTime(roundTime);
		const body = document.querySelector("body");
		if(body) {
			gameWin ? body.classList.add("game-over") : body.classList.remove("game-over");
		}
		// save end round time to average time
		if (gameWin) {
			setAverageTime((prevState) => [...prevState, roundTime]);
		}
	}, [startTime, gameWin, minutes, seconds]);

	return (
		<>
			<Header
				gameState={gameState}
				isFetching={isFetching}
				setSeconds={setSeconds}
				setMinutes={setMinutes}
				seconds={seconds}
				minutes={minutes}
				roundTime={roundTime}
			/>
			<div className={`gcolor${gen}${boardSize < 1 ? " game-intro" : ""}`}>
				<h1>
					Pokematch
					{boardSize > 0 && (
						<i class={`gcolor${gen}`}>
							GEN{" "}
							<span>
								{gen} / {TOTAL_GENS}
							</span>
						</i>
					)}
				</h1>
				{boardSize === 0 && <StartScreen handleDifficulty={handleDifficulty} />}
				{isFetching && <Loader pokeball={true} />}
				{error && (
					<p className={"error"}>
						Oh dang, something went wrong
						<br />
						{error}
					</p>
				)}
				{boardSize !== 0 && !isFetching && !error && (
					<>
						{deck && (
							<>
								<div className={`card-container deckgen-${gen} bs-${boardSize}`}>
									<PokeCard
										pokemons={deck}
										gameState={gameState}
										setGameState={setGameState}
										matchedCards={matchedCards}
										setMatchedCards={setMatchedCards}
									/>
								</div>
								<div className={`footerkinda ${gameWin ? "hide" : ""}`}>
									<Powerups
										gameState={gameState}
										setGameState={setGameState}
										setSeconds={setSeconds}
										matchedCards={matchedCards}
										setMatchedCards={setMatchedCards}
									/>
									<div class="restart-container">
										<button className={"btn refresh"} onClick={handleRestart}>
											<Refresh size={26} fill="#fff" />
											<br />
										</button>
									</div>
									<MuteButton gameState={gameState} setGameState={setGameState} />
								</div>
							</>
						)}
						{gameWin && (
							<GameOvered
								gameState={gameState}
								setGameState={setGameState}
								deck={deck}
								handleRestart={handleRestart}
								roundTime={roundTime}
								averageTime={averageTime}
							/>
						)}
					</>
				)}
			</div>
		</>
	);
}
