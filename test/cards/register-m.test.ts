import { BitValue } from '../../src/bit-value';
import { BusFactory } from '../../src/bus/bus';
import { BusGroupFactory } from '../../src/bus/bus-groups';
import { BusPartFactory } from '../../src/bus/bus-parts';
import { RegJMXYLines } from '../../src/bus/bus-part-lines';
import { CardFactory } from '../../src/card-factory';
import { CardPart } from '../../src/cards/card-part';
import { clearLines, setValue } from './helpers';

const bf = new BusFactory(new BusPartFactory());
const bgf = new BusGroupFactory(bf);
const cf = new CardFactory();

const card = cf.createRegisterM();
const bgs = bgf.createBusGroups();
card.connect(bgs.y);

const addrIn = new CardPart();
const dataIn = new CardPart();
const ctrlIn = new CardPart();
bgs.y.addressBus.addressPart.connect(addrIn);
bgs.y.dataControlBus.dataPart.connect(dataIn);
bgs.y.controlYBus.regJMXYPart.connect(ctrlIn);

const addrOut = bgs.y.addressBus.addressPart;
const dataOut = bgs.y.dataControlBus.dataPart;

test('ld sel M1', function () {
  setValue(dataIn, 0xdc);
  ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.LM1);
  clearLines(ctrlIn);
  dataIn.value = BitValue.Zero;
  expect(dataOut.value.isZero);
  ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.SM1);
  expect(dataOut.value.toUnsignedNumber()).toBe(0xdc);
  clearLines(ctrlIn);
});

test('ld sel M2', function () {
  setValue(dataIn, 0xbc);
  ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.LM2);
  clearLines(ctrlIn);
  dataIn.value = BitValue.Zero;
  expect(dataOut.value.isZero);
  ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.SM2);
  expect(dataOut.value.toUnsignedNumber()).toBe(0xbc);
  clearLines(ctrlIn);
});

test('ld clr M1', function () {
  setValue(dataIn, 0xba);
  ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.LM1);
  clearLines(ctrlIn);
  dataIn.value = BitValue.Zero;
  expect(dataOut.value.isZero);
  ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.SM1);
  expect(dataOut.value.toUnsignedNumber()).toBe(0xba);
  ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.LM1);
  expect(dataOut.value.isZero);
});

test('ld clr M2', function () {
  setValue(dataIn, 0x98);
  ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.LM2);
  clearLines(ctrlIn);
  dataIn.value = BitValue.Zero;
  expect(dataOut.value.isZero);
  ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.SM2);
  expect(dataOut.value.toUnsignedNumber()).toBe(0x98);
  ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.LM2);
  expect(dataOut.value.isZero);
});

test('ld M1 M2 sel M', function () {
  setValue(dataIn, 0xab);
  ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.LM1);
  clearLines(ctrlIn);
  dataIn.value = BitValue.Zero;

  setValue(dataIn, 0xcd);
  ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.LM2);
  clearLines(ctrlIn);
  dataIn.value = BitValue.Zero;

  expect(addrOut.value.isZero);
  ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.SEM);
  expect(addrOut.value.toUnsignedNumber()).toBe(0xabcd);
  clearLines(ctrlIn);
});
