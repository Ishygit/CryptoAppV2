const encoders = require('./Encoders');

class CAppException {
    constructor(message) {
        this.message = message;
    }
}

function main() {
    const [operation, encoderTypeInput, key, basename] = process.argv.slice(2);
    let encoderType = encoderTypeInput;  // Define encoderType in outer scope

    try {
        // Validate operation
        if (operation !== 'E' && operation !== 'D') {
            throw new CAppException(`Invalid operation.
                Use E for Encode or D for Decode.`);
        }

        // Validate encoder type and construct encoder
        const encoder = encoders[encoderType]?.(key);
        if (!encoder) {
            throw new CAppException(`Unknown encoder type ${encoderType}`);
        }

        // Input/output handling based on basename
        if (basename) {
            const fs = require('fs');
            const input = fs.readFileSync(`${basename}.in`, 'utf-8');
            const output = (operation === 'E') ? encoder.encode(input) :
             encoder.decode(input);
            fs.writeFileSync(`${basename}.out`, output);
        } else {
            const readline = require('readline');
            const rl = readline.createInterface({ input: process.stdin,
                output: process.stdout });

            rl.on('line', (line) => {
                console.log((operation === 'E') ? encoder.encode(line) :
                 encoder.decode(line));
            });
        }
    } catch (e) {
        if (e instanceof CAppException) {
            console.log(e.message);
        } else {
            console.log(`Problem constructing ${encoderType}: ${e}`);
        }
    }
}

main();
