import { useCallback } from "react";
import { useEffect, useState } from "react";

/**
 * get a random number in the given range
 * @param min -> starting range (inclusive)
 * @param max -> ending range (inclusive)
 */
const getRandomNumber = (min: number, max: number): number =>
	Math.floor(Math.random() * (max - min + 1) + min);

export interface Cell {
	row: number;
	col: number;
	content: number;
	valid: boolean;
	question: boolean;
}
export type Board = Cell[][];

interface Position {
	x: number;
	y: number;
}

/**
 * get the next zero occurence of a board
 * @param gameBoard -> board to find the next zero
 */
const getNextZero = (gameBoard: Board) => {
	for (let x = 0; x < 9; x++)
		for (let y = 0; y < 9; y++)
			// if it is zeros
			if (gameBoard[x][y].content === 0) return { x, y };
};

/**
 * check if a number is valid to put in a position
 * @param gameBoard -> board to check
 * @param position -> position to check
 * @param num -> number to put at that position
 */
const isValid = (
	gameBoard: Board,
	position: Position,
	num: number
): boolean => {
	// checking in rows
	if (gameBoard[position.x].some((cell) => cell.content === num))
		return false;

	// checking in columns
	for (let i = 0; i < 9; i++)
		if (gameBoard[i][position.y].content === num) return false;

	// check in the box
	const x = Math.floor(position.x / 3) * 3;
	const y = Math.floor(position.y / 3) * 3;

	for (let i = x; i < x + 3; i++)
		for (let j = y; j < y + 3; j++)
			if (gameBoard[i][j].content === num) return false;

	return true;
};

/**
 * solve the given SUDOKU board
 * @param gameBoard -> board to solve
 */
const solveBoard = (gameBoard: Board): boolean => {
	const position = getNextZero(gameBoard);

	if (position === undefined) return true;

	for (let num = 1; num < 10; num++) {
		if (isValid(gameBoard, position, num)) {
			gameBoard[position.x][position.y].content = num;
			gameBoard[position.x][position.y].valid = true;

			if (solveBoard(gameBoard)) return true;
			else gameBoard[position.x][position.y].content = 0;
		}
	}

	return false;
};
/**
 * create a completely random board
 */
const createRandomBoard = (): Board => {
	const initialBoard: Board = new Array(9).fill(0).map((_, i) =>
		new Array(9).fill(0).map((_, j) => ({
			row: i,
			col: j,
			content: 0,
			valid: false,
			question: false,
		}))
	);

	// no of initially filled cells
	let count = getRandomNumber(15, 25);

	while (count > 0) {
		const position: Position = {
			x: getRandomNumber(0, 8),
			y: getRandomNumber(0, 8),
		};
		const num = getRandomNumber(1, 9);

		if (isValid(initialBoard, position, num)) {
			initialBoard[position.x][position.y].content = num;
			initialBoard[position.x][position.y].question = true;
			initialBoard[position.x][position.y].valid = true;
			count--;
		}
	}

	const boardCopy = initialBoard.map((row) =>
		row.map((cell) => ({ ...cell }))
	);
	if (solveBoard(boardCopy)) return initialBoard;

	return createRandomBoard();
};

// cache the intial state of board to reset the board
let boardCache: Board | undefined;
// storing the next board created by a worker
// don't need to re-render when this changes
// 		-- reason not using a state for this
let nextBoard: Board | undefined;
// worker instance
const worker = new Worker("/worker.js");

/**
 * SUDOKU game logic custom hook
 */
