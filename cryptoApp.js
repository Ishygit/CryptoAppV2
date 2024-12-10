// const encoders = require('./Encoders');

// class CAppException {
//     constructor(message) {
//         this.message = message;
//     }
// }

// function main() {
//     const [operation, encoderTypeInput, key, basename] = process.argv.slice(2);
//     let encoderType = encoderTypeInput;  // Define encoderType in outer scope

//     try {
//         // Validate operation
//         if (operation !== 'E' && operation !== 'D') {
//             throw new CAppException(`Invalid operation.
//                 Use E for Encode or D for Decode.`);
//         }

//         // Validate encoder type and construct encoder
//         const encoder = encoders[encoderType]?.(key);
//         if (!encoder) {
//             throw new CAppException(`Unknown encoder type ${encoderType}`);
//         }

//         // Input/output handling based on basename
//         if (basename) {
//             const fs = require('fs');
//             const input = fs.readFileSync(`${basename}.in`, 'utf-8');
//             const output = (operation === 'E') ? encoder.encode(input) :
//              encoder.decode(input);
//             fs.writeFileSync(`${basename}.out`, output);
//         } else {
//             const readline = require('readline');
//             const rl = readline.createInterface({ input: process.stdin,
//                 output: process.stdout });

//             rl.on('line', (line) => {
//                 console.log((operation === 'E') ? encoder.encode(line) :
//                  encoder.decode(line));
//             });
//         }
//     } catch (e) {
//         if (e instanceof CAppException) {
//             console.log(e.message);
//         } else {
//             console.log(`Problem constructing ${encoderType}: ${e}`);
//         }
//     }
// }

// main();


// ********************************************************************
// const rls = require("readline-sync");
// const encoders = require("./Encoders");
// var fs = require("fs");
// var readline = require("readline");

// const MAX = 4;

// class CAppException {
//   constructor(message) {
//     this.message = message;
//   }
// }

// (() => {
//   try {
//     if (process.argv.length < MAX || process.argv.length > MAX + 2) {
//       throw new CAppException("Usage: crypto E|D algorithm key");
//     }

//     let encoder;

//     // Check if encoder type exists in encoders
//     if (encoders[process.argv[3]]) {
//       try {
//         console.log(encoders[process.argv[3]]);
//         encoder = new encoders[process.argv[3]](process.argv[4]); //encoders been passed a key
//       } catch (err) {
//         throw new CAppException(
//           `Problem constructing encoder with key ${process.argv[4]}
//         `);
//       }

//       if (process.argv.length > MAX + 1) {
//         let input = process.argv[5] + ".in";
//         let output = process.argv[5] + ".out";

//         if (fs.existsSync(input)) {
//           try {
//             const rl = readline.createInterface({
//               input: fs.createReadStream(input),
//             });

//             let fileContentArray = []; // use an array to store the read file

//             rl.on("line", (line) => {
//               fileContentArray.push(line);
//             });

//             rl.on("close", () => {
//               const concatenatedInput = fileContentArray.join("\n");

//               let result;
//               if (process.argv[2] === "E") {
//                 result = encoder.encode(concatenatedInput);
//               } else if (process.argv[2] === "D") {
//                 result = encoder.decode(concatenatedInput);
//               }

//               fs.writeFileSync(output, result);

//               process.exit(0);
//             });
//           } catch (err) {
//             throw new CAppException(`Error processing file: ${err.message}`);
//           }
//         } else {
//           throw new CAppException(`Input file ${input} does not exist.`);
//         }
//       } else if (process.argv[2] === "E") {
//         while ((line = rls.question())) {
//           console.log(encoder.encode(line));
//         }
//       } else if (process.argv[2] === "D") {
//         while ((line = rls.question())) {
//           console.log(encoder.decode(line));
//         }
//       }
//     } else {
//       throw new CAppException(`Unknown encoder type: ${process.argv[3]}`);
//     }
//   } catch (err) {
//     console.log(`Error: ${err.message}`);
//   }
// })();


// new version
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
