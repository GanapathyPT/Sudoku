import React from "react";
import { IconButton } from "@material-ui/core";
import WbSunnyIcon from "@material-ui/icons/WbSunny";
import Brightness3Icon from "@material-ui/icons/Brightness3";
import { CSSProperties } from "@material-ui/core/styles/withStyles";

interface Props {
	theme: boolean;
	onThemeChange: () => void;
}

const themeSwitcherStyle: CSSProperties = {
	position: "fixed",
	top: 5,
	right: 5,
};

const ThemeChanger = ({ onThemeChange, theme }: Props) => (
	<IconButton style={themeSwitcherStyle} onClick={onThemeChange}>
		{theme ? (
			<WbSunnyIcon style={{ color: "#fff" }} />
		) : (
			<Brightness3Icon style={{ color: "#000" }} />
		)}
	</IconButton>
);

export { ThemeChanger };
