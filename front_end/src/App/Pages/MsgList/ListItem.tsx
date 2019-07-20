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
}

export default class ListItem extends React.Component<itemProps, {}> {
	render() {
		return (
			<li>
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
