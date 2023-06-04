import { StockNormalManagementEntity } from "../entities";

export interface StockNormalManagementRepositoryInterface {
    findById(id: string): Promise<StockNormalManagementEntity | null>
    findByAnnounceNormalId(announceNormalId: string): Promise<StockNormalManagementEntity | null>
    update(stockEntity: StockNormalManagementEntity): Promise<void>
    create(stockEntity: StockNormalManagementEntity): Promise<void>
}