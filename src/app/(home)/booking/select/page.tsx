import type { Metadata } from "next"
import TeamSelectionPage from "@/features/booking/components/team-selection-page"
import { getTeamsForSlot } from "@/features/booking/data/team-data"

export const metadata: Metadata = {
  title: "Chọn Vé | Đầu Chân Việt",
}

/** Simulates async ticket availability check — triggers loading.tsx */
async function fetchAvailability(roomId: string, date: string, time: string) {
  await new Promise(resolve => setTimeout(resolve, 1500))
  return getTeamsForSlot(roomId, date, time)
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; room?: string; time?: string }>
}) {
  const { date = '', room = '', time = '' } = await searchParams
  const teams = await fetchAvailability(room, date, time)

  return (
    <TeamSelectionPage
      date={date}
      roomId={room}
      time={time}
      teams={teams}
    />
  )
}
