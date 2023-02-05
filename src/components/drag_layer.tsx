import React, { useMemo } from 'react'
import { useDragLayer } from 'react-dnd'
import styled from 'styled-components'
import { DND_AREA_PADDING } from '../constants'
import type { DragObject } from '../types'
import { Box } from './box'

const Wrapper = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  pointer-events: none;
  z-index: 10;
`

export const DragLayer: React.FC = () => {
  const { clientOffset, item } = useDragLayer<DragObject>((monitor) => ({
    clientOffset: monitor.getSourceClientOffset(),
    item: monitor.getItem(),
  }))

  const dragContainerPosition = useMemo(() => {
    if (!clientOffset || !item) {
      return null
    }
    return {
      x: clientOffset.x - item.dragOffset.x - DND_AREA_PADDING.width,
      y: clientOffset.y - item.dragOffset.y - DND_AREA_PADDING.height,
    }
  }, [clientOffset, item])

  const layerSize = useMemo(() => {
    if (!item) {
      return { width: 0, height: 0 }
    }
    return {
      width: item.dragArea.x2 - item.dragArea.x1,
      height: item.dragArea.y2 - item.dragArea.y1,
    }
  }, [item])

  if (!dragContainerPosition) return null

  return (
    <Wrapper
      style={{
        width: `${layerSize.width}px`,
        height: `${layerSize.height}px`,
        transform: `translate(${dragContainerPosition.x}px, ${dragContainerPosition.y}px)`,
      }}
    >
      {item?.boxes.map((box) => {
        return (
          <Box
            key={box.id}
            style={{
              position: 'absolute',
              transform: `translate(
          ${box.position.x}px, 
          ${box.position.y}px)`,
            }}
          >
            {box.name}
          </Box>
        )
      })}
    </Wrapper>
  )
}
