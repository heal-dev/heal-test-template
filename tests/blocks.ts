import type { Page } from '@playwright/test';
import type { Heal, HealPageAgent } from '@heal-dev/heal-cli/sdk';

export async function login(
  _heal: Heal,
  _page: Page,
  agent: HealPageAgent,
  credentials: { username: string; password: string }
) {
  await agent.healType('Username', credentials.username);
  await agent.healType('Password', credentials.password);
  await agent.healClick('Login');
}
