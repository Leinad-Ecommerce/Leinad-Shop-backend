import { EventEmitterInterface } from "@/modules/@shared/events"
import { TwoFactorAuthenticationRepositoryInterface } from "../../../domain/repositories"
import { Remove2faUsecaseInterface } from "../../../domain/usecases"
import { Remove2faUsecase } from "./remove-2fa.usecase"
import { TwoFactorAuthenticationEntity } from "../../../domain/entities"
import { mock } from "jest-mock-extended"
import { TwoFactorAuthenticationRemovedEvent } from "./2fa-removed.event"

jest.mock("./2fa-removed.event")

describe("Test Remove2faUsecase", () => {

    let sut: Remove2faUsecase
    let props: Remove2faUsecaseInterface.InputDto
    let twoFactorAuthenticationRepository: TwoFactorAuthenticationRepositoryInterface
    let eventEmitter: EventEmitterInterface
    let twoFactorAuthenticationEntity: TwoFactorAuthenticationEntity

    beforeEach(() => {
        props = {
            userId: "any_user_id"
        }
        twoFactorAuthenticationEntity = mock<TwoFactorAuthenticationEntity>()
        twoFactorAuthenticationRepository = mock<TwoFactorAuthenticationRepositoryInterface>({
            findByUserId: async () => twoFactorAuthenticationEntity
        })
        eventEmitter = mock<EventEmitterInterface>()
        sut = new Remove2faUsecase(twoFactorAuthenticationRepository, eventEmitter)
    })

    it("Should execute the usecase properly", async () => {
        const output = await sut.execute(props)
        expect(output.isRight()).toBe(true)
    })

    it("Should return TwoFactorNotFoundError if twoFactor is not found on repository", async () => {
        jest.spyOn(twoFactorAuthenticationRepository, "findByUserId")
        .mockResolvedValueOnce(null)

        const output = await sut.execute(props)
        if(output.isRight()) return fail("it should not be right")
        expect(output.value[0].name).toBe("TwoFactorNotFoundError")
    })

    it("Should call twoFactorAuthenticationRepository.delete with correct values", async () => {
        await sut.execute(props)
        expect(twoFactorAuthenticationRepository.delete).toHaveBeenCalledWith(twoFactorAuthenticationEntity.id)
        expect(twoFactorAuthenticationRepository.delete).toHaveBeenCalledTimes(1)
    })

    it("Should call eventEmitter.emit once", async () => {
        await sut.execute(props)
        expect(eventEmitter.emit).toHaveBeenCalledTimes(1)
    })

    it("Should create TwoFactorAuthenticationRemovedEvent with correct values", async () => {
        await sut.execute(props)
        expect(TwoFactorAuthenticationRemovedEvent).toHaveBeenCalledWith({
            twoFactorAuthenticationId: twoFactorAuthenticationEntity.id
        })
    })
})