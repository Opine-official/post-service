import { IKafkaAcknowledgement } from '../../../domain/interfaces/IMessageAcknowledgement';
import kafka from './config';

export class KafkaAcknowledgement implements IKafkaAcknowledgement {
  private consumer;

  constructor() {
    this.consumer = kafka.consumer({ groupId: 'post-consumer-delete-group' });
  }

  async start(
    topic: string,
    // session: any
  ): Promise<Error | void> {
    await this.consumer.connect();

    await this.consumer.subscribe({ topic: topic });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          topic: topic,
          partition: partition,
          value: message?.value?.toString(),
        });

        if (!message?.value?.toString()) {
          // await session.commitTransaction();
          // await session.endSession();

          return;
        }

        const value = JSON.parse(message?.value?.toString());

        if (value.success) {
          // await session.commitTransaction();
        } else {
          // await session.abortTransaction();
        }

        // await session.endSession();
      },
    });
  }
}
