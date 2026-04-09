import { test, expect } from '@playwright/test';

var baseURL = 'http://localhost:8080';

test('TEST-CONNECTION', async ({ page }) => {
  await page.goto(baseURL);
});

// TODO: Fill in with test cases.
let url = 'http://localhost:8080';

test.beforeEach(async ({ page }) => {
    //fixture stuff
    await page.goto(url);
    await page.evaluate(() => document.cookie = "1=false");
    await page.evaluate(() => document.cookie = "2=false");
    await page.evaluate(() => document.cookie = "3=false");
  });


test('TEST-1-RESET', async ({ page }) => {
    //preconditions - rent all the cats
    await page.evaluate(() => document.cookie = "1=true");
    await page.evaluate(() => document.cookie = "2=true");
    await page.evaluate(() => document.cookie = "3=true");

    //execution step - press reset link
    await page.getByRole('link', { name: 'Reset' }).click();

    //check postconditions
    await expect(page.locator('#cat-id1')).toContainText('ID 1. Jennyanydots');
    await expect(page.locator('#cat-id2')).toContainText('ID 2. Old Deuteronomy');
    await expect(page.locator('#cat-id3')).toContainText('ID 3. Mistoffelees');

});


test('TEST-2-CATALOG', async ({ page }) => {
    //go to the catalog page
    await page.getByRole('link', { name: 'Catalog' }).click();

    //get 2nd list item
    const myLi = await page.getByRole('listitem').filter({ hasText: /^$/ }).nth(1);

    //get src attribute
    const src = await myLi.getByRole('img', { name: 'Old Deuteronomy' }).getAttribute('src');

    //check the source
    await expect(src).toBe('/images/cat2.jpg');
});

test('TEST-3-LISTING', async ({ page }) => {
    //go to the catalog page
    await page.getByRole('link', { name: 'Catalog' }).click();

    //see if list has 3 items
    await expect(page.locator('.list-group-item')).toHaveCount(3);

    //get 3rd list element
    const thirdListItem = await page.locator('.list-group-item').nth(2);

    //see if it has the right text
    await expect(thirdListItem).toContainText('ID 3. Mistoffelees');

});

