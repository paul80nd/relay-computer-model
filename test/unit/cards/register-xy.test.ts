import { RegJMXYLines } from '../../../src/bus/bus-part-lines';
import { LinesPart, TestFactory, ValuePart } from './helpers';

const addr = new ValuePart;
const data = new ValuePart;
const ctrl = new LinesPart;

const { cf, bgs } = TestFactory.Deps;
const card = cf.createRegisterXY();
card.connect(bgs.y);
addr.connectOn(bgs.y.addressBus.addressPart);
data.connectOn(bgs.y.dataControlBus.dataPart)
ctrl.connectOn(bgs.y.controlYBus.regJMXYPart);

test('ld sel X', function () {
  data.set(0xdc);
  ctrl.flick(RegJMXYLines.LDX);
  data.clear();
  data.expect().toBe(0);
  ctrl.set(RegJMXYLines.SEX);
  data.expect().toBe(0xdc);
  ctrl.clear();
});

test('ld sel Y', function () {
  data.set(0xbc);
  ctrl.flick(RegJMXYLines.LDY);
  data.clear();
  data.expect().toBe(0);
  ctrl.set(RegJMXYLines.SEY);
  data.expect().toBe(0xbc);
  ctrl.clear();
});

test('ld sel XY', function () {
  addr.set(0xabcd);
  ctrl.flick(RegJMXYLines.LXY);
  addr.clear();
  addr.expect().toBe(0);
  ctrl.set(RegJMXYLines.SXY);
  addr.expect().toBe(0xabcd);
  ctrl.clear();
});

test('ld clr X', function () {
  data.set(0xba);
  ctrl.flick(RegJMXYLines.LDX);
  data.clear();
  data.expect().toBe(0);
  ctrl.set(RegJMXYLines.SEX);
  data.expect().toBe(0xba);
  ctrl.set(RegJMXYLines.LDX);
  data.expect().toBe(0);
});

test('ld clr Y', function () {
  data.set(0x98);
  ctrl.flick(RegJMXYLines.LDY);
  data.clear();
  data.expect().toBe(0);
  ctrl.set(RegJMXYLines.SEY);
  data.expect().toBe(0x98);
  ctrl.set(RegJMXYLines.LDY);
  data.expect().toBe(0);
});

test('ld clr XY', function () {
  addr.set(0x9876);
  ctrl.flick(RegJMXYLines.LXY);
  addr.clear();
  addr.expect().toBe(0);
  ctrl.set(RegJMXYLines.SXY);
  addr.expect().toBe(0x9876);
  ctrl.set(RegJMXYLines.LXY);
  addr.expect().toBe(0);
});

test('ld X Y sel XY', function () {
  data.set(0xab);
  ctrl.flick(RegJMXYLines.LDX);
  data.clear();

  data.set(0xcd);
  ctrl.flick(RegJMXYLines.LDY);
  data.clear();

  addr.expect().toBe(0);
  ctrl.set(RegJMXYLines.SXY);
  addr.expect().toBe(0xabcd);
  ctrl.clear();
});

test('ld XY sel X Y', function () {
  addr.set(0xfedc);
  ctrl.flick(RegJMXYLines.LXY);
  addr.clear();

  data.expect().toBe(0);
  ctrl.set(RegJMXYLines.SEX);
  data.expect().toBe(0xfe);
  ctrl.clear();

  data.expect().toBe(0);
  ctrl.set(RegJMXYLines.SEY);
  data.expect().toBe(0xdc);
  ctrl.clear();
});
