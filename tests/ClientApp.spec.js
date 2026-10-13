const {test,expect} = require('@playwright/test') ;

test('@Web Client App login', async ({ page }) => {
//js file- Login js, DashboardPage
const email = "srikanth.snist@gmail.com";
const productName = 'zara coat 3';
const products = page.locator(".card-body");
await page.goto("https://rahulshettyacademy.com/client");
await page.locator("#userEmail").fill(email);
await page.locator("#userPassword").fill("06311A0482$ri");
await page.locator("[value='Login']").click();
await page.waitForLoadState('networkidle');
await page.locator(".card-body b").first().waitFor();
const titles = await page.locator(".card-body b").allTextContents();
console.log(titles);
const product = page.locator('.card-body')
  .filter({ has: page.locator('b:has-text("ZARA COAT 3")') });

await product.locator('button:has-text("Add To Cart")').click();
await page.waitForTimeout(3000);
await page.locator('button.btn-custom:has-text("Cart")').click();
await page.waitForTimeout(3000);
console.log('Items in Cart', await page.locator('h3:has-text("ZARA COAT 3")').textContent());
await page.locator('button:has-text("Checkout")').click();
await page.locator('.field.small:has(.title:has-text("CVV Code")) input.input.txt').fill('666');
await page.locator('.field:has(.title:has-text("Name on Card ")) input.input.txt').fill('Srikanth');
await page.locator('.field.small:has(.title:has-text("Apply Coupon")) input.input.txt').fill('rahulshettyacademy');
await page.waitForTimeout(3000);
await page.locator('button:has-text("Apply Coupon")').click();
const couponConfirmation = await page.locator('p:has-text("Coupon Applied")');
await couponConfirmation.waitFor();
 console.log('Items in Cart', await couponConfirmation.textContent());
await page.locator('input[placeholder*="Country"]').pressSequentially('India');
await page.locator('span.ng-star-inserted:text-is(" India")').click();
await page.locator('a.action__submit:has-text("Place Order")').click();
const orderNumber = await page.locator('table label.ng-star-inserted').textContent();
 const orderid = orderNumber.split(" ")[2];
console.log('orderNumber :',orderid) ;
await page.locator('button[routerlink*="myorders"]').click();
await page.locator("tbody tr").first().waitFor();
console.log('Number of rows', await page.locator("tbody tr").count() );
const orderRow = await page.locator("tbody tr");
await orderRow.first().waitFor();
for(let i = 0; i< await orderRow.count();++i)
{
   console.log('verifying in row number : ',i );
 if(await orderRow.nth(i).locator('th').textContent() === orderid)
 {
    console.log(orderid, 'is present in row number : ',i );
  await orderRow.nth(i).locator('td button:text-is("View")').click();
 }
break;
}
await page.locator('div.email-title').waitFor();
console.log(await page.locator("div.email-title").textContent() );
const orderdetails = await page.locator('.col-text').textContent();
expect(orderid.includes(orderdetails)).toBeTruthy();
console.log('Assertion is ', bool, '\n', await page.locator("div.address").nth(0).textContent() );


})
