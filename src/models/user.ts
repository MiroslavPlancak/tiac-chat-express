// models/User.ts

export interface User {
    id: string; // uniqueidentifier in SQL corresponds to string in TypeScript
    name: string; // nvarchar(255) in SQL corresponds to string in TypeScript
  }
  