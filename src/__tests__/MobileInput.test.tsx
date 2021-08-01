import React from "react";
import { render, screen } from "@testing-library/react";
import { MobileInput } from "../components/MobileInput";

describe("MOBILE_INPUT", () => {
	it("should have 9 inputs if gameOver is false", () => {
		render(<MobileInput gameOver={false} onMobileOptionClick={jest.fn} />);

		const cells = screen.getAllByTestId("cell");
		expect(cells.length).toBe(9);
	});

	it("should not be question and must be valid", () => {
		render(<MobileInput gameOver={false} onMobileOptionClick={jest.fn} />);

		const cells = screen.getAllByTestId("cell");
		expect(cells.length).toBe(9);
		cells.forEach((cell) => {
			expect(cell.classList.contains("bold")).toBeFalsy();
			expect(cell.classList.contains("error")).toBeFalsy();
		});
	});

	it("should not show anything if game is over", () => {
		render(<MobileInput gameOver={true} onMobileOptionClick={jest.fn} />);

		const cells = screen.queryAllByTestId("cell");
		expect(cells.length).toBeFalsy();
	});
});
