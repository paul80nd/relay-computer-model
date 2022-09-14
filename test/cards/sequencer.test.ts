'use strict';

import * as assert from 'assert';
import { BitValue } from '../../src/bit_value';
import { BusFactory } from '../../src/bus/bus';
import { BusGroupFactory } from '../../src/bus/bus_groups';
import { BusPartFactory } from '../../src/bus/bus_parts';
import { AbortLines, ClockLines, OperationLines, PulseLines, ResetLines } from '../../src/bus/bus_part_lines';
import { CardFactory } from '../../src/cards/cards';
import { CardPart } from '../../src/cards/card_part';

suite('card-sequencer', () => {

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

});


//   private abortChanged = () => {
//     if (this.abortPart && this.fsm.bit(5)) {
//       const abort = this.abortPart.value;

//       if (!this.abort.isEqualTo(abort)) { this.abort = abort; }
//     }
//   };

//   private clock = () => {
//     const clock = this.clockPart!.value.bit(ClockLines.CLK);
//     if (clock !== this.lastClock) {
//       this.lastClock = clock;
//       this.fsm = this.fsm.shiftLeft(24);
//       if (this.fsm.bit(15) && this.abort.bit(AbortLines.AT14)) {
//         this.fsm = this.fsm.flipBit(15);
//         this.fsm = this.fsm.flipBit(0);
//       }
//       if (this.fsm.bit(13) && this.abort.bit(AbortLines.AT12)) {
//         this.fsm = this.fsm.flipBit(13);
//         this.fsm = this.fsm.flipBit(0);
//       }
//       if (this.fsm.bit(11) && this.abort.bit(AbortLines.AT10)) {
//         this.fsm = this.fsm.flipBit(11);
//         this.fsm = this.fsm.flipBit(0);
//       }
//       else if (this.fsm.bit(9) && this.abort.bit(AbortLines.AT08)) {
//         this.fsm = this.fsm.flipBit(9);
//         this.fsm = this.fsm.flipBit(0);
//       }
//       if (this.fsm.bit(0)) {
//         this.abort = BitValue.Zero;
//       }
//       this.derrivePulses();
//     }
//   };

