const encoders = require('./Encoders');

class CAppException {
  constructor(message) {
    this.message = message;
  }
}

function main() {
  try {
    const [operation, encoderType, key, basename] = process.argv.slice(2);

    // Validate command-line arguments
    if (!operation || !encoderType || !key) {
      throw new CAppException('Usage: node CryptoApp.js <E/D> <encoderType> <key> [basename]');
    }

    if (operation !== 'E' && operation !== 'D') {
      throw new CAppException('Invalid operation. Use E for Encode or D for Decode.');
    }

    let encoder;
    try {
      // Validate and create encoder
      encoder = encoders[encoderType]?.(key);
      if (!encoder) {
        throw new Error(`Unknown encoder type ${encoderType}`);
      }
    } catch (e) {
      throw new CAppException(
        e.message.startsWith('Unknown') ? 
        `Unknown encoder type ${encoderType}` : 
        `Problem constructing ${encoderType}: ${e.message || e}`
      );
    }

    if (basename) {
      // Handle file-based input/output
      const fs = require('fs');
      const inputPath = `${basename}.in`;
      const outputPath = `${basename}.out`;

      if (!fs.existsSync(inputPath)) {
        throw new CAppException(`Input file '${inputPath}' not found.`);
      }

      const input = fs.readFileSync(inputPath, 'utf-8');
      const output = operation === 'E' ? encoder.encode(input) : encoder.decode(input);
      fs.writeFileSync(outputPath, output);
      console.log(`Processed output written to '${outputPath}'.`);
    } else {
      // Handle line-by-line input/output
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      rl.on('line', (line) => {
        try {
          console.log(operation === 'E' ? encoder.encode(line) : encoder.decode(line));
        } catch (err) {
          console.error(`Error processing line: ${err.message || err}`);
        }
      });
    }
  } catch (e) {
    // Handle all CAppExceptions
    if (e instanceof CAppException) {
      console.log(e.message);
    } else {
      console.log(`Error: ${e.message || e}`);
    }
  }
}

main();
