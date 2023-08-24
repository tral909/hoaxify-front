import React from 'react'
import * as apiCalls from '../api/apiCalls'
import ProfileCard from '../components/ProfileCard'
import { connect } from 'react-redux'

export class UserPage extends React.Component {
    state = {
        user: undefined,
        userNotFound: false,
        isLoadingUser: false,
        inEditMode: false,
        originalDisplayName: undefined,
        pendingUpdateCall: false
    }
    componentDidMount() {
        this.loadUser()
    }
    componentDidUpdate(prevProps) {
        if (prevProps.match.params.username !== this.props.match.params.username) {
            this.loadUser()
        }
    }

    loadUser = () => {
        const username = this.props.match.params.username
        if (!username) {
            return
        }
        this.setState({ userNotFound: false, isLoadingUser: true })
        apiCalls.getUser(username)
            .then(response => {
                this.setState({ user: response.data, isLoadingUser: false })
            })
            .catch(error => {
                this.setState({ userNotFound: true, isLoadingUser: false })
            })
    }

    onClickEdit = () => {
        this.setState({
            inEditMode: true
        })
    }

    onClickCancel = () => {
        const user = {...this.state.user}
        if (this.state.originalDisplayName !== undefined) {
            user.displayName = this.state.originalDisplayName
        }
        this.setState({
            user,
            originalDisplayName: undefined,
            inEditMode: false
        })
    }

    onClickSave = () => {
        const userId = this.props.loggedInUser.id
        const userUpdate = {
            displayName: this.state.user.displayName
        }
        this.setState({ pendingUpdateCall: true })
        apiCalls.updateUser(userId, userUpdate)
            .then(response => {
                this.setState({
                    inEditMode: false,
                    originalDisplayName: undefined,
                    pendingUpdateCall: false
                })
            }).catch(error => {
                this.setState({
                    pendingUpdateCall: false
                })
            })
    }

    onChangeDisplayName = (event) => {
        const user = { ...this.state.user }
        let originalDisplayName = this.state.originalDisplayName
        if (originalDisplayName === undefined) {
            originalDisplayName = user.displayName
        }
        user.displayName = event.target.value
        this.setState({ user, originalDisplayName })
    }

    render() {
        let pageContent
        if (this.state.isLoadingUser) {
            pageContent = (
                <div className="d-flex">
                    <div className="spinner-border text-black-50 m-auto">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )
        } else if (this.state.userNotFound) {
            pageContent = (
                <div className="alert alert-danger text-center" role="alert">
                    <div className="alert-heading">
                        <i className="fas fa-exclamation-triangle fa-3x" />
                    </div>
                    <h5>User not found</h5>
                </div>
            )
        } else {
            const isEditable = this.props.loggedInUser.username === this.props.match.params.username
            pageContent = this.state.user && (
                <ProfileCard
                    user={this.state.user}
                    isEditable={isEditable}
                    inEditMode={this.state.inEditMode}
                    onClickEdit={this.onClickEdit}
                    onClickCancel={this.onClickCancel}
                    onClickSave={this.onClickSave}
                    onChangeDisplayName={this.onChangeDisplayName}
                    pendingUpdateCall={this.state.pendingUpdateCall}
                />
            )
        }
        return <div data-testid='userpage'>{pageContent}</div>
    }
}

UserPage.defaultProps = {
    match: {
        params: {}
    }
}

const mapStateToProps = (state) => {
    return {
        loggedInUser: state
    }
}

export default connect(mapStateToProps)(UserPage)