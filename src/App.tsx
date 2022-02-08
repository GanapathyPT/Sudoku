import "./App.css";
import React from "react";
import { Grid, Button, CircularProgress } from "@material-ui/core";
import { ThemeChanger } from "./components/ThemeChanger";
import { GameBoard } from "./components/Board";
import { MobileInput } from "./components/MobileInput";
import { useSudoku } from "./logic/sudoku-logic";
import { useTheme } from "./logic/theme-logic";
import { Header } from "./components/Header";
import { Crackers } from "./components/Crackers";

const App = () => {
	const {
		board,
		selectedCell,
		gameOver,
		boardLoading,
		resetGame,
		newGame,
		onCellClick,
		onMobileOptionClick,
		visualizeSolving,
	} = useSudoku();
	const { darkMode, inverseTheme, normalTheme, onThemeChange } = useTheme();

	return (
		<Grid
			container
			justify="center"
			alignItems="center"
			className="full-screen"
		>
			<Grid item xs={12} md={6}>
				<Crackers gameOver={gameOver} />
				<Header title="SUDOKU" subTitle="game for puzzle lovers" />
				<MobileInput
					onMobileOptionClick={onMobileOptionClick}
					gameOver={gameOver}
				/>
				<div style={{ marginTop: 20 }}>
					<Button
						variant="contained"
						style={{ ...inverseTheme }}
						onClick={gameOver ? newGame : resetGame}
					>
						{gameOver ? "New Game" : "Reset Game"}
					</Button>

					<Button
						variant="contained"
						style={{ marginLeft: 10, ...normalTheme }}
						onClick={visualizeSolving}
					>
						Visualize
					</Button>
				</div>
				<ThemeChanger theme={darkMode} onThemeChange={onThemeChange} />
			</Grid>
			<Grid item xs={12} md={6}>
				{boardLoading ? (
					<CircularProgress style={{ color: inverseTheme.backgroundColor }} />
				) : (
					<GameBoard
						board={board}
						onCellClick={onCellClick}
						selectedCell={selectedCell}
					/>
				)}
			</Grid>
		</Grid>
	);
};

export default App;
