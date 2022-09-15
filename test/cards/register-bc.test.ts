'use strict';

import { BitValue } from '../../src/bit-value';
import { BusFactory } from '../../src/bus/bus';
import { BusGroupFactory } from '../../src/bus/bus-groups';
import { BusPartFactory } from '../../src/bus/bus-parts';
import { RegABCDLines } from '../../src/bus/bus-part-lines';
import { CardFactory } from '../../src/card-factory';
import { CardPart } from '../../src/cards/card-part';

const bf = new BusFactory(new BusPartFactory());
const bgf = new BusGroupFactory(bf);
const cf = new CardFactory();

const card = cf.createRegisterBC();
const bgs = bgf.createBusGroups();
card.connect(bgs.z);

const dataIn = new CardPart();
const ctrlIn = new CardPart();
bgs.z.dataControlBus.dataPart.connect(dataIn);
bgs.z.controlZBus.regABCDPart.connect(ctrlIn);

const dataOut = bgs.z.dataControlBus.dataPart;
const bOut = bgs.z.registerBCBus.registerBPart;
const cOut = bgs.z.registerBCBus.registerCPart;

test('ld sel B', function () {
  dataIn.value = BitValue.fromUnsignedNumber(0xdc);
  ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RLB);
  ctrlIn.value = BitValue.Zero;
  dataIn.value = BitValue.Zero;
  expect(dataOut.value.isZero);
  ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RSB);
  expect(dataOut.value.toUnsignedNumber()).toBe(0xdc);
});

test('ld sel C', function () {
  dataIn.value = BitValue.fromUnsignedNumber(0xbc);
  ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RLC);
  ctrlIn.value = BitValue.Zero;
  dataIn.value = BitValue.Zero;
  expect(dataOut.value.isZero);
  ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RSC);
  expect(dataOut.value.toUnsignedNumber()).toBe(0xbc);
});

test('ld clr B', function () {
  dataIn.value = BitValue.fromUnsignedNumber(0xba);
  ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RLB);
  ctrlIn.value = BitValue.Zero;
  dataIn.value = BitValue.Zero;
  expect(dataOut.value.isZero);
  ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RSB);
  expect(dataOut.value.toUnsignedNumber()).toBe(0xba);
  ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RLB);
  expect(dataOut.value.isZero);
});

test('ld clr C', function () {
  dataIn.value = BitValue.fromUnsignedNumber(0x98);
  ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RLC);
  ctrlIn.value = BitValue.Zero;
  dataIn.value = BitValue.Zero;
  expect(dataOut.value.isZero);
  ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RSC);
  expect(dataOut.value.toUnsignedNumber()).toBe(0x98);
  ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RLC);
  expect(dataOut.value.isZero);
});

test('ld sel B bus', function () {
  dataIn.value = BitValue.fromUnsignedNumber(0xdc);
  ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RLB);
  ctrlIn.value = BitValue.Zero;
  dataIn.value = BitValue.Zero;
  expect(bOut.value.isZero);
  ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RSB);
  expect(bOut.value.toUnsignedNumber()).toBe(0xdc);
});

test('ld sel C bus', function () {
  dataIn.value = BitValue.fromUnsignedNumber(0xbc);
  ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RLC);
  ctrlIn.value = BitValue.Zero;
  dataIn.value = BitValue.Zero;
  expect(cOut.value.isZero);
  ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RSC);
  expect(cOut.value.toUnsignedNumber()).toBe(0xbc);
});

test('ld clr B bus', function () {
  dataIn.value = BitValue.fromUnsignedNumber(0xba);
  ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RLB);
  ctrlIn.value = BitValue.Zero;
  dataIn.value = BitValue.Zero;
  expect(bOut.value.isZero);
  ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RSB);
  expect(bOut.value.toUnsignedNumber()).toBe(0xba);
  ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RLB);
  expect(bOut.value.isZero);
});

test('ld clr C bus', function () {
  dataIn.value = BitValue.fromUnsignedNumber(0x98);
  ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RLC);
  ctrlIn.value = BitValue.Zero;
  dataIn.value = BitValue.Zero;
  expect(cOut.value.isZero);
  ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RSC);
  expect(cOut.value.toUnsignedNumber()).toBe(0x98);
  ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RLC);
  expect(cOut.value.isZero);
});
