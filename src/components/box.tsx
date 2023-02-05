import React from 'react'
import styled from 'styled-components'
import { DRAG_OBJECT_SIZE } from '../constants'

const StyledDiv = styled.div<{ selected: boolean }>`
  width: ${DRAG_OBJECT_SIZE.width}px;
  height: ${DRAG_OBJECT_SIZE.height}px;
  border: 1px solid red;
  background-color: ${({ selected }) => (selected ? 'red' : 'none')};
`

type BoxProps = {
  id?: string
  selected?: boolean
  children: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>

export const Box: React.FC<BoxProps> = ({
  id,
  selected = false,
  style,
  children,
}) => {
  return (
    <StyledDiv id={id} selected={selected} style={style} className="box">
      {children}
    </StyledDiv>
  )
}
