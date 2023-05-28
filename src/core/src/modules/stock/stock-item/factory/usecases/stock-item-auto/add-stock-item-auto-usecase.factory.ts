import { OutboxEmitter } from "@/modules/@shared/infra/providers";
import { prismaClient } from "@/modules/@shared/infra/repository/prisma/client";
import { PrismaClient } from "@prisma/client";
import { AddStockItemAutoUsecaseInterface, ChangeStockItemTypeToAutoUsecaseInterface } from "../../../domain/usecases";
import { PrismaStockItemAutoRepository, PrismaStockItemRepository } from "../../../infra/repositories";
import { AddStockItemAutoUsecase, ChangeStockItemTypeToAutoUsecase} from "../../../application/usecases";

export class AddStockItemUsecaseFactory {

    static create(): AddStockItemAutoUsecaseInterface {
        
        const execute = async (input: AddStockItemAutoUsecaseInterface.InputDto): Promise<AddStockItemAutoUsecaseInterface.OutputDto> => {
            
            return await prismaClient.$transaction(async (prisma) => {
                const prismaStockItemAutoRepository = new PrismaStockItemAutoRepository(prisma as PrismaClient)
                const outboxEmitter = new OutboxEmitter(prisma as PrismaClient)
                const addStockItemAutoUsecase = new AddStockItemAutoUsecase(prismaStockItemAutoRepository, outboxEmitter)
                return await addStockItemAutoUsecase.execute(input)
            })
        }

        return {
            execute
        }
    }
}