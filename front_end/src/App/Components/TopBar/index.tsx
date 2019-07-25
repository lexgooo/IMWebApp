import * as React from "react";
import Qs from 'qs'

export interface navProps {
	currentRoute?: {
		path: string
		component: any
		title?: string
		name?: string
		back?: boolean
        navigation?: boolean
	}
	search?: string
	history: any
}

export default class TopBar extends React.Component<navProps, {}> {
	private headerStyle = {
		background: "#E3E3E3",
		padding: '15px 12px'

	};

	private renderTitle ():string {
		const currentRoute = this.props.currentRoute
		const search = this.props.search && Qs.parse(this.props.search)
		const title = (currentRoute &&  currentRoute.title) ? currentRoute.title : search.name
		return title
	}

	private renderBack ():object | void {
		const currentRoute = this.props.currentRoute
		if(currentRoute && currentRoute.back) {
			return <span onClick={() => {this.props.history.goBack()}} style={{float: 'left', fontSize: '18px'}} className="iconfont icon-Back" />
		}
	}

	public render() {
		return (
			<header style={this.headerStyle}>
				{this.renderBack()}
				<h1
					style={{
						fontSize: "18px",
						textAlign: 'center'
					}}
				>
					{this.renderTitle()}
				</h1>
			</header>
		);
	}
}
