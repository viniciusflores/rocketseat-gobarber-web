import React from 'react'

import { Container } from './styles'

interface TooltiProps {
  title: string
  className?: string
}

const Tooltip: React.FC<TooltiProps> = ({
  title,
  className = '',
  children,
}) => {
  return (
    <Container className={className} data-cy="hasTooltip">
      {children}
      <span data-cy={`tooltip-description-${title}`}>{title}</span>
    </Container>
  )
}

export default Tooltip
