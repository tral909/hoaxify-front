import React from 'react'
import { render, waitFor, fireEvent } from '@testing-library/react'
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

const mockSuccessGetMultiPageFirst = {
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
        last: false,
        size: 3,
        titalPages: 2
    }
}

const mockSuccessGetMultiPageLast = {
    data: {
        content: [
            {
                username: 'user4',
                displayName: 'display4',
                image: ''
            }
        ],
        number: 1,
        first: false,
        last: true,
        size: 3,
        titalPages: 2
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

        it('displays the next button when response has last value as false', async () => {
            apiCalls.listUsers = jest.fn().mockResolvedValue(mockSuccessGetMultiPageFirst)
            const { queryByText } = setup()
            await waitFor(() => expect(queryByText('next >')).toBeInTheDocument())
        })

        it('hides the next button when response has last value as true', async () => {
            apiCalls.listUsers = jest.fn().mockResolvedValue(mockSuccessGetMultiPageLast)
            const { queryByText } = setup()
            await waitFor(() => expect(queryByText('next >')).not.toBeInTheDocument())
        })

        it('displays the previous button when response has first value as false', async () => {
            apiCalls.listUsers = jest.fn().mockResolvedValue(mockSuccessGetMultiPageLast)
            const { queryByText } = setup()
            await waitFor(() => expect(queryByText('< previous')).toBeInTheDocument())
        })

        it('hides the previous button when response has first value as true', async () => {
            apiCalls.listUsers = jest.fn().mockResolvedValue(mockSuccessGetMultiPageFirst)
            const { queryByText } = setup()
            await waitFor(() => expect(queryByText('< previous')).not.toBeInTheDocument())
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

    describe('Interactions', () => {
        it('loads next page when clicked to next button', async () => {
            apiCalls.listUsers = jest.fn()
                .mockResolvedValue(mockSuccessGetMultiPageFirst)
                .mockResolvedValue(mockSuccessGetMultiPageLast)
            const { queryByText } = setup()
            const nextLink = queryByText('next >')
            await waitFor(() => expect(queryByText('next >')).toBeInTheDocument())
            fireEvent.click(nextLink)
            await waitFor(() => expect(queryByText('display4@user4')).toBeInTheDocument())
        })

        it('loads previous page when clicked to previous button', async () => {
            apiCalls.listUsers = jest.fn()
                .mockResolvedValue(mockSuccessGetMultiPageLast)
                .mockResolvedValue(mockSuccessGetMultiPageFirst)
            const { queryByText } = setup()
            const previousLink = queryByText('< previous')
            await waitFor(() => expect(queryByText('< previous')).toBeInTheDocument())
            fireEvent.click(previousLink)
            await waitFor(() => expect(queryByText('display1@user1')).toBeInTheDocument())
        })
    })
})