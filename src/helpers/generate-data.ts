import { faker } from "@faker-js/faker";
import { CreateProductDto } from "~routes/1-products/dto/create-product.dto";
import { ProductType } from "~routes/1-products/enums/product-type.enum";

const ownerId = "645548ee732c55aa88d2bed4";

export const generateProducts = (num: number): CreateProductDto[] => {
	const products = [];

	for (let i = 0; i < num; i++) {
		const item = {
			name: faker.commerce.productName(),
			thumbnail: faker.image.url(),
			desc: faker.commerce.productDescription(),
			price: faker.commerce.price({ min: 10, max: 100 }),
			quantity: faker.number.int({ min: 1, max: 100 }),
			user: ownerId,
			type: ProductType.clothing,
			attributes: {
				adjective: faker.commerce.productAdjective(),
				material: faker.commerce.productMaterial(),
			},
		};

		products.push(item);
	}

	return products;
};
