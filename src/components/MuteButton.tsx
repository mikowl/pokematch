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
				{!gameState.mute ? <MuteIcon fill={"#d12428"} /> : <UnmuteIcon />}
			</button>
		</div>
	);
};

export default MuteButton;
