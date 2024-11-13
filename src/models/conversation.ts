// models/Conversation.ts
export namespace Conversation{
  export interface Con {
    id: string            // uniqueidentifier in SQL corresponds to string in TypeScript
    name?: string         // nvarchar(255) in SQL corresponds to string in TypeScript (optional)
    createdAt?: Date      // datetime in SQL corresponds to Date in TypeScript (optional)
  }
  
  export interface ConWithParticipants extends Con {
    participantIds: string[]  // Optional array for conversations with participants
    participantIdsToAdd?: string[] // New participants to add (from front-end)
    participantIdsToRemove?: string[] // Participants to remove (from front-end)
  }
  
  export type participantIds = string[]
}
