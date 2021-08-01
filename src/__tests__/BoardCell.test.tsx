import React from "react";
import { render, screen } from "@testing-library/react";
import { BoardCell } from "../components/BoardCell";

describe("BOARD_CELL", () => {
	it("should not change bg color is cell is not selected", () => {
		render(
			<BoardCell
				cell={{
					row: 1,
					col: 1,
					content: 0,
					question: false,
					valid: true,
				}}
				onClick={jest.fn}
				isSelected={false}
			/>
		);
		const cellButton = screen.getByTestId("cell");
		expect(cellButton.classList.contains("selected")).not.toBeTruthy();
	});

	it("should change bg color is cell is not selected", () => {
		render(
			<BoardCell
				cell={{
					row: 1,
					col: 1,
					content: 0,
					question: false,
					valid: true,
				}}
				onClick={jest.fn}
				isSelected={true}
			/>
		);
		const cellButton = screen.getByTestId("cell");
		expect(cellButton.classList.contains("selected")).toBeTruthy();
	});

	it("should have color red if it is not valid", () => {
		render(
			<BoardCell
				cell={{
					row: 1,
					col: 1,
					content: 0,
					question: false,
					valid: false,
				}}
				onClick={jest.fn}
				isSelected={true}
			/>
		);
		const cellButton = screen.getByTestId("cell");
		expect(cellButton.classList.contains("error")).toBeTruthy();
	});

	it("should not have color red if it is not valid", () => {
		render(
			<BoardCell
				cell={{
					row: 1,
					col: 1,
					content: 0,
					question: false,
					valid: true,
				}}
				onClick={jest.fn}
				isSelected={true}
			/>
		);
		const cellButton = screen.getByTestId("cell");
		expect(cellButton.classList.contains("error")).not.toBeTruthy();
	});

	it("should be bold if it is a question", () => {
		render(
			<BoardCell
				cell={{
					row: 1,
					col: 1,
					content: 0,
					question: true,
					valid: false,
				}}
				onClick={jest.fn}
				isSelected={true}
			/>
		);
		const cellButton = screen.getByTestId("cell");
		expect(cellButton.classList.contains("bold")).toBeTruthy();
	});

	it("should not be bold if it is a question", () => {
		render(
			<BoardCell
				cell={{
					row: 1,
					col: 1,
					content: 0,
					question: false,
					valid: false,
				}}
				onClick={jest.fn}
				isSelected={true}
			/>
		);
		const cellButton = screen.getByTestId("cell");
		expect(cellButton.classList.contains("bold")).not.toBeTruthy();
	});
});
