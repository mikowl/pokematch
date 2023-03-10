import MuteIcon from "./Icons/Mute";
import UnmuteIcon from "./Icons/Unmute";
import { GameData } from "../types/other";

const MuteButton = ({
	gameState,
	setGameState,
}: {
	gameState: GameData;
	setGameState: Function;
}) => {
	const handleMute = () => {
		setGameState({
			...gameState,
			mute: !gameState.mute,
		});
	};

	return (
		<div className={`muteBtn`}>
			<button onClick={handleMute}>
				{!gameState.mute ? (
					<MuteIcon width={32} height={32} fill={"#d12428"} />
				) : (
					<UnmuteIcon width={32} height={32} />
				)}
			</button>
		</div>
	);
};

export default MuteButton;
