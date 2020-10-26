import React, { useState, useEffect, Fragment } from 'react';

import {
	Grid,
	Divider,
	Typography,
	IconButton,
	Snackbar,
	Button
} from "@material-ui/core";

import Alert from "@material-ui/lab/Alert";

import WbSunnyIcon from '@material-ui/icons/WbSunny';
import Brightness3Icon from '@material-ui/icons/Brightness3';

import { createRandomBoard, getAllPossibilities, find } from "../gameLogics";

export default function() {

	const [gameCompleted, setGameCompleted] = useState(false);
	const [solvedBoard, setSolvedBoard] = useState([]);
	const [possibilities, setPossibilities] = useState([]);
	const [selected, setSelected] = useState([0, 0]);
	const [table, setTable] = useState([]);
	const [darkTheme, setDarkTheme] = useState(false);
	const [alertMessage, setAlertMessage] = useState(false);

	const theme = {
		backgroundColor: darkTheme ? "black" : "white",
		color: darkTheme ? "white" : "black",
	};

	const themeSwitcher = {
		position: "fixed",
		top: 5,
		right: 5
	};

	const tableItem = {
		backgroundColor: darkTheme ? "#292929" : "#f6f6f6",
		borderColor: darkTheme ? "#545454" : "#e2e2e2",
		color: darkTheme ? "white" : "black",
	};

	const selectedStyle = {
		backgroundColor: darkTheme ? "#666" : "lightgrey",
	}

	const select = (i, j) => {
		console.log("selected ", i ,j )
		if (!gameCompleted)
			setSelected([i, j]);
	}

	const handleKeyPress = e => {
		let x,y;
		switch(e.keyCode) {
			case 37:
				x = selected[1] - 1 < 0 ? selected[0] - 1 : selected[0];
				y = selected[1] - 1 < 0 ? 8 : selected[1] - 1;
				if (selected[0] === 0 && selected[1] === 0) 
					[x, y] = [8,8];
				console.log("left ", x, y);
				break;
			case 38:
				x = selected[0] - 1 < 0 ? 8 : selected[0] - 1;
				y = selected[1];
				console.log("up", x, y)
				break;
			case 39:
				x = selected[1] + 1 > 8 ? selected[0] + 1 : selected[0];
				y = selected[1] + 1 > 8 ? 0 : selected[1] + 1;
				if (selected[0] === 8 && selected[1] === 8) 
					[x, y] = [0,0];
				console.log("right", x, y)
				break;
			case 40:
				x = selected[0] + 1 > 8 ? 0 : selected[0] + 1;
				y = selected[1];
				console.log("down", x, y)
				break;
			default:
				break;
		}
		select(x, y);
	}

	useEffect(() => {
		const [ques, ans] = createRandomBoard();
		setTable(ques);
		setSolvedBoard(ans);
		setDarkTheme(!!localStorage.getItem("theme"));
	}, [])

	useEffect(() => {
		localStorage.setItem("theme", theme ? "dark" : "");
	}, [theme])

	useEffect(() => {
		if (!!table.length && !table[selected[0]][selected[1]])
			setPossibilities(getAllPossibilities(table, selected));
		else
			setPossibilities([]);
	}, [table, selected])

	useEffect(() => {
		if (!!table.length && !find(table))
			setGameCompleted(true);
	}, [table])

	window.onkeydown = (e) => handleKeyPress(e);

	const newGame = () => window.location.reload();

	const setNumber = number => {
		const newTable = table.map(e => [...e]);
		if (solvedBoard[selected[0]][selected[1]] === number)
			newTable[selected[0]][selected[1]] = number;
		else 
			setAlertMessage(true);
		
		setTable(newTable);
	}

	const handleClose = (e,reason) => {
		if (reason === "clickaway")
			return;
		setAlertMessage(false);
	}

	return (
		<Grid 
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
								<button 
									onClick={() => setNumber(possibility)}
									className="table-item"
									style={tableItem}
								>
									{possibility || null}
								</button>
							)
						}
					</div>
					<div className="d-flex mt-5">
					{
						gameCompleted ? 
						<Button variant="contained" style={{
							backgroundColor: !darkTheme ? "black" : "white",
							color: !darkTheme ? "white" : "black",
						}} onClick={newGame}>
							New Game
						</Button>
						: null
					}
					</div>
				</div>
				<IconButton 
					style={themeSwitcher} 
					onClick={() => setDarkTheme(!darkTheme)}
				>
					{
						darkTheme ?
						<WbSunnyIcon style={theme} /> :
						<Brightness3Icon style={theme} />
					}
				</IconButton>
				{
					<Snackbar 
						open={alertMessage} 
						autoHideDuration={1000} 
						onClose={handleClose}
					>
						<Alert 
							elevation={6} 
							variant="filled" 
							onClose={handleClose} 
							severity="error" 
						>
							Wrong Answer
						</Alert>
					</Snackbar>
				}
			</Grid>
			<Grid item xs={12} md={6}>
				<div className="table-container">
					{
						table.map((row, i) => 
							<Fragment key={i}>
							<div className="table-row">
								{
									row.map((item, j) => 
										<Fragment key={j}>
										<button 
											onClick={() => select(i,j)}
											className="table-item"
											style={
												!gameCompleted &&
												i === selected[0] &&
												j === selected[1] ?
												{...tableItem, ...selectedStyle} :
												tableItem
											}
										>
											{item || null}
										</button>
										{
											j === 2 || j === 5 ?
											<Divider style={{
												width:5,
												backgroundColor: darkTheme ?
												 "black" : "white" 
											}} /> : null
										}
										</Fragment>
									)
								}
							</div>
							{
								i === 2 || i === 5 ?
								<Divider style={
									{ 
										height:5,
										backgroundColor: darkTheme ? "black" : "white" 
									}
								} /> : null
							}
							</Fragment>
						)
					}
				</div>
			</Grid>
		</Grid>
	)
}