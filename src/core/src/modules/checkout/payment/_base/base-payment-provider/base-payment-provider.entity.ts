import { BaseEntity } from "@/modules/@shared/domain";

export abstract class BasePaymentProviderEntity<T> extends BaseEntity<BasePaymentProviderEntity.Props & T> {

    constructor(props: BasePaymentProviderEntity.Props & T, id?: string){
        super(props, id);
    }

    cancel(): void {
        this.props.status = "CANCELLED"
    }
    approve(): void {
        this.props.status = "APPROVED"
    }
    refund(): void {
        this.props.status = "REFUNDED"
    }
    
    isPeding(): boolean {
        return this.props.status === "PENDING"
    }
    isCancelled(): boolean {
        return this.props.status === "CANCELLED"
    }
    isApproved(): boolean {
        return this.props.status === "APPROVED"
    }
    isRefunded(): boolean {
        return this.props.status === "REFUNDED"
    }

    abstract toJSON(): Record<string, unknown>;

    get status(): BasePaymentProviderEntity.Status {
        return this.props.status
    }
}

export namespace BasePaymentProviderEntity {

    export type Status =  "PENDING" | "CANCELLED" | "REFUNDED" |  "APPROVED" 
    export type PaymentMethods = "PIX" 

    export type Props = {
        orderPaymentId: string
        status: Status
    }
}