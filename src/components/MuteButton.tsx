import MuteIcon from "./Icons/Mute";
import UnmuteIcon from "./Icons/Unmute";

const MuteButton = ({ setMute, mute }: { setMute: Function; mute: boolean }) => {
	const handleMute = () => {
		setMute(!mute);
	};

	return (
		<div className={`muteBtn`}>
			<button onClick={handleMute}>
				{!mute ? (
					<MuteIcon width={32} height={32} fill={"#d12428"} />
				) : (
					<UnmuteIcon width={32} height={32} />
				)}
			</button>
		</div>
	);
};

export default MuteButton;
