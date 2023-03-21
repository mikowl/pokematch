import { GameData } from "../types/other";
import { TOTAL_GENS } from "../api";
import { formatTime } from "../utils";
import Timer from "./Timer";

const Header = ({ gameState, isFetching }: { gameState: GameData; isFetching: boolean }) => {
	const { gameWin, boardSize, turns, totalTurns, gen, totalCaught } = gameState;
	const roundTime = formatTime(Date.now() - gameState.startTime);
	const averageScore: number = ((gen * boardSize) / 2 / totalTurns) * 100 * 1.5;
	// To add: Pokematching: ★★★☆☆
	return (
		<header>
			<p>
				-<span className={`header-turns`}>Turns: {turns}</span>
				{" ~ "}
				{totalCaught}/{(TOTAL_GENS * boardSize) / 2} caught ~ Time:{" "}
				{gameWin ? roundTime : boardSize === 0 ? "0:00" : !isFetching && <Timer />}
			</p>
		</header>
	);
};

export default Header;
