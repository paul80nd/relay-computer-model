import { AbortLines, I2BLines, OperationLines, PulseLines, RegABCDLines } from '../../src/bus/bus-part-lines';
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
const zbus = bgs.w.controlZBus;
const opbus = bgs.w.operationBus;

op.set(OperationLines.ISET);

test('set D', function () {
  inst.set(0b01000000);
  pulse.set(PulseLines.D);
  expectPart(zbus.regABCDPart).hasLinesSet(RegABCDLines.RLA);
  expectPart(opbus.abortPart).hasLinesSet(AbortLines.AT08);
  expectPart(xbus.i2bPart).hasLinesSet();
});

test('set E', function () {
  inst.set(0b01000000);
  pulse.set(PulseLines.E);
  expectPart(zbus.regABCDPart).hasLinesSet();
  expectPart(opbus.abortPart).hasLinesSet();
  expectPart(xbus.i2bPart).hasLinesSet(I2BLines.I2B);
});

// Load Immediate - SETAB - 8 Cycles
// 01 rddddd
// r = destination register (0-A, 1-B)
// ddddd = value (-16..15)

test('set dest', function () {
  pulse.set(PulseLines.D);
  inst.set(0b01000000);
  expectPart(zbus.regABCDPart).hasLinesSet(RegABCDLines.RLA);

  inst.set(0b01100000);
  expectPart(zbus.regABCDPart).hasLinesSet(RegABCDLines.RLB);
});
