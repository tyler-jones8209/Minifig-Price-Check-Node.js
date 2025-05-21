# Minifig-Price-Check-Node.js
This is fun script I've created to scrape the price of a minifigure from BrickLink based on user given arguments. This is not meant to be used as a tool, but more of my first venture into the world of Node.js.

## Prerequisites
### Imports/Packages
``` javascript
const puppeteer = require('puppeteer');
```

## How to Use
The script takes 4 positional arguments: BrickLink item number (e.g., njo0047), price type (min, avg, max), condition (new, used), and period (current, last_6). Unfortunately, you do need to know the item number of the minifig. Or, you could just guess random IDs for fun. 

### Searching for a Price
Let's say I want to find the average used price of Jay ZX - Shoulder Armor (my all-time favorite minifig) over the last 6 months (one of BrickLink's categories for prices). This is the syntax I would use to find it:
``` bash
tdjones22@f0:~/scripts/js/brick_link$ node minifig_price_check.js njo0047 avg used last_6
Used Avg price of Jay ZX - Shoulder Armor (njo0047) during the last 6 months: $ 3.49
```

This works for all minifigure item numbers:
Using a Star Wars Minifig
``` bash
tdjones22@f0:~/scripts/js/brick_link$ node minifig_price_check.js sw0120 max new current
New Max price of Anakin Skywalker - Black Right Hand (sw0120) during Current time period: $ 73.2
```

Using a DC Minifig
``` bash
tdjones22@f0:~/scripts/js/brick_link$ node minifig_price_check.js bat004 avg used current
Used Avg price of Two-Face - Black Stripe Hips (bat004) during Current time period: $ 54.19
```

Using an LIJ Minifig
``` bash
tdjones22@f0:~/scripts/js/brick_link$ node minifig_price_check.js iaj024 avg used current
Used Avg price of Indiana Jones - White Tuxedo Jacket (iaj024) during Current time period: $ 19.28
```

Anyway, you get the gist. If anything, this is just a sad reminder of how expensive Legos are ;(.
