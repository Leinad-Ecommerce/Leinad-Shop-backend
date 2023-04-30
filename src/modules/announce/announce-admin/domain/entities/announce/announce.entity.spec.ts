import { AnnounceEntity } from "./announce.entity"
import { DomainValidator } from "@/modules/@shared/domain/validator"
import { mockDomainValidator } from "@/modules/@shared/tests"
import { AnnounceValidatorFactory } from "./validator"
import { mock, MockProxy } from "jest-mock-extended"
import { left } from "@/modules/@shared/logic"

jest.mock("./validator")

describe("Test announce entity", () => {

    let props: AnnounceEntity.Input
    let sut: AnnounceEntity
    let domainValidatorStub: jest.Mocked<DomainValidator<any>>

    const makeSut = (props: AnnounceEntity.Input, id?: string): AnnounceEntity => {
        const sut = AnnounceEntity.create(props, id)
        if(sut.isLeft()) throw sut.value[0]
        return sut.value
    }

    beforeEach(() => {
        domainValidatorStub = mockDomainValidator()
        jest.spyOn(AnnounceValidatorFactory, "create").mockReturnValue(domainValidatorStub)


        props = {
            title: "any_title",
            description: "any_description",
            price: 10,
            categoryId: "any_category_id",
            userId: "any_user_id",
        }
        sut = makeSut(props)
    })

    it("Should Create an announce entity", () => {
        const sut = makeSut(props, "any_id")
        expect(sut.toJSON()).toEqual({
            id: "any_id",
            title: "any_title",
            description: "any_description",
            price: 10,
            categoryId: "any_category_id",
            userId: "any_user_id",
            status: "DEACTIVATED"
        })
    })

    it("Should call domainValidatorStub once", () => {
        expect(domainValidatorStub.validate).toHaveBeenCalledTimes(1)
    })

    it("Should return an error if domainValidatorStub returns an error", () => {
        jest.spyOn(domainValidatorStub, "validate").mockReturnValueOnce(left([ new Error("validatorError") ]))

        const sut = AnnounceEntity.create(props)
        expect(sut.value).toEqual([ new Error("validatorError") ])
    })

    it("Should activate the announce", () => {
        sut.activate()
        expect(sut.status).toBe("ACTIVE")
    })

    it("Should check if the announce is active", () => {
        expect(sut.isActive()).toBe(false)
        sut.activate()
        expect(sut.isActive()).toBe(true)
    })

    it("Should deactivate the announce", () => {
        sut.activate()
        expect(sut.isActive()).toBe(true)
        sut.deactivate()
        expect(sut.status).toBe("DEACTIVATED")
    })

    it("Should ban the announce", () => {
        sut.ban()
        expect(sut.status).toBe("BANNED")
    })
})