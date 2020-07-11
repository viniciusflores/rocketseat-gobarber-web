import React from 'react'
import { render, fireEvent, waitFor, configure } from '@testing-library/react'
import Input from '../../components/Input'

configure({ testIdAttribute: 'data-cy' })

jest.mock('@unform/core', () => {
  return {
    useField() {
      return {
        fieldName: 'email',
        defaultValue: '',
        error: '',
        registerField: jest.fn(),
      }
    },
  }
})

describe('Input component', () => {
  it('Shold be able to render an input', () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="E-mail" />,
    )

    expect(getByPlaceholderText('E-mail')).toBeTruthy()
    expect(getByTestId('email')).toBeTruthy()
  })

  it('Should render highlight on input focus', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="E-mail" />,
    )

    const inputElement = getByPlaceholderText('E-mail')
    const containerElement = getByTestId('input-container')

    fireEvent.focus(inputElement)

    await waitFor(() => {
      expect(containerElement).toHaveStyle('border-color:#ff9000;')
      expect(containerElement).toHaveStyle('color:#ff9000;')
    })

    fireEvent.blur(inputElement)

    await waitFor(() => {
      expect(containerElement).not.toHaveStyle('border-color:#ff9000;')
      expect(containerElement).not.toHaveStyle('color:#ff9000;')
    })
  })

  it('Should keep input border highlight when input filled', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="E-mail" />,
    )

    const inputElement = getByPlaceholderText('E-mail')
    const containerElement = getByTestId('email')

    fireEvent.change(inputElement, {
      target: { value: 'johndoe@email.com' },
    })

    fireEvent.blur(inputElement)

    await waitFor(() => {
      expect(containerElement).not.toHaveStyle('border-color:#ff9000;')
      expect(containerElement).not.toHaveStyle('color:#ff9000;')
    })
  })
})
