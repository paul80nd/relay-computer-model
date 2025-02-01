import * as assert from 'assert';
import { BitValue } from '../../../src/bit-value';
import { AbortLines, ClockLines, PulseLines, ResetLines } from '../../../src/bus/bus-part-lines';
import { LinesPart, TestFactory } from './helpers';

const abort = new LinesPart;
const clock = new LinesPart;
const reset = new LinesPart;

const { cf, bgs } = TestFactory.Deps;
const card = cf.createSequencer();
card.connect(bgs.w);
abort.connectOn(bgs.w.operationBus.abortPart);
clock.connectOn(bgs.w.controlXBus.clockPart)
reset.connectOn(bgs.w.controlXBus.resetPart);

const pulseOut = bgs.w.pulseBus.pulsePart;

function clockTick() {
  clock.invertLine(ClockLines.CLK);
}
function checkPulses(testName: string, ...expects: number[]) {
  const expected = expects.reduce((p, c) => p.flipBit(c), BitValue.Zero);
  assert.ok(pulseOut.value.isEqualTo(expected), testName);
}

test('8 cycle', function () {
  reset.flick(ResetLines.RES);

  clockTick(); checkPulses("clk 1", PulseLines.A);
  clockTick(); checkPulses("clk 2", PulseLines.A, PulseLines.B);
  clockTick(); checkPulses("clk 3", PulseLines.A);
  clockTick(); checkPulses("clk 4", PulseLines.E);
  clockTick(); checkPulses("clk 5", PulseLines.C, PulseLines.D, PulseLines.E);

  abort.set(AbortLines.AT08);

  clockTick(); checkPulses("clk 6", PulseLines.C, PulseLines.E);
  clockTick(); checkPulses("clk 7");

  abort.clear();

  clockTick(); checkPulses("clk 8");
});

test('10 cycle', function () {
  // internal fsm runs on from test above
  clockTick(); checkPulses("clk 1", PulseLines.A);
  clockTick(); checkPulses("clk 2", PulseLines.A, PulseLines.B);
  clockTick(); checkPulses("clk 3", PulseLines.A);
  clockTick(); checkPulses("clk 4", PulseLines.E);
  clockTick(); checkPulses("clk 5", PulseLines.C, PulseLines.D, PulseLines.E);

  abort.set(AbortLines.AT10);

  clockTick(); checkPulses("clk 6", PulseLines.C, PulseLines.E);
  clockTick(); checkPulses("clk 7");
  clockTick(); checkPulses("clk 8", PulseLines.F, PulseLines.G, PulseLines.J);
  clockTick(); checkPulses("clk 9", PulseLines.F, PulseLines.J, PulseLines.K);

  abort.clear();

  clockTick(); checkPulses("clk 10");
});

test('12 cycle', function () {
  // internal fsm runs on from test above
  clockTick(); checkPulses("clk 1", PulseLines.A);
  clockTick(); checkPulses("clk 2", PulseLines.A, PulseLines.B);
  clockTick(); checkPulses("clk 3", PulseLines.A);
  clockTick(); checkPulses("clk 4", PulseLines.E);
  clockTick(); checkPulses("clk 5", PulseLines.C, PulseLines.D, PulseLines.E);

  abort.set(AbortLines.AT12);

  clockTick(); checkPulses("clk 6", PulseLines.C, PulseLines.E);
  clockTick(); checkPulses("clk 7");
  clockTick(); checkPulses("clk 8", PulseLines.F, PulseLines.G, PulseLines.J);
  clockTick(); checkPulses("clk 9", PulseLines.F, PulseLines.J, PulseLines.K);
  clockTick(); checkPulses("clk 10", PulseLines.J);
  clockTick(); checkPulses("clk 11", PulseLines.H, PulseLines.I);

  abort.clear();

  clockTick(); checkPulses("clk 12");
});

test('14 cycle', function () {
  // internal fsm runs on from test above
  clockTick(); checkPulses("clk 1", PulseLines.A);
  clockTick(); checkPulses("clk 2", PulseLines.A, PulseLines.B);
  clockTick(); checkPulses("clk 3", PulseLines.A);
  clockTick(); checkPulses("clk 4", PulseLines.E);
  clockTick(); checkPulses("clk 5", PulseLines.C, PulseLines.D, PulseLines.E);

  abort.set(AbortLines.AT14);

  clockTick(); checkPulses("clk 6", PulseLines.C, PulseLines.E);
  clockTick(); checkPulses("clk 7");
  clockTick(); checkPulses("clk 8", PulseLines.F, PulseLines.G, PulseLines.J);
  clockTick(); checkPulses("clk 9", PulseLines.F, PulseLines.J, PulseLines.K);
  clockTick(); checkPulses("clk 10", PulseLines.J);
  clockTick(); checkPulses("clk 11", PulseLines.H, PulseLines.I);
  clockTick(); checkPulses("clk 12", PulseLines.H, PulseLines.L, PulseLines.M);
  clockTick(); checkPulses("clk 13", PulseLines.L);

  abort.clear();

  clockTick(); checkPulses("clk 14");
  clockTick(); checkPulses("clk 15");
});

test('24 cycle', function () {
  // internal fsm runs on from test above
  clockTick(); checkPulses("clk 1", PulseLines.A);
  clockTick(); checkPulses("clk 2", PulseLines.A, PulseLines.B);
  clockTick(); checkPulses("clk 3", PulseLines.A);
  clockTick(); checkPulses("clk 4", PulseLines.E);
  clockTick(); checkPulses("clk 5", PulseLines.C, PulseLines.D, PulseLines.E);
  clockTick(); checkPulses("clk 6", PulseLines.C, PulseLines.E);
  clockTick(); checkPulses("clk 7");
  clockTick(); checkPulses("clk 8", PulseLines.F, PulseLines.G, PulseLines.J);
  clockTick(); checkPulses("clk 9", PulseLines.F, PulseLines.J, PulseLines.K);
  clockTick(); checkPulses("clk 10", PulseLines.J);
  clockTick(); checkPulses("clk 11", PulseLines.H, PulseLines.I);
  clockTick(); checkPulses("clk 12", PulseLines.H, PulseLines.L, PulseLines.M);
  clockTick(); checkPulses("clk 13", PulseLines.L);
  clockTick(); checkPulses("clk 14");
  clockTick(); checkPulses("clk 15", PulseLines.N);
  clockTick(); checkPulses("clk 16", PulseLines.N, PulseLines.O);
  clockTick(); checkPulses("clk 17", PulseLines.N);
  clockTick(); checkPulses("clk 18");
  clockTick(); checkPulses("clk 19", PulseLines.Q, PulseLines.R);
  clockTick(); checkPulses("clk 20", PulseLines.Q);
  clockTick(); checkPulses("clk 21");
  clockTick(); checkPulses("clk 22", PulseLines.S, PulseLines.T);
  clockTick(); checkPulses("clk 23", PulseLines.S);

  clock.clear();
});
