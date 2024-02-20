import { StoreModule } from "./1-stores/store.module";
import { BannerModule } from "./2-banners/banner.module";
import { CategoryModule } from "./3-categories/category.module";
import { NewsModule } from "./4-news/news.module";
import { ProductGroupModule } from "./5-product-groups/product-group.module";
import { ProductModule } from "./6-products/product.module";
import { ReviewModule } from "./7-reviews/review.module";
import { UserModule } from "./pre-built/1-users/user.module";
import { WardModule } from "./pre-built/10-wards/ward.module";
import { SettingModule } from "./pre-built/11-settings/setting.module";
import { NotificationModule } from "./pre-built/12-notifications/notification.module";
import { EndpointModule } from "./pre-built/2-endpoints/endpoint.module";
import { PermissionModule } from "./pre-built/2-permissions/permission.module";
import { MenuModule } from "./pre-built/3-menus/menu.module";
import { AuthModule } from "./pre-built/4-auth/auth.module";
import { TokenModule } from "./pre-built/5-tokens/token.module";
import { OtpModule } from "./pre-built/6-otp/otp.module";
import { UploadModule } from "./pre-built/7-uploads/upload.module";
import { UserFileModule } from "./pre-built/7-user-files/user-file.module";
import { ProvinceModule } from "./pre-built/8-provinces/province.module";
import { DistrictModule } from "./pre-built/9-districts/district.module";

export const RouteModules = [
	// pre-built
	AuthModule,
	UserModule,
	PermissionModule,
	EndpointModule,
	MenuModule,
	TokenModule,
	OtpModule,
	UploadModule,
	ProvinceModule,
	DistrictModule,
	WardModule,
	SettingModule,
	NotificationModule,

	// features
	StoreModule,
	BannerModule,
	CategoryModule,
	NewsModule,
	ProductGroupModule,
	ProductModule,
	ReviewModule,
	UserFileModule,
];
