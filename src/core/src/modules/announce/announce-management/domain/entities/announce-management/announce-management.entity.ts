import { BaseEntity } from "@/modules/@shared/domain"
import { Either, right } from "@/modules/@shared/logic"


export class AnnounceManagementEntity extends BaseEntity<AnnounceManagementEntity.Props> {

    private constructor(props: AnnounceManagementEntity.Props, id?: string) {
        super(props, id)
    }

    static create({ userId, categoryId }: AnnounceManagementEntity.Input, id?: string): Either<Error[], AnnounceManagementEntity> {

        const announceManagementEntity = new AnnounceManagementEntity({
            status: "DEACTIVATED",
            announceType: "NORMAL",
            userId,
            categoryId
        }, id)
        return right(announceManagementEntity)
    }

    

    activate(): void {
        this.props.status = "ACTIVATED"
    }

    ban(): void {
        this.props.status = "BANNED"
    }

    deactivate(): void {
        this.props.status = "DEACTIVATED"
    }

    isActivated(): boolean {
        return this.props.status === "ACTIVATED"
    }
    isBanned(): boolean {
        return this.props.status === "BANNED"
    }
    isDeactivated(): boolean {
        return this.props.status === "DEACTIVATED"
    }

    changeTypeToItem(): void {
        this.props.announceType = "ITEM"
    }

    changeTypeToNormal(): void {
        this.props.announceType = "NORMAL"
    }

    isTypeItem(): boolean {
        return this.props.announceType === "ITEM"
    }

    isTypeNormal(): boolean {
        return this.props.announceType === "NORMAL"
    }

    toJSON(): AnnounceManagementEntity.PropsJSON {
        return {
            id: this.id,
            status: this.status,
            announceType: this.announceType,
            userId: this.userId,
            categoryId: this.categoryId
        }
    }
    
    get status(): AnnounceManagementEntity.Status {
        return this.props.status
    }
    get announceType(): AnnounceManagementEntity.AnnounceType {
        return this.props.announceType
    }
    get userId(): string {
        return this.props.userId
    }
    get categoryId(): string {
        return this.props.categoryId    
    }
    
}

export namespace AnnounceManagementEntity {

    export type Status = "DEACTIVATED" | "ACTIVATED" | "BANNED"
    export type AnnounceType = "NORMAL" | "ITEM"
    

    export type Input = {
        userId: string
        categoryId: string
    }

    export type Props = {
        userId: string
        status: Status
        categoryId: string
        announceType: AnnounceType
    }
    
    export type PropsJSON = Props & { id: string }
}