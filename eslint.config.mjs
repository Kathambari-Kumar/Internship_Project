import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    // Ignore generated files like Prisma's, since got many lint errors here
    ignores: ["src/generated/**"], 
  },
  // Include Next.js ESLint rules
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  
];

export default eslintConfig;
