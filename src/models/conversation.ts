// models/Conversation.ts

export interface Conversation {
    id: string // uniqueidentifier in SQL corresponds to string in TypeScript
    name?: string // nvarchar(255) in SQL corresponds to string in TypeScript (optional)
    createdAt?: Date // datetime in SQL corresponds to Date in TypeScript (optional)
  }
  