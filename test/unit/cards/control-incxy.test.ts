import { AbortLines, OperationLines, PulseLines, RegJMXYLines, RegAuxLines } from '../../../src/bus/bus-part-lines';
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
const ybus = bgs.w.controlYBus;
const opbus = bgs.w.operationBus;

op.set(OperationLines.IINC);

test('incxy D', function () {
  inst.set(0b10110000);
  pulse.set(PulseLines.D);
  expectPart(opbus.abortPart).hasLinesSet(AbortLines.AT14);
});

test('incxy F', function () {
  inst.set(0b10110000);
  pulse.set(PulseLines.F);
  expectPart(ybus.regJMXYPart).hasLinesSet(RegJMXYLines.SXY);
});

test('incxy G', function () {
  inst.set(0b10110000);
  pulse.set(PulseLines.G);
  expectPart(xbus.auxRegisterPart).hasLinesSet(RegAuxLines.LIC);
});

test('incxy H', function () {
  inst.set(0b10110000);
  pulse.set(PulseLines.H);
  expectPart(xbus.auxRegisterPart).hasLinesSet(RegAuxLines.SIC);
});

test('incxy I', function () {
  inst.set(0b10110000);
  pulse.set(PulseLines.I);
  expectPart(ybus.regJMXYPart).hasLinesSet(RegJMXYLines.LXY);
});
