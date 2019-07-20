import * as React from "react";
import { Route } from "react-router-dom";

interface navPorps {
	navs: {
		value: string;
		label: string;
		icon: string;
	}[];
}

export default class TopBar extends React.Component<navPorps, {}> {
	private headerStyle = {
		height: "42px",
		background: "#E3E3E3",
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	};
	private header(location:any) {
        let title:string = ''
        this.props.navs.forEach(item => {
            if(location.pathname === `/${item.value}`) {
                title = item.label
            }
        })
		return (
			<header style={this.headerStyle}>
				<h1
					style={{
						fontSize: "18px"
					}}
				>
					{title}
				</h1>
			</header>
		);
	}
	public render() {
		return <Route children={({ location }) => this.header(location)} />;
	}
}
