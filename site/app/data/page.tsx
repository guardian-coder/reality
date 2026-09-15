import { requireChatGPTUser } from '@/app/chatgpt-auth';
import DataConsole from './console';

export const dynamic = 'force-dynamic';

export default async function RealityDataPage() {
  const user = await requireChatGPTUser('/data');
  return <DataConsole displayName={user.displayName} />;
}
