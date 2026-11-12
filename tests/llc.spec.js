import {test,expect} from '@playwright/test';

test("playwright special locator test", async ({page})=>
{
    await page.goto("https://rahulshettyacademy.com/angularpractice/");
    await page.getByLabel("Check me out if you Love IceCreams!").check();
    await page.getByLabel("Employed").check();
     await page.getByLabel("Gender").selectOption("Female");
}
);
