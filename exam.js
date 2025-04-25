const fs = require('fs');

// Function to decode a value from a given base
function decodeValue(base, valueStr) {
    return BigInt(parseInt(valueStr, parseInt(base)));
}

// Function to read and decode the input JSON file
function readAndDecode(filename) {
    const data = JSON.parse(fs.readFileSync(filename, 'utf-8'));
    const { n, k } = data.keys;
    const points = [];

    // Process each entry and decode values based on the base
    Object.entries(data).forEach(([key, val]) => {
        if (key === 'keys') return;
        const x = BigInt(key);
        const y = decodeValue(val.base, val.value);
        points.push({ x, y });
    });

    // Return the first 'k' points
    return { k, points: points.slice(0, k) };
}

// Function for Lagrange interpolation to calculate the secret constant (c)
function lagrangeInterpolation(points) {
    let result = 0n;

    for (let j = 0; j < points.length; j++) {
        let { x: xj, y: yj } = points[j];
        let numerator = 1n;
        let denominator = 1n;

        for (let m = 0; m < points.length; m++) {
            if (m === j) continue;
            const xm = points[m].x;
            numerator *= -xm;
            denominator *= (xj - xm);
        }

        const term = yj * numerator / denominator;
        result += term;
    }

    return result;
}

// Function to format large numbers with commas
function formatNumberWithCommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Main execution block for processing multiple test cases
const files = ['testcase1.json', 'testcase2.json'];

files.forEach((file, idx) => {
    const { k, points } = readAndDecode(file);
    const secret = lagrangeInterpolation(points);
    const formattedSecret = formatNumberWithCommas(secret.toString());

    console.log(`Secret for Test Case ${idx + 1}:`, formattedSecret);

    // Save the output to a file
    const outputLines = [
        `Secret for Test Case 1: ${idx === 0 ? formattedSecret : ''}`,
        `Secret for Test Case 2: ${idx === 1 ? formattedSecret : ''}`
    ];

    fs.writeFileSync('output.txt', outputLines.join('\n'), 'utf8');
});

console.log("Secrets saved to output.txt");
