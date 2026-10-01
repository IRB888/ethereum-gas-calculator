# Gas Planner

A bilingual Ethereum gas-budget planner with a transaction basket, exact wei arithmetic and transparent cross-network comparison.

**[Open the app](https://irb888.github.io/ethereum-gas-calculator/)** · [Report a bug](https://github.com/IRB888/ethereum-gas-calculator/issues)

## Version 2.3

- Network cards show execution fees, entered extra fees and the exact reserve separately. Unknown L2 fees remain visibly unknown. CSV includes execution and reserve amounts.

## Try it and report feedback

Use made-up amounts and project names when testing. Report your browser/device, steps, expected and actual behavior through [the bug-report form](https://github.com/IRB888/ethereum-gas-calculator/issues/new?template=bug_report.yml). Never attach real financial backups, credentials or identity documents. Suggestions should describe a real task the tool cannot complete.

## Version 2.2

- Cross-tab protection now detects storage clearing as well as edits, and ignores unrelated session storage events.
- A live-data response arriving after a conflict cannot replace the local plan or its warning. CSV and JSON exports remain available so unsaved work can be recovered before reload.

## Version 2.1

- JSON backup download and validated restore (100 KB maximum). Restoring asks before replacing the current plan, discards unknown properties and marks all restored rates as manual, so old snapshots cannot appear live.

## Version 2.0

- Russian and English UI; responsive mobile layout and keyboard-accessible controls.
- Up to 30 operations, each with its own gas limit and count. Presets for native transfers, ERC-20 transfers, approvals and swaps are explicitly examples, not transaction-specific estimates.
- Ethereum, Base and Optimism side-by-side, with editable gas prices and explicit extra L2 fees.
- One-click public gas-price and ETH/USD snapshots; per-source failures retain prior/manual values. Requests time out after 10 seconds. Chain IDs and API responses are validated.
- Integer wei calculations, reserve rounded upward; CSV export includes inputs, completeness and source timestamps.
- Local browser persistence, conflict detection across tabs and an offline manual mode.

## Calculation and limitations

`budgetWei = ceil((sum(gasLimit × count) × gasPriceWei + additionalFeesWei) × (1 + reservePercent / 100))`

21000 gas × 10 gwei = **0.00021 ETH**, before reserves and extra fees.

`eth_gasPrice` is a current estimate, not an EIP-1559 maxFeePerGas guarantee. Execution can change before confirmation. Preset gas limits vary by contract and transaction. The same gas limits are used across comparison cards; adjust them to your actual operations and compare carefully.

**Base/Optimism totals are incomplete while the other-fees field is blank.** Enter total L1 data/operator fees for the entire plan from a wallet quote. The app does not serialize transactions or estimate rollup data fees. An explicit zero means the user supplied zero; it is not an automatic fee discovery. Never choose a network solely because it looks cheaper: the receiving contract or sale must support it.

USD is an approximate display conversion, not an exchange quote. Token principal, bridging and withdrawal costs are excluded unless manually included as other fees. Empty ETH/USD input suppresses dollar amounts.

## Data sources and privacy

No network requests on initial load. Clicking **Refresh live data** contacts:

- [PublicNode Ethereum RPC](https://ethereum.publicnode.com/) — `eth_chainId`, `eth_gasPrice`
- [Base public RPC](https://docs.base.org/) — same read-only methods
- [Optimism public RPC](https://docs.optimism.io/) — same read-only methods
- [Coinbase spot-price API](https://docs.cdp.coinbase.com/coinbase-app/track-apis/prices) — ETH/USD

Providers receive normal network metadata, such as your IP address. No wallet address, secret, plan, or transaction is sent. Public services can rate-limit requests or block CORS; use manual inputs when unavailable. Snapshots older than five minutes are labeled stale. There is no automatic polling.

Storage key: `gas-planner:v2`. Clearing browser data deletes the saved plan. CSV exports contain the numbers you entered. No analytics, external scripts, cookies or wallet permissions.

## Tested

Exact conversions, multi-operation totals, reserve rounding, numeric bounds, malformed RPC data, CSV escaping, and browser controls are checked.

## Run locally

Download `index.html` and open it in a modern browser, or serve this folder with `python3 -m http.server 8000`. No installation or build required. Local browser storage works best on a stable HTTP(S) origin. Moving between file://, localhost and the hosted site does not migrate browser data automatically.

## Development & tests

Requires Node.js 22+ only for tests. Run `node --test test.cjs`. No npm packages or runtime dependencies. The tests execute the same pure domain functions embedded in `index.html`, and check syntax of both scripts. GitHub Actions runs these tests on pushes and pull requests.

The single-file app has two clearly separated scripts: `domain` (validation and calculations) and `app` (UI, persistence and interactions). CSS is embedded so the app can be downloaded and used without a build. Contributions should include tests for changed accounting/validation behavior.

Built with AI assistance. This is an independent planning tool, not an official Legion or Jumper integration. It does not submit applications, connect a wallet or promise an allocation or a higher reputation score.

## License

MIT License

Copyright (c) 2026 IRB888

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
