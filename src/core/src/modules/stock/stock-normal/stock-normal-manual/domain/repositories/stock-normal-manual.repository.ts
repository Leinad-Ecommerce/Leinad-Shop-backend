import { StockNormalManualEntity } from "../entities";

export interface StockNormalManualRepositoryInterface {
    create(stockNormalManualEntity: StockNormalManualEntity): Promise<void>
    findById(id: string): Promise<StockNormalManualEntity | null>
    findByAnnounceNormalId(announceNormalId: string): Promise<StockNormalManualEntity | null>
    update(stockNormalManualEntity: StockNormalManualEntity): Promise<void>
}