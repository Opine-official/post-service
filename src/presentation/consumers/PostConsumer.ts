import SaveUser from '../../application/use-cases/SaveUser';
import kafka from '../../infrastructure/brokers/kafka/config';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { UpdateTokenVersion } from '../../application/use-cases/UpdateTokenVersion';

const consumer = kafka.consumer({ groupId: 'post-consumer-group' });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'user-register-topic' });
  await consumer.subscribe({ topic: 'user-login-topic' });

  const userRepository = new UserRepository();
  const saveUser = new SaveUser(userRepository);
  const updateTokenVersion = new UpdateTokenVersion(userRepository);

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        'reached here': true,
        topic,
        partition,
        value: message?.value?.toString(),
      });

      if (!message?.value?.toString()) {
        return;
      }

      if (topic === 'user-register-topic') {
        const userData = JSON.parse(message?.value?.toString());

        const saveUserResult = await saveUser.execute(userData);

        if (saveUserResult instanceof Error) {
          console.error(saveUserResult);
          return;
        }
      } else if (topic === 'user-login-topic') {
        const userData = JSON.parse(message?.value?.toString());

        const updateTokenVersionResult =
          await updateTokenVersion.execute(userData);

        if (updateTokenVersionResult instanceof Error) {
          console.error(updateTokenVersionResult);
          return;
        }
      }
    },
  });
};

run().catch(console.error);

export default run;
