import useSound from "use-sound";
import { GameData, CardElement } from "../types/other";
import Pokeball from "./Icons/Pokeball";

const powerUpList = ["reveal", "turns", "time", "matchSet"];

export const randomPower = () => {
	const randomNum = Math.floor(Math.random() * powerUpList.length);
	return powerUpList[randomNum];
};

const Powerups = ({
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
	const [playSuccess2] = useSound("/sounds/success2.mp3", { volume: 0.5 });
	const [playClick] = useSound("/sounds/click.mp3", { volume: 0.8 });

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
		turnsEl?.classList.add("animate-turns");
		setTimeout(() => {
			turnsEl?.classList.remove("animate-turns");
		}, 3000);
		if (!mute) playSuccess2();
		setGameState({
			...gameState,
			totalTurns: totalTurns - 2,
			powerUps: [...gameState.powerUps.filter((_, index) => index !== i)],
		});
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
				powerUps: [...gameState.powerUps.filter((_, index) => index !== i)],
			});
		}, 1000);
	};

	const timePower = (index: number) => {
		const timeEl = document.querySelector(".timer");
		timeEl?.classList.add("animate-time");
		setTimeout(() => {
			timeEl?.classList.remove("animate-time");
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
						default:
							break;
						}
					};
					return (
						<button onClick={() => powerFunction()} className={`power-up-btn`} key={index}>
							<Pokeball className={`${powerUp}-color`} />
						</button>
					);
				})
			)}
		</div>
	);
};

export default Powerups;
