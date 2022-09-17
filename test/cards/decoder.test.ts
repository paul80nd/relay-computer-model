import { OperationLines } from '../../src/bus/bus-part-lines';
import { expectPart, TestFactory, ValuePart } from './helpers';

const inst = new ValuePart;

const { cf, bgs } = TestFactory.Deps;
const card = cf.createDecoder();
card.connect(bgs.w);
inst.connectOn(bgs.w.controlInstructionBus.instructionPart);

const cpop = bgs.w.operationBus.operationPart;

test('goto', function () {
  inst.set(0b11000000);
  expectPart(cpop).hasLinesSet(OperationLines.IGTO);
});

test('alu', function () {
  inst.set(0b10000000);
  expectPart(cpop).hasLinesSet(OperationLines.IALU);
});

test('alu', function () {
  inst.set(0b01000000);
  expectPart(cpop).hasLinesSet(OperationLines.ISET);
});

test('mov8', function () {
  inst.set(0b00000000);
  expectPart(cpop).hasLinesSet(OperationLines.IMV8);
});

test('sequence', function () {
  inst.set(0b01000000);
  inst.set(0b00000000);
  inst.set(0b10000000);
  expectPart(cpop).hasLinesSet(OperationLines.IALU);
});

