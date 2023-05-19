export interface IMemory {
  userId: string
  content: string
  isPublic: boolean
  coverUrl: string
}

export interface IMemoryModel extends IMemory {
  id: string
  createdAt: Date
}
