# Dev Bench

Designed to benchmark performance of PCs/Laptops/WSL/etc when working on NodeJS-based Front-End projects.

## Getting Started

1. Clone this repo
2. Run `npm ci` to install deps
3. Copy `config.example.ts` to `config.ts`
4. Modify `config.ts` to your liking (add projects, commands, optionally patches, etc.)
5. Run `npm start`
6. See results (mean ± standard deviation):
   ```
   Benchmarking "build"...
   Average: 27s ±5s
   Benchmarking "unit test"...
   Average: 45s ±10s
   ```
