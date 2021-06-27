import { useCallback, useEffect, useState } from "react";

const THEME = "THEME";

const useTheme = () => {
	const [darkMode, setDarkMode] = useState<boolean>();

	useEffect(() => {
		const darkMode = localStorage.getItem(THEME);
		setDarkMode(darkMode !== null);
	}, []);

	useEffect(() => {
		if (darkMode === undefined) return;

		if (darkMode) localStorage.setItem(THEME, THEME);
		else localStorage.removeItem(THEME);

		document.documentElement.style.setProperty(
			"--text-color",
			darkMode ? "#fff" : "#000"
		);
		document.documentElement.style.setProperty(
			"--grid-color",
			darkMode ? "#292929" : "#f6f6f6"
		);
		document.documentElement.style.setProperty(
			"--grid-border-color",
			darkMode ? "#545454" : "#e2e2e2"
		);
		document.documentElement.style.setProperty(
			"--bg-color",
			darkMode ? "#000" : "#fff"
		);
	}, [darkMode]);

	const onThemeChange = useCallback(() => {
		setDarkMode((oldState) => !oldState);
	}, [setDarkMode]);

	return {
		darkMode,
		onThemeChange,
	};
};

export { useTheme };
