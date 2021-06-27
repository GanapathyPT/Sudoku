import React from "react";
import { Cell } from "../logic/sudoku-logic";
import { BoardCell } from "./BoardCell";

interface Props {
	gameOver: boolean;
	onMobileOptionClick: (cell: Cell) => void;
}

const MobileInput = ({ onMobileOptionClick, gameOver }: Props) =>
	gameOver ? null : (
		<div className="mobile-input">
			{new Array(9).fill(0).map((_, i) => (
				<BoardCell
					key={i + 1}
					cell={{
						row: 0,
						col: 0,
						content: i + 1,
						question: false,
						valid: true,
					}}
					onClick={onMobileOptionClick}
				/>
			))}
		</div>
	);

export { MobileInput };
