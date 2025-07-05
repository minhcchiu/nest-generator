import { Module } from "@nestjs/common";
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from "nestjs-i18n";
import { join } from "path";
import { EnvStatic } from "src/configurations/env.static";

@Module({
  imports: [
    I18nModule.forRootAsync({
      useFactory: () => ({
        fallbackLanguage: EnvStatic.getAppConfig().fallbackLanguage,
        loaderOptions: {
          path: join(__dirname, "/i18n/"),
          watch: true,
        },
      }),
      resolvers: [
        {
          use: QueryResolver,
          options: ["lang"],
        },
        AcceptLanguageResolver,
        new HeaderResolver(["x-lang"]),
      ],
    }),
  ],
})
export class I18nConfigModule {}
