import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { ProductService } from "~modules/1-products/product.service";
import { ShopOrderItemDto } from "~modules/4-checkouts/dto/checkout-review.dto";
import { CreateDiscountDto } from "./dto/create-discount.dto";
import { DiscountAppliesToEnum } from "./enums/discount-applies-to.enum";
import { DiscountTypeEnum } from "./enums/discount-type.enum";
import { Discount, DiscountDocument } from "./schemas/discount.schema";

@Injectable()
export class DiscountService extends BaseService<DiscountDocument> {
  private discountModel: Model<DiscountDocument>;
  constructor(
    @InjectModel(Discount.name) _model: Model<DiscountDocument>,
    private readonly productService: ProductService,
  ) {
    super(_model);
    this.discountModel = _model;
  }

  async create(input: CreateDiscountDto) {
    const foundDiscount = await this.discountModel
      .findOne({
        code: input.code,
        shopId: input.shopId,
      })
      .lean();

    if (foundDiscount && foundDiscount.isActive) throw new NotFoundException("Discount exists!");

    return this.discountModel.create(input);
  }

  async findProductsByDiscount({
    discountFilter,
    productOptions,
  }: {
    discountFilter: Record<string, any>;
    productOptions: Record<string, any>;
  }) {
    const foundDiscount = await this.findOne(discountFilter);

    if (!foundDiscount || !foundDiscount.isActive)
      throw new NotFoundException("Discount not exists!");

    // all products
    const productsFilter: Record<string, any> = {
      isPublished: true,
      shopId: foundDiscount.shopId,
    };

    // specific products
    if (foundDiscount.appliesTo === DiscountAppliesToEnum.SPECIFIC) {
      Object.assign(productsFilter, {
        _id: { $in: foundDiscount.productIds },
      });
    }

    const pagination = await this.productService.paginate(productsFilter, productOptions);

    return pagination;
  }

  async getDiscountAmount(data: {
    code: string;
    userId: ObjectId;
    shopId: ObjectId;
    products: ShopOrderItemDto[];
  }) {
    const foundDiscount = await this.discountModel
      .findOne({
        code: data.code,
        shopId: data.shopId,
      })
      .lean();

    if (!foundDiscount) throw new NotFoundException("Discount doesn't exists!");

    const {
      isActive,
      maxUses,
      minOrderValue,
      usersUsed,
      startDate,
      maxUsesPerUser,
      endDate,
      discountType,
      discountValue,
    } = foundDiscount;

    if (!isActive) throw new BadRequestException("Discount expired!");
    if (!maxUses) throw new BadRequestException("Discount are out!");
    if (new Date() < new Date(startDate) || new Date() > new Date(endDate))
      throw new BadRequestException("Discount code has expired!");

    let totalOrder = 0;
    if (minOrderValue > 0) {
      totalOrder = data.products.reduce(
        (acc, product) => acc + product.price * product.quantity,
        0,
      );
    }

    if (totalOrder < minOrderValue)
      throw new BadRequestException(`Discount requires a minium order value of ${minOrderValue}!`);

    if (maxUsesPerUser > 0) {
      const userUsedDiscount = usersUsed.some(
        userId => userId.toString() === data.userId.toString(),
      );

      if (userUsedDiscount) {
        // ...
      }
    }

    // check unit
    const amount =
      discountType === DiscountTypeEnum.fixedAmount
        ? discountValue
        : totalOrder * (discountValue / 100);

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }
}
