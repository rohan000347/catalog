const fs = require('fs');
const path = require('path');

// Convert base string to BigInt
function baseToBigInt(valueStr, baseStr) {
    return BigInt(parseInt(valueStr, parseInt(baseStr)));
}

// Lagrange interpolation at x = 0
function lagrangeInterpolationZero(points) {
    let result = 0n;
    const k = points.length;

    for (let i = 0; i < k; i++) {
        let [xi, yi] = points[i];
        xi = BigInt(xi);
        yi = BigInt(yi);
        let num = 1n;
        let den = 1n;

        for (let j = 0; j < k; j++) {
            if (i !== j) {
                let xj = BigInt(points[j][0]);
                num *= -xj;
                den *= (xi - xj);
            }
        }

        result += (yi * num) / den;
    }

    return result;
}

// Format BigInt with commas
function formatBigIntWithCommas(bigint) {
    return bigint.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Handle one file
function processFile(filename) {
    const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
    const k = data.keys.k;

    const points = [];
    for (const key in data) {
        if (key !== 'keys') {
            const x = parseInt(key);
            const base = data[key].base;
            const value = data[key].value;
            const y = baseToBigInt(value, base);
            points.push([x, y]);
        }
    }

    const selectedPoints = points.slice(0, k);
    const secret = lagrangeInterpolationZero(selectedPoints);
    return formatBigIntWithCommas(secret);
}

// List of files to process
const files = ['testcase1.json', 'testcase2.json'];
const outputLines = [];

files.forEach((file, index) => {
    try {
        const secret = processFile(file);
        const line = `Test Case ${index + 1} (${file}): The secret (f(0)) is: ${secret}`;
        console.log(line);
        outputLines.push(line);
    } catch (err) {
        console.error(`Error processing ${file}:`, err);
    }
});

// Save to output.txt
fs.writeFileSync('output.txt', outputLines.join('\n'), 'utf8');
console.log(`\n Output saved to output.txt1`);