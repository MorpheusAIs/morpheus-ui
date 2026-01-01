import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const REGISTRY_DIR = join(ROOT, "registry", "new-york");
const OUTPUT_DIR = join(ROOT, "public", "r");

// Ensure output directory exists
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

interface RegistryItem {
  name: string;
  type: "registry:ui" | "registry:hook" | "registry:lib";
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  files: Array<{
    path: string;
    content: string;
    type: "registry:ui" | "registry:hook" | "registry:lib";
  }>;
}

function getFileContent(filePath: string): string {
  try {
    return readFileSync(filePath, "utf-8");
  } catch {
    console.error(`Failed to read file: ${filePath}`);
    return "";
  }
}

function buildComponentItem(name: string, relativePath: string, type: RegistryItem["type"]): RegistryItem {
  const fullPath = join(REGISTRY_DIR, relativePath);
  const content = getFileContent(fullPath);

  // Extract dependencies from imports
  const dependencies: string[] = [];
  const registryDependencies: string[] = [];

  // Check for common dependencies
  if (content.includes("wagmi")) dependencies.push("wagmi");
  if (content.includes("viem")) dependencies.push("viem");
  if (content.includes("lucide-react")) dependencies.push("lucide-react");
  if (content.includes("@radix-ui")) {
    const radixMatches = content.match(/@radix-ui\/[\w-]+/g);
    if (radixMatches) {
      dependencies.push(...new Set(radixMatches));
    }
  }

  // Check for internal dependencies
  if (content.includes("NetworkBadge") || content.includes("NetworkIcon")) {
    registryDependencies.push("network-icons");
  }
  if (content.includes("useMorBalances")) {
    registryDependencies.push("use-mor-balances");
  }

  return {
    name,
    type,
    dependencies: dependencies.length > 0 ? dependencies : undefined,
    registryDependencies: registryDependencies.length > 0 ? registryDependencies : undefined,
    files: [
      {
        path: `${name}.tsx`,
        content,
        type,
      },
    ],
  };
}

// Define all registry items
const items: Array<{ name: string; path: string; type: RegistryItem["type"] }> = [
  // Components
  { name: "mor-balance", path: "mor-balance/mor-balance.tsx", type: "registry:ui" },
  { name: "network-icons", path: "network-icons/network-icons.tsx", type: "registry:ui" },
  { name: "metric-card", path: "metric-card/metric-card.tsx", type: "registry:ui" },
  { name: "staking-form-card", path: "staking-form-card/staking-form-card.tsx", type: "registry:ui" },
  { name: "bridge-form-card", path: "bridge-form-card/bridge-form-card.tsx", type: "registry:ui" },
  { name: "user-assets-table", path: "capital/user-assets-table/user-assets-table.tsx", type: "registry:ui" },
  { name: "chart-section", path: "capital/chart-section/chart-section.tsx", type: "registry:ui" },
  { name: "deposit-modal", path: "capital/deposit-modal/deposit-modal.tsx", type: "registry:ui" },
  { name: "withdraw-modal", path: "capital/withdraw-modal/withdraw-modal.tsx", type: "registry:ui" },
  { name: "claim-rewards-modal", path: "capital/claim-rewards-modal/claim-rewards-modal.tsx", type: "registry:ui" },
  { name: "stake-rewards-modal", path: "capital/stake-rewards-modal/stake-rewards-modal.tsx", type: "registry:ui" },
  // Hooks
  { name: "use-mor-balances", path: "hooks/use-mor-balances/use-mor-balances.ts", type: "registry:hook" },
  { name: "use-staking-data", path: "hooks/use-staking-data/use-staking-data.ts", type: "registry:hook" },
  { name: "use-capital-pool-data", path: "hooks/use-capital-pool-data/use-capital-pool-data.ts", type: "registry:hook" },
  // Lib
  { name: "contracts", path: "../lib/contracts/addresses.ts", type: "registry:lib" },
  { name: "utils", path: "../lib/utils/index.ts", type: "registry:lib" },
];

// Build each item
console.log("Building registry items...\n");

for (const item of items) {
  const registryItem = buildComponentItem(item.name, item.path, item.type);
  const outputPath = join(OUTPUT_DIR, `${item.name}.json`);
  writeFileSync(outputPath, JSON.stringify(registryItem, null, 2));
  console.log(`  ✓ ${item.name}.json`);
}

// Build index.json (registry manifest)
const indexContent = {
  name: "morpheus-ui",
  description: "Web3 component library for Morpheus Protocol",
  homepage: "https://morpheus-ui.vercel.app",
  items: items.map((item) => ({
    name: item.name,
    type: item.type,
  })),
};

writeFileSync(join(OUTPUT_DIR, "index.json"), JSON.stringify(indexContent, null, 2));
console.log("\n  ✓ index.json (registry manifest)");

console.log(`\n✅ Registry built successfully to ${OUTPUT_DIR}`);
console.log(`\nItems can be installed via:`);
console.log(`  npx shadcn@latest add https://your-domain.vercel.app/r/mor-balance.json`);
