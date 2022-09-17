import { BitValue, CardPart } from "../../src";
import { BusFactory } from "../../src/bus/bus";
import { BusGroupFactory } from "../../src/bus/bus-groups";
import { BusPartFactory, IBusPart } from "../../src/bus/bus-parts";
import { CardFactory } from "../../src/cards";

export class TestFactory {
  static get Deps() {
    const bf = new BusFactory(new BusPartFactory());
    const bgf = new BusGroupFactory(bf);
    const cf = new CardFactory();
    const bgs = bgf.createBusGroups();
    return { cf, bgs }
  }
}

export class ValuePart {
  private bp?: IBusPart;
  private cp = new CardPart();
  connectOn(bp: IBusPart) { this.bp = bp; bp.connect(this.cp); }
  set(value: number) { this.cp.value = BitValue.fromUnsignedNumber(value); }
  clear() { this.cp.value = BitValue.Zero; }
  expect(): ValueExpect { return expect(this.bp?.value.toUnsignedNumber()) as unknown as ValueExpect; }
}
type ValueExpect = jest.Expect & jest.Matchers<void>

export class LinesPart {
  private bp?: IBusPart;
  private cp = new CardPart();
  connectOn(bp: IBusPart) { this.bp = bp; bp.connect(this.cp); }
  flick(...linesToSet: number[]) { this.set(...linesToSet); this.clear(); }
  set(...linesToSet: number[]) { this.cp.value = linesToSet.reduce((p, c) => p.flipBit(c), BitValue.Zero); }
  invertLine(...linesToSet: number[]) { linesToSet.forEach(l => this.cp.value = this.cp.value.flipBit(l)); }
  clear() { this.cp.value = BitValue.Zero; }
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
