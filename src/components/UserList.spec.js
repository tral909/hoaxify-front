import React from 'react'
import { render, waitFor } from '@testing-library/react'
import UserList from './UserList'
import * as apiCalls from '../api/apiCalls'

beforeEach(() => {
    apiCalls.listUsers = jest.fn().mockResolvedValue(mockedEmptySuccessResponse)
})

const setup = () => {
    return render(<UserList />)
}

const mockedEmptySuccessResponse = {
    data: {
        content: [],
        number: 0,
        size: 3
    }
}

const mockSuccessGetSinglePage = {
    data: {
        content: [
            {
                username: 'user1',
                displayName: 'display1',
                image: ''
            },
            {
                username: 'user2',
                displayName: 'display2',
                image: ''
            },
            {
                username: 'user3',
                displayName: 'display3',
                image: ''
            }
        ],
        number: 0,
        first: true,
        last: true,
        size: 3,
        titalPages: 1
    }
}

describe('UserList', () => {
    describe('Layout', () => {
        it('has header of Users', () => {
            const { container } = setup()
            const header = container.querySelector('h3')
            expect(header).toHaveTextContent('Users')
        })

        it('displays three items when listUser api returns three users', async () => {
            apiCalls.listUsers = jest.fn().mockResolvedValue(mockSuccessGetSinglePage)
            const { queryByTestId } = setup()
            await waitFor(() => expect(queryByTestId('usergroup').childElementCount).toBe(3))
        })

        it('displays the displayName@username when listuser api returns users', async () => {
            apiCalls.listUsers = jest.fn().mockResolvedValue(mockSuccessGetSinglePage)
            const { queryByText } = setup()
            await waitFor(() => expect(queryByText('display1@user1')).toBeInTheDocument())
        })
    })

    describe('Lifecycle', () => {
        it('calls listUsers api when it is rendered', () => {
            setup()
            expect(apiCalls.listUsers).toHaveBeenCalledTimes(1)
        })

        it('calls listUsers method with page zero abd size three', () => {
            setup()
            expect(apiCalls.listUsers).toHaveBeenCalledWith({ page: 0, size: 3 })
        })
    })
})