import { prismaClient } from "@/modules/@shared/infra/repository/prisma/client"
import { PrismaOrderRepository } from "./prisma-order.repository"
import { OrderEntity } from "../../../domain/entities"
import { mock } from "jest-mock-extended"

describe("Test PrismaOrderRepository", () => {


    let sut: PrismaOrderRepository
    let orderEntity: OrderEntity

    beforeEach(async () => {
        orderEntity = mock<OrderEntity>({
            id: "any_id",
            toJSON: () => ({
                id: "any_id",
                customerId: "any_customer_id",
                status: "PENDINGPAYMENT",
                orderItems: [
                    { 
                        id: "any_id", 
                        quantity: 1, 
                        unitPrice: 1, 
                        announceId: "any_announce_id",
                        stockType: "MANUAL", 
                        announceType: "ITEM", 
                        announceTypeId: "any_announce_type_id" 
                    },
                    { 
                        id: "any_id_2", 
                        quantity: 1, 
                        unitPrice: 1, 
                        announceId: "any_announce_id",
                        stockType: "MANUAL", 
                        announceType: "ITEM", 
                        announceTypeId: "any_announce_type_id" 
                    },
                ]
            }) as any
        })
        sut = new PrismaOrderRepository(prismaClient)
        await prismaClient.order.deleteMany({})
        await prismaClient.orderItems.deleteMany({})
    })

    it("Should create a new order", async () => {
        await sut.create(orderEntity)
        const prismaOrder = await prismaClient.order.findFirst({
            where: {
                id: orderEntity.toJSON().id
            }
        })
        const { orderItems, ...orderEntityProps } = orderEntity.toJSON()
        expect(prismaOrder).toBeTruthy()
        expect(prismaOrder?.id).toBe(orderEntityProps.id)
        expect(prismaOrder?.userId).toBe(orderEntityProps.customerId)
        expect(prismaOrder?.status).toBe(orderEntityProps.status)
        
        const prismaOrderItems = await prismaClient.orderItems.findMany({
            where: { orderId: orderEntityProps.id }
        })

        expect(prismaOrderItems).toBeTruthy()
        expect(prismaOrderItems.length).toBe(2)
        expect( {
            ...prismaOrderItems[0],
        }).toMatchObject(orderItems[0])
        expect( {
            ...prismaOrderItems[1],
        }).toMatchObject(orderItems[1])
    })

    it("Should find an order by id", async () => {
        await sut.create(orderEntity)

        const orderFound = await sut.findById(orderEntity.id)
        expect(orderFound?.toJSON()).toEqual(orderEntity.toJSON())
    })

    it("Should return null if no order is found", async () => {
        const output = await sut.findById("any_id")
        expect(output).toBeNull()
    })
})