const useSudoku = () => {
	const [board, setBoard] = useState<Board>([]);
	const [selectedCell, setSelectedCell] = useState<Cell>();
	const [gameOver, setGameOver] = useState<boolean>(false);

	// fetch the initial board only for first time
	useEffect(() => {
		// if there is a cache using it else creating new one
		let newBoard = boardCache;
		if (newBoard !== undefined) setBoard(newBoard);
		else newBoard = createRandomBoard();

		// setting the board and caching it
		setBoard(newBoard);
		boardCache = newBoard;

		// post message to worker to create a new board
		// if new board is received caching it
		worker.postMessage("START");
		worker.onmessage = (event) => {
			const { cmd, content }: { cmd: string; content: Board } =
				event.data;
			if (cmd === "BOARD") nextBoard = content;
		};
	}, []);

	// when board changes check if game is over
	useEffect(() => {
		if (
			board.length !== 0 &&
			board.every((row) =>
				row.every((cell) => cell.content !== 0 && cell.valid)
			) &&
			getNextZero(board) === undefined
		)
			setGameOver(true);
	}, [board]);

	useEffect(() => {
		const mouseDownListener = ({ code }: KeyboardEvent) => {
			// cheat code to solve the game :)
			if (code === "Space") {
				const boardCopy = board.map((row) =>
					row.map((cell) => ({ ...cell }))
				);
				solveBoard(boardCopy);
				setBoard(boardCopy);
				setGameOver(true);
				return;
			}

			// if nothing is selected do nothing
			if (selectedCell === undefined) return;

			// handling arrow key moves
			let x: number, y: number;
			switch (code) {
				case "ArrowLeft":
					x =
						selectedCell.col - 1 < 0
							? selectedCell.row - 1
							: selectedCell.row;
					y = selectedCell.col - 1 < 0 ? 8 : selectedCell.col - 1;
					if (selectedCell.row === 0 && selectedCell.col === 0)
						[x, y] = [8, 8];
					break;
				case "ArrowUp":
					x = selectedCell.row - 1 < 0 ? 8 : selectedCell.row - 1;
					y = selectedCell.col;
					break;
				case "ArrowRight":
					x =
						selectedCell.col + 1 > 8
							? selectedCell.row + 1
							: selectedCell.row;
					y = selectedCell.col + 1 > 8 ? 0 : selectedCell.col + 1;
					if (selectedCell.row === 8 && selectedCell.col === 8)
						[x, y] = [0, 0];
					break;
				case "ArrowDown":
					x = selectedCell.row + 1 > 8 ? 0 : selectedCell.row + 1;
					y = selectedCell.col;
					break;
				default:
					return;
			}
			setSelectedCell(board[x][y]);

			// handling number entering events
			if (code.includes("Digit")) {
				// if selected is a question or the game is over no need to handle number click
				if (selectedCell.question || gameOver) return;

				const boardCopy = board.map((row) =>
					row.map((cell) => ({ ...cell }))
				);
				const num = parseInt(code[code.length - 1]);
				boardCopy[selectedCell.row][selectedCell.col].valid = isValid(
					boardCopy,
					{
						x: selectedCell.row,
						y: selectedCell.col,
					},
					num
				);
				boardCopy[selectedCell.row][selectedCell.col].content = num;
				setBoard(boardCopy);
				return;
			}
		};
		window.addEventListener("keydown", mouseDownListener);
		return () => window.removeEventListener("keydown", mouseDownListener);
	}, [board, selectedCell, gameOver]);

	const onCellClick = useCallback(
		(cell: Cell) => {
			setSelectedCell(cell);
		},
		[setSelectedCell]
	);

	const onMobileOptionClick = useCallback(
		(cell: Cell) => {
			if (selectedCell === undefined || gameOver) return;

			const boardCopy = board.map((row) =>
				row.map((cell_) => ({ ...cell_ }))
			);
			boardCopy[selectedCell.row][selectedCell.col].valid = isValid(
				boardCopy,
				{
					x: selectedCell.row,
					y: selectedCell.col,
				},
				cell.content
			);
			boardCopy[selectedCell.row][selectedCell.col].content =
				cell.content;
			setBoard(boardCopy);
		},
		[board, selectedCell, gameOver, setBoard]
	);

	const newGame = useCallback(async () => {
		// checking if nextBoard is there
		// if yes using it else creating new
		let newBoard = nextBoard;
		if (newBoard === undefined) newBoard = createRandomBoard();
		setBoard(newBoard);
		setSelectedCell(undefined);
		setGameOver(false);
		boardCache = nextBoard;
		nextBoard = undefined;

		// posting message to worker to start creating a new board
		worker.postMessage("START");
	}, [setBoard, setSelectedCell, setGameOver]);

	const resetGame = useCallback(() => {
		if (boardCache) setBoard(boardCache);
	}, [setBoard]);

	return {
		board,
		selectedCell,
		gameOver,
		newGame,
		resetGame,
		onCellClick,
		onMobileOptionClick,
	};
};

export { useSudoku };
