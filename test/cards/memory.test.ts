import { MemoryLines } from '../../src/bus/bus-part-lines';
import { LinesPart, TestFactory, ValuePart } from './helpers';

const addr = new ValuePart;
const ctrl = new LinesPart;
const data = new ValuePart;

const { cf, bgs } = TestFactory.Deps;
const card = cf.createMemory();
card.connect(bgs.y);
addr.connectOn(bgs.y.addressBus.addressPart);
ctrl.connectOn(bgs.y.controlYBus.memoryPart);
data.connectOn(bgs.y.dataControlBus.dataPart);

test('write read', function () {
  addr.set(0x7ca9);
  data.set(0xed);
  ctrl.flick(MemoryLines.B2M, MemoryLines.MEW);
  data.clear();
  data.expect().toBe(0);

  ctrl.set(MemoryLines.MER);
  data.expect().toBe(0xed);

  ctrl.clear();
  data.expect().toBe(0);
});

test('beyond range', function () {
  addr.set(0xeca9); // Address beyond memory
  data.set(0xed);
  ctrl.flick(MemoryLines.B2M, MemoryLines.MEW);
  data.clear();
  data.expect().toBe(0);

  ctrl.set(MemoryLines.MER);
  data.expect().toBe(0); // so no value stored

  ctrl.clear();
  data.expect().toBe(0);
});

test('disable', function () {
  addr.set(0x7ca9);
  data.set(0xed);
  ctrl.flick(MemoryLines.B2M, MemoryLines.MEW);
  data.clear();
  data.expect().toBe(0);

  ctrl.set(MemoryLines.MER);
  data.expect().toBe(0xed);

  card.toggleEnabled()
  data.expect().toBe(0);

  card.toggleEnabled()
  data.expect().toBe(0xed);

  ctrl.clear();
});

test('load prog', function () {
  card.loadProgram(0x1234, [0x12, 0xab, 0xfe]);

  ctrl.set(MemoryLines.MER);
  addr.set(0x1234);
  data.expect().toBe(0x12);

  addr.set(0x1235);
  data.expect().toBe(0xab);

  addr.set(0x1236);
  data.expect().toBe(0xfe);

  ctrl.clear();
  data.expect().toBe(0x00);
});
