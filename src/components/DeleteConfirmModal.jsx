import React from 'react'
import { AlertTriangle, Trash2, X } from 'lucide-react'

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, roomNumber }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200 p-6 space-y-4">
        
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900">Delete Room {roomNumber}?</h3>
            <p className="text-xs text-stone-500 mt-0.5">This action cannot be undone.</p>
          </div>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-3 rounded-2xl border border-stone-100">
          Are you sure you want to remove Room <span className="font-bold text-stone-800">{roomNumber}</span> from the inventory?
        </p>

        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-100 text-stone-700 hover:bg-stone-200 rounded-xl text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center space-x-1.5 shadow-md shadow-red-600/20"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete Room</span>
          </button>
        </div>

      </div>
    </div>
  )
}

export default DeleteConfirmModal
