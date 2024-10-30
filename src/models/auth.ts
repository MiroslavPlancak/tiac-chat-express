// models/UserAuth.ts

export interface UserAuth {
    userId: string; // Assuming you're using a string for the uniqueidentifier type
    username: string;
    passwordHash: string;
  }
  