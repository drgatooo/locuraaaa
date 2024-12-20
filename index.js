// @ts-check
const express = require('express');
const fs = require('node:fs');
const path = require('node:path');
const { applyColors } = require('./util');
const figlet = require('figlet');

const PORT = process.env['PORT'] || 4321;

// files in frames/ should be named 0.txt, 1.txt, 2.txt, etc.

const app = express();

// to keep app alive
app.get('/ping', (_, res) => {
  res.json({ pong: true });
});

app.get('/papu', (_, res) => {
  res.send('<h1>:v</h1>');
});

app.get('/list', (_, res) => {
  const msgs = fs.readdirSync(path.join(__dirname, 'frames'));
  res.send(
    `\x1b[2J\x1b[3J\x1b[H\n${figlet.textSync('PAPUTV')}\nVideos (o algo así):\n${msgs.map(m => `- ${m}`).join('\n').replace(/\.txt/g, '')}\n\nUso: curl -L papu.fwrd.lol/<video>`
  )
});

app.get('/', handleRequest);
app.get('/:msg', handleRequest);

/**
 * Handle the request and send the frames to the client
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @returns 
 */
function handleRequest(req, res) {
  console.log(req.headers['user-agent']);
  const msg = req.params.msg || 'papunavida';

  if (req.headers && req.headers['user-agent'] && !req.headers['user-agent'].includes('curl')) {
    res.writeHead(302, { Location: '/papu' });
    res.end();
    return;
  }

  let frameIndex = 0;
  
  try {
    const frames = loadFrames(path.join(__dirname, 'frames', msg));
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    sendFrame(res, frames, frameIndex);
  } catch (error) {
    res.status(404).send('Try again with papu.fwrd.lol/=3');
  }
}

/**
 * function to send frames sequentially to the server
 * @param {express.Response} res
 * @param {string[]} frames
 * @param {number} frameIndex
 */
function sendFrame(res, frames, frameIndex) {
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
      sendFrame(res, frames, frameIndex);
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
