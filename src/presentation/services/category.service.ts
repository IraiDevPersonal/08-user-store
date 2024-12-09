import { CategoryModel } from "../../data";
import {
  CategoryEntity,
  CreateCategoryDto,
  CustomError,
  PaginationDto,
  UserEntity,
} from "../../domain";

export class CategoryService {
  constructor() {}

  async createCategory(createCategoryDto: CreateCategoryDto, user: UserEntity) {
    const categoryExist = await CategoryModel.findOne({
      name: createCategoryDto.name,
    });

    if (categoryExist) {
      throw CustomError.badRequest("Category already exist");
    }

    try {
      const category = new CategoryModel({
        ...createCategoryDto,
        user: user.id,
      });
      await category.save();

      return {
        id: category.id,
        name: category.name,
        available: category.available,
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async getCategories(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    try {
      const [total, categories] = await Promise.all([
        CategoryModel.countDocuments(),
        CategoryModel.find()
          .skip((page - 1) * limit)
          .limit(limit),
      ]);

      const url = "/api/categories";
      const next =
        total > page * limit ? `${url}?page=${page + 1}&limit=${limit}` : null;
      const prev =
        page - 1 > 0 ? `${url}?page=${page - 1}&limit=${limit}` : null;

      return {
        page,
        limit,
        total,
        next,
        prev,
        categories: categories.map(CategoryEntity.fromObject),
      };
    } catch (error) {
      throw CustomError.internalServer();
    }
  }
}
