'use strict';

import { BitValue } from '../../src/bit-value';
import { BusFactory } from '../../src/bus/bus';
import { BusGroupFactory } from '../../src/bus/bus-groups';
import { BusPartFactory } from '../../src/bus/bus-parts';
import { RegJMXYLines } from '../../src/bus/bus-part-lines';
import { CardFactory } from '../../src/card-factory';
import { CardPart } from '../../src/cards/card-part';

const bf = new BusFactory(new BusPartFactory());
const bgf = new BusGroupFactory(bf);
const cf = new CardFactory();

const card = cf.createRegisterXY();
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

test('ld sel X', function () {
  dataIn.value = BitValue.fromUnsignedNumber(0xdc);
  ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.LDX);
  ctrlIn.value = BitValue.Zero;
  dataIn.value = BitValue.Zero;
  expect(dataOut.value.isZero);
  ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.SEX);
  expect(dataOut.value.toUnsignedNumber()).toBe(0xdc);
  ctrlIn.value = BitValue.Zero;
});

test('ld sel Y', function () {
  dataIn.value = BitValue.fromUnsignedNumber(0xbc);
  ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.LDY);
  ctrlIn.value = BitValue.Zero;
  dataIn.value = BitValue.Zero;
  expect(dataOut.value.isZero);
  ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.SEY);
  expect(dataOut.value.toUnsignedNumber()).toBe(0xbc);
  ctrlIn.value = BitValue.Zero;
});

test('ld sel XY', function () {
  addrIn.value = BitValue.fromUnsignedNumber(0xabcd);
  ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.LXY);
  ctrlIn.value = BitValue.Zero;
  addrIn.value = BitValue.Zero;
  expect(addrOut.value.isZero);
  ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.SXY);
  expect(addrOut.value.toUnsignedNumber()).toBe(0xabcd);
  ctrlIn.value = BitValue.Zero;
});

test('ld clr X', function () {
  dataIn.value = BitValue.fromUnsignedNumber(0xba);
  ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.LDX);
  ctrlIn.value = BitValue.Zero;
  dataIn.value = BitValue.Zero;
  expect(dataOut.value.isZero);
  ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.SEX);
  expect(dataOut.value.toUnsignedNumber()).toBe(0xba);
  ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.LDX);
  expect(dataOut.value.isZero);
});

test('ld clr Y', function () {
  dataIn.value = BitValue.fromUnsignedNumber(0x98);
  ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.LDY);
  ctrlIn.value = BitValue.Zero;
  dataIn.value = BitValue.Zero;
  expect(dataOut.value.isZero);
  ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.SEY);
  expect(dataOut.value.toUnsignedNumber()).toBe(0x98);
  ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.LDY);
  expect(dataOut.value.isZero);
});

test('ld clr XY', function () {
  addrIn.value = BitValue.fromUnsignedNumber(0x9876);
  ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.LXY);
  ctrlIn.value = BitValue.Zero;
  addrIn.value = BitValue.Zero;
  expect(addrOut.value.isZero);
  ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.SXY);
  expect(addrOut.value.toUnsignedNumber()).toBe(0x9876);
  ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.LXY);
  expect(addrOut.value.isZero);
});

test('ld X Y sel XY', function () {
  dataIn.value = BitValue.fromUnsignedNumber(0xab);
  ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.LDX);
  ctrlIn.value = BitValue.Zero;
  dataIn.value = BitValue.Zero;

  dataIn.value = BitValue.fromUnsignedNumber(0xcd);
  ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.LDY);
  ctrlIn.value = BitValue.Zero;
  dataIn.value = BitValue.Zero;

  expect(addrOut.value.isZero);
  ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.SXY);
  expect(addrOut.value.toUnsignedNumber()).toBe(0xabcd);
  ctrlIn.value = BitValue.Zero;
});

test('ld XY sel X Y', function () {
  addrIn.value = BitValue.fromUnsignedNumber(0xfedc);
  ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.LXY);
  ctrlIn.value = BitValue.Zero;
  addrIn.value = BitValue.Zero;

  expect(dataOut.value.isZero);
  ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.SEX);
  expect(dataOut.value.toUnsignedNumber()).toBe(0xfe);
  ctrlIn.value = BitValue.Zero;

  expect(dataOut.value.isZero);
  ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.SEY);
  expect(dataOut.value.toUnsignedNumber()).toBe(0xdc);
  ctrlIn.value = BitValue.Zero;
});
