import { PokemonGeneration } from './pokemon';

export type IconProps = {
	size?: number;
	fill?: string;
	styles?: any;
	className?: string;
};

export type GameData = {
	boardSize: number;
	difficulty: number;
	gameWin: boolean;
	gen: PokemonGeneration;
	mute: boolean;
	powerUps: string[];
	startTime: number;
	totalCaught: number;
	totalTurns: number;
	turns: number;
}

// export type BoardSize = { [key: number]: number } 

export type BoardSize = Record<number, number>

export type Rating = {
	turns: number;
	rating: string;
	title: string;
};

export type CardElement = HTMLButtonElement | string;
export type Cards = CardElement[] | HTMLButtonElement[];