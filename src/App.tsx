import React, { useState } from 'react'
import { DndSourceArea } from './components/dnd_source_area'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndDropArea } from './components/dnd_drop_area'
import { DragLayer } from './components/drag_layer'
import { MultiDragContextProvider } from './contexts/multi_drag_context'

export function App() {
  const [open, setOpen] = useState(true)
  return (
    <DndProvider backend={HTML5Backend}>
      <MultiDragContextProvider>
        <div className="App">
          <p>Drag and drop with mouse drag selecting</p>

          <button onClick={() => setOpen(!open)}>
            Open/Close drag source area
          </button>
          {open && <DndSourceArea />}
          <DndDropArea />
          <DragLayer />
        </div>
      </MultiDragContextProvider>
    </DndProvider>
  )
}
