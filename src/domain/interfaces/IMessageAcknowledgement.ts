export interface IKafkaAcknowledgement {
  start: (topic: string) => Promise<Error | void>;
}
