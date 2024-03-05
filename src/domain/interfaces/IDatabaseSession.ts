import mongoose from 'mongoose';

export interface IDatabaseSession {
  startTransaction(): Promise<void>;
  commitTransaction(): Promise<void>;
  abortTransaction(): Promise<void>;
  endSession(): Promise<void>;
  createNewSession(): Promise<IDatabaseSession>;
  getSession(): mongoose.ClientSession | null;
}
