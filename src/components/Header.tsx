import { GameData } from "../types/other";
import { TOTAL_GENS } from "../api";
import { formatTime } from "../utils";
import Timer from "./Timer";
import ClockIcon from "./Icons/Clock";

const Header = ({ gameState, isFetching }: { gameState: GameData; isFetching: boolean }) => {
	const { boardSize, gameWin, totalCaught, turns } = gameState;
	const roundTime = formatTime(Date.now() - gameState.startTime);
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
							!isFetching && <Timer />
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
