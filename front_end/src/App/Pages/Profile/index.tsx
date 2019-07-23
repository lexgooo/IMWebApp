import * as React from 'react'
import ProfileCard from '../../Components/ProfileCard'
import Button from '../../Components/Button'

export default class Profile extends React.Component<{}, {}> {
    public state = {
        info: {
            name: '用户名',
            gender: '男',
            id: 'gwx0001'
        }
    }
    render() {
        return (
            <main>
                <ProfileCard name={this.state.info.name} gender={this.state.info.gender} id={this.state.info.id} />
                <Button style={{marginTop: '40px'}}>退出登录</Button>
            </main>
        )
    }
}