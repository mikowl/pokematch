import useSound from "use-sound";
import { GameData } from "../types/other";
import Pokeball from "./Icons/Pokeball";

const powerUpList = ["reveal", "turns"];

export const randomPower = () => {
	const randomNum = Math.floor(Math.random() * powerUpList.length);
	return powerUpList[randomNum];
};

const Powerups = ({ gameState, setGameState }: { gameState: GameData; setGameState: Function }) => {
	const { mute, powerUps, totalTurns, turns } = gameState;
	const [playSuccess2] = useSound("/sounds/success2.mp3", { volume: 0.5 });

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

	// TODO: use power up on spacebar press
	// useEffect(() => {
	// 	const handleSpacebar = (e: KeyboardEvent) => {
	// 		if (e.code === "Space" && powerUps > 0 && gameWin === false) {
	// 			e.preventDefault();
	// 			handlePowerUp();
	// 		}
	// 	};
	// 	document.addEventListener("keydown", handleSpacebar);
	// 	return () => {
	// 		document.removeEventListener("keydown", handleSpacebar);
	// 	};
	// }, []);

	return (
		<div className={"power-ups"}>
			<span>Powerups</span>
			{powerUps.length === 0 ? (
				<button className={`power-up-btn aintgotnone`}>0</button>
			) : (
				powerUps.map((powerUp, index) => {
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
				})
			)}
		</div>
	);
};

export default Powerups;
