import React, { useState, useEffect, Fragment } from 'react';

import {
	Grid,
	Divider,
	Typography,
	IconButton
}from "@material-ui/core";

import FavoriteIcon from '@material-ui/icons/Favorite';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import Brightness3Icon from '@material-ui/icons/Brightness3';

import { createRandomBoard } from "../gameLogics";

export default function() {

	const [gameCompleted, setGameCompleted] = useState(false);
	const [solvedBoard, setSolvedBoard] = useState([]);
	const [lives, setLives] = useState(5);
	const [selected, setSelected] = useState([0, 0]);
	const [table, setTable] = useState([]);
	const [timer, setTimer] = useState(null);
	const [mobileInput, setMobileInput] = useState(null);
	const [darkTheme, setDarkTheme] = useState(false);

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
		const mi = document.getElementById('mobileInput');
		mi.focus();
		if (!gameCompleted)
			setSelected([i, j]);
	}

	const handleKeyPress = e => {
		if (gameCompleted)
			return;

		const key = +e.keyCode;

		if ((key > 96 && key < 106) || (key > 48 && key < 58)){
			if (!table[selected[0]][selected[1]]){
				const number = key > 96 && key < 106 ? key - 96 : key - 48;
				if (selected[0] !== null && selected[1] !== null){
					const newTable = table.map(e => [...e]);
					if (solvedBoard[selected[0]][selected[1]] === number)
						newTable[selected[0]][selected[1]] = number;
					else
						setLives(l => l - 1);
					
					setTable(newTable);
				}
			}
		}
		else if (key > 36 && key < 41){
			switch(key) {
				case 37:
					let x1 = selected[1] - 1 < 0 ? selected[0] - 1 : selected[0];
					let y1 = selected[1] - 1 < 0 ? 8 : selected[1] - 1;
					if (selected[0] === 0 && selected[1] === 0) 
						[x1, y1] = [8,8];
					setSelected([x1, y1]);
					break;
				case 38:
					const x2 = selected[0] - 1 < 0 ? 8 : selected[0] - 1;
					const y2 = selected[1];
					setSelected([x2, y2]);
					break;
				case 39:
					let x3 = selected[1] + 1 > 8 ? selected[0] + 1 : selected[0];
					let y3 = selected[1] + 1 > 8 ? 0 : selected[1] + 1;
					if (selected[0] === 8 && selected[1] === 8) 
						[x3, y3] = [0,0];
					setSelected([x3, y3]);
					break;
				case 40:
					const x4 = selected[0] + 1 > 8 ? 0 : selected[0] + 1;
					const y4 = selected[1];
					setSelected([x4, y4]);
					break;
				default:
					setSelected([null, null]);
			}
		}
	}

	const countdown = () => setTimer(s => s - 1);


	useEffect(() => {
		if (lives === 0){
			setTable(solvedBoard);
			setGameCompleted(true);
			setSelected([null, null]);
			setTimer(10);
			setInterval(countdown, 1000);
		}
	}, [lives, solvedBoard])

	useEffect(() => {
		const [ques, ans] = createRandomBoard();
		setTable(ques);
		setSolvedBoard(ans);
		setDarkTheme(!!localStorage.getItem("theme"));
	}, [])

	useEffect(() => {
		localStorage.setItem("theme", theme ? "dark" : "");
	}, [theme])

	window.onkeydown = handleKeyPress;

	const newGame = () => window.location.reload();

	if (timer === 0){
		clearInterval(countdown);
		newGame();
	}

	const handleInput = e => {
		const number = +e.target.value;
		if (number > 0 && number < 10){
			const newTable = table.map(e => [...e]);
			if (solvedBoard[selected[0]][selected[1]] === number){
				newTable[selected[0]][selected[1]] = number;
				setMobileInput(number);
			}
			else
				setLives(l => l - 1);
			
			setTable(newTable);
		}
		setMobileInput(null);
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
								"GAME OVER" : "Lives :"
							}
						</Typography>
						<div className="ml-5">
							{
								[...Array(lives >= 0 ? lives : 0)].map(e => 
									<FavoriteIcon style={theme} className="lives" />
								)
							}
						</div>
					</div>
					<div className="d-flex dir-c mt-5">
					{
						gameCompleted ? 
						<Fragment>
							<p>
								{`starting new game in ${timer} seconds`}
							</p>
							<p onClick={newGame} className="instant-link">
								start now
							</p>
						</Fragment>
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
			</Grid>
			<Grid item xs={12} md={6}>
				<div className="table-container">
					{
						table.map((row, i) => 
							<Fragment>
							<div className="table-row">
								{
									row.map((item, j) => 
										<Fragment>
										<button 
											type="text"
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
				<input 
					id="mobileInput"
					autoFocus 
					type="text" 
					value={mobileInput} 
					onChange={handleInput} 
					className="hidden-input" 
				/>
			</Grid>
		</Grid>
	)
}