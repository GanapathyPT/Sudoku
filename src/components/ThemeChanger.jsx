import React from 'react';

import { IconButton } from "@material-ui/core";

import WbSunnyIcon from "@material-ui/icons/WbSunny";
import Brightness3Icon from "@material-ui/icons/Brightness3";

export default function ThemeChanger(props) {

	const {
		theme,
		setDarkTheme,
		darkTheme,
	} = props;

	const themeSwitcher = {
		position: "fixed",
		top: 5,
		right: 5,
	};

	return (
		<IconButton 
			style={themeSwitcher} 
			onClick={() => setDarkTheme(!darkTheme)}
		>
			{
				darkTheme ?
				<WbSunnyIcon style={theme} /> :
				<Brightness3Icon style={theme} />
			}
		</IconButton>
	)
}