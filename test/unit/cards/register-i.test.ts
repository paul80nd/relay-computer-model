import { I2BLines, RegAuxLines } from '../../../src/bus/bus-part-lines';
import { LinesPart, TestFactory, ValuePart } from './helpers';

const ctrl = new LinesPart;
const ctrlI2B = new LinesPart;
const data = new ValuePart;
const inst = new ValuePart;

const { cf, bgs } = TestFactory.Deps;
const card = cf.createRegisterI();
card.connect(bgs.x);
ctrl.connectOn(bgs.x.controlXBus.auxRegisterPart);
ctrlI2B.connectOn(bgs.x.controlXBus.i2bPart);
data.connectOn(bgs.x.dataInstructionBus.dataPart);
inst.connectOn(bgs.x.dataInstructionBus.instructionPart);

test('lin', function () {
  data.set(0xdc);
  ctrl.flick(RegAuxLines.LIN);
  data.clear();
  inst.expect().toBe(0xdc);
});

test('i2b', function () {
  data.set(0b01101011);
  ctrl.flick(RegAuxLines.LIN);
  data.clear();
  inst.expect().toBe(0b01101011);
  data.expect().toBe(0);
  ctrlI2B.set(I2BLines.I2B);
  inst.expect().toBe(0b01101011);
  data.expect().toBe(0b00001011);
  ctrlI2B.clear();
});

test('i2b sign ext', function () {
  data.set(0b01011010);
  ctrl.flick(RegAuxLines.LIN);
  data.clear();
  inst.expect().toBe(0b01011010);
  data.expect().toBe(0);
  ctrlI2B.set(I2BLines.I2B);
  inst.expect().toBe(0b01011010);
  data.expect().toBe(0b11111010);
  ctrlI2B.clear();
});
