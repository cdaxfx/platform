
var username = "code@ourengineroom.com"
var password = "7568401553"


var appUrl = "http://localhost:3000/"
jest.setTimeout(15000)
describe("App.js", () => {
    it("user opens an app and logs in as an user", async () => {
      await page.goto(appUrl);
      await page.waitForSelector("#root");
      await expect(page.title()).resolves.toMatch('CDAX Forex')
      
      //Navigate to log in screen
      await page.click(`a[href='/login']`);
      await expect(page.url()).toMatch(`${appUrl}login`)
      await expect(page).toFillForm('form', {
        username,
        password,
      })
      await expect(page).toClick('button')
      await page.waitForNetworkIdle()
      await expect(page.url()).toMatch(`${appUrl}admin`)

      await page.click(`a[href='/dashboard/profile']`);
      //await page.waitForTimeout(200)
      await page.waitForNetworkIdle()
      await expect(page).toMatch('OurEngineRoom Admin')
    });
});