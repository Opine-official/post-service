import kafka from '../../infrastructure/brokers/kafka/config';

const consumer = kafka.consumer({ groupId: 'post-consumer-group' });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'user-register-topic' });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        'reached here': true,
        topic,
        partition,
        value: message?.value?.toString(),
      });
    },
  });
};

run().catch(console.error);

export default run;
