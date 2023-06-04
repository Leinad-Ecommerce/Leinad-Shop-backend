import { StockNormalManualEntity } from "./stock-normal-manual.entity"


describe("Test StockNormalManualEntity", () => {

    let sut: StockNormalManualEntity
    let props: StockNormalManualEntity.Props
    let id: string

    beforeEach(() => {
        id = "any_id"
        props = {
            stock: 10,
            stockNormalManagementId: "any_stock_normal_management_id"
        }
        const sutCreated = StockNormalManualEntity.create(props, id)
        sut = sutCreated.value as StockNormalManualEntity
    })

    it("should return correct json", () => {
        expect(sut.toJSON()).toEqual({
            id,
            ...props
        })
    })

})