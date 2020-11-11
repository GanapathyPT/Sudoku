import React, { memo } from 'react'

export default memo(function Cell(props) {

	const {
		selected,
		onClick,
		item,
		i,j,
		darkTheme,
	} = props;

	const tableItem = {
		backgroundColor: darkTheme ? "#292929" : "#f6f6f6",
		borderColor: darkTheme ? "#545454" : "#e2e2e2",
		color: darkTheme ? "white" : "black",
	};

	const selectedStyle = {
		backgroundColor: darkTheme ? "#666" : "lightgrey",
	};

	return (
		<button 
			onClick={onClick}
			className="table-item"
			style={
				!!selected &&
				i === selected[0] &&
				j === selected[1] ?
				{...tableItem, ...selectedStyle} :
				tableItem
			}
		>
			{item || null}
		</button>	
	)
})