import React, { useState, useContext } from 'react'
import styled from 'styled-components'
import { Box } from './box'
import { useDrop } from 'react-dnd'
import { DND_AREA_PADDING, DRAG_AREA_SIZE } from '../constants'
import { MultiDragContext } from '../contexts/multi_drag_context'
import { DragObjectItem, SelectedBox } from '../types'

const Wrapper = styled.div`
  position: relative;
  width: ${DRAG_AREA_SIZE.width}px;
  height: ${DRAG_AREA_SIZE.height}px;
  border: 3px solid black;
  margin-top: 32px;
  padding: 16px;
  filter: drop-shadow(4px 4px 2px #aaa);
  background: rgba(0, 0, 255, 0.1);
`

export const DndDropArea: React.FC = () => {
  const context = useContext(MultiDragContext)
  const [boxes, setBoxes] = useState<SelectedBox[]>([])

  const [, drop] = useDrop<DragObjectItem>(() => ({
    accept: 'box',
    drop: (item, monitor) => {
      const dropBoxes = monitor.getItem().boxes
      const dragOffset = monitor.getItem().dragOffset
      const onDrop = monitor.getItem().onDrop
      const dropAreaPosition = (document.getElementById(
        'drop_area',
      ) as HTMLElement).getBoundingClientRect()
      const offset = monitor.getSourceClientOffset()

      if (!offset) return
      const newBoxes = dropBoxes.map((box) => ({
        ...box,
        position: {
          x:
            box.position.x +
            offset.x -
            dragOffset.x -
            dropAreaPosition.left -
            DND_AREA_PADDING.width,
          y:
            box.position.y +
            offset.y -
            dragOffset.y -
            dropAreaPosition.top -
            DND_AREA_PADDING.height,
        },
      }))
      setBoxes(newBoxes)
      context.clearSelection(onDrop)
    },
  }))

  return (
    <Wrapper ref={drop} id="drop_area">
      <p>DropArea</p>
      {boxes.map((box) => {
        return (
          <Box
            key={box.id}
            style={{
              position: 'absolute',
              top: '0px',
              left: '0px',
              transform: `translate(${box.position?.x}px, ${box.position?.y}px)`,
            }}
          >
            {box.name}
          </Box>
        )
      })}
    </Wrapper>
  )
}
