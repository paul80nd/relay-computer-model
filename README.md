# Relay Computer Model

A TypeScript "wire-by-wire" simulation of my home-built Relay Computer — a discrete relay-based CPU. Rather than emulating instructions at a high level, this model reproduces the machine the way it is actually built: as a set of physical **cards** plugged into **backplanes** and wired together through **buses**. Signals propagate card-to-card exactly as the real relays switch, so the simulation behaves like the hardware down to the individual control lines.

This package is the logic core; a separate Angular + SVG project consumes it to render the interactive front panel and animated schematics.

## Architecture

The model mirrors the physical construction of the machine:

| Concept               | In the code           | Role                                                                                                                                                                                                                                                                                 |
|-----------------------|-----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **`BitValue`**        | `src/bit-value.ts`    | Immutable value carried on a bus/wire, with the bit operations the hardware performs (`and`, `or`, `xor`, `shiftLeft`, `hiPart`/`loPart`, …).                                                                                                                                        |
| **Cards**             | `src/cards/*.card.ts` | Individual relay boards — clock, sequencer, decoder, control, incrementer, memory, the ALU (arithmetic/logic/control) and the registers. Each card `connect`s to a bus group and exposes its outputs.                                                                                |
| **Backplanes**        | `src/backplanes.ts`   | Four backplanes (**W, X, Y, Z**) that group the cards, matching the real chassis. W = control unit (control/decoder/sequencer), X = fetch & timing (clock/incrementer/registers I & PC), Y = memory & addressing (memory/registers J, M, XY), Z = datapath (ALU + registers AD, BC). |
| **Buses**             | `src/bus/*`           | The cabling between cards — bus groups, bus parts and the named signal lines that run between them.                                                                                                                                                                                  |
| **`ComputerFactory`** | `src/computer.ts`     | Wires the whole machine together and returns an `IComputer` exposing the front-panel cards (control switches, displays, aux control) plus the four backplanes.                                                                                                                       |

## Usage

```ts
import { ComputerFactory } from '@paul80nd/relay-computer-model';

// Build the machine. Pass `true` to disable the free-running clock so it
// can be stepped manually (as the acceptance tests do).
const computer = new ComputerFactory().createComputer(true);

// Power-on reset via the front panel.
computer.controlSwitchesCard.toggleReset();

// Load a program into memory and single-step the clock.
computer.yBackplane.memory.loadProgram(0, [/* opcodes */]);
computer.controlSwitchesCard.toggleClock();

// Read machine state back out of the backplanes / displays.
const pc = computer.xBackplane.registerPC.pcAddress;
```

The `controlSwitchesCard` models the physical front panel (`deposit`, `examine`, `loadAddr`, `toggleClock`, `toggleRunStop`, `toggleReset`), and the `displayACard` / `displayBCard` expose the lamp values just like the real machine's panel.

## Developing

- Restore packages with `npm install`
- Perform a full build (compile + lint + test) with `npm run prepublishOnly`
- During development, start the TypeScript watch compiler to trigger rebuilds on changes: `npm run watch`

### Tests

The suite compiles to `lib/` and runs against the emitted JavaScript:

- `npm run test-unit` — per-card unit tests (`test/unit`)
- `npm run test-acpt` — instruction-level acceptance tests that run whole programs to halt (`test/acpt`)
- `npm test` — both of the above
- `npm run test-cov` — both suites together with a combined coverage report

## Building an installable npm package

- Perform a full build with `npm run prepublishOnly` (`npm publish` runs this automatically)
- The package publishes only the compiled `lib/src` output to GitHub Packages

## License

[MIT](./LICENSE) © Paul Law
