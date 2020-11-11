import React, { Fragment } from 'react';

import { Divider } from "@material-ui/core";

import Cell from "./Cell";

export default function Table(props) {

	const {
		table,
		darkTheme,
		selected,
		select
	} = props;

	return (
		<div className="table-container" >
			{
				table.map((row, i) => 
					<Fragment key={i}>
					<div className="table-row">
						{
							row.map((item, j) => 
								<Fragment key={j}>
									<Cell {...{
										selected,
										item,
										i,j,
										darkTheme,
										onClick: () => select(i,j)
									}}/>
								{
									j === 2 || j === 5 ?
									<Divider style={{
										width:5,
										backgroundColor: darkTheme ?
										 "black" : "white" 
									}} /> : null
								}
								</Fragment>
							)
						}
					</div>
					{
						i === 2 || i === 5 ?
						<Divider style={
							{ 
								height:5,
								backgroundColor: darkTheme ? "black" : "white" 
							}
						} /> : null
					}
					</Fragment>
				)
			}
		</div>
	)
}
