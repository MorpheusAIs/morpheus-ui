import Link from "next/link";

const components = [
  { name: "mor-balance", description: "Display MOR token balance" },
  { name: "network-icons", description: "Network icons and badges" },
  { name: "metric-card", description: "Metric display cards" },
  { name: "staking-form-card", description: "Staking form component" },
  { name: "bridge-form-card", description: "Cross-chain bridge form" },
  { name: "user-assets-table", description: "User assets table" },
  { name: "chart-section", description: "Chart visualization" },
  { name: "deposit-modal", description: "Deposit modal dialog" },
  { name: "withdraw-modal", description: "Withdraw modal dialog" },
  { name: "claim-rewards-modal", description: "Claim rewards modal" },
  { name: "stake-rewards-modal", description: "Stake rewards modal" },
];

const hooks = [
  { name: "use-mor-balances", description: "Multi-chain MOR balance hook" },
  { name: "use-staking-data", description: "Staking data hook" },
  { name: "use-capital-pool-data", description: "Capital pool data hook" },
];

const lib = [
  { name: "contracts", description: "Contract addresses" },
  { name: "utils", description: "Utility functions" },
];

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">Morpheus UI</h1>
          <p className="text-lg text-muted-foreground">
            Web3 component registry for Morpheus Protocol
          </p>
        </div>

        <div className="bg-card border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Installation</h2>
          <p className="text-muted-foreground">
            Install components using the shadcn CLI:
          </p>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>npx shadcn@latest add https://morpheus-ui.vercel.app/r/mor-balance.json</code>
          </pre>
        </div>

        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Components</h2>
            <div className="grid gap-3">
              {components.map((item) => (
                <Link
                  key={item.name}
                  href={`/r/${item.name}.json`}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div>
                    <span className="font-mono font-medium">{item.name}</span>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    registry:ui
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Hooks</h2>
            <div className="grid gap-3">
              {hooks.map((item) => (
                <Link
                  key={item.name}
                  href={`/r/${item.name}.json`}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div>
                    <span className="font-mono font-medium">{item.name}</span>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <span className="text-xs bg-blue-500/10 text-blue-500 px-2 py-1 rounded">
                    registry:hook
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Utilities</h2>
            <div className="grid gap-3">
              {lib.map((item) => (
                <Link
                  key={item.name}
                  href={`/r/${item.name}.json`}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div>
                    <span className="font-mono font-medium">{item.name}</span>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <span className="text-xs bg-orange-500/10 text-orange-500 px-2 py-1 rounded">
                    registry:lib
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <div className="text-center text-sm text-muted-foreground pt-8 border-t">
          <p>
            View the{" "}
            <a
              href="https://github.com/morpheusais/morpheus-ui"
              className="text-primary hover:underline"
            >
              source code on GitHub
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
