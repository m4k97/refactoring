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
  // Step 2: Rename variables
  // Rename thisAmount to result because it represents the result of the calculation for the current performance.
  // Rename perf to aPerformance because it represents a single performance in the invoice.
  // 
  function amountFor(aPerformance, play) {
    let result = 0;
    switch (play.type) {
      case "tragedy":
        result = 40000;
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30);
        }
        break;
      case "comedy":
        result = 30000;
        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20);
        }
        result += 300 * aPerformance.audience;
        break;
      default:
        throw new Error(`unknown type: ${play.type}`);
    }
    return result;
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