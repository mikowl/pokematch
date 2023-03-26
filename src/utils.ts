
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

export const isMobile = () => {
	return window.innerWidth <= 768;
};

// format time to minutes and seconds function
export function formatTime(timestamp:number) {
	const minutes = Math.floor(timestamp / 60000); // 1 minute = 60000 ms
	const seconds = Math.floor((timestamp - minutes * 60000) / 1000); // 1 second = 1000 ms
	const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
	return `${minutes}:${formattedSeconds}`;
}

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

export const convertScoreToGrade = (score: number) => {
	if (score >= 96) return "A+";
	if (score >= 93) return "A";
	if (score >= 90) return "A-";
	if (score >= 86) return "B+";
	if (score >= 83) return "B";
	if (score >= 80) return "B-";
	if (score >= 76) return "C+";
	if (score >= 73) return "C";
	if (score >= 70) return "C-";
	if (score >= 66) return "D+";
	if (score >= 63) return "D";
	if (score >= 60) return "D-";
	return "F";
};

function timeToSeconds(time: number | string): number {
	if (typeof time === 'string') {
		const [minutes, seconds] = time.split(':');
		return Number(minutes) * 60 + Number(seconds);
	} 
	return time;
}

export const timeClass = (boardSize: number, roundTime: number | string) => {
	if (boardSize <= 12) {
		if (timeToSeconds(roundTime) <= 20) return "fiyahhh flash";
		if (timeToSeconds(roundTime) <= 26) return "flash";
		return;
	}
	if (boardSize <= 16) {
		if (timeToSeconds(roundTime) < 37) return "fiyahhh flash";
		if (timeToSeconds(roundTime) <= 41) return "flash";
		return;
	}
	if (boardSize <= 20) {
		if (timeToSeconds(roundTime) < 55) return "fiyahhh flash";
		if (timeToSeconds(roundTime) <= 65) return "flash";
	}
};

