import React, {Component} from 'react'
import ProfileCard from '../Components/ProfileCard'
import Button from '../Components/Button'

export interface contactProps {
    history:any,
    location:any
}

export default class ContactProfile extends Component<contactProps, {}> {
    public state = {
        info: {
            name: '根据id去查',
            gender: '女',
            id: 'gwx0000002'
        }
    }

    public render():object {
        return (
            <main>
                <ProfileCard name={this.state.info.name} gender={this.state.info.gender} id={this.state.info.id} />
                <Button color="#03C160" onClick={() => this.props.history.push({pathname: 'chatwindow', search: this.props.location.search})} style={{marginTop: '40px'}}>发送消息</Button>
            </main>
        )
    }
}