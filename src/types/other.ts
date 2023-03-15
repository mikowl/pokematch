import { PokemonGeneration } from './pokemon';

export type IconProps = {
	size?: number;
	fill?: string;
};

export type GameData = {
	turns: number;
	totalTurns: number;
	gameWin: boolean;
	gen: PokemonGeneration;
	mute: boolean;
	difficulty: number;
	boardSize: number;
	startTime: number;
}

// export type BoardSize = { [key: number]: number } 

export type BoardSize = Record<number, number>