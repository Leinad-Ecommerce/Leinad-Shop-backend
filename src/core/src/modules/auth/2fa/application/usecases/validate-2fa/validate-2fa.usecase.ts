import { EventEmitterInterface } from "@/modules/@shared/events";
import { TwoFactorAuthenticationRepositoryInterface } from "../../../domain/repositories";
import { Validate2faUsecaseInterface } from "../../../domain/usecases";
import { TwoFactorAuthenticationManagementInterface } from "../../protocols";
import { left, right } from "@/modules/@shared/logic";
import { Invalid2faTokenError, TwoFactorNotFoundError } from "../_errors";
import { TwoFactorAuthenticationValidatedEvent } from "./2fa-validated.event";
import { TwoFactorIsAlreadyValidError } from "./errors";


export class Validate2faUsecase implements Validate2faUsecaseInterface {

    constructor(
        private readonly twoFactorAuthenticationRepository: TwoFactorAuthenticationRepositoryInterface,
        private readonly twoFactorAuthenticationManagement: TwoFactorAuthenticationManagementInterface,
        private readonly eventEmitter: EventEmitterInterface
    ){}

    async execute({ token, userId }: Validate2faUsecaseInterface.InputDto): Promise<Validate2faUsecaseInterface.OutputDto> {
        
        const twoFactorAuthenticationEntity = await this.twoFactorAuthenticationRepository.findByUserId(userId)
        if(!twoFactorAuthenticationEntity) return left([ new TwoFactorNotFoundError() ])

        if(twoFactorAuthenticationEntity.isValid()) return left([ new TwoFactorIsAlreadyValidError() ])

        const isTokenValid = await this.twoFactorAuthenticationManagement.verify2fa({
            token,
            secret: twoFactorAuthenticationEntity.secret
        })
        if(!isTokenValid) return left([ new Invalid2faTokenError() ])

        twoFactorAuthenticationEntity.validate()

        await this.twoFactorAuthenticationRepository.update(twoFactorAuthenticationEntity)

        const twoFactorAuthenticationValidatedEvent = new TwoFactorAuthenticationValidatedEvent({
            twoFactorAuthenticationId: twoFactorAuthenticationEntity.id
        })
        await this.eventEmitter.emit(twoFactorAuthenticationValidatedEvent)

        return right(null)
    }
}