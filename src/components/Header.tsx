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
	return (
		<>
			<header>
				<div className="hdr-container">
					<span className={`clock-time`}>
						<ClockIcon size={20} fill="#FFF" />
						{gameWin ? (
							<span className={`timer off`}>{roundTime}</span>
						) : boardSize === 0 ? (
							<span className={`timer off`}>0:00</span>
						) : (
							!isFetching && (
								<Timer
									setMinutes={setMinutes}
									setSeconds={setSeconds}
									seconds={seconds}
									minutes={minutes}
								/>
							)
						)}
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
