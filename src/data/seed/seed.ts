import { envs } from "../../config";
import { CategoryModel } from "../mongo/models/category.model";
import { ProductModel } from "../mongo/models/product.model";
import { UserModel } from "../mongo/models/user.model";
import { MongoDatabase } from "../mongo/mongo-database";
import { seedData } from "./data";

(async () => {
  await MongoDatabase.connect({
    dbName: envs.MONGO_DB_NAME,
    mongoUrl: envs.MONGO_URL,
  });

  await main();

  await MongoDatabase.disconnect();
})();

const randombetween0andX = (x: number) => {
  return Math.floor(Math.random() * x);
};

async function main() {
  if (envs.PROD) {
    console.log("En Producción no se debe ejecutar jamaz!!!!!");
    return;
  }

  // 0. Borrar todo
  await Promise.all([
    UserModel.deleteMany(),
    CategoryModel.deleteMany(),
    ProductModel.deleteMany(),
  ]);
  // 1. crear usuario
  const user = await UserModel.insertMany(seedData.users);
  // 2. crear categorias
  const categories = await CategoryModel.insertMany(
    seedData.categories.map((cat) => {
      return {
        ...cat,
        user: user[0]._id,
      };
    })
  );
  // 3. crear productos
  const products = await ProductModel.insertMany(
    seedData.products.map((prod) => {
      return {
        ...prod,
        user: user[randombetween0andX(seedData.users.length - 1)]._id,
        category:
          categories[randombetween0andX(seedData.categories.length - 1)]._id,
      };
    })
  );

  console.log("SEEDED");
}
