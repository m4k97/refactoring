import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import createStatementData from "./createStatementData.js";

function statement(invoice, plays) {

  // 
  // Step 10-2: Split into two functions
  // 

  return renderPlainText(createStatementData(invoice, plays));
}

function renderPlainText(data, plays) {
  let result = `Statement for ${data.customer}\n`;

  for (let perf of data.performances) {
    result += ` ${perf.play.name}: ${usd(perf.amount)} (${perf.audience} seats)\n`;
  }
  result += `Amount owed is ${usd(data.totalAmount)}\n`;
  result += `You earned ${data.totalVolumeCredits} credits\n`;
  return result;
}

function usd(aNumber) {
  return new Intl.NumberFormat("en-US",
    {
      style: "currency", currency: "USD",
      minimumFractionDigits: 2
    }).format(aNumber/100);
}

export default statement;

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const [invoicesPath = "invoices.json", playsPath = "plays.json"] = process.argv.slice(2);
  const invoices = JSON.parse(fs.readFileSync(path.resolve(invoicesPath), "utf8"));
  const plays = JSON.parse(fs.readFileSync(path.resolve(playsPath), "utf8"));

  for (const invoice of invoices) {
    console.log(statement(invoice, plays));
  }
}