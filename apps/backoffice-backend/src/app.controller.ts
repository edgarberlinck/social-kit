import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { KafkaProducerService } from './kafka/kafka.producer.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly kafkaProducerService: KafkaProducerService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('message')
  async postMessage(@Body() message: any) {
    await this.kafkaProducerService.sendMessage('my-topic', message);
    return { status: 'Message sent to Kafka' };
  }
}
