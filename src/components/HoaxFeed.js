import React, { Component } from 'react'
import * as apiCalls from '../api/apiCalls'
import Spinner from './Spinner'

class HoaxFeed extends Component {
    state = {
        page: {
            content: []
        },
        isLoadingHoaxes: false
    }
    componentDidMount() {
        this.setState({isLoadingHoaxes: true})
        apiCalls.loadHoaxes(this.props.user).then(response => {
            this.setState({ page: response.data, isLoadingHoaxes: false })
        })
    }
    render() {
        if (this.state.isLoadingHoaxes) {
            return <Spinner />
        }
        if (this.state.page.content.length === 0) {
            return (
                <div className='card card-header'>
                    There are no hoaxes
                </div>
            );
        }
        return <div>
            {this.state.page.content.map((hoax) => {
                return <span key={hoax.id}>{hoax.content}</span>
            })}
        </div>
    }
}

export default HoaxFeed;