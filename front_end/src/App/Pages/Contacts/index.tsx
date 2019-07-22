import * as React from 'react'
import LetterItem from './LetterItem'

export default class Contacts extends React.Component<{}, {}> {
    private nomalGap:number = 12
    public state = {
        currentLetter: 'A',
        contactList: [
            {
                initial: 'A',
                list: [
                    {
                        id: '1',
                        name: 'Alice'
                    },
                    {
                        id: '2',
                        name: 'Allen'
                    }
                ]
            },
            {
                initial: 'B',
                list: [
                    {
                        id: '3',
                        name: 'Byron'
                    },
                    {
                        id: '4',
                        name: 'Beyonce'
                    }
                ]
            },
            {
                initial: 'C',
                list: [
                    {
                        id: '5',
                        name: 'Catherine'
                    }
                ]
            },
            {
                initial: 'D',
                list: [
                    {
                        id: '6',
                        name: 'Davis'
                    },
                    {
                        id: '7',
                        name: 'De Gaulle'
                    }
                ]
            },
            {
                initial: 'E',
                list: [
                    {
                        id: '8',
                        name: 'Ella'
                    },
                    {
                        id: '9',
                        name: 'Eve'
                    },
                    {
                        id: '10',
                        name: 'Eason'
                    },
                    {
                        id: '11',
                        name: 'Eva'
                    }
                ]
            },
            {
                initial: 'F',
                list: [
                    {
                        id: '12',
                        name: 'Freeman'
                    }
                ]
            },
            {
                initial: 'G',
                list: [
                    {
                        id: '13',
                        name: 'Gatsby'
                    }
                ]
            },
            {
                initial: 'H',
                list: [
                    {
                        id: '14',
                        name: 'Homer'
                    }
                ]
            }
        ]
    }
    private renderItem():any {
        const letterList = [...this.state.contactList]
        return letterList.map(item => {
            return <LetterItem initial={item.initial} list={item.list} key={item.initial} />
        })
    }
    private currentLetterStyle:object = {
        bacground: '#fff',
        color: '#03C160',
        fontSize: '14px',
        padding: `${this.nomalGap}px`,
        borderBottom: '1px solid #E7E7E7',
        height: '38px',
        boxSizing: 'border-box'
    }
    private contactsStyle:object = {
        flex: '1',
        overflowY: 'scroll'
    }
    private haddleScroll():any {
        console.log('滚动事件')
    }
    render() {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            }}>
                <h2 style={this.currentLetterStyle}>{this.state.currentLetter}</h2>
                <ul style={this.contactsStyle} onScroll={this.haddleScroll()}>
                    {this.renderItem()}
                </ul>
            </div>
        )
    }
}
