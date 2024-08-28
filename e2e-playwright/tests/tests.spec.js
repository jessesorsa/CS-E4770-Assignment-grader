const { test, expect } = require("@playwright/test");

test("Server responds with a page with the title 'Programming assignments'", async ({ page }) => {
  await page.goto("/");
  await page.locator(".ready-for-testing").waitFor({ timeout: 30000 });
  expect(await page.title()).toBe("Programming assignments");
});

test("Top bar exists", async ({ page }) => {
  await page.goto("/");
  await page.locator(".ready-for-testing").waitFor({ timeout: 30000 });
  await expect(page.getByText('Total score: 0')).toBeVisible();
});


test("Failed submission", async ({ page }) => {
  await page.goto("/");

  const incorrectSubmission = 'incorrect submission';

  await page.getByPlaceholder("Solution").fill(incorrectSubmission);
  await page.getByRole("button", { name: "Submit" }).click();

  await page.locator(".grading-completed").waitFor();

  await page.getByRole("button", { name: "✕" }).click();

  await expect(page.getByText('Incorrect')).toBeVisible();

});


test("Successful submission", async ({ page }) => {
  await page.goto("/");

  const correctSubmission = `def hello():
    return "Hello"`;

  await page.locator(".ready-for-testing").waitFor();

  await page.getByPlaceholder("Solution").fill(correctSubmission);
  await page.getByRole("button", { name: "Submit" }).click();

  await page.locator(".grading-completed").waitFor();

  await page.getByRole("button", { name: "✕" }).click();

  await expect(page.getByText('Correct!')).toBeVisible();

});

test("Moving onto next assignment", async ({ page }) => {

  await page.goto("/");

  const correctSubmission = `def hello():
    return "Hello"`;

  await page.locator(".ready-for-testing").waitFor();

  await page.getByPlaceholder("Solution").fill(correctSubmission);
  await page.getByRole("button", { name: "Submit" }).click();

  await page.locator(".grading-completed").waitFor();

  await page.getByRole("button", { name: "✕" }).click();

  await page.getByRole("button", { name: "Next" }).click();

  await expect(page.getByText('Assignment 2')).toBeVisible();
});

test("Top points increase after successful submission", async ({ page }) => {
  await page.goto("/");

  const correctSubmission = `def hello():
    return "Hello"`;

  await page.locator(".ready-for-testing").waitFor();

  await page.getByPlaceholder("Solution").fill(correctSubmission);
  await page.getByRole("button", { name: "Submit" }).click();

  await page.locator(".grading-completed").waitFor();

  await page.getByRole("button", { name: "✕" }).click();

  await page.getByRole("button", { name: "Next" }).click();

  await expect(page.getByText('Total score: 100')).toBeVisible();
});
