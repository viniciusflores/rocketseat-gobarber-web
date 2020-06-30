import React, { ButtonHTMLAttributes } from 'react'

import { Container } from './styles'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
  dataTestId?: string
}

const Button: React.FC<ButtonProps> = ({
  children,
  loading,
  dataTestId,
  ...rest
}) => (
  <Container type="button" {...rest} data-cy={dataTestId}>
    {loading ? 'Carregando...' : children}
  </Container>
)

export default Button
