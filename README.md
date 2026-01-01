# Morpheus UI

Web3 component library for Morpheus Protocol, built on [shadcn/ui](https://ui.shadcn.com) and [Tailwind CSS](https://tailwindcss.com).

## Features

- **Web3-First Components**: Pre-built components for token balances, staking, bridging, and more
- **Multi-Chain Support**: Native support for Base and Arbitrum networks
- **Type-Safe**: Full TypeScript support with shared types
- **Customizable**: Built on Tailwind CSS for easy theming
- **Performance Optimized**: Efficient RPC polling and memoization

## Components

- `MorBalance` - Display MOR token balances across networks
- `MetricCard` - Animated metric display cards
- `StakingFormCard` - Staking form with validation
- `BridgeFormCard` - Cross-chain bridge form
- `UserAssetsTable` - Table for user's staked assets
- `ChartSection` - Chart visualizations
- Modal components for deposit, withdraw, claim rewards, and stake rewards

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9.12+

### Installation

```bash
# Clone the repository
git clone https://github.com/morpheusais/morpheus-ui.git
cd morpheus-ui

# Install dependencies
pnpm install

# Build the registry
pnpm build:registry

# Start development server
pnpm dev:registry
```

### Using Components

Import components from the registry:

```tsx
import { MorBalance } from "@morpheus-ui/registry";

function Dashboard() {
  return <MorBalance address="0x..." />;
}
```

## Documentation

See [docs.morpheusprotocol.com](https://docs.morpheusprotocol.com) for complete documentation.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.
