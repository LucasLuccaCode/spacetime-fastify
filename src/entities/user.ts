import { IMemory } from './memory'

export interface IUser {
  githubId: number
  name: string
  login: string
  avatarUrl: string
}

export interface IUserModel extends IUser {
  id: string
}

export interface IUserWithMemories extends IUserModel {
  memories: IMemory[]
}
