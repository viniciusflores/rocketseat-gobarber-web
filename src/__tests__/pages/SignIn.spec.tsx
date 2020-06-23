import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import SignIn from '../../pages/SignIn'

const mockedHistoryPush = jest.fn()
const mockedSignIn = jest.fn()
const mockedAddToast = jest.fn()

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
  }
})

jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({
      sighIn: mockedSignIn,
    }),
  }
})

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  }
})

describe('SignIn Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear()
  })

  it('should be able to render SignIn Page', () => {
    const { debug } = render(<SignIn />)

    debug()
  })

  it('Should be able to sign in', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />)

    const emailField = getByPlaceholderText('E-mail')
    const passwordField = getByPlaceholderText('Senha')
    const buttonElement = getByText('Entrar')

    fireEvent.change(emailField, { target: { value: 'johndoe@email.com' } })
    fireEvent.change(passwordField, { target: { value: '123456' } })

    fireEvent.click(buttonElement)

    await waitFor(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('Should not be able to sign in with invalid credentials', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />)

    const emailField = getByPlaceholderText('E-mail')
    const passwordField = getByPlaceholderText('Senha')
    const buttonElement = getByText('Entrar')

    fireEvent.change(emailField, { target: { value: 'not-valid-email' } })
    fireEvent.change(passwordField, { target: { value: '123456' } })

    fireEvent.click(buttonElement)

    await waitFor(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled()
    })
  })

  it('Should display an error if login fails', async () => {
    mockedSignIn.mockImplementation(() => {
      throw Error()
    })

    const { getByPlaceholderText, getByText } = render(<SignIn />)

    const emailField = getByPlaceholderText('E-mail')
    const passwordField = getByPlaceholderText('Senha')
    const buttonElement = getByText('Entrar')

    fireEvent.change(emailField, { target: { value: 'johndoe@email.com' } })
    fireEvent.change(passwordField, { target: { value: '123456' } })

    fireEvent.click(buttonElement)

    await waitFor(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      )
    })
  })
})
