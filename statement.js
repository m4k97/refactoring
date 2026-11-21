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
    
    // 
    // Step 3: Replace Temp with Query + Inline Variable
    // 
    // const play = playFor(perf);
    // 
    // Step 3: Change Function Declaration
    // let thisAmount = amountFor(perf, playFor(perf));
    // Step 3: Inline Variable
    // let thisAmount = amountFor(perf)

    // add volume credits
    volumeCredits += Math.max(perf.audience - 30, 0);
    // add extra credit for every ten comedy attendees
    // 
    // Step 3: Replace Temp with Query + Inline Variable
    // 
    if ("comedy" === playFor(perf).type) volumeCredits += Math.floor(perf.audience / 5);
    // print line for this order
    // 
    // Step 3: Replace Temp with Query + Inline Variable
    // 
    result += ` ${playFor(perf).name}: ${format(amountFor(perf) / 100)} (${perf.audience} seats)\n`;
    totalAmount += amountFor(perf);
  }
  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits\n`;
  return result;

  // 
  // Step 3: Change Function Declaration
  // 
  // function amountFor(aPerformance, play) {
  function amountFor(aPerformance) {
    let result = 0;
    // 
    // Step 3: Inline Variable
    // 
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
        // 
        // Step 3: Inline Variable
        //
        throw new Error(`unknown type: ${playFor(aPerformance).type}`);
    }
    return result;
  }

  // 
  // Step 3: Replace Temp with Query
  // 
  function playFor(aPerformance) {
    return plays[aPerformance.playID];
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