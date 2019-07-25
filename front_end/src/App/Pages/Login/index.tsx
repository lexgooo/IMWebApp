import React, { Component } from 'react'
import Button from '../../Components/Button'

export default class Login extends Component<{}, {}> {
    public state: any = {
        userId: '',
        password: ''
    }

    private titleStyle = {
        fontSize: '26px',
        marginTop: '113px',
        marginBottom: '81px',
        marginLeft: '20px',
        lineHeight: '37px'
    }

    private inputStyle(borderBottom?:boolean):{} {
        return {
            fontSize: '14px',
            padding: '12px 20px',
            border: 'none',
            borderTop: '1px solid #ccc',
            borderBottom: borderBottom ? '1px solid #ccc' : 'none'
        }
    }

    public render() {
        return (
            <main>
                <h1 style={this.titleStyle}>用户登录</h1>
                <form style={{
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <input style={this.inputStyle()} type='text' value={this.state.userId} placeholder='请输入登录用户ID' />
                    <input style={this.inputStyle(true)} type='password' value={this.state.password} placeholder='请输入登录密码' />
                    <Button style={{
                        marginTop: '65px'
                    }} background='#03C160' color='#fff'>
                        登 录
                    </Button>
                </form>
            </main>
        )
    }
}
