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
    public render():object {
        return (
            <main>
                <ProfileCard name={this.state.info.name} gender={this.state.info.gender} id={this.state.info.id} />
                <Button style={{marginTop: '40px'}} onClick={() => this.props.history.replace('/login')}>退出登录</Button>
            </main>
        )
    }
}