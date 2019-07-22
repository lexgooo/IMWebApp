import * as React from 'react'
import ContactItem from './ContactItem'

export interface letterProps {
    initial:string
    list:any[]
}

export default class LetterItem extends React.Component<letterProps, {}> {
    private renderContact():any {
        const list = [...this.props.list]
        return list.map(item => {
            return <ContactItem id={item.id} name={item.name} key={item.id} />
        })
    }

    render() {
        return (
            <div>
                <h3>{this.props.initial}</h3>
                <ul>
                    {this.renderContact()}
                </ul>
            </div>
        )
    }
}