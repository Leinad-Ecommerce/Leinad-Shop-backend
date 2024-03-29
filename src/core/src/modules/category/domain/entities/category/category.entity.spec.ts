import { mockDomainValidator } from "@/modules/@shared/tests"
import { CategoryEntity } from "./category.entity"
import { CategoryValidatorFactory } from "./validator"
import { DomainValidator } from "@/modules/@shared/domain/validator"
import { left } from "@/modules/@shared/logic"

jest.mock("./validator")

describe("test CategoryEntity", () => {

    let sut: CategoryEntity
    let props: CategoryEntity.Input
    let categoryValidatorFactory: jest.Mocked<typeof CategoryValidatorFactory>
    let domainValidatorStub: jest.Mocked<DomainValidator<any>>

    const makeSut = (props: CategoryEntity.Input) => {

        const categoryEntityOrError = CategoryEntity.create(props)
        if (categoryEntityOrError.isLeft()) throw categoryEntityOrError.value[0]

        sut = categoryEntityOrError.value
        return sut
    }

    beforeEach(() => {
        domainValidatorStub = mockDomainValidator()
        categoryValidatorFactory = CategoryValidatorFactory as jest.Mocked<typeof CategoryValidatorFactory>
        categoryValidatorFactory.create.mockReturnValue(domainValidatorStub)

        props = {
            title: "any_title",
            description: "any_description",
        }
        sut = makeSut(props)
    })

    it("Should create a CategoryEntity", () => {
        const sut = CategoryEntity.create(props, "any_id")
        if (sut.isLeft()) throw sut.value[0]

        expect(sut.value.toJSON()).toEqual({
            id: "any_id",
            title: props.title,
            description: props.description,
            parentId: undefined,
            status: "DEACTIVE"
        })
    })

    it("Should not be able to create a entity with the parrent", () => {
        const sut = CategoryEntity.create({
            ...props,
            parentId: "any_parent_id"
        } as any, "any_id")

        if (sut.isLeft()) throw sut.value[0]

        expect(sut.value.parentId).toBe(undefined)
    })

    it("Should set a parentId", () => {
        const parentId = "any_parent_id"
        sut.setParentId(parentId)
        expect(sut.parentId).toBe(parentId)
    })

    it("Should be a subCategory if parentId is provided", () => {
        sut.setParentId("any_parent_id")
        expect(sut.isSubCategory()).toBe(true)
    })

    it("Should not be a subCategory if parrentId is not provided", () => {
        const sut = makeSut({
            ...props
        })
        expect(sut.isSubCategory()).toBe(false)
    })

    it("Should activate a category", () => {
        expect(sut.isActivate()).toBe(false)
        sut.activate()
        expect(sut.isActivate()).toBe(true)
    })



    it("Should deactivate a category", () => {
        sut.activate()
        expect(sut.isActivate()).toBe(true)
        sut.deactivate()
        expect(sut.isActivate()).toBe(false)
    })

    it("Should check if the category is active", () => {
        expect(sut.status).toBe("DEACTIVE")
        expect(sut.isActivate()).toBe(false)

        sut.activate()
        expect(sut.status).toBe("ACTIVE")
        expect(sut.isActivate()).toBe(true)
    })

    it("Should call DomainValidator once when a sut is being created", () => {
        expect(domainValidatorStub.validate).toHaveBeenCalledTimes(1)
    })

    it("Should return left if the domain validator returns an error ", () => {
        domainValidatorStub.validate
            .mockReturnValueOnce(left([new Error()]))

        const sut = CategoryEntity.create(props)
        expect(sut.isLeft()).toBe(true)
    })

    it("Should change the title ", () => {
        expect(sut.title).toBe("any_title")
        sut.changeTitle("new_title")
        expect(sut.title).toBe("new_title")
    })

    it("Should call domainValidatorStub with correct values when updating the title ", () => {
        const newTitle = "new_title"
        sut.changeTitle(newTitle)
        expect(domainValidatorStub.validate).toHaveBeenLastCalledWith({ ...sut.EntityProps, title: newTitle })
    })


    it("Should not update title if an invalid title is provided ", () => {
        expect(sut.title).toBe("any_title")

        domainValidatorStub.validate
            .mockReturnValueOnce(left([new Error()]))

        const output = sut.changeTitle("invalid_title")

        expect(output.isLeft()).toBe(true)
        expect(sut.title).toBe("any_title")
    })

    it("Should change the description ", () => {
        expect(sut.description).toBe("any_description")
        sut.changeDescription("new_description")
        expect(sut.description).toBe("new_description")
    })

    it("Should call domainValidatorStub with correct values when updating the description ", () => {
        const newDescription = "new_description"
        sut.changeDescription(newDescription)
        expect(domainValidatorStub.validate).toHaveBeenLastCalledWith({ ...sut.EntityProps, description: newDescription })
    })


    it("Should not update description if an invalid description is provided ", () => {
        expect(sut.description).toBe("any_description")

        domainValidatorStub.validate
            .mockReturnValueOnce(left([new Error()]))

        const output = sut.changeDescription("invalid_description")

        expect(output.isLeft()).toBe(true)
        expect(sut.description).toBe("any_description")

    })

    it("Should remove the parrentId", () => {
        sut.setParentId("any_parent_id")
        expect(sut.parentId).toBe("any_parent_id")
        sut.removeParentId()
        expect(sut.parentId).toBe(undefined)
    })

})