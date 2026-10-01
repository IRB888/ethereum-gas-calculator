# ethereum-gas-calculator

An offline Ethereum L1 gas-budget calculator.

## Run

Download `index.html` and open it in a modern browser. No installation, build step, wallet connection or API keys required.

## Features

- Gas limit, max fee in gwei, transaction count and optional USD conversion.
- Adjustable extra budget and input validation.
- Manual estimates only; no live gas-price feed.
- Formula: `gasLimit * maxFeeGwei * count / 1e9 * (1 + bufferPercent / 100)`.
- Example: 100,000 gas × 1 gwei × 2 transactions + 25% = 0.00025 ETH.

## Limits

This is a personal planning tool, not financial advice or an official Legion/Jumper integration. Verify current requirements in the official sale interface.

## Development

Built with plain HTML, CSS and JavaScript, with AI assistance. Contributions and bug reports are welcome.

## License

MIT License

Copyright (c) 2026 IRB888

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
