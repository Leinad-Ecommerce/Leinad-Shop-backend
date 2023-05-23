import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { EventSourcingModule } from './modules/event-sourcing/event-sourcing.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { RabbitMQService } from './services/rabbitmq/rabbitmq.service';
import { MysqlConsumerService } from './services/mysql-consumer/mysql-consumer.service';
import { AnnouncesModule } from './modules/announces/announces.module';
import { ProductStockModule } from './product-stock/product-stock.module';
import { ProductStockModule } from './modules/product-stock/product-stock.module';

@Module({
  imports: [AuthModule, EventSourcingModule, CategoriesModule, AnnouncesModule, ProductStockModule],
  controllers: [],
  providers: [RabbitMQService, MysqlConsumerService],
})
export class AppModule {}
