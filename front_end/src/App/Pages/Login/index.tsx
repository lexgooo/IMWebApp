import React, { Component } from 'react'
import {login} from '../../../api/login'
import Button from '../../Components/Button'

export default class Login extends Component<{}, {}> {
    state: any = {
        userId: '',
        password: ''
    }

    titleStyle = {
        fontSize: '26px',
        marginBottom: '81px',
        marginLeft: '20px',
        lineHeight: '37px'
    }

    inputStyle(borderBottom?: boolean): {} {
        return {
            fontSize: '14px',
            padding: '12px 20px',
            border: 'none',
            borderTop: '1px solid #ccc',
            borderBottom: borderBottom ? '1px solid #ccc' : 'none'
        }
    }

    handleChange = (e:any): void => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    private handleSubmit(): any {
        const params = {
            userId: this.state.userId,
            password: this.state.password
        }
        debugger
        login(params).then((res:any) => {
            debugger
            console.log(res)
        }).catch((err:any) => {
            console.log(err)
        })
        return
    }

    public render() {
        return (
            <main style={{paddingTop: '113px'}}>
                <h1 style={this.titleStyle}>用户登录</h1>
                <form
                    style={{
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <input
                        style={this.inputStyle()}
                        type='text'
                        name="userId"
                        onChange={this.handleChange}
                        value={this.state.userId}
                        placeholder='请输入登录用户ID'
                    />
                    <input
                        style={this.inputStyle(true)}
                        type='password'
                        name="password"
                        onChange={this.handleChange}
                        value={this.state.password}
                        placeholder='请输入登录密码'
                    />
                    <Button
                        onClick={() => this.handleSubmit()}
                        style={{
                            marginTop: '65px'
                        }}
                        background='#03C160'
                        color='#fff'
                    >
                        登 录
                    </Button>
                </form>
            </main>
        )
    }
}
