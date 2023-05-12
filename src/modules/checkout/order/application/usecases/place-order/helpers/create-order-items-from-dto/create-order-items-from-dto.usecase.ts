import { UsecaseInterface } from "@/modules/@shared/domain";
import { Either, left, right } from "@/modules/@shared/logic";
import { OrderItemEntity } from "@/modules/checkout/order/domain/entities";
import { PlaceOrderInputDto } from "../../place-order.dto";
import { InsufficientProductStockError, ProductNotFoundError, ProductOutOfStockError } from "../../errors";
import { CheckAnnounceExistsFacadeFactory, GetAnnouncePriceFacadeFactory } from "@/modules/announce/announce-admin/factories";
import { GetProductStockFacadeFactory } from "@/modules/product-stock/factories";

export class CreateOrderItemsFromDtoUsecase implements UsecaseInterface {
    async execute(products: PlaceOrderInputDto["products"]): Promise<Either<Error[], OrderItemEntity[]>> {
        
        const orderItems: OrderItemEntity[] = []
        for(const product of products) {
            // check if product exists
            const productExistsResult = await this.checkAnnounceExists(product.id)
            if(!productExistsResult) return left([ new ProductNotFoundError() ])
            // check if product has enough stock
            const stockValidationResult = await this.validateStock(product.quantity, product.id)
            if(stockValidationResult.isLeft()) return left(stockValidationResult.value)
            // get product price
            const announcePrice = await this.getAnnouncePrice(product.id)
            
            const orderItemEntity = OrderItemEntity.create({
                productId: product.id,
                quantity: product.quantity,
                unitPrice: announcePrice
            })
            if(orderItemEntity.isLeft()) return left(orderItemEntity.value)
            
            orderItems.push(orderItemEntity.value)
        }
        return right(orderItems)

    }

    private async validateStock(requiredQuantity: number, productId: string):  Promise<Either<Error[], null>>{
        const productStockQuantity = await this.getProductStockQuantity(productId) ?? 0
        if(productStockQuantity <= 0) return left([ new ProductOutOfStockError(productId) ])
        if(productStockQuantity < requiredQuantity) return left([ 
            new InsufficientProductStockError(productId, requiredQuantity, productStockQuantity) 
        ])
        return right(null)
    }

    private async checkAnnounceExists(id: string): Promise<boolean> {
        const checkAnnounceExistsFacade = CheckAnnounceExistsFacadeFactory.create()
        return await checkAnnounceExistsFacade.execute(id)
    }

    private async getAnnouncePrice(id: string): Promise<number> {
        const getAnnouncePriceFacade = GetAnnouncePriceFacadeFactory.create()
        const announcePrice = await getAnnouncePriceFacade.execute(id)
        return announcePrice ?? 0
    }

    private async getProductStockQuantity(id: string): Promise<number> { 
        const getProductStockFacade = GetProductStockFacadeFactory.create()
        const productStock = await getProductStockFacade.execute(id)
        return productStock ?? 0
    }
}