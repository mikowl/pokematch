import { GameData } from "../types/other";
import Pokeball from "./Icons/Pokeball";
import { playSoundEffect } from "../sounds";

const powerUpList = ["reveal", "turns"];

export const randomPower = () => {
	const randomNum = Math.floor(Math.random() * powerUpList.length);
	return powerUpList[randomNum];
};

const Powerups = ({ gameState, setGameState }: { gameState: GameData; setGameState: Function }) => {
	const { mute, powerUps2, turns, totalTurns } = gameState;

	const revealPower = (i: number) => {
		playSoundEffect("success2", mute);
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
			powerUps2: [...gameState.powerUps2.filter((_, index) => index !== i)],
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
		playSoundEffect("success2", mute);
		setGameState({
			...gameState,
			turns: turns - 2,
			totalTurns: totalTurns - 2,
			powerUps2: [...gameState.powerUps2.filter((_, index) => index !== i)],
		});
	};

	return (
		<div className={"power-ups"}>
			<span>Powerups</span>
			{powerUps2.map((powerUp, index) => {
				const powerFunction = () => {
					if (powerUp === "reveal") {
						revealPower(index);
					} else if (powerUp === "turns") {
						turnsPower(index);
					}
				};
				return (
					<button onClick={() => powerFunction()} className={`power-up-btn`} key={index}>
						<Pokeball className={`${powerUp}-color`} />
					</button>
				);
			})}
		</div>
	);
};

export default Powerups;
