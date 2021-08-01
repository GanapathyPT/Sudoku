import React from "react";

interface Props {
	title: string;
	subTitle: string;
}

function Header({ subTitle, title }: Props) {
	return (
		<div>
			<h1 className="title">{title}</h1>
			<p className="sub-title">{subTitle}</p>
		</div>
	);
}

export { Header };
