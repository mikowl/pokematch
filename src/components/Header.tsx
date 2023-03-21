import { GameData } from "../types/other";
import { TOTAL_GENS } from "../api";
import { formatTime } from "../utils";
import Timer from "./Timer";

const Header = ({ gameState }: { gameState: GameData }) => {
	const { gameWin, boardSize, turns, totalCaught } = gameState;
	const roundTime = formatTime(Date.now() - gameState.startTime);
	// To add: Pokematching: ★★★☆☆
	return (
		<header>
			<p>
				-<span className="header-turns">Turns: {turns} ~</span> {totalCaught}/
				{(TOTAL_GENS * boardSize) / 2} caught ~ Time:{" "}
				{gameWin ? roundTime : boardSize === 0 ? "0:00" : <Timer />}-
			</p>
		</header>
	);
};

export default Header;
