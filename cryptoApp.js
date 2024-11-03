// CryptoApp.js

const rls = require('readline-sync');
const encoders = require('./Encoders'); // Import the single encoders object
const CAppException = require('./CAppException');
const fs = require('fs');

function main() {
    const [operation, encoderType, key, basename] = process.argv.slice(2);
    let encoder;

    try {
        // Determine the correct encoder class from encoders object
        const EncoderClass = encoders[encoderType];
        if (!EncoderClass) {
            throw new CAppException(`Unknown encoder type: ${encoderType}`);
        }

        // Attempt to construct the encoder with the given key
        try {
            encoder = new EncoderClass(key);
        } catch (error) {
            throw new CAppException(`Problem constructing ${encoderType}`);
        }

        // Handle file-based or standard I/O
        if (basename) {
            const input = fs.readFileSync(`${basename}.in`, 'utf-8');
            const output = operation === 'E' ? encoder.encode(input) : encoder.decode(input);
            fs.writeFileSync(`${basename}.out`, output);
        } else {
            // Standard input/output handling
            const action = operation === 'E' ? 'encode' : 'decode';
            while (true) {
                const line = rls.question('');
                if (!line) break;
                console.log(encoder[action](line));
            }
        }
    } catch (error) {
        if (error instanceof CAppException) {
            console.log(error.message);
        } else {
            console.error('Unexpected error:', error);
        }
    }
}

main();
