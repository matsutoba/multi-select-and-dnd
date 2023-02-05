import React, { useEffect, useState, useRef, useContext } from 'react'
import styled from 'styled-components'
import { Box } from './box'
import Selecto, { OnSelect, OnDragStart, OnSelectEnd } from 'react-selecto'
import { useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import type { Rectangle, SelectedBox, Position } from '../types'
import { getDragArea, getDragOffset, isBox } from '../services/drag_service'
import { DRAG_AREA_SIZE } from '../constants'
import { MultiDragContext } from '../contexts/multi_drag_context'

const Wrapper = styled.div`
  width: ${DRAG_AREA_SIZE.width}px;
  height: ${DRAG_AREA_SIZE.height}px;
  border: 3px solid black;
  padding: 16px;
  filter: drop-shadow(4px 4px 2px #aaa);
  background: #fff;
`

const BoxWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 64px);
  grid-gap: 16px;
`

const data: SelectedBox[] = [
  { id: '1', name: 'box1', selected: false, position: { x: 0, y: 0 } },
  { id: '2', name: 'box2', selected: false, position: { x: 0, y: 0 } },
  { id: '3', name: 'box3', selected: false, position: { x: 0, y: 0 } },
  { id: '4', name: 'box4', selected: false, position: { x: 0, y: 0 } },
  { id: '5', name: 'box5', selected: false, position: { x: 0, y: 0 } },
  { id: '6', name: 'box6', selected: false, position: { x: 0, y: 0 } },
]

export const DndSourceArea: React.FC = () => {
  const context = useContext(MultiDragContext)
  const refDragContainer = useRef<HTMLDivElement>(null)
  const refSelecto = useRef<Selecto>(null)
  const [boxes, setBoxes] = useState(data)
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 })
  const [dragArea, setDragArea] = useState<Rectangle>({
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  })

  const [, drag, dragPreview] = useDrag({
    type: 'box',
    item: {
      boxes: boxes.filter((b) => b.selected),
      dragOffset,
      dragArea,
      onDrop: () => {
        refSelecto.current?.setSelectedTargets([])
        setBoxes(boxes.map((box) => ({ ...box, selected: false })))
      },
    },
  })

  const updateSelectionState = (
    e: OnSelect,
    currentDragArea?: Rectangle,
  ): void => {
    // update select flag
    const selectedId = e.selected.map((el) => el.id)
    const newBoxState = boxes.map((box) => {
      const newState = {
        ...box,
        selected: selectedId.includes(box.id),
      }

      if (!currentDragArea) {
        return newState
      }

      // Update the object's position relative to the area being dragged
      const el = e.selected.find((element) => element.id === box.id)!
      const elementPosition = el?.getBoundingClientRect()
      const position = elementPosition
        ? {
            x: elementPosition.x - currentDragArea.x1,
            y: elementPosition.y - currentDragArea.y1,
          }
        : { x: 0, y: 0 }
      return {
        ...newState,
        position,
      }
    })

    setBoxes(newBoxState)
  }

  useEffect(() => {
    dragPreview(getEmptyImage())
    context.refSelecto = refSelecto
  }, [dragPreview, context])

  return (
    <>
      <Wrapper className="dragContainer" ref={refDragContainer}>
        <BoxWrapper ref={drag}>
          {boxes.map((box) => (
            <Box key={box.id} id={box.id} selected={box.selected}>
              {box.name}
            </Box>
          ))}
        </BoxWrapper>
      </Wrapper>
      <Selecto
        ref={refSelecto}
        dragContainer=".dragContainer"
        selectableTargets={['.box']}
        hitRate={20}
        selectFromInside={false}
        selectByClick
        toggleContinueSelect="meta" // Command+Click
        onDragStart={(e: OnDragStart) => {
          if (boxes.some((b) => b.selected) && isBox(e.inputEvent.target)) {
            // When a box in the selected state is clicked,
            // the selection operation is aborted and the box can be dragged.
            e.stop()
            return
          }
        }}
        onSelect={(e: OnSelect) => {
          updateSelectionState(e)
        }}
        onSelectEnd={(e: OnSelectEnd) => {
          const area = getDragArea(e.selected)
          updateSelectionState(e, area)
          setDragArea(area)
          setDragOffset(getDragOffset(refDragContainer.current!, e.selected))
        }}
      />
    </>
  )
}
