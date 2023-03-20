import confetti from "canvas-confetti";

export const shuffle = (array: any[]) => {
	return array.sort(() => Math.random() - 0.5);
};

// range utility
// example:
// {range(5).map((i) => (
// 	<Comp key={i + 1} value={squares[i]} /> 
// ))}
export const range = (start: number, end?: number, step = 1) => {
	const output = [];
	if (typeof end === 'undefined') {
		end = start;
		start = 0;
	}
	for (let i = start; i < end; i += step) {
		output.push(i);
	}
	return output;
};

// format time to minutes and seconds function
export function formatTime(timestamp:number) {
	const minutes = Math.floor(timestamp / 60000); // 1 minute = 60000 ms
	const seconds = Math.floor((timestamp - minutes * 60000) / 1000); // 1 second = 1000 ms
	const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
	return `${minutes}:${formattedSeconds}`;
}

export function timeToSeconds(time: number | string): number {
	if (typeof time === 'string') {
		const [minutes, seconds] = time.split(':');
		return Number(minutes) * 60 + Number(seconds);
	} 
	return time;
}

export const omgConfetti = () => {
	confetti({
		particleCount: 300,
		startVelocity: 50,
		spread: 360,
		shapes: ["circle"],
		disableForReducedMotion: true,
		colors: ["#222E66", "#4962D6", "#FFCB05", "#CA370B", "#5e3f89", "#f0b7bc", "#b0e0e6"],
	});
};
export const pewpewpew = () => {
	setTimeout(omgConfetti, 1000);
	setTimeout(omgConfetti, 2000);
};


export const ratingThresholds = (boardSize: number) => [
	{ turns: Math.floor(boardSize * 0.75), rating: "★★★★★", title: "-Pokematch Master-" },
	{ turns: Math.floor(boardSize * 1.1), rating: "★★★★☆", title: "-Pokematch Trainer-" },
	{ turns: Math.floor(boardSize * 1.25), rating: "★★★☆☆", title: "-Pokematch Rookie-" },
	{ turns: Math.floor(boardSize * 1.5), rating: "★★☆☆☆", title: "-Pokematch Beginner-" },
	{ turns: Infinity, rating: "★☆☆☆☆", title: "-Pokematch Noob-" },
];

export const scoringMessages = (turns: number, boardSize: number): string => {
	const { rating, title } = ratingThresholds(boardSize).find(
		(threshold) => turns <= threshold.turns
	)!;
	return `<span>${rating}</span> ${title}`;
};



