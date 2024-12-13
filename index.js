// @ts-check
const express = require('express');
const fs = require('node:fs');
const path = require('node:path');
const { applyColors } = require('./util');

const PORT = process.env['PORT'] || 4321;
const frames = loadFrames(path.join(__dirname, 'frames'));

// files in frames/ should be named 0.txt, 1.txt, 2.txt, etc.

const app = express();

// to keep app alive
app.get('/ping', (_, res) => {
  res.json({ pong: true });
});

app.get('/papu', (_, res) => {
  res.send('<h1>:v</h1>');
});

app.get('/', (req, res) => {
  console.log(req.headers['user-agent']);

  if (req.headers && req.headers['user-agent'] && !req.headers['user-agent'].includes('curl')) {
    res.writeHead(302, { Location: '/papu' });
    res.end();
    return;
  }

  let frameIndex = 0;
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  sendFrame(res, frameIndex);
});

/**
 * function to send frames sequentially to the server
 * @param {express.Response} res
 * @param {number} frameIndex
 */
function sendFrame(res, frameIndex) {
  // clean the terminal
  res.write('\x1b[2J\x1b[3J\x1b[H');

  const frame = applyColors(frames[frameIndex]);
  res.write(frame.replace('// withtext', '') + '\n');
  frameIndex = frameIndex + 1;

  if (frameIndex >= frames.length) {
    res.write('\n\n---- EOF ----\n');
    res.end();
    return void 0;
  }

  setTimeout(
    () => {
      sendFrame(res, frameIndex);
    },
    frame.startsWith('// withtext') ? 3000 : 1500
  );
}

/**
 * @param {string} dir
 * @returns {string[]}
 */
function loadFrames(dir) {
  const files = fs.readdirSync(dir);
  return files
    .sort((a, b) => Number(a.split('.')[0]) - Number(b.split('.')[0]))
    .map(file => {
      return fs.readFileSync(path.join(dir, file), 'utf-8');
    });
}

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
