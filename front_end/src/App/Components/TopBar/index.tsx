import * as React from "react";

export interface navProps {
	currentRoute: {
		path: string
		component: any
		title: string
		name?: string
		back?: boolean
	} | undefined
}

export default class TopBar extends React.Component<navProps, {}> {
	private headerStyle = {
		height: "42px",
		background: "#E3E3E3",
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	};
	public render() {
		return (
			<header style={this.headerStyle}>
				<h1
					style={{
						fontSize: "18px"
					}}
				>
					{this.props.currentRoute && this.props.currentRoute.title}
				</h1>
			</header>
		);
	}
}
