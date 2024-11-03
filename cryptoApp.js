const fs = require('fs');
const rls = require('readline');
const RotEncoder = require('./RotEncoder');
const SbsEncoder = require('./SbsEncoder');
const VigenereEncoder = require('./VigenereEncoder');

async function main() {
    try {
        const [operation, encoderType, key, basename] = process.argv.slice(2);
        if (!operation || !encoderType || !key) {
            throw 'Usage: crypto algorithm key [basename]';
        }

        let encoder;

        // Instantiate the correct encoder based on command-line arguments
        switch (encoderType.toLowerCase()) {
            case 'rotencoder':
                if (isNaN(parseInt(key)) || parseInt(key) <= 0) {
                    throw `Bad offset ${key}`;
                }
                encoder = new RotEncoder(key);
                break;
            case 'sbsencoder':
                encoder = new SbsEncoder(key);
                break;
            case 'vigenereencoder':
                encoder = new VigenereEncoder(key);
                break;
            default:
                throw `Unknown encoder type ${encoderType}`;
        }

        // Set up file-based I/O or standard input/output as required
        if (basename) {
            const inputFile = `${basename}.in`;
            const outputFile = `${basename}.out`;

            const inputStream = fs.createReadStream(inputFile, 'utf8');
            const outputStream = fs.createWriteStream(outputFile, 'utf8');

            const rl = rls.createInterface({
                input: inputStream,
                output: outputStream
            });

            rl.on('line', (line) => {
                const result = operation === 'E' ? encoder.encode(line) : encoder.decode(line);
                outputStream.write(result + '\n');
            });

            rl.on('close', () => {
                outputStream.end();
                console.log(`Output written to ${outputFile}`);
            });
        } else {
            // Standard I/O
            const rl = rls.createInterface({
                input: process.stdin,
                output: process.stdout,
                terminal: false
            });

            rl.on('line', (line) => {
                const result = operation === 'E' ? encoder.encode(line) : encoder.decode(line);
                console.log(result);
            });
        }

    } catch (error) {
        console.log(error);
    }
}

main();
