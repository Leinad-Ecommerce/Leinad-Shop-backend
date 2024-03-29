import { UserRepositoryInterface } from "../../domain/repositories";
import { AuthUserFacadeInterface } from "../../facades";

export class AuthUserFacadeImp implements AuthUserFacadeInterface {
    
    constructor(
        private readonly userRepository: UserRepositoryInterface
    ){}

    async getEmailByUserId(userId: string): Promise<string | null> {
        const userEntity = await this.userRepository.findById(userId);
        return userEntity?.email ?? null
    }

    async isEmailVerified(userId: string): Promise<boolean> {
        const userEntity = await this.userRepository.findById(userId);
        return userEntity?.isEmailVerified ?? false;
    }


}