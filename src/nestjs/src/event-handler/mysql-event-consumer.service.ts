import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitMQEventEmitterService } from './rabbitmq-event-emitter.service';
const MySQLEvents = require('@rodrigogs/mysql-events');

@Injectable()
export class MysqlEventConsumerService implements OnModuleInit {


  constructor(
    private readonly eventEmitter: RabbitMQEventEmitterService
  ) {}

  onModuleInit(): void {
    this.startEventListening();
  }

  private async startEventListening(): Promise<void> {
    const instance = new MySQLEvents({
        host: 'localhost',
        port: 33010,
        user: 'root',
        password: 'password',
      }, {
        
        startAtEnd: true,
        excludedSchemas: {
          mysql: true,
        },
      });
    
      await instance.start();
    
      instance.addTrigger({
        name: 'TEST',
        expression: 'test-integration-db.outbox',
        statement: MySQLEvents.STATEMENTS.INSERT,
        onEvent: (event: any) => { 
          event.affectedRows.map(async (event: any) => {
            const { eventName, payload } = event.after
            await this.eventEmitter.publishToExchange("amq.fanout", eventName, payload)
          })
        },
      });
      
      instance.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
      instance.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);
  }

  // Add additional methods as needed
}