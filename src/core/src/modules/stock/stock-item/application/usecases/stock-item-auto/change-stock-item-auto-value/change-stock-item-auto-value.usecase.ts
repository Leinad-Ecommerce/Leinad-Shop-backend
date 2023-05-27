import { EventEmitterInterface } from "@/modules/@shared/events";
import { left, right } from "@/modules/@shared/logic";
import { StockItemAutoRepositoryInterface } from "@/modules/stock/stock-item/domain/repositories";
import { ChangeStockItemAutoValueUsecaseInterface } from "@/modules/stock/stock-item/domain/usecases";
import { StockItemAutoNotFoundError } from "../_errors";
import { StockItemAutoValueChangedEvent } from "./stock-item-auto-value-changed.event";


export class ChangeStockItemAutoValueUsecase implements ChangeStockItemAutoValueUsecaseInterface {

    constructor(
        private readonly stockItemAutoRepository: StockItemAutoRepositoryInterface,
        private readonly eventEmitter: EventEmitterInterface
    ){}

    async execute({ stockItemAutoId, value }: ChangeStockItemAutoValueUsecaseInterface.InputDto): Promise<ChangeStockItemAutoValueUsecaseInterface.OutputDto> {
        
        const stockItemAutoEntity = await this.stockItemAutoRepository.findById(stockItemAutoId)
        if(!stockItemAutoEntity) return left([ new StockItemAutoNotFoundError()])

        const changeValueResult = stockItemAutoEntity.changeValue(value)
        if(changeValueResult.isLeft()) return left(changeValueResult.value)

        await this.stockItemAutoRepository.update(stockItemAutoEntity)

        const stockItemAutoValueChangedEvent = new StockItemAutoValueChangedEvent({
            stockItemAutoId: stockItemAutoEntity.id,
            value: stockItemAutoEntity.getValue()
        })

        await this.eventEmitter.emit(stockItemAutoValueChangedEvent)

        return right(null)
    }
}