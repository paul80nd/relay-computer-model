'use strict';

import { BitValue } from '../../src/bit-value';
import { BusFactory } from '../../src/bus/bus';
import { BusGroupFactory } from '../../src/bus/bus-groups';
import { BusPartFactory } from '../../src/bus/bus-parts';
import { I2BLines, RegAuxLines } from '../../src/bus/bus-part-lines';
import { CardFactory } from '../../src/card-factory';
import { CardPart } from '../../src/cards/card-part';

const bf = new BusFactory(new BusPartFactory());
const bgf = new BusGroupFactory(bf);
const cf = new CardFactory();

const card = cf.createRegisterI();
const bgs = bgf.createBusGroups();
card.connect(bgs.x);

const dataIn = new CardPart();
const ctrlIn = new CardPart();
const ctrlIn2 = new CardPart();
bgs.x.dataInstructionBus.dataPart.connect(dataIn);
bgs.x.controlXBus.auxRegisterPart.connect(ctrlIn);
bgs.x.controlXBus.i2bPart.connect(ctrlIn2);

const instrOut = bgs.x.dataInstructionBus.instructionPart;
const dataOut = bgs.x.dataInstructionBus.dataPart;

test('lin', function () {
  dataIn.value = BitValue.fromUnsignedNumber(0xdc);
  ctrlIn.value = BitValue.Zero.flipBit(RegAuxLines.LIN);
  ctrlIn.value = BitValue.Zero;
  dataIn.value = BitValue.Zero;
  expect(instrOut.value.toUnsignedNumber()).toBe(0xdc);
});

test('i2b', function () {
  dataIn.value = BitValue.fromUnsignedNumber(0b01101011);
  ctrlIn.value = BitValue.Zero.flipBit(RegAuxLines.LIN);
  ctrlIn.value = BitValue.Zero;
  dataIn.value = BitValue.Zero;
  expect(instrOut.value.toUnsignedNumber()).toBe(0b01101011);
  expect(dataOut.value.isZero);
  ctrlIn2.value = BitValue.Zero.flipBit(I2BLines.I2B);
  expect(instrOut.value.toUnsignedNumber()).toBe(0b01101011);
  expect(dataOut.value.toUnsignedNumber()).toBe(0b00001011);
  ctrlIn2.value = BitValue.Zero;
});

test('i2b sign ext', function () {
  dataIn.value = BitValue.fromUnsignedNumber(0b01011010);
  ctrlIn.value = BitValue.Zero.flipBit(RegAuxLines.LIN);
  ctrlIn.value = BitValue.Zero;
  dataIn.value = BitValue.Zero;
  expect(instrOut.value.toUnsignedNumber()).toBe(0b01011010);
  expect(dataOut.value.isZero);
  ctrlIn2.value = BitValue.Zero.flipBit(I2BLines.I2B);
  expect(instrOut.value.toUnsignedNumber()).toBe(0b01011010);
  expect(dataOut.value.toUnsignedNumber()).toBe(0b11111010);
  ctrlIn2.value = BitValue.Zero;
});
