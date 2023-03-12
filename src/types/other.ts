import { PokemonGeneration } from './pokemon';

export type IconProps = {
	width: number;
	height: number;
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
};

export type BoardSize = { [key: number]: number } 
