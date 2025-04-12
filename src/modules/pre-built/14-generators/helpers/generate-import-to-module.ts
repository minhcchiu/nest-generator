import { pascalCase, snakeCase } from "change-case";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import * as pluralize from "pluralize";

export const generateImportToModule = (schemaName: string) => {
  const moduleName = `${pascalCase(schemaName)}Module`;
  const nameSnakeCase = snakeCase(schemaName);

  const importLine = `import { ${moduleName} } from "~modules/${pluralize(nameSnakeCase)}/${nameSnakeCase}.module";`;

  const filePath = join(process.cwd(), "src", "modules", "feature.modules.ts");

  const content = readFileSync(filePath, "utf-8");

  const lines = content.split("\n");

  const lastImportIndex = lines.reduce((lastIndex, line, i) => {
    return line.startsWith("import ") ? i : lastIndex;
  }, -1);
  const endFeatureModulesIndex = lines.findIndex(line => line.trim() === "];");

  if (lastImportIndex === -1 || endFeatureModulesIndex === -1) return;

  lines.splice(lastImportIndex + 1, 0, importLine);
  lines.splice(endFeatureModulesIndex + 1, 0, `  ${moduleName},`);

  writeFileSync(filePath, lines.join("\n"), "utf-8");
};
