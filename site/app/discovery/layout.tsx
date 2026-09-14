import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reality — The Discovery Story',
  description: 'The evidence, decisions, failures, and hypotheses that led to the Reality control plane.',
};

export default function DiscoveryLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
