import React, { memo } from "react";
import { Divider } from "@material-ui/core";
import { Cell } from "../logic/sudoku-logic";

interface Props {
	cell: Cell;
	isSelected?: boolean;
	disabled?: boolean;
	onClick: (cell: Cell) => void;
}

const dividerStyle = { width: 5, backgroundColor: "transparent" };

const BoardCell = memo(({ cell, isSelected, disabled, onClick }: Props) => (
	<>
		{console.log("render")}
		<button
			onClick={() => onClick(cell)}
			className={`table-item ${isSelected ? "selected" : ""} ${
				cell.valid ? "" : "error"
			} ${cell.question ? "bold" : ""} ${disabled ? "disabled" : ""}`}
			style={{ animationDelay: Math.floor(Math.random() * 500) + "ms" }}
			data-testid="cell"
		>
			{cell.content === 0 ? null : cell.content}
		</button>
		{cell.col === 2 || cell.col === 5 ? <Divider style={dividerStyle} /> : null}
	</>
));

export { BoardCell };
