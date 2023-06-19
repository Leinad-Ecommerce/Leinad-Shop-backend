import { OnModuleInit } from "@nestjs/common";
import { Message } from "amqplib";
import { RabbitMQService } from "src/services/rabbitmq/rabbitmq.service";
import { 
    VerifyEmailUsecase
} from "@core/domain/dist/src/modules/auth/main/factories"

export class VerifyEmailConsumer implements OnModuleInit {

    constructor(
        private readonly rabbitMqService: RabbitMQService
    ){}

    onModuleInit(): void {
        const exchange = "EmailVerifiedEventExchange"
        this.rabbitMqService.setupConsumer({
            exchange,
            queue: "verify-user-email-queue"
        }, this.verifyEmail)
    }

    async verifyEmail(message: Message) {
        const payload = RabbitMQService.getContentFromMessage(message)
        
    }
}