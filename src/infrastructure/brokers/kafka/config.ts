import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'post-service',
  brokers: ['kafka:9092'],
});

export default kafka;
