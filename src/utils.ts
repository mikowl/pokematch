import confetti from "canvas-confetti";
import { Rating } from "./types/other";

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

export const ratingThresholds: { [key: number]: Rating[] } = {
	4: [
		{ turns: 2, rating: "★★★★★", title: "-Pokematch Master-" },
		{ turns: 4, rating: "★★★☆☆", title: "-Pokematch Rookie-" },
		{ turns: Infinity, rating: "★☆☆☆☆", title: "-Pokematch Noob-" },
	],
	12: [
		{ turns: 9, rating: "★★★★★", title: "-Pokematch Master-" },
		{ turns: 13, rating: "★★★★☆", title: "-Pokematch Trainer-" },
		{ turns: 15, rating: "★★★☆☆", title: "-Pokematch Rookie-" },
		{ turns: 17, rating: "★★☆☆☆", title: "-Pokematch Beginner-" },
		{ turns: Infinity, rating: "★☆☆☆☆", title: "-Pokematch Noob-" },
	],
	16: [
		{ turns: 12, rating: "★★★★★", title: "-Pokematch Master-" },
		{ turns: 18, rating: "★★★★☆", title: "-Pokematch Trainer-" },
		{ turns: 21, rating: "★★★☆☆", title: "-Pokematch Rookie-" },
		{ turns: 24, rating: "★★☆☆☆", title: "-Pokematch Beginner-" },
		{ turns: Infinity, rating: "★☆☆☆☆", title: "-Pokematch Noob-" },
	]
};

export const scoringMessages = (turns: number, boardSize: number): string => {
	// const size = boardSize === 12 ? 12 : 16;
	const { rating, title } = ratingThresholds[boardSize].find(
		(threshold) => turns <= threshold.turns
	)!;
	// wrap stars in span tag
	// return `${rating.padEnd(5, "☆")} ${title}`;
	return `<span>${rating}</span> ${title}`;
	
};


