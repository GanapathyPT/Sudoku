
const randomNumber = (min, max) => 
	Math.floor((Math.random() * (max - min + 1)) + min);


//finds next zero in the board 
function find(board)  {
	for(let i=0; i<9; i++){
		for(let j=0; j<9; j++){
			if(board[i][j] === 0){
				//return its position
				return [i,j];
			}
		}
	}
	// if zero not found
	return false
}
//check if the number is valid in that position
function isValid(board, num, pos)  {
	// check the row for the number
	if (board[pos[0]].includes(num))
		return false;

	/**
	|--------------------------------------------------
	| my old method to check whether the number is in the row
	|--------------------------------------------------
		for(let i=0; i<9; i++){
			if (board[pos[0]][i] === num){
				//number already exists in row
				return false;
			}
		}
	*/

	//check the column for the number
	for(let i=0; i<9; i++){
		if(board[i][pos[1]] === num){
			//number already exists in column
			return false;
		}
	}

	//check the box
	let x = Number.parseInt(pos[0] / 3) * 3;
	let y = Number.parseInt(pos[1] / 3) * 3;

	for(let i=x; i<x+3; i++){
		for(let j=y; j<y+3; j++){
			if(board[i][j] === num){
				//number exists in the box
				return false;
			}
		}
	}

	//the number is valid
	return true;
}

//solving the board
function solve (board)  {
	//get position of the first occuring zero
	let pos = find(board);
	//if not found game solved
	if(!pos)
		return true;

	for(let i=1; i<10; i++){
		//check all number for validity
		if(isValid(board, i, pos)){
			//adding valid number to the board
			board[pos[0]][pos[1]] = i;
			//call solve recursively untill no position is found
			if(solve(board)){
				//the board is solved
				return true;
			}
			//backtrack to last position by making it zero
			else{
				board[pos[0]][pos[1]] = 0;
			}
		}
	}
	//return false if no number is valid for the position
	return false;
}

//creating random question 
export function createRandomBoard()  {

	//creating board with all zeros
	let board = [];
	for(let i=0; i<9; i++){
		board.push([]);
		for(let j=0; j<9; j++)
			board[i].push(0);
	}
	//getting how many numbers to append in question randomly
	const n = randomNumber(40, 50);
	for(let i=0; i<n; i++){
		//getting random position
		const pos = [randomNumber(0,8), randomNumber(0,8)];
		//getting random number
		const num = randomNumber(1,9);
		//add only if it is valid
		if (isValid(board, num, pos))
			board[pos[0]][pos[1]] = num;
	}

	//copying the board
	const question = board.map(e => [...e]);

	//return only if it is solvable
	if(!solve(board))
		return createRandomBoard();
	return [question, board];
}