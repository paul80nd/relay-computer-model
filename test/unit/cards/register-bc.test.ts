import { RegABCDLines } from '../../../src/bus/bus-part-lines';
import { LinesPart, TestFactory, ValuePart } from './helpers';

const ctrl = new LinesPart;
const data = new ValuePart;

const { cf, bgs } = TestFactory.Deps;
const card = cf.createRegisterBC();
card.connect(bgs.z);
ctrl.connectOn(bgs.z.controlZBus.regABCDPart);
data.connectOn(bgs.z.dataControlBus.dataPart);

const bOut = bgs.z.registerBCBus.registerBPart;
const cOut = bgs.z.registerBCBus.registerCPart;

test('ld sel B', function () {
  data.set(0xdc);
  ctrl.flick(RegABCDLines.RLB);
  data.clear();
  data.expect().toBe(0);
  ctrl.set(RegABCDLines.RSB);
  data.expect().toBe(0xdc);
});

test('ld sel C', function () {
  data.set(0xbc);
  ctrl.flick(RegABCDLines.RLC);
  data.clear();
  data.expect().toBe(0);
  ctrl.set(RegABCDLines.RSC);
  data.expect().toBe(0xbc);
});

test('ld clr B', function () {
  data.set(0xba);
  ctrl.flick(RegABCDLines.RLB);
  data.clear();
  data.expect().toBe(0);
  ctrl.set(RegABCDLines.RSB);
  data.expect().toBe(0xba);
  ctrl.set(RegABCDLines.RLB);
  data.expect().toBe(0);
});

test('ld clr C', function () {
  data.set(0x98);
  ctrl.flick(RegABCDLines.RLC);
  data.clear();
  data.expect().toBe(0);
  ctrl.set(RegABCDLines.RSC);
  data.expect().toBe(0x98);
  ctrl.set(RegABCDLines.RLC);
  data.expect().toBe(0);
});

test('ld sel B bus', function () {
  data.set(0xdc);
  ctrl.flick(RegABCDLines.RLB);
  data.clear();
  expect(bOut.value.isZero);
  ctrl.set(RegABCDLines.RSB);
  expect(bOut.value.toUnsignedNumber()).toBe(0xdc);
});

test('ld sel C bus', function () {
  data.set(0xbc);
  ctrl.flick(RegABCDLines.RLC);
  data.clear();
  expect(cOut.value.isZero);
  ctrl.set(RegABCDLines.RSC);
  expect(cOut.value.toUnsignedNumber()).toBe(0xbc);
});

test('ld clr B bus', function () {
  data.set(0xba);
  ctrl.flick(RegABCDLines.RLB);
  data.clear();
  expect(bOut.value.isZero);
  ctrl.set(RegABCDLines.RSB);
  expect(bOut.value.toUnsignedNumber()).toBe(0xba);
  ctrl.set(RegABCDLines.RLB);
  expect(bOut.value.isZero);
});

test('ld clr C bus', function () {
  data.set(0x98);
  ctrl.flick(RegABCDLines.RLC);
  data.clear();
  expect(cOut.value.isZero);
  ctrl.set(RegABCDLines.RSC);
  expect(cOut.value.toUnsignedNumber()).toBe(0x98);
  ctrl.set(RegABCDLines.RLC);
  expect(cOut.value.isZero);
});
