import * as React from "react";

interface itemProps {
	item: {
		id: string;
		userName: string;
		time: string;
		unread: number;
		lastMsg: string;
		avator?: string;
	};
	index: number;
}

export default class ListItem extends React.Component<itemProps, {}> {
	private itemStyle(index:number) {
		let style:{} = {
			background: "#fff",
			display: "flex"
		};

		if(index > 0) {
			// style.borderTop = '1px solid #D5D5D5'
		}

		return style;
	}
	private avatorStyle = {};
	public render() {
		return (
			<li style={this.itemStyle(this.props.index)}>
				<div style={{ background: `url(${this.props.item.avator})` }} />
				<div>
					<div>
						<span>{this.props.item.userName}</span>
						<span>{this.props.item.time}</span>
					</div>
					<div>
						<span>{this.props.item.lastMsg}</span>
						<span>{this.props.item.unread}</span>
					</div>
				</div>
			</li>
		);
	}
}
