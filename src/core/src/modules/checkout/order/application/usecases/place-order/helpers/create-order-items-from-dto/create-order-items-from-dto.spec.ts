import { CheckAnnounceExistsFacadeInterface, GetAnnouncePriceFacadeInterface } from "@/modules/announce/announce-admin/facades";
import { PlaceOrderInputDto } from "../../place-order.dto"
import { CreateOrderItemsFromDtoUsecase } from "./create-order-items-from-dto.usecase"

import { CheckAnnounceExistsFacadeFactory, GetAnnouncePriceFacadeFactory } from "@/modules/announce/announce-admin/factories";
import { GetProductStockFacadeFactory } from "@/modules/product-stock/factories";
import { GetProductStockFacadeInterface } from "@/modules/product-stock/facades";
import { InsufficientProductStockError, ProductNotFoundError, ProductOutOfStockError } from "../../errors";

jest.mock("@/modules/announce/announce-admin/factories")
jest.mock("@/modules/product-stock/factories")

describe("Test CreateOrderItemsFromDtoUsecase", () => {

    let sut: CreateOrderItemsFromDtoUsecase
    let props: PlaceOrderInputDto["products"]
    let checkAnnounceExistsFacade: CheckAnnounceExistsFacadeInterface
    let getProductStockFacade: GetProductStockFacadeInterface
    let getAnnouncePriceFacade: GetAnnouncePriceFacadeInterface

    beforeEach(() => {
        getProductStockFacade = { execute: jest.fn().mockResolvedValue(3) }
        GetProductStockFacadeFactory.create = jest.fn().mockReturnValue(getProductStockFacade)

        checkAnnounceExistsFacade = { execute: jest.fn().mockResolvedValue(true) }
        CheckAnnounceExistsFacadeFactory.create = jest.fn().mockReturnValue(checkAnnounceExistsFacade)

        getAnnouncePriceFacade = { execute: jest.fn().mockResolvedValue(10) }
        GetAnnouncePriceFacadeFactory.create = jest.fn().mockReturnValue(getAnnouncePriceFacade)
        
        props = [
            { id: "1", quantity: 3 },
            { id: "2", quantity: 2 },
            { id: "3", quantity: 1 }
        ]
        sut = new CreateOrderItemsFromDtoUsecase()
    })

    it("Should execute the usecase properly", async () => {
        const output = await sut.execute(props)
        expect(output.isRight()).toBe(true)
    })

    it("Should call checkAnnounceExistsFacade every time the loop runs", async () => {
        await sut.execute(props)
        expect(checkAnnounceExistsFacade.execute).toBeCalledTimes(props.length)
    })

    it("Should call getProductStockFacade every time the loop runs", async () => {
        await sut.execute(props)
        expect(getProductStockFacade.execute).toBeCalledTimes(props.length)
    })

    it("Should call getAnnouncePriceFacade every time the loop runs", async () => {
        await sut.execute(props)
        expect(getAnnouncePriceFacade.execute).toBeCalledTimes(props.length)
    })

    it("Should return ProductNotFoundError if one of the products does not exist", async () => {
        checkAnnounceExistsFacade.execute = jest.fn().mockResolvedValueOnce(false)
        const output = await sut.execute(props)
        expect(output.isLeft()).toBe(true)
        expect(output.value[0]).toEqual(new ProductNotFoundError() )
    })

    it("Should return ProductOutOfStockError if one of the products does not have stock", async () => {
        getProductStockFacade.execute = jest.fn().mockResolvedValueOnce(0)
        const output = await sut.execute(props)
        expect(output.isLeft()).toBe(true)
        expect(output.value[0]).toEqual(new ProductOutOfStockError(props[0].id) )
    })

    it("Should return InsufficientProductStockError if one of the products does not have enough stock to supply the required stock", async () => {
        getProductStockFacade.execute = jest.fn().mockResolvedValueOnce(2)
        const output = await sut.execute(props)
        expect(output.isLeft()).toBe(true)
        expect(output.value[0]).toEqual(new InsufficientProductStockError(props[0].id, props[0].quantity, 2) )
    })

    it("Should return the order items if everything is ok", async () => {
        const output = await sut.execute(props)
        expect(output.isRight()).toBe(true)
        expect(output.value.length).toBe(props.length)
    })

    
})