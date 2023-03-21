import { FunctionComponent } from "preact";
import { useEffect, useState } from "preact/hooks";

const Timer: FunctionComponent = () => {
	const [seconds, setSeconds] = useState<number>(0);
	const [minutes, setMinutes] = useState<number>(0);

	useEffect(() => {
		const intervalId = setInterval(() => {
			setSeconds((seconds) => seconds + 1);
		}, 1000);
		return () => clearInterval(intervalId);
	}, []);

	useEffect(() => {
		if (seconds === 60) {
			setSeconds(0);
			setMinutes((minutes) => minutes + 1);
		}
	}, [seconds]);

	return <span className="timer">{`${minutes}:${seconds.toString().padStart(2, "0")}`}</span>;
};

export default Timer;
