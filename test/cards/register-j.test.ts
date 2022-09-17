import { RegJMXYLines } from '../../src/bus/bus-part-lines';
import { LinesPart, TestFactory, ValuePart } from './helpers';

const addr = new ValuePart;
const data = new ValuePart;
const ctrl = new LinesPart;

const { cf, bgs } = TestFactory.Deps;
const card = cf.createRegisterJ();
card.connect(bgs.y);
addr.connectOn(bgs.y.addressBus.addressPart);
data.connectOn(bgs.y.dataControlBus.dataPart)
ctrl.connectOn(bgs.y.controlYBus.regJMXYPart);

test('ld J1 J1 sel J', function () {
  data.set(0xab);
  ctrl.flick(RegJMXYLines.LJ1);
  data.clear();

  data.set(0xcd);
  ctrl.flick(RegJMXYLines.LJ2);
  data.clear();

  addr.expect().toBe(0);
  ctrl.set(RegJMXYLines.SEJ);
  addr.expect().toBe(0xabcd);
  ctrl.clear();
});
