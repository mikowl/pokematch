import { useRef } from "preact/hooks";
import useSound from "use-sound";
import { GameData, CardElement, PowerUps } from "../types/other";
import Pokeball from "./Icons/Pokeball";
import GameOvered from "./GameOvered";

export const powerUpInfo: PowerUps = {
	reveal: "Reveal cards",
	turns: "-2 turns",
	time: "-7 seconds",
	matchSet: "Match a set",
	flipAllCards: "Flip all cards",
};

export const randomPower = (): string => {
	const keys = Object.keys(powerUpInfo);
	const randomIndex = Math.floor(Math.random() * keys.length);
	return keys[randomIndex];
};

export const Powerups = ({
	gameState,
	setGameState,
	setSeconds,
	matchedCards,
	setMatchedCards,
}: {
	gameState: GameData;
	setGameState: Function;
	setSeconds: Function;
	matchedCards: CardElement[];
	setMatchedCards: Function;
}) => {
	const { mute, powerUps, totalTurns, turns } = gameState;
	const [playSuccess] = useSound("/sounds/success.mp3", { volume: 0.5 });
	const [playSuccess2] = useSound("/sounds/success2.mp3", { volume: 0.5 });
	const [playClick] = useSound("/sounds/click.mp3", { volume: 0.8 });
	const infoRef = useRef<Array<HTMLParagraphElement | null>>([]);

	const revealPower = (i: number) => {
		if (!mute) playSuccess2();
		// power up will temporarily show all cards
		const cards = document.querySelectorAll(".card-btn");
		// only add reveal class to cards that are not flipped
		cards.forEach((card) => {
			if (!card.classList.contains("flipped")) {
				card.classList.add("reveal");
			}
		});
		setGameState({
			...gameState,
			powerUps: [...gameState.powerUps.filter((_, index) => index !== i)],
		});

		setTimeout(() => {
			cards.forEach((card) => card.classList.remove("reveal"));
		}, 1500);
	};

	const turnsPower = (i: number) => {
		const turnsEl = document.querySelector(".header-turns");
		turnsEl?.classList?.add("animate-turns");
		setTimeout(() => {
			turnsEl?.classList?.remove("animate-turns");
		}, 3000);
		if (!mute) playSuccess2();
		// this feels a bit messy but is an easy way to make countdown effect
		setTimeout(() => {
			setGameState({
				...gameState,
				turns: turns - 1,
				powerUps: [...gameState.powerUps.filter((_, index) => index !== i)],
			});
		}, 500);
		setTimeout(() => {
			setGameState({
				...gameState,
				turns: turns - 2,
				totalTurns: totalTurns + 2,
				powerUps: [...gameState.powerUps.filter((_, index) => index !== i)],
			});
		}, 1000);
	};

	const timePower = (index: number) => {
		const timeEl = document.querySelector(".timer");
		timeEl?.classList?.add("animate-time");
		setTimeout(() => {
			timeEl?.classList?.remove("animate-time");
		}, 2000);
		if (!mute) playSuccess2();

		setGameState((prevState: GameData) => ({
			...prevState,
			powerUps: prevState.powerUps.filter((_, i) => i !== index),
		}));
		setSeconds((seconds: number) => seconds - 7);
	};

	const matchSetPower = (index: number) => {
		// check if .card-btn does not have the class .flipped
		const cards = document.querySelectorAll(".card-btn:not(.flipped)");
		// get data-name of first card
		// add flipped to all cards with the same data-name
		const firstCard = cards[0].getAttribute("data-name") as HTMLElement | null;
		cards.forEach((card) => {
			if (card.getAttribute("data-name") === firstCard) {
				card.classList.add("flipped", "animate-matched");
				setMatchedCards([...matchedCards, firstCard, card]);
				setTimeout(() => {
					card.classList.remove("animate-matched");
				}, 500);
			}
		});
		setGameState((prevState: GameData) => ({
			...prevState,
			powerUps: prevState.powerUps.filter((_, i) => i !== index),
		}));
		playClick();
	};

	const flipAllCards = (index: number) => {
		const cards = document.querySelectorAll(".card-btn:not(.flipped)");
		cards.forEach((card) => {
			card.classList.add("flipped", "animate-matched");
			// all cards matched
			setMatchedCards([...matchedCards, card]);
			setTimeout(() => {
				card.classList.remove("animate-matched");
			}, 500);
		});
		setGameState((prevState: GameData) => ({
			...prevState,
			totalCaught: prevState.totalCaught + cards.length / 2,
			powerUps: prevState.powerUps.filter((_, i) => i !== index),
		}));
		playClick();
		// set next gen after 2 seconds
		setTimeout(() => {
			setGameState((prevState: GameData) => ({
				...prevState,
				gameWin: true,
				// gen: prevState.gen + 1,
			}));
			playSuccess();
		}, 2000);
	}

	return (
		<div className={"power-ups"}>
			<span>Powerups</span>
			{powerUps.length === 0 ? (
				<button className={`power-up-btn aintgotnone`}>0</button>
			) : (
				powerUps.map((powerUp, index) => {
					const powerFunction = () => {
						switch (powerUp) {
							case "reveal":
								revealPower(index);
								break;
							case "turns":
								turnsPower(index);
								break;
							case "time":
								timePower(index);
								break;
							case "matchSet":
								matchSetPower(index);
								break;
							case "flipAllCards":
								flipAllCards(index);
								break;
							default:
								break;
						}
					};
					return (
						<div key={`${index  }-${  powerUp}`} style={{ display: "contents" }}>
							<button
								onClick={() => powerFunction()}
								onMouseEnter={() => {
									infoRef.current[index]?.classList?.add("active");
								}}
								onMouseLeave={() => {
									infoRef.current[index]?.classList?.remove("active");
								}}
								className={`power-up-btn`}
							>
								<Pokeball className={`${powerUp}-color`} alt={powerUpInfo[powerUp]} />
							</button>
							<p
								key={index}
								className="pu-info"
								ref={(el) => {
									infoRef.current[index] = el;
								}}
							>
								{powerUpInfo[powerUp]}
							</p>
						</div>
					);
				})
			)}
		</div>
	);
};
