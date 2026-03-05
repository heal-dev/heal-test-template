import { expect, test as base } from '@playwright/test';
import { Heal } from '@heal-dev/heal-cli/sdk';
import * as blocks from './blocks';

type HealFixture = { heal: Heal };

const test = base.extend<HealFixture>({
  heal: async ({}, use) => {
    const heal = await Heal.init({ headless: false });
    await use(heal);
    await heal.close();
  },
});

test('login via block', async ({ heal }) => {
  const { agent, page } = await heal.getPage();
  await page.goto('https://the-internet.herokuapp.com/login');

  await blocks.login(heal, page, agent, {
    username: 'tomsmith',
    password: 'SuperSecretPassword!',
  });

  await expect(page.locator('#flash')).toContainText('You logged into a secure area!');
});
