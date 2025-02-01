import { OperationLines } from '../../../src/bus/bus-part-lines';
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

test('mov16', function () {
  inst.set(0b10100000);
  expectPart(cpop).hasLinesSet(OperationLines.IM16);
});

test('store', function () {
  inst.set(0b10011000);
  expectPart(cpop).hasLinesSet(OperationLines.ISTR);
});

test('load', function () {
  inst.set(0b10010000);
  expectPart(cpop).hasLinesSet(OperationLines.ILOD);
});

test('incxy', function () {
  inst.set(0b10110000);
  expectPart(cpop).hasLinesSet(OperationLines.IINC);
});

test('misc', function () {
  inst.set(0b10101110);
  expectPart(cpop).hasLinesSet(OperationLines.IMSC);
});

test('sequence', function () {
  inst.set(0b01000000);
  inst.set(0b00000000);
  inst.set(0b10000000);
  expectPart(cpop).hasLinesSet(OperationLines.IALU);
});

