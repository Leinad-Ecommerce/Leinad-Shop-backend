import { DomainValidator, YupErrorAdapter, YupValidatorProvider } from "@/modules/@shared/domain/validator";
import { Either, left, right } from "@/modules/@shared/logic";
import * as yup from 'yup';
import { InvalidPriceLengthError, InvalidPriceTypeError, PriceNotProvidedError } from "../errors";

export class YupBaseStockItemValidatorFactory extends YupValidatorProvider implements DomainValidator<YupBaseStockItemValidatorFactory.ValidateFields>{

    schema = yup.object({

        price: yup.number()
            .strict(true)
            .typeError(YupErrorAdapter.toYupFormat(new InvalidPriceTypeError()))
            .required(YupErrorAdapter.toYupFormat(new PriceNotProvidedError()))
            .min(0.50, YupErrorAdapter.toYupFormat(new InvalidPriceLengthError()))
            .max(100000000, YupErrorAdapter.toYupFormat(new InvalidPriceLengthError())),
        
    });

    validate(props: YupBaseStockItemValidatorFactory.ValidateFields): Either<Error[], null> {
        const schemaValid = this.validateSchema(props)
        if(schemaValid.isLeft()) return left(schemaValid.value)
        return right(null)
    }
}

export namespace YupBaseStockItemValidatorFactory {
    export type ValidateFields = {
        price: number
    }
    
}