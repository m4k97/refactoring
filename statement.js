const fs = require("node:fs");
const path = require("node:path");

function statement(invoice, plays) {
  let totalAmount = 0;
  let result = `Statement for ${invoice.customer}\n`;

  for (let perf of invoice.performances) {
    // print line for this order
    result += ` ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience} seats)\n`;
    totalAmount += amountFor(perf);
  }

  // 
  // Step 6: Split Loop
  // 
  // Step 6: Slide Statement: move volumeCredits initialization near the top of the function, and add a new loop to calculate volumeCredits.
  // 
  // Step 6: Extract Function: extract the volumeCredits calculation into a separate function.
  // let volumeCredits = 0;
  // for (let perf of invoice.performances) {
  //   volumeCredits += volumeCreditsFor(perf);
  //   // print line for this order
  //   result += ` ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience} seats)\n`;
  //   totalAmount += amountFor(perf);
  // }

  result += `Amount owed is ${usd(totalAmount)}\n`;
  // 
  // Step 6: Inline Variable: inline the volumeCredits variable, and replace it with a call to the totalVolumeCredits function.
  // 
  result += `You earned ${totalVolumeCredits()} credits\n`;
  return result;

  function amountFor(aPerformance) {
    let result = 0;
    switch (playFor(aPerformance).type) {
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
        throw new Error(`unknown type: ${playFor(aPerformance).type}`);
    }
    return result;
  }

  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }

  function volumeCreditsFor(aPerformance) {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    if ("comedy" === playFor(aPerformance).type) result += Math.floor(aPerformance.audience / 5);
    return result;
  }

  function usd(aNumber) {
    return new Intl.NumberFormat("en-US",
      {
        style: "currency", currency: "USD",
        minimumFractionDigits: 2
      }).format(aNumber/100);
  }

  // 
  // Step 6: Extact Function: extract the volumeCredits calculation into a separate function.
  // 
  function totalVolumeCredits() {
    let result = 0;
    for (let perf of invoice.performances) {
      result += volumeCreditsFor(perf);
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