import { AbortLines, ClockCtrlLines, OperationLines, PulseLines, DataSwitchGateLines, RegAuxLines } from '../../../src/bus/bus-part-lines';
import { expectPart, LinesPart, TestFactory, ValuePart } from './helpers';

const op = new LinesPart;
const inst = new ValuePart;
const pulse = new LinesPart;

const { cf, bgs } = TestFactory.Deps;
const card = cf.createControl();
card.connect(bgs.w);
op.connectOn(bgs.w.operationBus.operationPart);
inst.connectOn(bgs.w.controlInstructionBus.instructionPart)
pulse.connectOn(bgs.w.pulseBus.pulsePart);

const xbus = bgs.w.controlXBus;
const ybus = bgs.y.controlYBus;
const opbus = bgs.w.operationBus;

op.set(OperationLines.IMSC);

test('misc C', function () {
  inst.set(0b10101110);
  pulse.set(PulseLines.C);
  expectPart(opbus.abortPart).hasLinesSet();
});

test('misc D', function () {
  pulse.set(PulseLines.D);
  inst.set(0b10101110);
  expectPart(xbus.clockCtrlPart).hasLinesSet();
  expectPart(opbus.abortPart).hasLinesSet(AbortLines.AT10);
});

test('misc F', function () {
  pulse.set(PulseLines.F);
  inst.set(0b10101111);
  expectPart(ybus.sdsPart).hasLinesSet(DataSwitchGateLines.SAS);
});

test('misc G', function () {
  pulse.set(PulseLines.G);
  inst.set(0b10101111);
  expectPart(xbus.auxRegisterPart).hasLinesSet(RegAuxLines.LPC);
});

// Halt - MISC - 10 Cycles
// 1010111 r
// r = reload program counter (0-no reload, 1-reload from switches)

test('hlt', function () {
  pulse.set(PulseLines.G);
  inst.set(0b10101110);
  expectPart(xbus.clockCtrlPart).hasLinesSet(ClockCtrlLines.HLT);
  expectPart(xbus.auxRegisterPart).hasLinesSet();
  expectPart(opbus.abortPart).hasLinesSet();
});

test('hlt reload', function () {
  pulse.set(PulseLines.G);
  inst.set(0b10101111);
  expectPart(xbus.clockCtrlPart).hasLinesSet(ClockCtrlLines.HLT);
  expectPart(xbus.auxRegisterPart).hasLinesSet(RegAuxLines.LPC);
  expectPart(opbus.abortPart).hasLinesSet();
});

