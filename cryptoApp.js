const fs = require('fs');
const readline = require('readline');
const RotEncoder = require('./RotEncoder');
const SbsEncoder = require('./SbsEncoder');

async function main() {
    try {
        const [operation, encoderType, key, basename] = process.argv.slice(2);
        let encoder;

        // Instantiate the correct encoder based on command-line arguments
        switch (encoderType.toLowerCase()) {
            case 'rotencoder':
                encoder = new RotEncoder(key); // This will throw if `key` is invalid
                break;
            case 'sbsencoder':
                encoder = new SbsEncoder(key); // This will throw if `key` is invalid
                break;
            default:
                throw `Unknown encoder type ${encoderType}`;
        }

        // Check for valid operation and read/write data accordingly
        if (operation !== 'E' && operation !== 'D') {
            throw 'Invalid operation. Use E for Encode or D for Decode.';
        }

        const encodeOrDecode = operation === 'E' ? 'encode' : 'decode';

        if (basename) {
            // If basename is provided, use file I/O
            const inputFile = `${basename}.in`;
            const outputFile = `${basename}.out`;
            const fileStream = fs.createReadStream(inputFile);
            const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
            const outputStream = fs.createWriteStream(outputFile);

            for await (const line of rl) {
                outputStream.write(encoder[encodeOrDecode](line) + '\n');
            }

            outputStream.close();
        } else {
            // Standard I/O (Interactive Mode)
            const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
            rl.on('line', (line) => {
                if (line) {
                    console.log(encoder[encodeOrDecode](line));
                } else {
                    rl.close();
                }
            });
        }
    } catch (err) {
        console.log(err); // Catch and log any errors thrown
    }
}

main();
