export type DreidelLetter = 'נ' | 'ג' | 'ה' | 'פ';

export const DREIDEL_LETTERS: DreidelLetter[] = ['נ', 'ג', 'ה', 'פ'];

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export type InputMethod = 'DIGITAL' | 'PHYSICAL';

export interface GameNode {
  id: number;
  letter: DreidelLetter | 'START' | 'END';
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  connections: number[]; // IDs of connected nodes
}

export interface Player {
  id: number;
  name: string;
  color: string;
  avatarColor: string;
  currentNodeId: number;
}

export type GameStatus = 'SETUP' | 'PLAYING' | 'FINISHED';

export interface GameState {
  status: GameStatus;
  difficulty: Difficulty;
  inputMethod: InputMethod;
  players: Player[];
  currentPlayerIndex: number;
  maze: GameNode[];
  lastSpinResult: DreidelLetter | null;
  isSpinning: boolean;
  winner: Player | null;
  turnMessage: string;
  validNextNodes: number[]; // IDs of nodes the player can move to
}