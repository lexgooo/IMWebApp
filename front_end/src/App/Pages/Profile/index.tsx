import * as React from 'react'
import ProfileCard from '../../Components/ProfileCard'
import Button from '../../Components/Button'
export interface profileProps {
    history: any
}
export default class Profile extends React.Component<profileProps, {}> {
    public state = {
        info: {
            name: '用户名',
            gender: '男',
            id: 'gwx0001'
        }
    }
    private handleExit(history:any):any {
        history.replace('/login')
    }
    public render():object {
        const {history} = this.props
        return (
            <main>
                <ProfileCard name={this.state.info.name} gender={this.state.info.gender} id={this.state.info.id} />
                {/* <button onClick={() => this.handleExit(history)}>退出登录</button> */}
                <Button style={{marginTop: '40px'}} onClick={() => this.handleExit(history)}>退出登录</Button>
            </main>
        )
    }
}