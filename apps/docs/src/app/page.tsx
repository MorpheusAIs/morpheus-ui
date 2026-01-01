import Link from "next/link";

const components = [
  { name: "MorBalance", href: "/docs/components/mor-balance" },
  { name: "MetricCard", href: "/docs/components/metric-card" },
  { name: "NetworkIcons", href: "/docs/components/network-icons" },
  { name: "StakingFormCard", href: "/docs/components/staking-form-card" },
  { name: "BridgeFormCard", href: "/docs/components/bridge-form-card" },
  { name: "UserAssetsTable", href: "/docs/components/user-assets-table" },
  { name: "ChartSection", href: "/docs/components/chart-section" },
];

const hooks = [
  { name: "useMorBalances", href: "/docs/hooks/use-mor-balances" },
  { name: "useStakingData", href: "/docs/hooks/use-staking-data" },
  { name: "useCapitalPoolData", href: "/docs/hooks/use-capital-pool-data" },
];

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Morpheus UI</h1>
        <p className="text-xl text-muted-foreground">
          Web3 component library for Morpheus Protocol
        </p>
        <div className="mt-4 flex gap-4 justify-center">
          <a
            href="https://github.com/morpheusais/morpheus-ui"
            className="text-primary hover:underline"
          >
            GitHub
          </a>
          <a href="/docs/introduction" className="text-primary hover:underline">
            Docs
          </a>
        </div>
      </header>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Components</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {components.map((comp) => (
            <Link
              key={comp.name}
              href={comp.href}
              className="p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <code className="text-primary">{comp.name}</code>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Hooks</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {hooks.map((hook) => (
            <Link
              key={hook.name}
              href={hook.href}
              className="p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <code className="text-primary">{hook.name}</code>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Quick Start</h2>
        <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
          <code>{`pnpm install @morpheus-ui/registry`}</code>
        </pre>
      </section>
    </div>
  );
}
