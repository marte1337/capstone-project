import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextVitals,
  globalIgnores([".next/**", "coverage/**"]),
  {
    rules: {
      "import/no-anonymous-default-export": [
        "error",
        {
          allowObject: true,
        },
      ],
      "react-hooks/immutability": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);
