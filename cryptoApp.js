const fs = require('fs');
const readline = require('readline');
const RotEncoder = require('./RotEncoder');
const SbsEncoder = require('./SbsEncoder');

async function main() {
    const [operation, encoderType, key, basename] = process.argv.slice(2);

    // Create encoder instance
    let encoder;
    switch (encoderType.toLowerCase()) {
        case 'rotencoder':
            encoder = new RotEncoder(key);
            break;
        case 'sbsencoder':
            encoder = new SbsEncoder(key);
            break;
        default:
            console.log(`Unknown encoder type: ${encoderType}`);
            return;
    }

    // Determine if file-based or standard I/O is used
    if (basename) {
        const inputFilename = `${basename}.in`;
        const outputFilename = `${basename}.out`;

        // Set up file read and write streams
        const inputStream = fs.createReadStream(inputFilename, 'utf8');
        const outputStream = fs.createWriteStream(outputFilename, { flags: 'w' });

        // Set up readline interface for event-based reading
        const rl = readline.createInterface({
            input: inputStream,
            output: outputStream,
            terminal: false
        });

        // Process each line from the input file
        rl.on('line', (line) => {
            const result = operation === 'E' ? encoder.encode(line) : encoder.decode(line);
            outputStream.write(result + '\n');
        });

        // Close output stream when reading is complete
        rl.on('close', () => {
            outputStream.end();
            console.log(`Processed data written to ${outputFilename}`);
        });
    } else {
        // Standard I/O for interactive mode
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        // Process each line entered in standard input
        rl.on('line', (line) => {
            if (!line) return rl.close();
            const result = operation === 'E' ? encoder.encode(line) : encoder.decode(line);
            console.log(result);
        });

        // Close input when done
        rl.on('close', () => {
            console.log('Done processing.');
        });
    }
}

main();
