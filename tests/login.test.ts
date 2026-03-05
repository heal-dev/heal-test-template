import { expect, test as base } from '@playwright/test';
import { Heal } from '@heal-dev/heal-cli/sdk';

type HealFixture = { heal: Heal };

const test = base.extend<HealFixture>({
  heal: async ({}, use) => {
    const heal = await Heal.init({ headless: false });
    await use(heal);
    await heal.close();
  },
});

test('login with valid credentials', async ({ heal }) => {
  const { agent, page } = await heal.getPage();
  await page.goto('https://the-internet.herokuapp.com/login');

  await agent.healType('Username', 'tomsmith');
  await agent.healType('Password', 'SuperSecretPassword!');
  await agent.healClick('Login');

  await expect(page.locator('#flash')).toContainText('You logged into a secure area!');
});
