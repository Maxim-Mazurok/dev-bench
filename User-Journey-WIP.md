# Comparing two power mode settings on Windows

## First run ("Best Performance" mode)

### Initial setup

- `npx dev-bench init`
- Github Auth (save token)
- Create:
  - `config.benchmarks.ts` - how we run benchmarks (how many times, cool-down between them, default node, etc)
  - `config.environment.ts` - describes current environment where benchmark will be running
  - `config.projects.ts` - what to run (where to clone from, what commands to run, etc.)
  - `config.reporters.ts` - how to report results (by which env key to group charts, etc.)

### Create and test config

- _user edits config_:
  - In `config.benchmarks.ts` sets to run benchmarks 3 times
  - In `config.environment.ts` adds `powerMode: "Best performance"`
  - In `config.project.ts` adds projects and commands
  - In `config.reporters.ts` sets `groupByKey: "powerMode"`
- `npx dev-bench test`
- Type-check all configs, clone all projects, apply patches, run commands once
- Configs are valid - upload `benchmarks`, `project` and `reporters` configs to Gist (do not upload `environment`)

### Run benchmarks

- `npx dev-bench start`
- Run all benchmarks
- Upload all results to Gist

## Second run ("Better Performance" mode)

### Change env and env config

- Change power mode from "Best Performance" to "Better Performance" in Windows Settings
- Update `config.environment.ts` to reflect the change

### Run benchmarks

- `npx dev-bench start`
- Run all benchmarks
- Upload all results to Gist

### Compare results

- `npx dev-bench compare`
- Download all results from Gist
- Generate chart (and open it)

# Comparing Windows and WSL2 (Ubuntu) environments

## First run (Windows)

### Initial setup

- `npx dev-bench init`
- Github Auth
- Create:
  - `config.benchmarks.ts`
  - `config.environment.ts`
  - `config.projects.ts`
  - `config.reporters.ts`

### Create and test config

- _user edits config_:
  - In `config.project.ts` adds projects and commands
  - In `config.reporters.ts` sets `groupByKey: "platform"`
- `npx dev-bench test`
- Test configs
- Upload configs to Gist

### Run benchmarks

- `npx dev-bench start`
- Run all benchmarks
- Upload all results to Gist

## Second run (WSL)

### Run benchmarks

- `npx dev-bench start`
- GitHub Auth (save token)
- Download all configs
- Run all benchmarks
- Upload all results to Gist

### Compare results

- `npx dev-bench compare`
- Download all results from Gist
- Generate chart (and open it)

# Comparing PC and Laptop

## First run (PC)

### Initial setup

- `npx dev-bench init`
- Github Auth
- Create:
  - `config.benchmarks.ts`
  - `config.environment.ts`
  - `config.projects.ts`
  - `config.reporters.ts`

### Create and test config

- _user edits config_:
  - In `config.environment.ts` adds `deviceName: "PC"`
  - In `config.project.ts` adds projects and commands
  - In `config.reporters.ts` sets `groupByKey: "deviceName"`
- `npx dev-bench test`
- Test configs
- Upload configs to Gist

### Run benchmarks

- `npx dev-bench start`
- Run all benchmarks
- Upload all results to Gist

## Second run (Laptop)

### Initial setup

- `npx dev-bench init`
- Github Auth
- Download:
  - `config.benchmarks.ts`
  - `config.projects.ts`
  - `config.reporters.ts`
- Create:
  - `config.environment.ts`

### Change config

- _user edits config_:
  - In `config.environment.ts` adds `deviceName: "Laptop"`

### Run benchmarks

- `npx dev-bench start`
- Run all benchmarks
- Upload all results to Gist

### Compare results

- `npx dev-bench compare`
- Download all results from Gist
- Generate chart (and open it)
