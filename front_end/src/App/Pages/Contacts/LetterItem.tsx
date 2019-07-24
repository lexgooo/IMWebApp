import * as React from 'react'
import ContactItem from './ContactItem'

export interface letterProps {
    initial: string
    list: any[]
    setParentState: any
}

export default class LetterItem extends React.Component<letterProps, {}> {
    protected normalGap: number = 12
    private letterDom: any = React.createRef()
    private renderContact(): any {
        const list = [...this.props.list]
        return list.map((item, index) => {
            return (
                <ContactItem
                    normalGap={this.normalGap}
                    id={item.id}
                    name={item.name}
                    index={index}
                    key={item.id}
                />
            )
        })
    }

    private initialStyle: object = {
        color: '#727272',
        display: 'flex',
        alignItems: 'center',
        padding: `${this.normalGap}px`
    }

    private handleScroll(e: any): void {
        const dom: any = this.letterDom.current
        if (dom) {
            const scrollTop: number = e.target.scrollTop
            const offsetTop: number = dom.offsetTop
            const offsetHeight: number = dom.offsetHeight
            if (
                scrollTop > offsetTop &&
                scrollTop <= offsetTop + offsetHeight
            ) {
                console.log(
                    this.props.initial,
                    offsetHeight,
                    offsetTop,
                    scrollTop
                )
                this.props.setParentState({ currentLetter: this.props.initial })
            }
            // console.log(this.props.initial, dom.offsetHeight, dom.offsetTop, e.target.scrollTop)
        }
    }

    public componentDidMount(): void {
        console.log('组件已经渲染完成')
        window.addEventListener(
            'scroll',
            e => {
                this.handleScroll(e)
            },
            true
        )
    }

    render() {
        return (
            <div ref={this.letterDom}>
                <h3 style={this.initialStyle}>{this.props.initial}</h3>
                <ul>{this.renderContact()}</ul>
            </div>
        )
    }
}
