import { XYCoord } from 'react-dnd'

export interface Position {
  x: number
  y: number
}

export interface Box {
  id: string
  name: string
}

export interface SelectedBox extends Box {
  selected: boolean
  position: { x: number; y: number }
}

export interface Rectangle {
  x1: number
  y1: number
  x2: number
  y2: number
}

export interface DragObjectItem {
  boxes: SelectedBox[]
  dragOffset: Position
  dragArea: Rectangle
  onDrop: () => {}
}

export interface DragObject {
  clientOffset: XYCoord | null
  item: DragObjectItem
}
