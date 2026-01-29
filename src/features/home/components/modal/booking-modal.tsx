'use client'

import { useState, useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Calendar, Clock, User, Phone, MapPin, Users } from "lucide-react"
import { useTranslation } from "react-i18next"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
// Import Slider từ shadcn/ui
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { AnimatedText } from "@/components/ui/animated-text"

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const { t, i18n } = useTranslation('common')
  const currentLanguage = i18n.resolvedLanguage ?? i18n.language

  // Cập nhật schema: players bây giờ là số từ 2 đến 12
  const bookingSchema = z.object({
    name: z.string().min(1, t("modal.validation.name") || "Bắt buộc"),
    phone: z.string().min(10, t("modal.validation.phone") || "SĐT không hợp lệ"),
    date: z.string().min(1, t("modal.validation.date") || "Bắt buộc"),
    time: z.string().min(1, t("modal.validation.time") || "Bắt buộc"),
    room: z.string().min(1, t("modal.validation.room") || "Bắt buộc"),
    players: z.number().min(2).max(12),
  })

  type BookingFormValues = z.infer<typeof bookingSchema>

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    // Default players là 2
    defaultValues: { name: "", phone: "", date: "", time: "", room: "", players: 2 },
  })

  const [submitMessage, setSubmitMessage] = useState("")

  useEffect(() => {
    if (isOpen) {
      setSubmitMessage("")
      form.reset()
    }
  }, [isOpen, form])

  const onSubmit = async (values: BookingFormValues) => {
    setSubmitMessage("")
    try {
      const googleSheetsUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL
      if (!googleSheetsUrl) throw new Error("Missing Google Sheets URL")
      await fetch(googleSheetsUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      setSubmitMessage(t("modal.success"))
      form.reset()
      setTimeout(() => {
        onClose()
        setSubmitMessage("")
      }, 2000)
    } catch (error) {
      console.error("Booking error:", error)
      setSubmitMessage(t("modal.error"))
    }
  }

  const roomOptions = t("modal.roomOptions", { returnObjects: true }) as Record<string, string>
  const isSuccess = submitMessage === t("modal.success")

  // --- STYLE ---
  const fieldContainer = "relative bg-[#2b0e0e] border border-white/5 rounded-lg transition-all duration-200 focus-within:border-yellow-600/50 focus-within:ring-1 focus-within:ring-yellow-600/20"
  const inputBase = "h-11 bg-transparent border-none text-white placeholder:text-white/30 focus-visible:ring-0 pl-10 text-sm"
  const iconStyle = "absolute left-3 top-3 h-5 w-5 text-yellow-600/70"
  const labelStyle = "text-xs font-semibold text-yellow-500/80 mb-1.5 ml-1 uppercase tracking-wide"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95%] sm:max-w-[500px] max-h-[90vh] overflow-y-auto p-0 gap-0 bg-[#160404] border border-yellow-900/30 shadow-2xl rounded-xl">

        <DialogHeader className="px-4 py-4 sm:px-6 sm:py-5 border-b border-white/5 bg-[#1a0505] sticky top-0 z-10">
          <DialogTitle className="text-lg sm:text-xl font-bold tracking-widest text-yellow-500 uppercase text-center">
            <AnimatedText animationType="fade" dependencyKey={`${currentLanguage}-modal-title`}>
              {t("modal.title") || "ĐẶT PHÒNG"}
            </AnimatedText>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 sm:p-6 space-y-4 sm:space-y-5">

            {/* Hàng 1: Tên & SĐT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className={labelStyle}>{t("modal.name")}</FormLabel>
                    <div className={fieldContainer}>
                      <User className={iconStyle} />
                      <FormControl>
                        <Input placeholder="Tên của bạn" {...field} className={inputBase} />
                      </FormControl>
                    </div>
                    <FormMessage className="text-red-400 text-[10px] mt-1" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className={labelStyle}>{t("modal.phone")}</FormLabel>
                    <div className={fieldContainer}>
                      <Phone className={iconStyle} />
                      <FormControl>
                        <Input placeholder="Số điện thoại" {...field} className={inputBase} />
                      </FormControl>
                    </div>
                    <FormMessage className="text-red-400 text-[10px] mt-1" />
                  </FormItem>
                )}
              />
            </div>

            {/* Hàng 2: Chọn phòng */}
            <FormField
              control={form.control}
              name="room"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className={labelStyle}>{t("modal.room")}</FormLabel>
                  <div className={fieldContainer}>
                    <MapPin className={iconStyle} />
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className={cn(inputBase, "w-full text-left")}>
                          <SelectValue placeholder={t("modal.roomPlaceholder")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#1f0a0a] border-yellow-900/30 text-white">
                        {Object.entries(roomOptions).map(([value, label]) => (
                          <SelectItem key={value} value={value} className="focus:bg-yellow-600 focus:text-black">
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <FormMessage className="text-red-400 text-[10px] mt-1" />
                </FormItem>
              )}
            />

            {/* Hàng 3: Ngày & Giờ */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className={labelStyle}>{t("modal.date")}</FormLabel>
                    <div className={fieldContainer}>
                      <Calendar className={cn(iconStyle, "w-4 h-4")} />
                      <FormControl>
                        <Input type="date" {...field} className={cn(inputBase, "pl-10")} />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className={labelStyle}>{t("modal.time")}</FormLabel>
                    <div className={fieldContainer}>
                      <Clock className={cn(iconStyle, "w-4 h-4")} />
                      <FormControl>
                        <Input type="time" {...field} className={cn(inputBase, "pl-10")} />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Hàng 4: SL NGƯỜI (SLIDER 2 - 12) */}
            <FormField
              control={form.control}
              name="players"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <div className="flex justify-between items-end">
                    <FormLabel className={labelStyle}>
                      {t("modal.players") || "Số người"}
                    </FormLabel>
                    <span className="text-yellow-500 font-bold text-sm bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
                      {field.value} {t("modal.playerUnit") || "người"}
                    </span>
                  </div>
                  <div className="px-2 py-4 bg-[#2b0e0e] rounded-lg border border-white/5">
                    <FormControl>
                      <Slider
                        min={2}
                        max={12}
                        step={1}
                        value={[field.value]}
                        onValueChange={(vals) => field.onChange(vals[0])}
                        className="py-1"
                      />
                    </FormControl>
                    <div className="flex justify-between mt-2 text-[10px] text-white/30 font-medium px-1">
                      <span>2</span>
                      <span>4</span>
                      <span>6</span>
                      <span>8</span>
                      <span>10</span>
                      <span>12</span>
                    </div>
                  </div>
                  <FormMessage className="text-red-400 text-[10px]" />
                </FormItem>
              )}
            />

            {/* Nút Gửi */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full h-11 sm:h-12 bg-yellow-600 hover:bg-yellow-500 text-black font-bold tracking-widest uppercase rounded-lg shadow-lg shadow-yellow-900/20 transition-all duration-300"
              >
                {form.formState.isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  t("modal.submit") || "XÁC NHẬN"
                )}
              </Button>

              {submitMessage && (
                <div className={`mt-3 text-center text-sm font-medium ${isSuccess ? "text-green-500" : "text-red-500"}`}>
                  {submitMessage}
                </div>
              )}
            </div>

          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}