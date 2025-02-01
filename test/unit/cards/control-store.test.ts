import { AbortLines, MemoryLines, OperationLines, PulseLines, RegABCDLines, RegJMXYLines } from '../../../src/bus/bus-part-lines';
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
const zbus = bgs.w.controlZBus;
const opbus = bgs.w.operationBus;

op.set(OperationLines.ISTR);

test('store D', function () {
  inst.set(0b10011000);
  pulse.set(PulseLines.D);
  expectPart(opbus.abortPart).hasLinesSet(AbortLines.AT12);
});

test('store J', function () {
  inst.set(0b10011000);
  pulse.set(PulseLines.J);
  expectPart(zbus.regABCDPart).hasLinesSet(RegABCDLines.RSA);
  expectPart(ybus.regJMXYPart).hasLinesSet(RegJMXYLines.SEM);
  expectPart(ybus.memoryPart).hasLinesSet(MemoryLines.B2M);
});

test('store K', function () {
  inst.set(0b10011000);
  pulse.set(PulseLines.K);
  expectPart(ybus.memoryPart).hasLinesSet(MemoryLines.MEW);
});

// Store Register - STORE - 12 Cycles
// 100110 ss
// ss = source register (00-A, 01-B, 10-C, 11-D)

test('store src', function () {
  pulse.set(PulseLines.J);
  inst.set(0b10011000);
  expectPart(zbus.regABCDPart).hasLinesSet(RegABCDLines.RSA);

  inst.set(0b10011001);
  expectPart(zbus.regABCDPart).hasLinesSet(RegABCDLines.RSB);

  inst.set(0b10011010);
  expectPart(zbus.regABCDPart).hasLinesSet(RegABCDLines.RSC);

  inst.set(0b10011011);
  expectPart(zbus.regABCDPart).hasLinesSet(RegABCDLines.RSD);
});
