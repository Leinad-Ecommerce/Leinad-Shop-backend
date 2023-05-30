import { PrismaClient } from "@prisma/client";
import { AnnounceItemEntity } from "../../../domain/entities";
import { AnnounceItemRepositoryInterface } from "../../../domain/repositories";

export class PrismaAnnounceItemRepository implements AnnounceItemRepositoryInterface {
    
    constructor(
        private readonly prismaClient: PrismaClient
    ){}
    
    async create(announceItem: AnnounceItemEntity): Promise<void> {
        throw new Error("Method not implemented.");
    }
    findById(id: string): Promise<AnnounceItemEntity | null> {
        throw new Error("Method not implemented.");
    }
    update(announceItem: AnnounceItemEntity): Promise<void> {
        throw new Error("Method not implemented.");
    }


}