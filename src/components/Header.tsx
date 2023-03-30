import { GameData } from "../types/other";
import { TOTAL_GENS } from "../api";
import Timer from "./Timer";
import ClockIcon from "./Icons/Clock";

const Header = ({
	gameState,
	isFetching,
	setMinutes,
	setSeconds,
	seconds,
	minutes,
	roundTime,
}: {
	gameState: GameData;
	isFetching: boolean;
	setMinutes: Function;
	setSeconds: Function;
	seconds: number;
	minutes: number;
	roundTime: number | string;
}) => {
	const { boardSize, gameWin, totalCaught, turns } = gameState;
	// const averageScore: number = ((gen * boardSize) / 2 / totalTurns) * 100 * 1.5;
	// To add: Pokematching: ★★★☆☆
	let timerContent;
	if (gameWin) {
		timerContent = roundTime;
	} else if (boardSize === 0) {
		timerContent = "0:00";
	} else if (!isFetching) {
		timerContent = (
			<Timer setMinutes={setMinutes} setSeconds={setSeconds} seconds={seconds} minutes={minutes} />
		);
	}

	return (
		<>
			<header>
				<div className="hdr-container">
					<span className={`clock-time`}>
						<ClockIcon size={20} fill="#FFF" />
						<span className={`timer ${gameWin || boardSize === 0 ? "off" : ""}`}>
							{timerContent}
						</span>
					</span>
					<span className={`header-turns`}>Turns: {turns}</span>
					<span className={`caught`}>
						{totalCaught}/{(TOTAL_GENS * boardSize) / 2} caught
					</span>
				</div>
			</header>
		</>
	);
};

export default Header;
