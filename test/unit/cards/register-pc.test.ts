import { RegAuxLines } from '../../../src/bus/bus-part-lines';
import { LinesPart, TestFactory, ValuePart } from './helpers';

const addr = new ValuePart;
const ctrl = new LinesPart;

const { cf, bgs } = TestFactory.Deps;
const card = cf.createRegisterPC();
card.connect(bgs.x);
addr.connectOn(bgs.x.addressBus.addressPart);
ctrl.connectOn(bgs.x.controlXBus.auxRegisterPart);

test('ld sel', function () {
  addr.set(0xdcba);
  ctrl.flick(RegAuxLines.LPC);
  addr.clear();
  addr.expect().toBe(0);
  ctrl.set(RegAuxLines.SPC);
  addr.expect().toBe(0xdcba);
});

test('ld clr', function () {
  addr.set(0xabcd);
  ctrl.flick(RegAuxLines.LPC);
  addr.clear();
  addr.expect().toBe(0);
  ctrl.set(RegAuxLines.SPC);
  addr.expect().toBe(0xabcd);
  ctrl.set(RegAuxLines.LPC);
  addr.expect().toBe(0);
});
