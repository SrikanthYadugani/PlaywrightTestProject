import {test,expect} from '@playwright/test';


test("Login to EventHub", async ({ page }) => {

  // 1. Monitor outgoing login requests
  page.on("request", request => {
    if (request.url().includes("login")) {
      console.log("Login request:", request.method());
      console.log("Request URL:", request.url());
    }
  });

  // 2. Monitor incoming login responses
  page.on("response", response => {
    if (response.url().includes("login")) {
      console.log("Login response:", response.status());
      console.log("Response URL:", response.url());
    }
  });

  // 3. Navigate to application
  await page.goto("https://eventhub.rahulshettyacademy.com");

  // 4. Enter login credentials
  await page.locator("#email").fill("srikanth.snist@gmail.com");
  await page.locator("#password").fill("06311A0482$ri");

  // 5. Click Sign In
  await page.locator("#login-btn").click();
  await page.getByRole("link", { name: "Browse Events →" }).waitFor();
  // 6. Verify successful login
  await expect(
    page.getByRole("link", { name: "Browse Events →" })
  ).toBeVisible({ timeout: 10000 });
  const now = new Date();
const eventName = `Test Event ${now.getDate()}${String(now.getMonth() + 1).padStart(2, '0')}${now.getFullYear()}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
   console.log('eventName :', eventName);
  //calling addEventFromAdim() function-----
  await addEventFromAdim(page,eventName);
 //----------
await page.locator("#nav-events").click();
await page.locator('[data-testid="event-card"]').first().waitFor();
await expect(page.locator('[data-testid="event-card"]').first()).toBeVisible();
await expect(page.locator('[data-testid="event-card"]').filter({hasText : eventName})).toBeVisible({timeout : 5000});
const eventCard = page.locator('[data-testid="event-card"]')
    .filter({ hasText: eventName });

const seatText = await eventCard.locator("span")
    .filter({ hasText: /\d+ seats available/ })
    .innerText();

const seatsBeforeBooking = parseInt(seatText.match(/\d+/)[0], 10);

console.log("Seats before booking:", seatsBeforeBooking);
await eventCard.locator('[data-testid="book-now-btn"]').click();
await expect(page.locator("#ticket-count")).toHaveText("1");
await page.getByLabel("Full Name").fill("Srikanth Y");
await page.getByPlaceholder("you@email.com").fill("srikanth.snist@gmail.com");
await page.getByPlaceholder("+91 98765 43210").fill("9999999999");
await page.locator(".confirm-booking-btn").click();
await expect(page.getByText("Booking Confirmed!")).toBeVisible();
const bookref = await page.locator(".booking-ref").textContent();
console.log('bookref :' +bookref);
await page.getByRole("button", {name : 'View My Bookings'}).click();
await expect(page).toHaveURL(`${new URL(page.url()).origin}/bookings`);
 await expect(page.locator("#booking-card").first()).toBeVisible();
 await expect(
    page.locator("#booking-card").first().filter({
        has: page.locator(".booking-ref", { hasText: bookref })
    })
).toBeVisible();
await expect(
    page.locator("#booking-card").first().filter({
        has: page.getByText(eventName)
    })
).toBeVisible();
await page.locator("#nav-events").click();
await page.locator('[data-testid="event-card"]').first().waitFor();
await expect(page.locator('[data-testid="event-card"]').first()).toBeVisible();
await expect(page.locator('[data-testid="event-card"]').filter({hasText : eventName})).toBeVisible({timeout : 5000});
  const aftereventCard =  page.locator('[data-testid="event-card"]')
    .filter({ hasText: eventName });
  const seatAfterText = await aftereventCard.locator("span")
    .filter({ hasText: /\d+ seats available/ })
    .innerText();
const seatsAfterBooking = parseInt(seatAfterText.match(/\d+/)[0], 10);

console.log("Seats after booking:", seatsAfterBooking);

expect(seatsAfterBooking === seatsBeforeBooking-1).toBeTruthy();


})

function futureDateValue() {
    const date = new Date();
    date.setDate(date.getDate() + 1);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}`;
}

async function addEventFromAdim( page, eventName) {  
  await page.getByRole("button", { name: "Admin" }).click();
  await page.locator("a.flex[href='/admin/events']").click();
 
  await page.locator("#event-title-input").fill(eventName);
 await page.locator("#admin-event-form textarea").fill(eventName + " Test Description");
 await page.getByLabel("City").fill("Hyderabad");
 await page.getByLabel("Venue").fill("Hitech city Hyderabad");
 await page.getByLabel("Event Date & Time").fill(futureDateValue());
await page.getByLabel("Price ($)").fill("100");
await page.getByLabel("Total Seats").fill("50");
  await page.locator("#add-event-btn").click();
await expect(page.getByText("Event created!")).toBeVisible();
}


const BASE_URL   = 'https://eventhub.rahulshettyacademy.com';

// Change these to match a registered account in your local sandbox
const GMAIL_USER = { email: 'srikanth.snist@gmail.com', password: '06311A0482$ri' };

async function loginSteps(page)
{
  await page.goto(`${BASE_URL}/login`);
  await page.getByLabel('Email').fill(GMAIL_USER.email);
  await page.getByPlaceholder('••••••').fill(GMAIL_USER.password);
  await page.locator('#login-btn').click();
  await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();
}

test("Refund Eligible for single booking", async ({page}) => {
  await loginSteps(page);
  await page.goto(`${BASE_URL}/events`);
  await page.getByTestId('event-card').last().getByTestId('book-now-btn').click();
  await page.getByLabel('Full Name').fill('Srikanth');
  await page.locator('#customer-email').fill(GMAIL_USER.email);
  await page.getByPlaceholder('+91 98765 43210').fill('9999999999');
  await page.locator('.confirm-booking-btn').click();
  // Navigate to booking detail
  await page.getByRole('link', { name: 'View My Bookings' }).click();
  await expect(page).toHaveURL(`${BASE_URL}/bookings`);
  await page.getByRole('link', { name: 'View Details' }).first().click();
  await expect(page.getByText('Booking Information')).toBeVisible();

  await page.getByRole("button", {name : 'Check eligibility for refund?'}).click();

  // Spinner must appear immediately
  await expect(page.locator('#refund-spinner')).toBeVisible();

  // Wait for spinner to disappear after 4s
  await expect(page.locator('#refund-spinner')).not.toBeVisible({ timeout: 6000 });

  // Validate eligible message
  const result = page.locator('#refund-result');
  await expect(result).toBeVisible();
  await expect(result).toContainText('Eligible for refund');
  await expect(result).toContainText('Single-ticket bookings qualify for a full refund');


});

// ── Test 2: 3 tickets → not eligible ─────────────────────────────────────────
test.only('refund not eligible for group ticket booking', async ({ page }) => {
  await loginSteps(page);

  // Book event with 3 tickets via UI
  await page.goto(`${BASE_URL}/events`);
  await page.getByTestId('event-card').last().getByTestId('book-now-btn').click();


  // Increase quantity to 3
  await page.locator('button:has-text("+")').click();
  await page.locator('button:has-text("+")').click();

  await page.getByLabel('Full Name').fill('Srikanth');
  await page.locator('#customer-email').fill(GMAIL_USER.email);
  await page.getByPlaceholder('+91 98765 43210').fill('9999999999');
  await page.locator('.confirm-booking-btn').click();

  // Navigate to booking detail
  await page.getByRole('link', { name: 'View My Bookings' }).click();
  await expect(page).toHaveURL(`${BASE_URL}/bookings`);
  await page.getByRole('link', { name: 'View Details' }).first().click();
  await expect(page.getByText('Booking Information')).toBeVisible();

  // Validate booking ref first letter matches event name first letter
  const bookingRef = await page.locator('span.font-mono.font-bold').innerText();
  const eventTitle = await page.locator('h1').innerText();
  expect(bookingRef.charAt(0)).toBe(eventTitle.charAt(0));

  await page.locator('#check-refund-btn').click();

  // Spinner must appear immediately
  await expect(page.locator('#refund-spinner')).toBeVisible();

  // Wait for spinner to disappear after 4s
  await expect(page.locator('#refund-spinner')).not.toBeVisible({ timeout: 6000 });

  // Validate ineligible message
  const result = page.locator('#refund-result');
  await expect(result).toBeVisible();
  await expect(result).toContainText('Not eligible for refund');
  await expect(result).toContainText('Group bookings (3 tickets) are non-refundable');
});
