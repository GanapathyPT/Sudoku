import React, { useState, useEffect } from "react";

import {
	Grid,
	Divider,
	Typography,
	Button,
} from "@material-ui/core";

import Table from "./Table";
import Cell from "./Cell";
import ErrorAlert from "./ErrorAlert";
import ThemeChanger from "./ThemeChanger";

import { 
	createRandomBoard, 
	getAllPossibilities, 
	find,
} from "../gameLogics";

export default function() {

	const [gameCompleted, setGameCompleted] = useState(false);
	const [solvedBoard, setSolvedBoard] = useState([]);
	const [possibilities, setPossibilities] = useState([]);
	const [selected, setSelected] = useState([0, 0]);
	const [table, setTable] = useState([]);
	const [darkTheme, setDarkTheme] = useState(false);
	const [alertMessage, setAlertMessage] = useState(false);

	// changing the color when dark mode is switched
	const theme = {
		backgroundColor: darkTheme ? "black" : "white",
		color: darkTheme ? "white" : "black",
	};

	// set the selected element when not game is completed
	const select = (i, j) => {
		if (!gameCompleted)
			setSelected([i, j]);
	}

	const moveSelected = ({ keyCode }) => {

		if (gameCompleted){
			newGame();				
			return;
		}

		const key = +keyCode;

		// handling the number event when the key is pressed
		if ((key > 96 && key < 106) || (key > 48 && key < 58)){
			// getting the number from both numpad and keyboard
			const number = key > 96 && key < 106 ? key - 96 : key - 48;
			// cloning the old table
			const newTable = table.map(e => [...e]);
			// checking for the pressed number is right
			if (solvedBoard[selected[0]][selected[1]] === number)
				newTable[selected[0]][selected[1]] = number;
			else
				setAlertMessage(true);

			setTable(newTable);
			return;
		}


		// moving the selected element on arrow key press
		let x,y;
		switch(keyCode) {
			case 32:
				setTable(solvedBoard);
				return;
			case 37: // left
				x = selected[1] - 1 < 0 ? selected[0] - 1 : selected[0];
				y = selected[1] - 1 < 0 ? 8 : selected[1] - 1;
				if (selected[0] === 0 && selected[1] === 0) 
					[x, y] = [8,8];
				break;
			case 38: // up
				x = selected[0] - 1 < 0 ? 8 : selected[0] - 1;
				y = selected[1];
				break;
			case 39: // right
				x = selected[1] + 1 > 8 ? selected[0] + 1 : selected[0];
				y = selected[1] + 1 > 8 ? 0 : selected[1] + 1;
				if (selected[0] === 8 && selected[1] === 8) 
					[x, y] = [0,0];
				break;
			case 40: // down
				x = selected[0] + 1 > 8 ? 0 : selected[0] + 1;
				y = selected[1];
				break;
			default:
				return;
		}
		select(x, y);
	}

	useEffect(() => {
		// creating the board and getting also the answer
		const [ques, ans] = createRandomBoard();
		setTable(ques);
		setSolvedBoard(ans);
		// getting the dark mode from localStorage
		setDarkTheme(!!localStorage.getItem("theme"));
	}, [])

	useEffect(() => {
		// setting the darkMode to localStorage when changed
		localStorage.setItem("theme", darkTheme ? "dark" : "");
	}, [darkTheme])

	useEffect(() => {
		// setting the possibilities only if the selected element has zero value
		if (!!table.length && !table[selected[0]][selected[1]])
			setPossibilities(getAllPossibilities(table, selected));
		else
			setPossibilities([]);
		// game is completed if there is no zero in table
		if (!!table.length && !find(table))
			setGameCompleted(true);
	}, [table, selected])

	// reloading the tab for crating new game
	const newGame = () => window.location.reload();

	// setting the number when the possibility item is clicked
	const setNumber = number => {
		const newTable = table.map(e => [...e]);
		if (solvedBoard[selected[0]][selected[1]] === number)
			newTable[selected[0]][selected[1]] = number;
		else 
			setAlertMessage(true);
		
		setTable(newTable);
	}

	// getting the screen and focussing it on every render
	const GAME = document.getElementById("game");
	if (!!GAME)
		GAME.focus();

	return (
		<Grid 
			id="game" 
			onKeyDown={moveSelected} 
			tabIndex="0"
			style={theme} 
			container 
			justify="center" 
			alignItems="center" 
			className="full-screen"
		>
			<Grid item xs={12} md={6}>
				<h1 className="sudoku">
					SUDOKU
				</h1>
				<p className="sub-title">
					game for puzzle lovers
				</p>
				<Divider style={theme} />
				<div className="lives-container">
					<div className="d-flex">
						<Typography variant="h6" component="p">
							{
								gameCompleted ?
								"GAME OVER" : 
									!!possibilities.length ? 
									"Possibilities :" :
									null
							}
						</Typography>
					</div>
					<div className="d-flex">
						{
							!gameCompleted &&
							possibilities.map((possibility, index) => 
								<Cell {...{
									item: possibility,
									darkTheme,
									onClick: () => setNumber(possibility),
								}} />
							)
						}
					</div>
					<div className="d-flex mt-5">
					{
						gameCompleted ? 
						<Button 
							variant="contained" 
							style={{
								backgroundColor: darkTheme ? "white" : "black",
								color: darkTheme ? "black" : "white",
							}} 
							onClick={newGame}
						>
							New Game
						</Button>
						: null
					}
					</div>
				</div>
				<ThemeChanger {...{
					theme,
					darkTheme,
					setDarkTheme,
				}} />
				<ErrorAlert {...{
					alertMessage,
					setAlertMessage,
				}} />
			</Grid>
			<Grid item xs={12} md={6}>
				<Table {...{
					table,
					darkTheme,
					selected,
					select
				}}/>
			</Grid>
		</Grid>
	)
}