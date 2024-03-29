import { useCallback } from "react";
import { useEffect, useState } from "react";
import sudokuWorker from "../sudoku.worker";

interface Position {
	x: number;
	y: number;
}

enum WorkerPostType {
	CREATE_BOARD = 0,
}

enum WorkerOutputType {
	BOARD = 0,
}
interface BoardOutput {
	type: WorkerOutputType.BOARD;
	payload: Board;
}
type WorkerOutput = BoardOutput;

export interface Cell {
	row: number;
	col: number;
	content: number;
	valid: boolean;
	question: boolean;
}
export type Board = Cell[][];

// utility function
const copy = (board: Board): Board =>
	board.map((row) => row.map((cell) => ({ ...cell })));

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

const getBoxStartValues = (position: Position) => {
	const x = Math.floor(position.x / 3) * 3;
	const y = Math.floor(position.y / 3) * 3;
	return { x, y };
};

/**
 * check if a number is valid to put in a position
 * @param gameBoard -> board to check
 * @param position -> position to check
 * @param num -> number to put at that position
 */
export const isValid = (
	gameBoard: Board,
	position: Position,
	num: number
): boolean => {
	// checking in rows
	if (gameBoard[position.x].some((cell) => cell.content === num)) return false;

	// checking in columns
	for (let i = 0; i < 9; i++)
		if (gameBoard[i][position.y].content === num) return false;

	// check in the box
	const { x, y } = getBoxStartValues(position);
	for (let i = x; i < x + 3; i++)
		for (let j = y; j < y + 3; j++)
			if (gameBoard[i][j].content === num) return false;

	return true;
};

// storing the steps involved in solving the game
const solvingSteps: { position: Position; content: number }[] = [];

/**
 * solve the given SUDOKU board
 * @param gameBoard -> board to solve
 */
export const solveBoard = (gameBoard: Board): boolean => {
	const position = getNextZero(gameBoard);

	if (position === undefined) return true;

	for (let num = 1; num < 10; num++) {
		if (isValid(gameBoard, position, num)) {
			solvingSteps.push({
				position,
				content: num,
			});
			gameBoard[position.x][position.y].content = num;
			gameBoard[position.x][position.y].valid = true;

			if (solveBoard(gameBoard)) return true;
			else {
				solvingSteps.push({
					position,
					content: 0,
				});
				gameBoard[position.x][position.y].content = 0;
			}
		}
	}

	return false;
};

// cache the intial state of board to reset the board
let boardCache: Board | undefined;
// storing the next board created by a worker
// don't need to re-render when this changes
// 		-- reason not using a state for this
let nextBoard: Board | undefined;
// worker instance
const worker: Worker = new sudokuWorker();

/**
 * SUDOKU game logic custom hook
 */
