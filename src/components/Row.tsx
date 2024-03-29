import React from "react";
import { Divider } from "@material-ui/core";
import { Cell } from "../logic/sudoku-logic";
import { BoardCell } from "./BoardCell";

interface Props {
	row: Cell[];
	rowIndex: number;
	selectedCell?: Cell;
	disabled?: boolean;
	onCellClick: (cell: Cell) => void;
}

const dividerStyle = { height: 5, backgroundColor: "transparent" };

const Row = ({ row, rowIndex, selectedCell, disabled, onCellClick }: Props) => (
	<>
		<div className="table-row">
			{row.map((cell) => (
				<BoardCell
					key={`${cell.row}_${cell.col}`}
					cell={cell}
					disabled={disabled}
					isSelected={selectedCell === cell}
					onClick={onCellClick}
				/>
			))}
		</div>
		{rowIndex === 2 || rowIndex === 5 ? <Divider style={dividerStyle} /> : null}
	</>
);

export { Row };
