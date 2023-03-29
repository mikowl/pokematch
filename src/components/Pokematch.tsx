import { useEffect, useState } from "preact/hooks";
import { usePokemon, TOTAL_GENS } from "../api";
import PokeCard from "./PokeCard";
import { Pokemon } from "../types/pokemon";
import { GameData } from "../types/other";
import { UseQueryResult } from "@tanstack/react-query";
import Loader from "./Loader";
import GameOvered from "./GameOvered";
import MuteButton from "./MuteButton";
import Refresh from "./Icons/Refresh";
import Header from "./Header";
import Powerups from "./Powerups";
import Pokeball from "./Icons/Pokeball";

type PokemonData = UseQueryResult<Pokemon[], Error>;

export default function Pokematch() {
	const getInitialGameState = (): GameData => {
		const APP_VERSION = "2.3.5";
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

		return {
			boardSize: 0,
			difficulty: 0,
			gameWin: false,
			gen: 1,
			mute: false,
			powerUps: [],
			startTime: 0,
			totalCaught: 0,
			totalTurns: 0,
			turns: 0,
		};
	};

	const [gameState, setGameState] = useState<GameData>(getInitialGameState());
	const { boardSize, gameWin, gen, startTime } = gameState;

	const { data, isLoading, isFetching, error, refetch }: PokemonData = usePokemon(gen, boardSize);
	const [deck, setDeck] = useState<Pokemon[]>([]);

	const [seconds, setSeconds] = useState<number>(0);
	const [minutes, setMinutes] = useState<number>(0);

	const [roundTime, setRoundTime] = useState<number | string>(0);
	const refetchData = async () => {
		await refetch();
	};

	if (data && !isLoading) {
		setDeck(data);
	}
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
		if (data && !isLoading) setDeck(data);
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
		// const roundTime = formatTime(Date.now() - startTime);
		const roundTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;
		setRoundTime(roundTime);
		const body = document.querySelector("body");
		gameWin ? body?.classList.add("game-over") : body?.classList.remove("game-over");
	}, [startTime, gameWin, minutes, seconds]);

	let content;

	if (boardSize === 0) {
		content = (
			<>
				<p className={"instructions"}>
					Match the Pokemon, complete all {TOTAL_GENS} generations to win!
					<br />
					Every round is unique!
					<br />
				</p>
				<div className={"difficulty"}>
					<h2 className={"blue-flash"}>Choose Difficulty:</h2>
					{/* <p>Hard recommended for desktop only</p> */}
					<button className={"btn easy"} onClick={handleDifficulty} value="12">
						Easy
					</button>
					<button className={"btn medium"} onClick={handleDifficulty} value="16">
						Medium
					</button>
					<button className={"btn hard"} onClick={handleDifficulty} value="20">
						Hard
					</button>
					<h4>Pokeball powers:</h4>
					<div className="powerup-descriptions">
						<div>
							<Pokeball className="turns-color" />
							<p>-2 turns</p>
						</div>
						<div>
							<Pokeball className="reveal-color" />
							<p>Reveal all</p>
						</div>
						<div>
							<Pokeball className="time-color" />
							<p>-10 seconds</p>
						</div>
					</div>
					{import.meta.env.VITE_DEBUG == "TRUE" && (
						<>
							<br />
							<br />
							<br />
							<button className={"btn dbg"} onClick={handleDifficulty} value="4">
								Debug
							</button>
						</>
					)}
					{/* <p className="tip">Tip: Press spacebar to use power ups</p> */}
				</div>
			</>
		);
	} else if (isFetching || isLoading) {
		content = <Loader pokeball={true} />;
	} else if (error) {
		content = (
			<p className={"error"}>
				{" "}
				Oh dang, something went wrong <br /> {error}{" "}
			</p>
		);
	} else {
		content = (
			<>
				<div className={`card-container deckgen-${gen} bs-${boardSize}`}>
					{deck && <PokeCard pokemons={deck} gameState={gameState} setGameState={setGameState} />}
				</div>
				{deck && (
					<div className={`footerkinda ${gameWin ? "hide" : ""}`}>
						<Powerups gameState={gameState} setGameState={setGameState} setSeconds={setSeconds} />
						<div class="restart-container">
							<button className={"btn refresh"} onClick={handleRestart}>
								<Refresh size={26} fill="#fff" />
								<br />
							</button>
						</div>
						<MuteButton gameState={gameState} setGameState={setGameState} />
					</div>
				)}
				{gameWin && (
					<GameOvered
						gameState={gameState}
						setGameState={setGameState}
						deck={deck}
						handleRestart={handleRestart}
						roundTime={roundTime}
					/>
				)}
			</>
		);
	}

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
			<div className={`gcolor${gen}`}>
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
				{content}
			</div>
		</>
	);
}
