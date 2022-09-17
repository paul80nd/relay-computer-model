import { RegABCDLines } from '../../src/bus/bus-part-lines';
import { LinesPart, TestFactory, ValuePart } from './helpers';

const ctrl = new LinesPart;
const data = new ValuePart;

const { cf, bgs } = TestFactory.Deps;
const card = cf.createRegisterAD();
card.connect(bgs.z);
ctrl.connectOn(bgs.z.controlZBus.regABCDPart);
data.connectOn(bgs.z.dataControlBus.dataPart);

test('ld sel A', function () {
  data.set(0xdc);
  ctrl.flick(RegABCDLines.RLA);
  data.clear();
  data.expect().toBe(0);
  ctrl.set(RegABCDLines.RSA);
  data.expect().toBe(0xdc);
});

test('ld sel D', function () {
  data.set(0xbc);
  ctrl.flick(RegABCDLines.RLD);
  data.clear();
  data.expect().toBe(0);
  ctrl.set(RegABCDLines.RSD);
  data.expect().toBe(0xbc);
});

test('ld clr A', function () {
  data.set(0xba);
  ctrl.flick(RegABCDLines.RLA);
  data.clear();
  data.expect().toBe(0);
  ctrl.set(RegABCDLines.RSA);
  data.expect().toBe(0xba);
  ctrl.set(RegABCDLines.RLA);
  data.expect().toBe(0);
});

test('ld clr D', function () {
  data.set(0x98);
  ctrl.flick(RegABCDLines.RLD);
  data.clear();
  data.expect().toBe(0);
  ctrl.set(RegABCDLines.RSD);
  data.expect().toBe(0x98);
  ctrl.set(RegABCDLines.RLD);
  data.expect().toBe(0);
});
