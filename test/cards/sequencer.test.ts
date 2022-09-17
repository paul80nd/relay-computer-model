'use strict';

import * as assert from 'assert';
import { BitValue } from '../../src/bit-value';
import { BusFactory } from '../../src/bus/bus';
import { BusGroupFactory } from '../../src/bus/bus-groups';
import { BusPartFactory } from '../../src/bus/bus-parts';
import { AbortLines, ClockLines, PulseLines, ResetLines } from '../../src/bus/bus-part-lines';
import { CardFactory } from '../../src/card-factory';
import { CardPart } from '../../src/cards/card-part';

const bf = new BusFactory(new BusPartFactory());
const bgf = new BusGroupFactory(bf);
const cf = new CardFactory();

const card = cf.createSequencer();
const bgs = bgf.createBusGroups();
card.connect(bgs.w);

const abrtin = new CardPart();
const clkin = new CardPart();
const resin = new CardPart();
bgs.w.operationBus.abortPart.connect(abrtin);
bgs.w.controlXBus.clockPart.connect(clkin);
bgs.w.controlXBus.resetPart.connect(resin);

const pulseOut = bgs.w.pulseBus.pulsePart;

function clockTick() {
  clkin.value = clkin.value.flipBit(ClockLines.CLK);
}
function checkPulses(testName: string, ...expects: number[]) {
  const expected = expects.reduce((p, c) => p.flipBit(c), BitValue.Zero);
  assert.ok(pulseOut.value.isEqualTo(expected), testName);
}

test('8 cycle', function () {
  resin.value = BitValue.Zero.flipBit(ResetLines.RES);
  resin.value = BitValue.Zero;

  clockTick(); checkPulses("clk 1", PulseLines.A);
  clockTick(); checkPulses("clk 2", PulseLines.A, PulseLines.B);
  clockTick(); checkPulses("clk 3", PulseLines.A);
  clockTick(); checkPulses("clk 4", PulseLines.E);
  clockTick(); checkPulses("clk 5", PulseLines.C, PulseLines.D, PulseLines.E);

  abrtin.value = BitValue.Zero.flipBit(AbortLines.AT08);

  clockTick(); checkPulses("clk 6", PulseLines.C, PulseLines.E);
  clockTick(); checkPulses("clk 7");
  clockTick(); checkPulses("clk 8", PulseLines.F, PulseLines.G, PulseLines.J);

  abrtin.value = BitValue.Zero;

  clockTick(); checkPulses("clk 9");
});

test('10 cycle', function () {
  // internal fsm runs on from test above
  clockTick(); checkPulses("clk 1", PulseLines.A);
  clockTick(); checkPulses("clk 2", PulseLines.A, PulseLines.B);
  clockTick(); checkPulses("clk 3", PulseLines.A);
  clockTick(); checkPulses("clk 4", PulseLines.E);
  clockTick(); checkPulses("clk 5", PulseLines.C, PulseLines.D, PulseLines.E);

  abrtin.value = BitValue.Zero.flipBit(AbortLines.AT10);

  clockTick(); checkPulses("clk 6", PulseLines.C, PulseLines.E);
  clockTick(); checkPulses("clk 7");
  clockTick(); checkPulses("clk 8", PulseLines.F, PulseLines.G, PulseLines.J);
  clockTick(); checkPulses("clk 9", PulseLines.F, PulseLines.J, PulseLines.K);
  clockTick(); checkPulses("clk 10", PulseLines.J);

  abrtin.value = BitValue.Zero;

  clockTick(); checkPulses("clk 11");
});

test('12 cycle', function () {
  // internal fsm runs on from test above
  clockTick(); checkPulses("clk 1", PulseLines.A);
  clockTick(); checkPulses("clk 2", PulseLines.A, PulseLines.B);
  clockTick(); checkPulses("clk 3", PulseLines.A);
  clockTick(); checkPulses("clk 4", PulseLines.E);
  clockTick(); checkPulses("clk 5", PulseLines.C, PulseLines.D, PulseLines.E);

  abrtin.value = BitValue.Zero.flipBit(AbortLines.AT12);

  clockTick(); checkPulses("clk 6", PulseLines.C, PulseLines.E);
  clockTick(); checkPulses("clk 7");
  clockTick(); checkPulses("clk 8", PulseLines.F, PulseLines.G, PulseLines.J);
  clockTick(); checkPulses("clk 9", PulseLines.F, PulseLines.J, PulseLines.K);
  clockTick(); checkPulses("clk 10", PulseLines.J);
  clockTick(); checkPulses("clk 11", PulseLines.H, PulseLines.I);
  clockTick(); checkPulses("clk 12", PulseLines.H, PulseLines.L, PulseLines.M);

  abrtin.value = BitValue.Zero;

  clockTick(); checkPulses("clk 13");
});

test('14 cycle', function () {
  // internal fsm runs on from test above
  clockTick(); checkPulses("clk 1", PulseLines.A);
  clockTick(); checkPulses("clk 2", PulseLines.A, PulseLines.B);
  clockTick(); checkPulses("clk 3", PulseLines.A);
  clockTick(); checkPulses("clk 4", PulseLines.E);
  clockTick(); checkPulses("clk 5", PulseLines.C, PulseLines.D, PulseLines.E);

  abrtin.value = BitValue.Zero.flipBit(AbortLines.AT14);

  clockTick(); checkPulses("clk 6", PulseLines.C, PulseLines.E);
  clockTick(); checkPulses("clk 7");
  clockTick(); checkPulses("clk 8", PulseLines.F, PulseLines.G, PulseLines.J);
  clockTick(); checkPulses("clk 9", PulseLines.F, PulseLines.J, PulseLines.K);
  clockTick(); checkPulses("clk 10", PulseLines.J);
  clockTick(); checkPulses("clk 11", PulseLines.H, PulseLines.I);
  clockTick(); checkPulses("clk 12", PulseLines.H, PulseLines.L, PulseLines.M);
  clockTick(); checkPulses("clk 13", PulseLines.L);

  abrtin.value = BitValue.Zero;

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

  clkin.value = BitValue.Zero;
});
