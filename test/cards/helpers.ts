import { BitValue, CardPart } from "../../src";
import { IBusPart } from "../../src/bus/bus-parts";

export function setValue(part: CardPart, value: number) {
  part.value = BitValue.fromUnsignedNumber(value);
}

export function setLines(part: CardPart, ...linesToSet: number[]) {
  part.value = linesToSet.reduce((p, c) => p.flipBit(c), BitValue.Zero);
}

export function clearLines(... parts: CardPart[]) {
  parts.forEach(p => p.value = BitValue.Zero);
}

export function expectPart(actual: IBusPart): ElementExpect {
  return expect(actual) as unknown as ElementExpect
}

type ElementExpect = jest.Expect & ElementMatchers

interface ElementMatchers<R = void> extends jest.Matchers<void> {
  hasLinesSet(...bitsToSet: number[]): R
}

expect.extend({
  hasLinesSet(part: IBusPart, ...bitsToSet: number[]) {
    const expected = bitsToSet.reduce((p, c) => p.flipBit(c), BitValue.Zero).toUnsignedNumber();
    const actual = part.value.toUnsignedNumber();
    const pass = actual === expected;
    if (pass) {
      return {
        message: () =>
          `expected ${expected} not to be ${actual}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${expected} to be ${actual}`,
        pass: false,
      };
    }
  }
});