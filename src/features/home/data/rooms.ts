export interface RoomData {
  id: number
  titleKey: string
  titleEnKey: string
  image: string
  playersVi: string
  playersEn: string
  time: string
  fullContentKey: string
  fullContentEnKey: string
}

export const roomsData: RoomData[] = [
  {
    id: 1,
    titleKey: 'rooms.room1.title',
    titleEnKey: 'rooms.room1.titleEn',
    image: '/images/room1-mienn-dat-viet.png',
    playersVi: '2 - 4 đội/ 2 - 4 người',
    playersEn: '2 - 4 teams / 2 - 4 players',
    time: '90m',
    fullContentKey: 'rooms.room1.fullContent',
    fullContentEnKey: 'rooms.room1.fullContentEn',
  },
  {
    id: 2,
    titleKey: 'rooms.room2.title',
    titleEnKey: 'rooms.room2.titleEn',
    image: '/images/room2-lang-viet-song.png',
    playersVi: '2 - 4 đội/ 2 - 4 người',
    playersEn: '2 - 4 teams / 2 - 4 players',
    time: '90m',
    fullContentKey: 'rooms.room2.fullContent',
    fullContentEnKey: 'rooms.room2.fullContentEn',
  },
  {
    id: 3,
    titleKey: 'rooms.room3.title',
    titleEnKey: 'rooms.room3.titleEn',
    image: '/images/room3-lang-nghe.png',
    playersVi: '2 - 4 đội/ 2 - 4 người',
    playersEn: '2 - 4 teams / 2 - 4 players',
    time: '90m',
    fullContentKey: 'rooms.room3.fullContent',
    fullContentEnKey: 'rooms.room3.fullContentEn',
  },
]