test('TEST-4-RENT-A-CAT', async ({ page }) => {
    //press rent a cat link
    await page.getByRole('link', { name: 'Rent-A-Cat' }).click();

    //check if buttons exist
    await expect(page.getByRole('button', { name: 'Rent' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Return' })).toBeVisible();

});

test('TEST-5-RENT', async ({ page }) => {
    /*EXECUTION STEPS:
        1. Press the "Rent-A-Cat" link.
        2. Enter "1" into the input box for the rented cat ID.
        3. Press the "Rent" button. */
    await page.getByRole('link', { name: 'Rent-A-Cat' }).click();
    await page.getByRole('textbox', { name: 'Enter the ID of the cat to rent:' }).click();
    await page.getByRole('textbox', { name: 'Enter the ID of the cat to rent:' }).fill('1');
    await page.getByRole('button', { name: 'Rent' }).click();

    /* POSTCONDITIONS: 
        1. The first item in the cat listing is "Rented out".
        2. The second item in the cat listing is "ID 2. Old Deuteronomy".
        3. The third item in the cat listing is "ID 3. Mistoffelees".
        4. The text "Success!" is displayed in the element with ID "rentResult" */
    await expect(page.locator('.list-group-item').nth(0)).toContainText('Rented out');
    await expect(page.locator('.list-group-item').nth(1)).toContainText('ID 2. Old Deuteronomy');
    await expect(page.locator('.list-group-item').nth(2)).toContainText('ID 3. Mistoffelees');
    await expect(page.locator('#rentResult')).toContainText('Success!');

});


test('TEST-6-RETURN', async ({ page }) => {
    //preconditions - rent cats 2 and 3
    await page.evaluate(() => document.cookie = "2=true");
    await page.evaluate(() => document.cookie = "3=true");

    /* EXECUTION STEPS:
        1. Press the "Rent-A-Cat" link.
        2. Enter "2" into the input box for the returned cat ID.
        3. Press the "Return" button. */
    await page.getByRole('link', { name: 'Rent-A-Cat' }).click();
    await page.getByRole('textbox', { name: 'Enter the ID of the cat to return:' }).click();
    await page.getByRole('textbox', { name: 'Enter the ID of the cat to return:' }).fill('2');
    await page.getByRole('button', { name: 'Return' }).click();

    /* POSTCONDITIONS: 
        1. The first item in the cat listing is "ID 1. Jennyanydots".
        2. The second item in the cat listing is "ID 2. Old Deuteronomy".
        3. The third item in the cat listing is "Rented out".
        4. The text "Success!" is displayed in the element with ID "returnResult" */
    await expect(page.locator('.list-group-item').nth(0)).toContainText('ID 1. Jennyanydots');
    await expect(page.locator('.list-group-item').nth(1)).toContainText('ID 2. Old Deuteronomy');
    await expect(page.locator('.list-group-item').nth(2)).toContainText('Rented out');
    await expect(page.locator('#returnResult')).toContainText('Success!');
});


test('TEST-7-FEED-A-CAT', async ({ page }) => {
    // press feed-a-cat link
    await page.getByRole('link', { name: 'Feed-A-Cat' }).click();

    // postconditions
    await expect(page.getByRole('button', {name: 'Feed'})).toBeVisible();
});


test('TEST-8-FEED', async ({ page }) => {
    // execution steps
    await page.getByRole('link', { name: 'Feed-A-Cat' }).click();
    await page.getByRole('textbox', { name: 'Number of catnips to feed:' }).click();
    await page.getByRole('textbox', { name: 'Number of catnips to feed:' }).fill('6');
    await page.getByRole('button', { name: 'Feed' }).click();

    // postconditions
    await expect(page.locator('#feedResult')).toContainText('Nom, nom, nom.', { timeout: 10_000 });
});


test('TEST-9-GREET-A-CAT', async ({ page }) => {
    // execution steps
    await page.getByRole('link', { name: 'Greet-A-Cat' }).click();

    // postconditions
    await expect(page.getByText('Meow!Meow!Meow!')).toBeVisible();
});


test('TEST-10-GREET-A-CAT-WITH-NAME', async ({ page}) => {
    // execution steps
    let newPage = url + "/greet-a-cat/Jennyanydots";
    await page.goto(newPage);

    // postconditions
    await expect(page.getByText('Meow! from Jennyanydots.')).toBeVisible();
});


test('TEST-11-FEED-A-CAT-SCREENSHOT', async ({ page }) => {
    // preconditions
    await page.evaluate(() => document.cookie = "1=true");
    await page.evaluate(() => document.cookie = "2=true");
    await page.evaluate(() => document.cookie = "3=true");

    // execution steps
    await page.getByRole('link', { name: 'Feed-A-Cat' }).click();

    // postconditions
    await expect(page.locator('body')).toHaveScreenshot();
});


// // TESTS FOR BUGS THAT WERE FOUND GO BELOW
// test('DEFECT1-FUN-FEED', async ({ page }) => {
//     await page.getByRole('link', { name: 'Feed-A-Cat' }).click();
//     await page.getByRole('textbox', { name: 'Number of catnips to feed:' }).click();
//     await page.getByRole('textbox', { name: 'Number of catnips to feed:' }).fill('0');
//     await page.getByRole('button', { name: 'Feed' }).click();
//     await expect(page.locator('#feedResult')).toContainText('Cat fight!', { timeout: 10_000 });
// });


// test('DEFECT2-FUN-GREET-A-CAT', async ({ page }) => {
//     // preconditions: rent out cat 2
//     await page.evaluate(() => document.cookie = "2=true");

//     // execution steps
//     await page.getByRole('link', { name: 'Greet-A-Cat' }).click();

//     // postconditions
//     await expect(page.getByText('Meow!Meow!', { exact: true })).toBeVisible();
// });


// test('DEFECT3-GREET-A-CAT-WITH-NAME', async ({ page }) => {
//     // preconditions: rent out cat 1
//     await page.evaluate(() => document.cookie = "1=true");

//     // execution steps
//     await page.goto('https://cs1632.appspot.com/greet-a-cat/Jennyanydots');

//     // postconditions
//     await expect(page.getByText('Jennyanydots is not here.')).toBeVisible();
// });

/*
                                BUGS BRETT FOUND

    1. If feed 0 catnips, displays message "Nom, nom, nom."
        Should actually display "Cat fight!" because it is not a positive integer

    2. If rent out cat 2, and then go to Greet-A-Cat, it displays "Meow!Meow!Meow!"
        Should only display "Meow!Meow!" because there are 2 cats available

    3. If rent out cat 1, and then go to 'https://cs1632.appspot.com/greet-a-cat/Jennyanydots',
        displays "Meow! from Jennyanydots." 
        Should display "Jennyanydots is not here."
    
    4. If rent out cat 2, then feed -4 catnips, displays message "Nom, nom, nom."
        Should actually display "Cat fight!" because it is not a positive integer
*/