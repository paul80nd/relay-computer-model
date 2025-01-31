import { AbortLines, OperationLines, PulseLines, RegJMXYLines, DataSwitchGateLines, RegAuxLines } from '../../../src/bus/bus-part-lines';
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

const ybus = bgs.w.controlYBus;
const xbus = bgs.x.controlXBus;
const opbus = bgs.w.operationBus;

op.set(OperationLines.IM16);

test('mov C', function () {
  inst.set(0b10100000);
  pulse.set(PulseLines.C);
  expectPart(opbus.abortPart).hasLinesSet();
});

test('mov D', function () {
  pulse.set(PulseLines.D);
  inst.set(0b10100000);
  expectPart(opbus.abortPart).hasLinesSet(AbortLines.AT10);
});

test('mov F', function () {
  inst.set(0b10100000);
  pulse.set(PulseLines.F);
  expectPart(ybus.regJMXYPart).hasLinesSet(RegJMXYLines.SEM);
});

test('mov G', function () {
  inst.set(0b10100000);
  pulse.set(PulseLines.G);
  expectPart(ybus.regJMXYPart).hasLinesSet(RegJMXYLines.LXY);
});

// 16-Bit Move - MOV16 - 10 Cycles
// 10100 dss
// d = dest reg (0-XY or 1-PC)
// ss = src reg (00-M, 01-XY, 10-J, 11-AS)

test('mov src', function () {
  pulse.set(PulseLines.F);
  inst.set(0b10100000);
  expectPart(ybus.regJMXYPart).hasLinesSet(RegJMXYLines.SEM);

  inst.set(0b10100001);
  expectPart(ybus.regJMXYPart).hasLinesSet(RegJMXYLines.SXY);

  inst.set(0b10100010);
  expectPart(ybus.regJMXYPart).hasLinesSet(RegJMXYLines.SEJ);

  inst.set(0b10100011);
  expectPart(ybus.sdsPart).hasLinesSet(DataSwitchGateLines.SAS);
});

test('mov dest', function () {
  pulse.set(PulseLines.G);
  inst.set(0b10100000);
  expectPart(ybus.regJMXYPart).hasLinesSet(RegJMXYLines.LXY);

  inst.set(0b10100100);
  expectPart(xbus.auxRegisterPart).hasLinesSet(RegAuxLines.LPC);
});
