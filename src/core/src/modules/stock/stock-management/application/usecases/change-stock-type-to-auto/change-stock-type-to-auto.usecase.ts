import { left, right } from "@/modules/@shared/logic";
import {  ChangeStockTypeToAutoUsecaseInterface} from "@/modules/stock/stock-management/domain/usecases";
import { ProductStockAlreadyIsAutoError, ProductStockNotFoundError } from "../_errors";
import { EventEmitterInterface } from "@/modules/@shared/events";
import { StockTypeChangedToAutoEvent } from "./stock-type-changed-to-auto.event";
import { StockManagementRepositoryInterface } from "../../../domain/repositories/stock-management.repository";

export class ChangeStockTypeToAutoUsecase implements ChangeStockTypeToAutoUsecaseInterface {

    constructor(
        private readonly stockManagementRepository: StockManagementRepositoryInterface,
        private readonly eventEmitter: EventEmitterInterface
    ) { }

    async execute({ stockAutoId }: ChangeStockTypeToAutoUsecaseInterface.InputDto): Promise<ChangeStockTypeToAutoUsecaseInterface.OutputDto> {

        const stockManagementEntity = await this.stockManagementRepository.findById(stockAutoId)
        if (!stockManagementEntity) return left([new ProductStockNotFoundError()])

        if (stockManagementEntity.isStockAuto()) return left([new ProductStockAlreadyIsAutoError()])

        stockManagementEntity.toStockAuto()

        await this.stockManagementRepository.update(stockManagementEntity)

        const stockTypeChangedToAutoEvent = new StockTypeChangedToAutoEvent({
            id: stockManagementEntity.id
        })
        await this.eventEmitter.emit(stockTypeChangedToAutoEvent)

        return right(null)
    }
}