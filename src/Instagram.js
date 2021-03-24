const puppeteer = require('puppeteer');
const iPhone = puppeteer.devices['iPhone X'];
var response = [];

if(process.env.NODE_ENV != 'production'){
  require('dotenv').config({ path:  '.env' });
};

module.exports = async function posting(inf) {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage()
  await page.emulate(iPhone);
  await page.goto('https://www.instagram.com', { waitUntil: 'load' });
  await page.waitForSelector('button[type="button"]')
  await page.click('button[type="button"]')

  await page.waitForSelector('input[name="username"]')
  await page.type('input[name="username"]', process.env.ISTUSERNAME);
  await page.type('input[name="password"]', process.env.ISTPASSWORD);
  await page.waitForSelector('button[type="submit"]')
  await page.click('button[type="submit"]')
  console.log('• Element found, continuing ...');
  await page.waitForSelector('button[class="sqdOP yWX7d    y3zKF     "]');
  await page.click('button[class="sqdOP yWX7d    y3zKF     "]');
  console.log('• Element found, continuing ...')
  for await (a of inf) {
    await page.waitForSelector('.q02Nz._0TPg')
    console.log('• Element found, continuing ...');
    const [fileChooser] = await Promise.all([
      page.waitForFileChooser(),
      await page.evaluate(() => {
        document.getElementsByClassName('q02Nz _0TPg')[0].click();
      })
    ]);
    let post = `./src/assets/feed/${a.query.toLowerCase().replace(/ /g, '-')}.jpg`
    await fileChooser.accept([post]);
    console.log('• File successfully attached, continuing ...');
    await page.waitForSelector('.UP43G')
    console.log('• Element found, continuing ...');
    await page.evaluate(() => {
      document.getElementsByClassName('UP43G')[0].click();
    })
    let hashtags = await Hashtag(a.query);
    const data = new Date().toLocaleDateString('pt-BR');
    await page.waitForSelector('._472V_');
    await page.click('._472V_')
    console.log('• Element found, continuing...');
    await page.type('textarea._472V_', `.\nMatéria: [${a.query}]\nAutor: [${a.source}]\nData: [${data}]\n.\n.
${a.context, a.snippet}\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n${hashtags}`);
    console.log('• Caption added, continuing ...');
    await page.waitForSelector('.UP43G')
    console.log('• Element found, continuing ...');
    await page.evaluate(function () {
    setTimeout(function () {
        return document.getElementsByClassName('UP43G')[0].click();
      }, 2000);
    });
    console.log(`• Image [${a.query}] successfully posted, continuing ...`);
    response.push({
      url: a.url,
      query: a.query,
      hashtags: hashtags
    })
  };
  setTimeout(async function () {
    await browser.close();
  }, 5000);
  async function Hashtag(query) {
    const Haspage = await browser.newPage();
    await Haspage.goto('https://www.all-hashtag.com/hashtag-generator.php');
    var aux = [], hashtag;
    query.split(' ').forEach((a) => { aux.push(a.length) })
    await Haspage.type('input[type="text"]', query.split(' ')[aux.indexOf(Math.max(...aux))]);
    await Haspage.click('button[class="btn-gen"]');
    hashtag = await Haspage.waitForSelector('#copy-hashtags')
      .then(async function () {
        console.log('• Element found, continuing ...');
        return await Haspage.evaluate(function () {
          return document.getElementById('copy-hashtags').innerHTML
        });
      })
      .catch(function () {
        return `#${query.replace(/ /g, '')}`;
      });
      Promise.all(hashtag)
      await Haspage.close();
      return hashtag.toUpperCase();
  };
  return response;
}