import { RegJMXYLines } from '../../src/bus/bus-part-lines';
import { LinesPart, TestFactory, ValuePart } from './helpers';

const addr = new ValuePart;
const data = new ValuePart;
const ctrl = new LinesPart;

const { cf, bgs } = TestFactory.Deps;
const card = cf.createRegisterM();
card.connect(bgs.y);
addr.connectOn(bgs.y.addressBus.addressPart);
data.connectOn(bgs.y.dataControlBus.dataPart)
ctrl.connectOn(bgs.y.controlYBus.regJMXYPart);

test('ld sel M1', function () {
  data.set(0xdc);
  ctrl.flick(RegJMXYLines.LM1);
  data.clear();
  data.expect().toBe(0);
  ctrl.set(RegJMXYLines.SM1);
  data.expect().toBe(0xdc);
  ctrl.clear();
});

test('ld sel M2', function () {
  data.set(0xbc);
  ctrl.flick(RegJMXYLines.LM2);
  data.clear();
  data.expect().toBe(0);
  ctrl.set(RegJMXYLines.SM2);
  data.expect().toBe(0xbc);
  ctrl.clear();
});

test('ld clr M1', function () {
  data.set(0xba);
  ctrl.flick(RegJMXYLines.LM1);
  data.clear();
  data.expect().toBe(0);
  ctrl.set(RegJMXYLines.SM1);
  data.expect().toBe(0xba);
  ctrl.set(RegJMXYLines.LM1);
  data.expect().toBe(0);
});

test('ld clr M2', function () {
  data.set(0x98);
  ctrl.flick(RegJMXYLines.LM2);
  data.clear();
  data.expect().toBe(0);
  ctrl.set(RegJMXYLines.SM2);
  data.expect().toBe(0x98);
  ctrl.set(RegJMXYLines.LM2);
  data.expect().toBe(0);
});

test('ld M1 M2 sel M', function () {
  data.set(0xab);
  ctrl.flick(RegJMXYLines.LM1);
  data.clear();

  data.set(0xcd);
  ctrl.flick(RegJMXYLines.LM2);
  data.clear();

  addr.expect().toBe(0);
  ctrl.set(RegJMXYLines.SEM);
  addr.expect().toBe(0xabcd);
  ctrl.clear();
});
