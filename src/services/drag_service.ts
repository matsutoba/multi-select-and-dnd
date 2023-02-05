import { Rectangle, Position, Box } from '../types'
import { DRAG_OBJECT_SIZE } from '../constants'

export const getDragArea = (
  elements: (HTMLElement | SVGElement)[],
): Rectangle => {
  return elements.reduce(
    (result, current) => {
      const pos = current.getBoundingClientRect()
      return {
        x1: Math.min(pos.x, result.x1),
        y1: Math.min(pos.y, result.y1),
        x2: Math.max(pos.x + DRAG_OBJECT_SIZE.width, result.x2),
        y2: Math.max(pos.y + DRAG_OBJECT_SIZE.height, result.y2),
      }
    },
    {
      x1: Number.POSITIVE_INFINITY,
      y1: Number.POSITIVE_INFINITY,
      x2: 0,
      y2: 0,
    },
  )
}

export const getDragOffset = (
  dragContainer: HTMLElement,
  elements: (HTMLElement | SVGElement)[],
): Position => {
  const { left, top } = dragContainer.getBoundingClientRect()
  return {
    x:
      left - Math.min(...elements.map((el) => el.getBoundingClientRect().left)),
    y: top - Math.min(...elements.map((el) => el.getBoundingClientRect().top)),
  }
}

export const isBox = (element: any): element is Box => {
  return (element as Element).className.includes('box')
}
