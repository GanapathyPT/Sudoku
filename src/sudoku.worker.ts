declare const self: Worker;
export default {} as typeof Worker & { new (): Worker };

interface Position {
	x: number;
	y: number;
}

enum WorkerInputType {
	CREATE_BOARD = 0,
}

enum WorkerOutputType {
	BOARD = 0,
}

interface Cell {
	row: number;
	col: number;
	content: number;
	valid: boolean;
	question: boolean;
}
type Board = Cell[][];

// utility function
const getRandomNumber = (min: number, max: number) =>
	Math.floor(Math.random() * (max - min + 1) + min);

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
	const x = Math.floor(position.x / 3) * 3;
	const y = Math.floor(position.y / 3) * 3;

	for (let i = x; i < x + 3; i++)
		for (let j = y; j < y + 3; j++)
			if (gameBoard[i][j].content === num) return false;

	return true;
};

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
 * create a new random board
 */
const createRandomBoard = (): Board => {
	const initialBoard = new Array(9).fill(0).map((_, i) =>
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
		const position = {
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

	const boardCopy = initialBoard.map((row) => row.map((cell) => ({ ...cell })));
	if (solveBoard(boardCopy)) return initialBoard;

	return createRandomBoard();
};

// event handler when main thread post message
self.addEventListener("message", (event) => {
	const cmd: WorkerInputType = event.data;
	switch (cmd) {
		case WorkerInputType.CREATE_BOARD: {
			const board = createRandomBoard();
			self.postMessage({
				type: WorkerOutputType.BOARD,
				payload: board,
			});
		}
	}
});
