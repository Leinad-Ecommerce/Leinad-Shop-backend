import { OutboxEmitter } from "@/modules/@shared/infra/providers";
import { prismaClient } from "@/modules/@shared/infra/repository/prisma/client";
import { PrismaClient } from "@prisma/client";
import { SendNotificationUsecaseInterface } from "../../domain/usecases";
import { SendNotificationUsecase } from "../../application/usecases";
import { PrismaNotificationRepository } from "../../infra/repositories";

export class SendNotificationUsecaseFactory {

    static create(): SendNotificationUsecaseInterface {

        const execute = async (input: SendNotificationUsecaseInterface.InputDto): Promise<SendNotificationUsecaseInterface.OutputDto> => {

            return await prismaClient.$transaction(async (prisma) => {
                const prismaNotificationRepository = new PrismaNotificationRepository(prisma as PrismaClient)
                const outboxEmitter = new OutboxEmitter(prisma as PrismaClient)
                const sendNotificationUsecase = new SendNotificationUsecase(
                    prismaNotificationRepository,
                     outboxEmitter
                )
                return await sendNotificationUsecase.execute(input)
            })
        }

        return {
            execute
        }
    }
}