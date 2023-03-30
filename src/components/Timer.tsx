import { useEffect } from "preact/hooks";

const Timer = ({
	setMinutes,
	setSeconds,
	minutes,
	seconds,
}: {
	setMinutes: Function;
	setSeconds: Function;
	minutes: number;
	seconds: number;
}) => {
	useEffect(() => {
		const intervalId = setInterval(() => {
			setSeconds((seconds: number) => seconds + 1);
		}, 1000);
		return () => clearInterval(intervalId);
	}, [setSeconds]);

	useEffect(() => {
		if (seconds === 60) {
			setSeconds(0);
			setMinutes((minutes: number) => minutes + 1);
		}
	}, [seconds, setMinutes, setSeconds]);

	return <i>{`${minutes}:${seconds.toString().padStart(2, "0")}`}</i>;
};

export default Timer;
