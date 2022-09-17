import { BitValue } from '../../src/bit-value';
import { BusFactory } from '../../src/bus/bus';
import { BusGroupFactory } from '../../src/bus/bus-groups';
import { BusPartFactory } from '../../src/bus/bus-parts';
import { MemoryLines } from '../../src/bus/bus-part-lines';
import { CardFactory } from '../../src/card-factory';
import { CardPart } from '../../src/cards/card-part';
import { clearLines, setValue } from './helpers';

const bf = new BusFactory(new BusPartFactory());
const bgf = new BusGroupFactory(bf);
const cf = new CardFactory();

const card = cf.createMemory();
const bgs = bgf.createBusGroups();
card.connect(bgs.y);

const addrIn = new CardPart();
const dataIn = new CardPart();
const memCtrl = new CardPart();
bgs.y.addressBus.addressPart.connect(addrIn);
bgs.y.dataControlBus.dataPart.connect(dataIn);
bgs.y.controlYBus.memoryPart.connect(memCtrl);

const dataOut = bgs.y.dataControlBus.dataPart;

test('write read', function () {
  setValue(addrIn, 0x7ca9);
  setValue(dataIn, 0xed);
  memCtrl.value = BitValue.Zero.flipBit(MemoryLines.B2M).flipBit(MemoryLines.MEW);
  clearLines(memCtrl, dataIn);
  expect(dataOut.value.toUnsignedNumber()).toBe(0x00);
  memCtrl.value = BitValue.Zero.flipBit(MemoryLines.MER);
  expect(dataOut.value.toUnsignedNumber()).toBe(0xed);
  clearLines(memCtrl);
  expect(dataOut.value.toUnsignedNumber()).toBe(0x00);
});

test('beyond range', function () {
  setValue(addrIn, 0xeca9); // Address beyond memory
  setValue(dataIn, 0xed);
  memCtrl.value = BitValue.Zero.flipBit(MemoryLines.B2M).flipBit(MemoryLines.MEW);
  clearLines(memCtrl, dataIn);
  expect(dataOut.value.toUnsignedNumber()).toBe(0x00);
  memCtrl.value = BitValue.Zero.flipBit(MemoryLines.MER);
  expect(dataOut.value.toUnsignedNumber()).toBe(0x00); // so no value stored
  clearLines(memCtrl);
  expect(dataOut.value.toUnsignedNumber()).toBe(0x00);
});

test('disable', function () {
  setValue(addrIn, 0x7ca9);
  setValue(dataIn, 0xed);
  memCtrl.value = BitValue.Zero.flipBit(MemoryLines.B2M).flipBit(MemoryLines.MEW);
  clearLines(memCtrl, dataIn);
  expect(dataOut.value.toUnsignedNumber()).toBe(0x00);
  memCtrl.value = BitValue.Zero.flipBit(MemoryLines.MER);
  expect(dataOut.value.toUnsignedNumber()).toBe(0xed);
  card.toggleEnabled()
  expect(dataOut.value.toUnsignedNumber()).toBe(0x00);
  card.toggleEnabled()
  expect(dataOut.value.toUnsignedNumber()).toBe(0xed);
  clearLines(memCtrl);
});

test('load prog', function () {
  card.loadProgram(0x1234, [0x12, 0xab, 0xfe]);

  memCtrl.value = BitValue.Zero.flipBit(MemoryLines.MER);
  setValue(addrIn, 0x1234);
  expect(dataOut.value.toUnsignedNumber()).toBe(0x12);
  setValue(addrIn, 0x1235);
  expect(dataOut.value.toUnsignedNumber()).toBe(0xab);
  setValue(addrIn, 0x1236);
  expect(dataOut.value.toUnsignedNumber()).toBe(0xfe);
  clearLines(memCtrl);
  expect(dataOut.value.toUnsignedNumber()).toBe(0x00);
});
