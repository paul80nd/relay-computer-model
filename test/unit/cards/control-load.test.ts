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

op.set(OperationLines.ILOD);

test('load D', function () {
  inst.set(0b10010000);
  pulse.set(PulseLines.D);
  expectPart(opbus.abortPart).hasLinesSet(AbortLines.AT12);
});

test('load J', function () {
  inst.set(0b10010000);
  pulse.set(PulseLines.J);
  expectPart(ybus.regJMXYPart).hasLinesSet(RegJMXYLines.SEM);
  expectPart(ybus.memoryPart).hasLinesSet(MemoryLines.MER);
});

test('load K', function () {
  inst.set(0b10010000);
  pulse.set(PulseLines.K);
  expectPart(zbus.regABCDPart).hasLinesSet(RegABCDLines.RLA);
});

// Load Register - LOAD - 12 Cycles
// 100100 dd
// dd = destination register (00-A, 01-B, 10-C, 11-D)

test('load dst', function () {
  pulse.set(PulseLines.K);
  inst.set(0b10010000);
  expectPart(zbus.regABCDPart).hasLinesSet(RegABCDLines.RLA);

  inst.set(0b10010001);
  expectPart(zbus.regABCDPart).hasLinesSet(RegABCDLines.RLB);

  inst.set(0b10010010);
  expectPart(zbus.regABCDPart).hasLinesSet(RegABCDLines.RLC);

  inst.set(0b10010011);
  expectPart(zbus.regABCDPart).hasLinesSet(RegABCDLines.RLD);
});
