import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { UserPage } from './UserPage'
import * as apiCalls from '../api/apiCalls'

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
    return render(<UserPage {...props} />)
}

describe('UserPage', () => {

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

console.error = () => {}