import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { UserPage } from './UserPage'
import * as apiCalls from '../api/apiCalls'
import { Provider } from 'react-redux'
import configureStore from '../redux/configureStore'
import axios from 'axios'

beforeEach(() => {
    localStorage.clear()
    delete axios.defaults.headers.common['Authorization']
})

const mockSuccessGetUser = {
    data: {
        id: 1,
        username: 'user1',
        displayName: 'display1',
        image: 'profile.png'
    }
}
const match = {
    params: {
        username: 'user1'
    }
}

const mockFailGetUser = {
    response: {
        data: {
            message: 'User not found'
        }
    }
}

const setup = (props) => {
    const store = configureStore(false)
    return render(
        <Provider store={store}>
            <UserPage {...props} />
        </Provider>
    )
}

const setUserOneLoggedInStorage = () => {
    localStorage.setItem(
        'hoax-auth',
        JSON.stringify({
            id: 1,
            username: 'user1',
            displayName: 'display1',
            image: 'profile1.png',
            password: 'P4ssword',
            isLoggedIn: true
        })
    )
}

xdescribe('UserPage', () => {

    describe('Layout', () => {
        it('has root page dev', () => {
            const { queryByTestId } = setup()
            const userPageDiv = queryByTestId('userpage')
            expect(userPageDiv).toBeInTheDocument()
        })

        it('displays the displayName@username when user data loaded', async () => {
            apiCalls.getUser = jest.fn().mockResolvedValue(mockSuccessGetUser)
            const { queryByText } = setup({ match })
            await waitFor(() => expect(queryByText('display1@user1')).toBeInTheDocument())
        })

        it('displays not found alert when user not found', async () => {
            apiCalls.getUser = jest.fn().mockRejectedValue(mockFailGetUser)
            const { queryByText } = setup({ match })
            await waitFor(() => expect(queryByText('User not found')).toBeInTheDocument())
        })

        it('displays spinner while loading user data', async () => {
            const mockDelayedResponse = jest.fn().mockImplementation(() => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve(mockSuccessGetUser)
                    }, 300)
                })
            })
            apiCalls.getUser = mockDelayedResponse
            const { queryByText } = setup({ match })
            const spinner = queryByText('Loading...')
            expect(spinner).toBeInTheDocument()
        })

        it('displays the edit button when loggedInUser matches to user in url', async () => {
            setUserOneLoggedInStorage()
            apiCalls.getUser = jest.fn().mockResolvedValue(mockSuccessGetUser)
            const { queryByText } = setup({ match })
            await waitFor(() => expect(queryByText('display1@user1')).toBeInTheDocument())
            const editButton = queryByText('Edit')
            expect(editButton).toBeInTheDocument()
        })
    })

    describe('Lifecycle', () => {
        it('calls getUser when it is rendered', () => {
            apiCalls.getUser = jest.fn().mockResolvedValue(mockSuccessGetUser)
            setup({ match })
            expect(apiCalls.getUser).toHaveBeenCalledTimes(1)
        })

        it('calls getUser for user1 when it is rendered with user1 in match', () => {
            apiCalls.getUser = jest.fn().mockResolvedValue(mockSuccessGetUser)
            setup({ match })
            expect(apiCalls.getUser).toHaveBeenCalledWith('user1')
        })
    })
})

console.error = () => { }