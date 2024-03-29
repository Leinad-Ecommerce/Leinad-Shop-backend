import { mock } from "jest-mock-extended"
import { MercadopagoPaymentProviderEntity } from "../../../domain/entities"
import { PrismaMercadopagoPaymentProviderRepository } from "./prisma-mercadopago-payment-provider.repository"
import { prismaClient } from "@/modules/@shared/infra/repository/prisma/client"


describe('Test PrismaMercadopagoPaymentProviderRepository', () => { 

    let sut: PrismaMercadopagoPaymentProviderRepository
    let mercadopagoPaymentProviderEntity: MercadopagoPaymentProviderEntity

    beforeEach( async() => {
        const expirationDate = new Date()
        mercadopagoPaymentProviderEntity = mock<MercadopagoPaymentProviderEntity>({
            id: "any_id",
            expirationDate,
            mercadopagoPaymentId: "any_mercadopago_payment_id",
            toJSON: () => ({
                id: "any_id",
                amount: 100,
                expirationDate,
                mercadopagoPaymentId: "any_mercadopago_payment_id",
                orderPaymentId: "any_order_payment_id",
                status: "APPROVED",
                paymentMethod: "PIX"
            })
        })
        sut = new PrismaMercadopagoPaymentProviderRepository(prismaClient)

        await prismaClient.mercadopagoPaymentProvider.deleteMany()
    })

    it("Should create a new payment", async () => {
        await sut.create(mercadopagoPaymentProviderEntity)
        
        const prismaMercadopagoPaymentProvider = await prismaClient.mercadopagoPaymentProvider.findUnique({
            where: { id: mercadopagoPaymentProviderEntity.id }
        })
        expect(prismaMercadopagoPaymentProvider).toEqual(mercadopagoPaymentProviderEntity.toJSON())
    })

    it("Should find a payment by id", async () => {
        await sut.create(mercadopagoPaymentProviderEntity)

        const result = await sut.findById(mercadopagoPaymentProviderEntity.id)
        expect({...result?.toJSON()}).toEqual({...mercadopagoPaymentProviderEntity.toJSON(), expirationDate: result?.expirationDate})
    })

    it("Should return null if payment not found", async () => {
        const result = await sut.findById("any_id")
        expect(result).toBeNull()
    })

    it("Should find a payment by mercadopagoPaymentId", async () => {
        await sut.create(mercadopagoPaymentProviderEntity)

        const result = await sut.findByMercadopagoPaymentId(mercadopagoPaymentProviderEntity.mercadopagoPaymentId)
        expect({...result?.toJSON()}).toEqual({...mercadopagoPaymentProviderEntity.toJSON(), expirationDate: result?.expirationDate})
    })

    it("Should return null if payment not found", async () => {
        const result = await sut.findByMercadopagoPaymentId("any_mercadopago_payment_id")
        expect(result).toBeNull()
    })

    it("Should update a payment", async () => {
        await sut.create(mercadopagoPaymentProviderEntity)

        const mercadopagoPayment = await sut.findById(mercadopagoPaymentProviderEntity.id)

        mercadopagoPayment?.cancel()
        await sut.update(mercadopagoPayment!)

        const updatedMercadopagoPayment = await sut.findById(mercadopagoPaymentProviderEntity.id)
        expect({...updatedMercadopagoPayment?.toJSON(), expirationDate: mercadopagoPayment?.expirationDate}).toEqual(mercadopagoPayment?.toJSON())
    })
})