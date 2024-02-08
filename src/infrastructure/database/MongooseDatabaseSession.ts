import mongoose from 'mongoose';
import { IDatabaseSession } from '../../domain/interfaces/IDatabaseSession';

export class MongooseDatabaseSession implements IDatabaseSession {
  private session: mongoose.ClientSession | null = null;

  constructor(session?: mongoose.ClientSession) {
    this.session = session || null;
  }

  async startTransaction() {
    if (this.session) {
      this.session.startTransaction();
    }
  }

  async commitTransaction() {
    if (this.session) {
      await this.session.commitTransaction();
    }
  }

  async abortTransaction() {
    if (this.session) {
      await this.session.abortTransaction();
    }
  }

  async endSession() {
    if (this.session) {
      this.session.endSession();
      this.session = null;
    }
  }

  getSession(): mongoose.ClientSession | null {
    return this.session;
  }

  async createNewSession(): Promise<IDatabaseSession> {
    const newSession = await mongoose.startSession();
    return new MongooseDatabaseSession(newSession);
  }
}
