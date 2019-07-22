import * as React from 'react'

export interface contactProps {
    id:string
    name:string
}

export default class ContactItem extends React.Component<contactProps, {}> {
    render() {
        return (
            <li>
                <div>头像</div>
                <p>{this.props.name}</p>
            </li>
        )
    }
}