import "./App.css";
import React from "react";
import { Grid, Button } from "@material-ui/core";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import { ThemeChanger } from "./components/ThemeChanger";
import { GameBoard } from "./components/Board";
import { MobileInput } from "./components/MobileInput";
import { useSudoku } from "./logic/sudoku-logic";
import { useTheme } from "./logic/theme-logic";

const newGameButtonStyle: CSSProperties = {
	backgroundColor: "#000",
	color: "#fff",
	marginTop: 20,
};

const App = () => {
	const {
		board,
		selectedCell,
		gameOver,
		resetGame,
		newGame,
		onCellClick,
		onMobileOptionClick,
	} = useSudoku();
	const { darkMode, onThemeChange } = useTheme();

	const theme: CSSProperties = {
		backgroundColor: darkMode ? "#000" : "#fff",
		color: darkMode ? "#fff" : "#000",
	};
	const inverseTheme: CSSProperties = {
		backgroundColor: darkMode ? "#fff" : "#000",
		color: darkMode ? "#000" : "#fff",
	};

	return (
		<Grid
			container
			justify="center"
			alignItems="center"
			className="full-screen"
		>
			<Grid item xs={12} md={6}>
				<h1 style={theme} className="sudoku">
					SUDOKU
				</h1>
				<p style={theme} className="sub-title">
					game for puzzle lovers
				</p>
				{gameOver ? null : (
					<MobileInput onMobileOptionClick={onMobileOptionClick} />
				)}
				<Button
					variant="contained"
					style={{ ...newGameButtonStyle, ...inverseTheme }}
					onClick={gameOver ? newGame : resetGame}
				>
					{gameOver ? "New Game" : "Reset Game"}
				</Button>
				<ThemeChanger theme={darkMode} onThemeChange={onThemeChange} />
			</Grid>
			<Grid item xs={12} md={6}>
				<GameBoard
					board={board}
					onCellClick={onCellClick}
					selectedCell={selectedCell}
				/>
			</Grid>
		</Grid>
	);
};

export default App;
