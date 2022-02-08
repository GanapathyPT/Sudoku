import React from "react";
import { Board, Cell } from "../logic/sudoku-logic";
import { Row } from "./Row";

interface Props {
	board: Board;
	selectedCell?: Cell;
	disabled?: boolean;
	onCellClick: (cell: Cell) => void;
}

const GameBoard = ({ board, selectedCell, disabled, onCellClick }: Props) => (
	<div className="table-container">
		{board.map((boardRow, i) => (
			<Row
				key={`${boardRow[i].row}_${boardRow[i].col}`}
				row={boardRow}
				rowIndex={i}
				disabled={disabled}
				selectedCell={selectedCell}
				onCellClick={onCellClick}
			/>
		))}
	</div>
);

export { GameBoard };
