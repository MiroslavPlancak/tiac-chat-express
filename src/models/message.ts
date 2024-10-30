// models/Message.ts

export interface Message {
    id: string; // uniqueidentifier in SQL corresponds to string in TypeScript
    conversationId: string; // uniqueidentifier in SQL corresponds to string in TypeScript
    userId: string; // uniqueidentifier in SQL corresponds to string in TypeScript
    messageBody: string; // nvarchar(max) in SQL corresponds to string in TypeScript
    dateTime?: Date; // datetime in SQL corresponds to Date in TypeScript (optional)
  }
  