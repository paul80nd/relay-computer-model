import { AbortLines, OperationLines, PulseLines, RegABCDLines, RegJMXYLines } from '../../src/bus/bus-part-lines';
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

op.set(OperationLines.IMV8);

test('mov C', function () {
  inst.set(0b00000000);
  pulse.set(PulseLines.C);
  expectPart(zbus.regABCDPart).hasLinesSet(RegABCDLines.RSA);
  expectPart(opbus.abortPart).hasLinesSet();
});

test('mov D', function () {
  inst.set(0b00000000);
  pulse.set(PulseLines.D);
  expectPart(zbus.regABCDPart).hasLinesSet(RegABCDLines.RLA);
  expectPart(opbus.abortPart).hasLinesSet(AbortLines.AT08);
});

test('mov src', function () {
  pulse.set(PulseLines.C);
  inst.set(0b00000000);
  expectPart(zbus.regABCDPart).hasLinesSet(RegABCDLines.RSA);

  inst.set(0b00000001);
  expectPart(zbus.regABCDPart).hasLinesSet(RegABCDLines.RSB);

  inst.set(0b00000010);
  expectPart(zbus.regABCDPart).hasLinesSet(RegABCDLines.RSC);

  inst.set(0b00000011);
  expectPart(zbus.regABCDPart).hasLinesSet(RegABCDLines.RSD);

  inst.set(0b00000100);
  expectPart(ybus.regJMXYPart).hasLinesSet(RegJMXYLines.SM1);

  inst.set(0b00000101);
  expectPart(ybus.regJMXYPart).hasLinesSet(RegJMXYLines.SM2);

  inst.set(0b00000110);
  expectPart(ybus.regJMXYPart).hasLinesSet(RegJMXYLines.SEX);

  inst.set(0b00000111);
  expectPart(ybus.regJMXYPart).hasLinesSet(RegJMXYLines.SEY);
});

test('mov dest', function () {
  pulse.set(PulseLines.D);
  inst.set(0b00000000);
  expectPart(zbus.regABCDPart).hasLinesSet(RegABCDLines.RLA);

  inst.set(0b00001000);
  expectPart(zbus.regABCDPart).hasLinesSet(RegABCDLines.RLB);

  inst.set(0b00010000);
  expectPart(zbus.regABCDPart).hasLinesSet(RegABCDLines.RLC);

  inst.set(0b00011000);
  expectPart(zbus.regABCDPart).hasLinesSet(RegABCDLines.RLD);

  inst.set(0b00100000);
  expectPart(ybus.regJMXYPart).hasLinesSet(RegJMXYLines.LM1);

  inst.set(0b00101000);
  expectPart(ybus.regJMXYPart).hasLinesSet(RegJMXYLines.LM2);

  inst.set(0b00110000);
  expectPart(ybus.regJMXYPart).hasLinesSet(RegJMXYLines.LDX);

  inst.set(0b00111000);
  expectPart(ybus.regJMXYPart).hasLinesSet(RegJMXYLines.LDY);
});
