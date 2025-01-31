import { RegAuxLines } from '../../../src/bus/bus-part-lines';
import { LinesPart, TestFactory, ValuePart } from './helpers';

const addr = new ValuePart;
const ctrl = new LinesPart;

const { cf, bgs } = TestFactory.Deps;
const card = cf.createIncrementer();
card.connect(bgs.x);
addr.connectOn(bgs.x.addressBus.addressPart);
ctrl.connectOn(bgs.x.controlXBus.auxRegisterPart);

test('inc ld sel', function () {
  addr.set(0xabcd);
  ctrl.flick(RegAuxLines.LIC);
  addr.clear();
  addr.expect().toBe(0);

  ctrl.set(RegAuxLines.SIC);
  addr.expect().toBe(0xabce); // one higher
  ctrl.clear();
});

test('inc overflow ld sel', function () {
  addr.set(0xffff);
  ctrl.flick(RegAuxLines.LIC);
  addr.clear();
  addr.expect().toBe(0);

  ctrl.set(RegAuxLines.SIC);
  addr.expect().toBe(0); // overflowed
  ctrl.clear();
});
