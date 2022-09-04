# Dev Bench

Designed to benchmark performance of PCs/Laptops/WSL/etc when working on NodeJS-based Front-End projects.

## Getting Started

1. Clone this repo
2. Install Python3 (`sudo apt install python-is-python3` on WSL)
3. Install `pip` (`sudo apt install python3-pip` on WSL)
4. Install `nodeenv`: `pip install nodeenv`
5. Run `npm ci` to install deps
6. Copy `config.example.ts` to `config.ts`
7. Modify `config.ts` to your liking (add projects, commands, optionally patches, etc.), see [Configuration](#configuration)
8. Run `npm start`
9. See results (mean ± standard deviation):
   ```
   Benchmarking "build"...
   Average: 10s ±132ms
   Benchmarking "unit test"...
   Average: 45s ±12s
   ```

### Configuration

#### Patching

Patching can be useful to disable certain tests, change scripts, engines, etc. It's run right after cloning, before installing nodeenv and npm modules.

Available patching options:

- replace: set `search: "find-me"` and `replace: "replace-with-me"` - it'll replace first occurrence
- delete: set `delete: true` - will delete file
- append: set `append: "some-string"` - will append to file

Note: all patching options are exclusive <!-- TODO: make it apparent in types -->

## Troubleshooting

- Enable debug logging: `npx -y cross-env DEBUG=true npm start` and look in `log.txt`
