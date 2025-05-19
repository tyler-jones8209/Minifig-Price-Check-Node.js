const puppeteer = require('puppeteer');

(async () => {
  const identifier = process.argv[2]; // input bricklink id
  if (!identifier) {
    console.error("Usage: node script.js <lego_id> <price_label> <condition> <time_period>");
    process.exit(1);
  }
  const price_label = process.argv[3]; // choose between min, max, or average
  if (!price_label) {
    console.error("Usage: node script.js <lego_id> <price_label> <condition> <time_period>");
    process.exit(1);
  }
  const condition = process.argv[4]; // choose between new and used
  if (!condition) {
    console.error("Usage: node script.js <lego_id> <price_label> <condition> <time_period>");
    process.exit(1);
  }
  const period = process.argv[5]; // choose between last_6 and current
  if (!period) {
    console.error("Usage: node script.js <lego_id> <price_label> <condition> <time_period>");
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: null
  });

  const page = await browser.newPage();
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  const targetUrl = `https://www.bricklink.com/v2/catalog/catalogitem.page?M=${identifier}#T=P`;
  await page.goto(targetUrl, { waitUntil: 'networkidle2' });
  await delay(1500);

  async function retrieve_name(page) {
    const name = await page.evaluate(() => {
      const minifig_name = document.getElementById("item-name-title");
      return minifig_name ? minifig_name.textContent.trim() : null;
    });

    if (!name) {
      console.error("Minifigure name not found");
      process.exit(1);
    }

    return name;

  }

  function capitalize(word) {
    if (!word) {
      return "";
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  const minifig_name = await retrieve_name(page);

  async function retrieve_price(page, price_label, condition, period) {
   
    await page.waitForSelector('table.pcipgSummaryTable');

    const price = await page.evaluate((price_label, condition, period) => {
      const tables = document.querySelectorAll('table.pcipgSummaryTable');
      if (tables.length < 3) return null;

      let table = null;

      if (period === 'last_6' && condition === 'new') {
        table = tables[0];
      }
      else if (period === 'last_6' && condition === 'used') {
        table = tables[1];
      }
      else if (period === 'current' && condition === 'new') {
        table = tables[2];
      }
      else if (period === 'current' && condition === 'used') {
        table = tables[3];
      }

      if (!table) return null;

      let price_description = null;

      if (price_label === 'min') {
        price_description = "min price";
      }
      else if (price_label === 'max') {
        price_description = "max price";
      }
      else if (price_label === 'avg') {
        price_description = "avg price";
      }

      if (!price_description) return null;

      const rows = Array.from(table.querySelectorAll('tbody tr'));
      const price_row = rows.find(row =>
        row.innerText.toLowerCase().includes(price_description)
      );

      if (!price_row) return null;

      const cells = price_row.querySelectorAll('td');
      const price_cell = cells[1];
      if (!price_cell) return null;

      const price_text = price_cell.innerText.trim();
      const price_match = price_text.match(/[\d,.]+/);
      return price_match ? parseFloat(price_match[0].replace(',', '')) : null;
    }, price_label, condition, period);

    condition = capitalize(condition);
    price_label = capitalize(price_label);
    period = capitalize(period);

    if (period === 'current') {
      console.log(`${condition} ${price_label} price of ${minifig_name} (${identifier}) during ${period} time period:`, price);
    }
    else {
      console.log(`${condition} ${price_label} price of ${minifig_name} (${identifier}) during the last 6 months:`, price);
    }
  }

  await retrieve_price(page, price_label, condition, period);

  await browser.close();

})();
