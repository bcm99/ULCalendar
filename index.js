const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {

  let launchOptions = { headless: true, args: ['--start-maximized'] };

  const browser = await puppeteer.launch(launchOptions);
  const page = await browser.newPage();

  await page.setViewport({width: 1366, height: 768});
  await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');

  await page.authenticate({'username':'YourUsername', 'password': 'YourPassword'});

  await page.goto('https://inscription.uni.lu/Inscriptions/Student/GuichetEtudiant/Agenda');

  await page.waitForSelector('.k-link');
  const linkHandlers = await page.$x('//*[@id="scheduler"]/div/ul[2]/li[5]/a');
  if (linkHandlers.length > 0) {
    await linkHandlers[0].click();
  } else {
    throw new Error("Link not found");
  }

  await page.on('response', async (response) => {    
    if (response.url() == "https://inscription.uni.lu/Inscriptions/Student/GuichetEtudiant/GetEventInPeriode"){
        let jsonData = await response.json();
        fs.writeFile('./test.json', JSON.stringify(jsonData), function(err) {})

    } 
  }); 
})();