export interface IMemory {
  coverUrl: string
  content: string
  isPublic: boolean
  userId: string
}

export interface IMemoryModel extends IMemory {
  id: string
  createdAt: Date
}
