const fs = require("fs");

const seed =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@$";

function randomStrKey() {
  const length = 16;
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * seed.length);
    result += seed[randomIndex];
  }
  return result;
}

/**
 * @param {string} strKey
 * @param {number?} numKey
 * @returns {[string, number]}
 */
function pwdEncode(strKey, numKey) {
  if (!numKey) numKey = Date.now();

  const seedArr = Array.from(seed);
  const keyArr = Array.from(strKey);

  const codeArr = [];
  for (const char of keyArr) {
    const index = seedArr.findIndex((v) => v == char);
    codeArr.push((index * numKey) % seed.length);
  }

  let result = "";
  for (const code of codeArr) {
    result += seed[code];
  }

  return [result, numKey];
}

/**
 *
 * @param {string} strkey
 * @param {number} start
 * @param {number} end
 * @param {string?} outputPath
 */
function pwdRange(strkey, start, end, outputPath) {
  if (outputPath) {
    const pwdArr = [];
    for (let i = start; i <= end; i++) {
      const [pwd, numkey] = pwdEncode(strkey, i);
      pwdArr.push(`${strkey},${numkey},${pwd}`);
    }
    fs.writeFileSync(outputPath, "strkey,numkey,pwd\n");
    fs.appendFileSync(outputPath, pwdArr.join("\n"));
  } else {
    console.log("strkey,numkey,pwd");
    for (let i = start; i <= end; i++) {
      const [pwd, numkey] = pwdEncode(strkey, i);
      console.log(`${strkey},${numkey},${pwd}`);
    }
  }
}

pwdRange("Lethanhlong03", 2003, 2024, "output.csv");

module.exports = {
  randomStrKey,
  pwdEncode,
  pwdRange,
};
