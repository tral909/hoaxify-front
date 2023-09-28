import React from 'react'
import { render } from '@testing-library/react'
import { HomePage } from './HomePage'
import * as apiCalls from '../api/apiCalls'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import authReducer from '../redux/authReducer'

const defaultState = {
    id: 1,
    username: 'user1',
    displayName: 'display1',
    image: 'profile.png',
    password: 'P4ssword',
    isLoggedIn: true
}

let store

const setup = (state = defaultState) => {
    store = createStore(authReducer, state)
    return render(
        <Provider store={store}>
            <HomePage />
        </Provider>
    )
}

beforeEach(() => {
    apiCalls.listUsers = jest.fn().mockResolvedValue({
        data: {
            content: [],
            number: 0,
            size: 3
        }
    })
})

describe('HomePage', () => {

    describe('Layout', () => {
        it('has root page dev', () => {
            const { queryByTestId } = setup()
            const homePageDiv = queryByTestId('homepage')
            expect(homePageDiv).toBeInTheDocument()
        })
    })
})