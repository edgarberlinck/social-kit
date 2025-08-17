import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private consumer: Consumer;

  constructor(private configService: ConfigService) {
    this.kafka = new Kafka({
      clientId: 'kafka-consumer-microservice',
      brokers: [
        this.configService.get<string>('KAFKA_BROKER') || 'localhost:9092',
      ],
    });
    this.consumer = this.kafka.consumer({ groupId: 'my-group' });
  }

  async onModuleInit() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'my-topic', fromBeginning: true });

    await this.consumer.run({
      eachMessage: async ({ message }: EachMessagePayload) => {
        await Promise.resolve(); // Add this line to fix the error
        if (!message.value) {
          return;
        }
        console.log({
          value: message.value.toString(),
        });
      },
    });
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();
  }
}