const useSudoku = () => {
	const [board, setBoard] = useState<Board>([]);
	const [selectedCell, setSelectedCell] = useState<Cell>();
	const [gameOver, setGameOver] = useState<boolean>(false);
	const [boardDisabled, setBoardDisabled] = useState(false);
	const [boardLoading, setBoardLoading] = useState(true);

	const visualizeSolving = useCallback(() => {
		if (boardCache === undefined || gameOver) return;
		setBoardDisabled(true);
		solvingSteps.length = 0;
		const solvedBoard = copy(boardCache);
		solveBoard(solvedBoard);

		let i = 0;
		solvingSteps.forEach(({ content, position }, index) => {
			i += 10;
			setTimeout(() => {
				setBoard((oldBoard) => {
					const boardCopy = copy(oldBoard);
					boardCopy[position.x][position.y] = {
						...boardCopy[position.x][position.y],
						valid: true,
						content,
					};
					return boardCopy;
				});
				if (index === solvingSteps.length - 1) {
					setGameOver(true);
					setBoardDisabled(false);
				}
			}, i);
		});

		boardCache = undefined;
		worker.postMessage(WorkerPostType.CREATE_BOARD);
	}, [gameOver, setBoard, setBoardDisabled]);

	const updateValidityStatus = useCallback(
		(position: Position, updatingBoard: Board) => {
			const boardCopy = copy(updatingBoard);
			const positions = new Set<Position>();

			// update rows
			boardCopy[position.x].forEach((cell) => {
				if (cell.content !== 0 && !cell.question)
					positions.add({
						x: cell.row,
						y: cell.col,
					});
			});

			// update columns
			for (let i = 0; i < 9; i++) {
				const cell = boardCopy[i][position.y];
				if (cell.content !== 0 && !cell.question)
					positions.add({
						x: cell.row,
						y: cell.col,
					});
			}

			// update box
			const { x, y } = getBoxStartValues(position);
			for (let i = x; i < x + 3; i++) {
				for (let j = y; j < y + 3; j++) {
					const cell = boardCopy[i][j];
					if (cell.content !== 0 && !cell.question)
						positions.add({
							x: cell.row,
							y: cell.col,
						});
				}
			}
			positions.forEach((position) => {
				const cellContent = boardCopy[position.x][position.y].content;
				// removing the number temporarily to validate the number
				// isValid function consider the number in the given position
				// so remove the number to make sure validation works (hacky fix for now)
				const tempContentStorage = boardCopy[position.x][position.y].content;
				boardCopy[position.x][position.y].content = 0;
				boardCopy[position.x][position.y].valid = isValid(
					boardCopy,
					position,
					cellContent
				);
				// adding back the content after validation check
				boardCopy[position.x][position.y].content = tempContentStorage;
			});
			return boardCopy;
		},
		[]
	);

	const placeNumber = useCallback(
		(num: number) => {
			if (selectedCell === undefined) return;
			const boardCopy = copy(board);
			if (boardCopy[selectedCell.row][selectedCell.col].content === num) return;

			const position: Position = {
				x: selectedCell.row,
				y: selectedCell.col,
			};
			boardCopy[selectedCell.row][selectedCell.col].valid = isValid(
				boardCopy,
				position,
				num
			);
			boardCopy[selectedCell.row][selectedCell.col].content = num;
			const validityUpdatedBoard = updateValidityStatus(position, boardCopy);
			// if wrong ans is pressed vibrate the device if possible (mobile)
			if (!validityUpdatedBoard[selectedCell.row][selectedCell.col].valid)
				navigator.vibrate(200);
			setBoard(validityUpdatedBoard);
		},
		[board, selectedCell, setBoard, updateValidityStatus]
	);

	const newGame = useCallback(() => {
		if (!gameOver) return;

		// checking if nextBoard is there
		// if yes using it else wait
		if (nextBoard === undefined) return setBoardLoading(true);
		else setBoardLoading(false);

		setBoard(nextBoard);
		setSelectedCell(undefined);
		setGameOver(false);
		boardCache = copy(nextBoard);
		nextBoard = undefined;

		// posting message to worker to start creating a new board
		worker.postMessage(WorkerPostType.CREATE_BOARD);
	}, [gameOver, setBoard, setSelectedCell, setGameOver, setBoardLoading]);

	const onCellClick = useCallback(
		(cell: Cell) => {
			if (boardDisabled) return;
			setSelectedCell(cell);
		},
		[setSelectedCell, boardDisabled]
	);

	const onMobileOptionClick = useCallback(
		(cell: Cell) => {
			if (selectedCell === undefined || gameOver) return;
			placeNumber(cell.content);
		},
		[selectedCell, gameOver, placeNumber]
	);

	const resetGame = useCallback(() => {
		if (boardCache !== undefined) setBoard(boardCache);
	}, [setBoard]);

	// when board changes check if game is over
	useEffect(() => {
		// intial game creation
		if (board.length === 0) {
			worker.postMessage(WorkerPostType.CREATE_BOARD);
			setBoardLoading(false);
		}

		worker.onmessage = (event) => {
			const { type, payload }: WorkerOutput = event.data;
			switch (type) {
				case WorkerOutputType.BOARD: {
					if (board.length === 0) {
						setBoard(payload);
						boardCache = copy(payload);
						worker.postMessage(WorkerPostType.CREATE_BOARD);
					} else {
						nextBoard = payload;
						if (boardLoading) newGame();
					}
				}
			}
		};

		// check if game is completed
		if (
			board.length !== 0 &&
			board.every((row) =>
				row.every((cell) => cell.content !== 0 && cell.valid)
			) &&
			getNextZero(board) === undefined
		)
			setGameOver(true);
	}, [board, boardLoading, newGame]);

	useEffect(() => {
		const mouseDownListener = ({ code }: KeyboardEvent) => {
			// if nothing is selected or board is visualizing (disabled) do nothing
			if (selectedCell === undefined || boardDisabled) return;

			// handling arrow key moves
			let x: number = selectedCell.row;
			let y: number = selectedCell.col;
			switch (code) {
				case "ArrowLeft":
					x =
						selectedCell.col - 1 < 0 ? selectedCell.row - 1 : selectedCell.row;
					y = selectedCell.col - 1 < 0 ? 8 : selectedCell.col - 1;
					if (selectedCell.row === 0 && selectedCell.col === 0) [x, y] = [8, 8];
					break;
				case "ArrowUp":
					x = selectedCell.row - 1 < 0 ? 8 : selectedCell.row - 1;
					y = selectedCell.col;
					break;
				case "ArrowRight":
					x =
						selectedCell.col + 1 > 8 ? selectedCell.row + 1 : selectedCell.row;
					y = selectedCell.col + 1 > 8 ? 0 : selectedCell.col + 1;
					if (selectedCell.row === 8 && selectedCell.col === 8) [x, y] = [0, 0];
					break;
				case "ArrowDown":
					x = selectedCell.row + 1 > 8 ? 0 : selectedCell.row + 1;
					y = selectedCell.col;
					break;
				default:
					break;
			}
			setSelectedCell(board[x][y]);

			// handling number entering events
			if (code.includes("Digit")) {
				// if selected is a question or the game is over no need to handle number click
				if (selectedCell.question || gameOver) return;

				const num = parseInt(code[code.length - 1]);
				placeNumber(num);
			}
		};
		window.addEventListener("keydown", mouseDownListener);
		return () => window.removeEventListener("keydown", mouseDownListener);
	}, [board, selectedCell, gameOver, boardDisabled, placeNumber]);

	return {
		board,
		selectedCell,
		gameOver,
		boardLoading,
		boardDisabled,
		newGame,
		resetGame,
		onCellClick,
		onMobileOptionClick,
		visualizeSolving,
	};
};

export { useSudoku };
