"use client"

import { X } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { TICKET_TYPES, type TicketType } from "../data/team-data"

interface TicketTypeModalProps {
  open: boolean
  teamName: string
  playerId: number
  onClose: () => void
  onSelect: (ticketType: TicketType) => void
}

export default function TicketTypeModal({
  open,
  teamName,
  playerId,
  onClose,
  onSelect,
}: TicketTypeModalProps) {
  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-w-xl w-full max-h-[85vh] p-0 gap-0 bg-white border-none overflow-hidden flex flex-col"
        aria-describedby={undefined}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
          <DialogTitle className="text-lg font-bold text-gray-900">
            Chọn Loại Vé
          </DialogTitle>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slot info */}
        <div className="flex items-center gap-8 px-6 py-3 border-b border-gray-100 bg-gray-50 shrink-0">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Đội</p>
            <p className="font-bold text-gray-900">{teamName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Vị trí</p>
            <p className="font-bold text-gray-900">{playerId}</p>
          </div>
        </div>

        {/* Ticket type list */}
        <div className="overflow-y-auto flex-1">
          {TICKET_TYPES.map((ticket, idx) => (
            <div
              key={ticket.id}
              className={`px-6 py-4 ${idx < TICKET_TYPES.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-sm">{ticket.name}</h3>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {ticket.basePrice + ticket.bookingFee}.000đ{' '}
                    <span className="text-gray-400 text-xs">
                      ({ticket.basePrice}.000đ + {ticket.bookingFee}.000đ phí dịch vụ)
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                    {ticket.description}
                  </p>
                </div>
                <button
                  onClick={() => onSelect(ticket)}
                  className="shrink-0 px-5 py-2 rounded-full border-2 border-[#7f1d1d] text-[#7f1d1d] text-sm font-semibold hover:bg-[#7f1d1d] hover:text-white transition-colors"
                >
                  Chọn
                </button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
