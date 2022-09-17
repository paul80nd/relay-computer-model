import { ConditionLines, MemoryLines, OperationLines, PulseLines, RegAuxLines, RegJMXYLines } from '../../src/bus/bus-part-lines';
import { expectPart, LinesPart, TestFactory, ValuePart } from './helpers';

const op = new LinesPart;
const inst = new ValuePart;
const pulse = new LinesPart;
const alucnd = new LinesPart;

const { cf, bgs } = TestFactory.Deps;
const card = cf.createControl();
card.connect(bgs.w);
op.connectOn(bgs.w.operationBus.operationPart);
inst.connectOn(bgs.w.controlInstructionBus.instructionPart)
pulse.connectOn(bgs.w.pulseBus.pulsePart);
alucnd.connectOn(bgs.w.controlInstructionBus.conditionPart);

const xbus = bgs.w.controlXBus;
const ybus = bgs.w.controlYBus;

op.set(OperationLines.IGTO);

test('goto J', function () {
  inst.set(0b11000000);
  pulse.set(PulseLines.J);
  expectPart(xbus.auxRegisterPart).hasLinesSet(RegAuxLines.SPC);
  expectPart(ybus.memoryPart).hasLinesSet(MemoryLines.MER);
  expectPart(ybus.regJMXYPart).hasLinesSet();
});

test('goto K', function () {
  inst.set(0b11000000);
  pulse.set(PulseLines.K);
  expectPart(xbus.auxRegisterPart).hasLinesSet(RegAuxLines.LIC);
  expectPart(ybus.memoryPart).hasLinesSet();
  expectPart(ybus.regJMXYPart).hasLinesSet(RegJMXYLines.LM1);
});

test('goto L', function () {
  inst.set(0b11000000);
  pulse.set(PulseLines.L);
  expectPart(xbus.auxRegisterPart).hasLinesSet(RegAuxLines.SIC);
  expectPart(ybus.memoryPart).hasLinesSet();
  expectPart(ybus.regJMXYPart).hasLinesSet();
});

test('goto M', function () {
  inst.set(0b11000000);
  pulse.set(PulseLines.M);
  expectPart(xbus.auxRegisterPart).hasLinesSet(RegAuxLines.LPC);
  expectPart(ybus.memoryPart).hasLinesSet();
  expectPart(ybus.regJMXYPart).hasLinesSet();
});

test('goto N', function () {
  inst.set(0b11000000);
  pulse.set(PulseLines.N);
  expectPart(xbus.auxRegisterPart).hasLinesSet(RegAuxLines.SPC);
  expectPart(ybus.memoryPart).hasLinesSet(MemoryLines.MER);
  expectPart(ybus.regJMXYPart).hasLinesSet();
});

test('goto O', function () {
  inst.set(0b11000000);
  pulse.set(PulseLines.O);
  expectPart(xbus.auxRegisterPart).hasLinesSet(RegAuxLines.LIC);
  expectPart(ybus.memoryPart).hasLinesSet();
  expectPart(ybus.regJMXYPart).hasLinesSet(RegJMXYLines.LM2);
});

test('goto Q', function () {
  inst.set(0b11000000);
  pulse.set(PulseLines.Q);
  expectPart(xbus.auxRegisterPart).hasLinesSet(RegAuxLines.SIC);
  expectPart(ybus.memoryPart).hasLinesSet();
  expectPart(ybus.regJMXYPart).hasLinesSet();
});

test('goto R', function () {
  inst.set(0b11000000);
  pulse.set(PulseLines.R);
  expectPart(xbus.auxRegisterPart).hasLinesSet(RegAuxLines.LPC);
  expectPart(ybus.memoryPart).hasLinesSet();
  expectPart(ybus.regJMXYPart).hasLinesSet();
});

test('goto S', function () {
  inst.set(0b11000000);
  pulse.set(PulseLines.S);
  expectPart(xbus.auxRegisterPart).hasLinesSet();
  expectPart(ybus.memoryPart).hasLinesSet();
  expectPart(ybus.regJMXYPart).hasLinesSet(RegJMXYLines.SEJ);
});

test('goto T', function () {
  inst.set(0b11000000);
  pulse.set(PulseLines.T);
  expectPart(xbus.auxRegisterPart).hasLinesSet();
  expectPart(ybus.memoryPart).hasLinesSet();
  expectPart(ybus.regJMXYPart).hasLinesSet();
});

test('goto LD-M1/J1', function () {
  pulse.set(PulseLines.K);
  inst.set(0b11000000);
  expectPart(ybus.regJMXYPart).hasLinesSet(RegJMXYLines.LM1);

  inst.set(0b11100000);
  expectPart(ybus.regJMXYPart).hasLinesSet(RegJMXYLines.LJ1);
});

test('goto LD-M2/J2', function () {
  pulse.set(PulseLines.O);
  inst.set(0b11000000);
  expectPart(ybus.regJMXYPart).hasLinesSet(RegJMXYLines.LM2);

  inst.set(0b11100000);
  expectPart(ybus.regJMXYPart).hasLinesSet(RegJMXYLines.LJ2);
});

test('goto LD-XY', function () {
  pulse.set(PulseLines.R);
  inst.set(0b11000000);
  expectPart(ybus.regJMXYPart).hasLinesSet();

  inst.set(0b11000001);
  expectPart(ybus.regJMXYPart).hasLinesSet(RegJMXYLines.LXY);
});

test('goto LD-PC', function () {
  pulse.set(PulseLines.T);
  inst.set(0b11000000);
  expectPart(xbus.auxRegisterPart).hasLinesSet();

  inst.set(0b11000010);
  expectPart(xbus.auxRegisterPart).hasLinesSet();
  alucnd.set(ConditionLines.NZ);
  expectPart(xbus.auxRegisterPart).hasLinesSet(RegAuxLines.LPC);
  alucnd.clear()

  inst.set(0b11000100);
  alucnd.set(ConditionLines.EZ);
  expectPart(xbus.auxRegisterPart).hasLinesSet(RegAuxLines.LPC);
  alucnd.clear()

  inst.set(0b11001000);
  alucnd.set(ConditionLines.CY);
  expectPart(xbus.auxRegisterPart).hasLinesSet(RegAuxLines.LPC);
  alucnd.clear()

  inst.set(0b11010000);
  alucnd.set(ConditionLines.SN);
  expectPart(xbus.auxRegisterPart).hasLinesSet(RegAuxLines.LPC);
  alucnd.clear()
});
