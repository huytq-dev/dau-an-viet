"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useTranslation } from "react-i18next"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const { t } = useTranslation()

  const bookingSchema = z.object({
    name: z.string().min(1, "Bat buoc."),
    phone: z.string().min(1, "Bat buoc."),
    date: z.string().min(1, "Bat buoc."),
    time: z.string().min(1, "Bat buoc."),
    room: z.string().min(1, "Bat buoc."),
    players: z.string().min(1, "Bat buoc."),
  })

  type BookingFormValues = z.infer<typeof bookingSchema>

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      phone: "",
      date: "",
      time: "",
      room: "",
      players: "",
    },
  })

  const [submitMessage, setSubmitMessage] = useState("")

  useEffect(() => {
    if (isOpen) {
      setSubmitMessage("")
    }
  }, [isOpen])

  const onSubmit = async (values: BookingFormValues) => {
    setSubmitMessage("")
    try {
      const googleSheetsUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL

      if (!googleSheetsUrl) {
        throw new Error("Google Sheets URL chưa được cấu hình.")
      }

      await fetch(googleSheetsUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
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
  const playerOptions = t("modal.playersOptions", { returnObjects: true }) as Record<string, string>

  const isSuccess = submitMessage === t("modal.success")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-border bg-background">
        <header className="p-6 pb-4 border-b border-border/60">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-2xl font-semibold tracking-tight">
              {t("modal.title")}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {t("modal.description")}
            </DialogDescription>
          </DialogHeader>
        </header>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("modal.name")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("modal.namePlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("modal.phone")}</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder={t("modal.phonePlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="room"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("modal.room")}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder={t("modal.roomPlaceholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(roomOptions).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <fieldset className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("modal.date")}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("modal.time")}</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>

            <FormField
              control={form.control}
              name="players"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("modal.players")}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder={t("modal.playersPlaceholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(playerOptions).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <footer className="mt-6 space-y-3">
              <Button 
                  type="submit" 
                  className="w-full py-6 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                  disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("modal.submitting")}
                  </>
                ) : (
                  t("modal.submit")
                )}
              </Button>

              {submitMessage && (
                <p
                  className={`p-3 rounded-md text-center text-sm font-medium ${
                    isSuccess
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "bg-destructive/10 text-destructive border border-destructive/20"
                  }`}
                  role="status"
                >
                  {submitMessage}
                </p>
              )}
            </footer>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
