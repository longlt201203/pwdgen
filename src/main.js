const fs = require("fs");
const { pwdRange, pwdEncode, randomStrKey } = require("./lib");
const readline = require("readline");

function asyncReadline(query, validator) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve, reject) => {
    rl.question(query, (answer) => {
      if (validator) {
        const err = validator(answer);
        if (err) reject(err);
      }
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  const isRange = await asyncReadline("Range mode (Y/N, default: n): ");
  let strKey = await asyncReadline("String Key (Enter to skip): ");
  if (!strKey) strKey = randomStrKey();

  const outputPath = await asyncReadline("Output File Path (Enter to skip): ");

  if (isRange == "Y" || isRange == "y") {
    const startStr = await asyncReadline("Start key: ");
    const start = parseInt(startStr);
    if (!start) throw new Error("Start key must be a number!");
    const endStr = await asyncReadline("End key: ");
    const end = parseInt(endStr);
    if (!end) throw new Error("End key must be a number!");
    pwdRange(strKey, start, end, outputPath);
  } else {
    const numKeyStr = await asyncReadline("Number Key (Enter to skip): ");
    let numkey = null;
    if (numKeyStr) {
      numkey = parseInt(numKeyStr);
      if (!numkey) throw new Error("Numkey must be a number!");
    }
    const [pwd, outputNumkey] = pwdEncode(strKey, numkey);
    if (outputPath) {
      fs.writeFileSync(outputPath, `strkey,numkey,pwd\n`);
      fs.appendFileSync(outputPath, `${strKey},${outputNumkey},${pwd}`);
    } else {
      console.log(`strkey,numkey,pwd`);
      console.log(`${strKey},${outputNumkey},${pwd}`);
    }
  }
}

main();
