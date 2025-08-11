"use client"

import type React from "react"
import { useRef, useEffect } from "react"

interface TableContextMenuProps {
  x: number
  y: number
  onAddRowBelow: () => void
  onAddRowAbove: () => void
  onAddColumnRight: () => void
  onAddColumnLeft: () => void
  onDeleteRow: () => void
  onDeleteColumn: () => void
  onDeleteTable: () => void
  onClose: () => void
}

const TableContextMenu: React.FC<TableContextMenuProps> = ({
  x,
  y,
  onAddRowBelow,
  onAddRowAbove,
  onAddColumnRight,
  onAddColumnLeft,
  onDeleteRow,
  onDeleteColumn,
  onDeleteTable,
  onClose,
}) => {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  return (
    <div
      ref={menuRef}
      className="absolute z-20 bg-white border border-gray-200 rounded-md shadow-lg py-1 overflow-y-auto max-h-[80px]"
      style={{ top: y, left: x }}
    >
      <button
        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        onClick={() => {
          onAddRowAbove()
          onClose()
        }}
      >
        Add Row Above
      </button>
      <button
        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        onClick={() => {
          onAddRowBelow()
          onClose()
        }}
      >
        Add Row Below
      </button>
      <div className="my-1 border-t border-gray-200" /> {/* Separator */}
      <button
        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        onClick={() => {
          onAddColumnLeft()
          onClose()
        }}
      >
        Add Column Left
      </button>
      <button
        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        onClick={() => {
          onAddColumnRight()
          onClose()
        }}
      >
        Add Column Right
      </button>
      <div className="my-1 border-t border-gray-200" /> {/* Separator */}
      <button
        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        onClick={() => {
          onDeleteRow()
          onClose()
        }}
      >
        Delete Row
      </button>
      <button
        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        onClick={() => {
          onDeleteColumn()
          onClose()
        }}
      >
        Delete Column
      </button>
      <button
        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
        onClick={() => {
          onDeleteTable()
          onClose()
        }}
      >
        Delete Table
      </button>
    </div>
  )
}

export default TableContextMenu