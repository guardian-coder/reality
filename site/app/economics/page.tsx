import { requireChatGPTUser } from '@/app/chatgpt-auth';
import EconomicsConsole from './console';

export const dynamic = 'force-dynamic';

export default async function AgentEconomicsPage() {
  const user = await requireChatGPTUser('/economics');
  return <EconomicsConsole displayName={user.displayName} />;
}
