import { ValueObject } from "@/modules/@shared/domain";
import { Either, left, right } from "@/modules/@shared/logic";
import { PasswordValidatorFactory } from "./validator";
import { hashSync, compareSync } from "bcrypt"

export class PasswordValueObject extends ValueObject<PasswordValueObject.Props> {

    constructor(props: PasswordValueObject.Props){
        super(props)
    }
    get value(): string {
        return this.props.password
    }

    static create({ password }: PasswordValueObject.Props): Either<Error[], PasswordValueObject> {

        const passwordValidator = PasswordValidatorFactory.create()
        const validationResult = passwordValidator.validate({
            password
        })
        if(validationResult.isLeft()) return left(validationResult.value)

        const hashedPassword = hashSync(password, 10)
        const passwordValueObject = new PasswordValueObject({
            password: hashedPassword
        })
        return right(passwordValueObject)
    }

    comparePassword(plainPassword: string): boolean{
        return compareSync(plainPassword, this.value)
    }
}

export namespace PasswordValueObject {
    export type Props = {
        password: string
    }
}