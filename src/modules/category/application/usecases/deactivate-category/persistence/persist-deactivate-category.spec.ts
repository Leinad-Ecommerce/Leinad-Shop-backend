
import { CategoryRepositoryInterface } from "@/modules/category/domain/repositories"
import { EventEmitterInterface } from "@/modules/@shared/events"
import { mock } from "jest-mock-extended"
import { CategoryEntity } from "@/modules/category/domain/entities"
import { PersistDeactivateCategoryInputDto } from "./persist-deactivate-category.dto"
import { PersistDeactivateCategoryUsecase } from "./persist-deactivate-category.usecase"
import { CategoryDeactivatedEvent } from "./category-deactivated.event"

jest.mock("@/modules/category/domain/entities")
jest.mock("./category-deactivated.event")

describe("Test PersistActivateCategory", () => {

    let sut: PersistDeactivateCategoryUsecase
    let props: PersistDeactivateCategoryInputDto
    let categoryRepository: CategoryRepositoryInterface
    let eventEmitter: EventEmitterInterface
    let categoryEntity: CategoryEntity

    beforeEach(() => {
        categoryEntity = mock<CategoryEntity>()

        props = {
            categoryId: "any_category_id"
        }
        categoryRepository = mock<CategoryRepositoryInterface>()
        jest.spyOn(categoryRepository, "findById")
        .mockResolvedValue(categoryEntity)

        eventEmitter = mock<EventEmitterInterface>()
        sut = new PersistDeactivateCategoryUsecase(categoryRepository, eventEmitter)
    })

    it("Should execute the usecase properly", async () => {
        const output = await sut.execute(props)
        expect(output.isRight()).toBe(true)
    })

    it("Should return CategoryNotFoundError if categoryEntity is not found by the repository", async () => {
        jest.spyOn(categoryRepository, "findById")
        .mockResolvedValueOnce(null)

        const output = await sut.execute(props)
        if(output.isRight()) throw new Error("Should not return right")

        expect(output.value[0].name).toBe("CategoryNotFoundError")
    })

    it("Should call deactivate on the categoryEntity once", async () => {
        const categoryEntitySpy = jest.spyOn(categoryEntity, "deactivate")
        await sut.execute(props)
        expect(categoryEntitySpy).toHaveBeenCalledTimes(1)
    })

    it("Should call categoryRepository.update once", async () => {
        const categoryRepositorySpy = jest.spyOn(categoryRepository, "update")
        await sut.execute(props)
        expect(categoryRepositorySpy).toHaveBeenCalledTimes(1)
    })

    it("Should create CategoryDeactivatedEvent with correct values", async () => {
        await sut.execute(props)
        expect(CategoryDeactivatedEvent).toHaveBeenCalledWith({
            categoryId: props.categoryId
        })
    })

    it("Should call eventEmitteronce", async () => {
        const eventEmitterSpy = jest.spyOn(eventEmitter, "emit")
        await sut.execute(props)
        expect(eventEmitterSpy).toHaveBeenCalledTimes(1)
    })
})