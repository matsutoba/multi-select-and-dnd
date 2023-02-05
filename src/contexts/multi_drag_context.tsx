import React, { createContext, useRef, useMemo } from 'react'
import Selecto from 'react-selecto'

interface MultiDragContextProps {
  refSelecto: React.RefObject<Selecto> | null
  clearSelection: (onDrop: () => void) => void
}

export const MultiDragContext = createContext<MultiDragContextProps>({
  refSelecto: null,
  clearSelection: () => {},
})

interface MultiDragContextProviderProps {
  children: React.ReactNode
}

export const MultiDragContextProvider: React.FC<MultiDragContextProviderProps> = ({
  children,
}) => {
  const refSelecto = useRef<Selecto>(null)

  const value: MultiDragContextProps = useMemo(
    () => ({
      refSelecto,
      clearSelection: (onDrop) => {
        onDrop()
      },
    }),
    [],
  )

  return (
    <MultiDragContext.Provider value={value}>
      {children}
    </MultiDragContext.Provider>
  )
}
