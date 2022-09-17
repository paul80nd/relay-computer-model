import { AbortLines, AluFunctionClLines, OperationLines, PulseLines, RegABCDLines } from '../../src/bus/bus-part-lines';
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

const zbus = bgs.w.controlZBus;
const cibus = bgs.w.controlInstructionBus;
const opbus = bgs.w.operationBus;

op.set(OperationLines.IALU);

test('alu D', function () {
  inst.set(0b10001111);
  pulse.set(PulseLines.D);
  expectPart(zbus.regABCDPart).hasLinesSet(RegABCDLines.RLD);
  expectPart(opbus.abortPart).hasLinesSet(AbortLines.AT08);
  expectPart(cibus.aluFunctionClPart).hasLinesSet(AluFunctionClLines.CL);
});

test('alu E', function () {
  inst.set(0b10001111);
  pulse.set(PulseLines.E);
  expectPart(zbus.regABCDPart).hasLinesSet();
  expectPart(opbus.abortPart).hasLinesSet();
  expectPart(cibus.aluFunctionClPart).hasLinesSet(AluFunctionClLines.F0, AluFunctionClLines.F1, AluFunctionClLines.F2);
});

test('alu dest', function () {
  pulse.set(PulseLines.D);
  inst.set(0b10001111);
  expectPart(zbus.regABCDPart).hasLinesSet(RegABCDLines.RLD);

  inst.set(0b10000111)
  expectPart(zbus.regABCDPart).hasLinesSet(RegABCDLines.RLA);
});

test('alu func', function () {
  pulse.set(PulseLines.E);
  inst.set(0b10000000);
  expectPart(cibus.aluFunctionClPart).hasLinesSet();

  inst.set(0b10000001)
  expectPart(cibus.aluFunctionClPart).hasLinesSet(AluFunctionClLines.F0);

  inst.set(0b10000010)
  expectPart(cibus.aluFunctionClPart).hasLinesSet(AluFunctionClLines.F1);

  inst.set(0b10000011)
  expectPart(cibus.aluFunctionClPart).hasLinesSet(AluFunctionClLines.F1, AluFunctionClLines.F0);

  inst.set(0b10000100)
  expectPart(cibus.aluFunctionClPart).hasLinesSet(AluFunctionClLines.F2);

  inst.set(0b10000101)
  expectPart(cibus.aluFunctionClPart).hasLinesSet(AluFunctionClLines.F2, AluFunctionClLines.F0);

  inst.set(0b10000110)
  expectPart(cibus.aluFunctionClPart).hasLinesSet(AluFunctionClLines.F2, AluFunctionClLines.F1);

  inst.set(0b10000111)
  expectPart(cibus.aluFunctionClPart).hasLinesSet(AluFunctionClLines.F2, AluFunctionClLines.F1, AluFunctionClLines.F0);
});
