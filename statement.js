const fs = require("node:fs");
const path = require("node:path");

function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;
  const format = new Intl.NumberFormat("en-US",
    {
      style: "currency", currency: "USD",
      minimumFractionDigits: 2
    }).format;
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];

    // 
    // Step 1: Extract Function
    // 
    // Long function is hard to read, so we can extract a function to calculate the amount for each performance.
    // 
    // let thisAmount = 0;
    let thisAmount = amountFor(perf, play);

    // add volume credits
    volumeCredits += Math.max(perf.audience - 30, 0);
    // add extra credit for every ten comedy attendees
    if ("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5);
    // print line for this order
    result += ` ${play.name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n`;
    totalAmount += thisAmount;
  }
  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits\n`;
  return result;

  // 
  // Step 1: Extract Function
  // 
  function amountFor(perf, play) {
    let thisAmount = 0;
    switch (play.type) {
      case "tragedy":
        thisAmount = 40000;
        if (perf.audience > 30) {
          thisAmount += 1000 * (perf.audience - 30);
        }
        break;
      case "comedy":
        thisAmount = 30000;
        if (perf.audience > 20) {
          thisAmount += 10000 + 500 * (perf.audience - 20);
        }
        thisAmount += 300 * perf.audience;
        break;
      default:
        throw new Error(`unknown type: ${play.type}`);
    }
    return thisAmount;
  }
}

module.exports = statement;

if (require.main === module) {
  const [invoicesPath = "invoices.json", playsPath = "plays.json"] = process.argv.slice(2);
  const invoices = JSON.parse(fs.readFileSync(path.resolve(invoicesPath), "utf8"));
  const plays = JSON.parse(fs.readFileSync(path.resolve(playsPath), "utf8"));

  for (const invoice of invoices) {
    console.log(statement(invoice, plays));
  }
}