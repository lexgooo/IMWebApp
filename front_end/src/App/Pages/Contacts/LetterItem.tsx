import * as React from 'react'
import ContactItem from './ContactItem'

export interface letterProps {
    initial:string
    list:any[]
}

export default class LetterItem extends React.Component<letterProps, {}> {
    protected normalGap:number = 12
    private renderContact():any {
        const list = [...this.props.list]
        return list.map((item, index) => {
            return <ContactItem normalGap={this.normalGap} id={item.id} name={item.name} index={index} key={item.id} />
        })
    }

    private initialStyle:object = {
        color: '#727272',
        display: 'flex',
        alignItems: 'center',
        padding: `${this.normalGap}px`
    }

    render() {
        return (
            <div>
                <h3 style={this.initialStyle}>{this.props.initial}</h3>
                <ul>
                    {this.renderContact()}
                </ul>
            </div>
        )
    }
}