import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { EventSourcingModule } from './modules/event-sourcing/event-sourcing.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { RabbitMQService } from './services/rabbitmq/rabbitmq.service';
import { MysqlConsumerService } from './services/mysql-consumer/mysql-consumer.service';
import { AnnounceManagementModule } from './modules/announce/announce-management/announce-management.module';
import { AnnounceInfoModule } from './modules/announce/announce-info/announce-info.module';
import { AnnounceNormalModule } from './modules/announce/announce-types/announce-normal/announce-normal.module';
import { AnnounceItemModule } from './modules/announce/announce-types/announce-item/announce-item.module';
import { StockItemManualModule } from './modules/stock/stock-item/stock-item-manual/stock-item-manual.module';
import { StockItemAutoModule } from './modules/stock/stock-item/stock-item-auto/stock-item-auto.module';
import { StockNormalManualModule } from './modules/stock/stock-normal/stock-normal-manual/stock-normal-manual.module';
import { StockNormalAutoModule } from './modules/stock/stock-normal/stock-normal-auto/stock-normal-auto.module';
import { OrderModule } from './modules/checkout/order/order.module';
import { PaymentModule } from './modules/checkout/payment/payment.module';

@Module({
  imports: [
    AuthModule, 
    EventSourcingModule, 
    CategoriesModule, 
    AnnounceManagementModule, 
    AnnounceInfoModule, 
    AnnounceNormalModule, 
    AnnounceItemModule, 
    StockItemManualModule, 
    StockItemAutoModule, 
    StockNormalManualModule, 
    StockNormalAutoModule, OrderModule, PaymentModule, 
  ],
  controllers: [],
  providers: [RabbitMQService, MysqlConsumerService],
})
export class AppModule {}
