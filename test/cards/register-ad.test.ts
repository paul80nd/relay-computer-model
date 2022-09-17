import { BitValue } from '../../src/bit-value';
import { BusFactory } from '../../src/bus/bus';
import { BusGroupFactory } from '../../src/bus/bus-groups';
import { BusPartFactory } from '../../src/bus/bus-parts';
import { RegABCDLines } from '../../src/bus/bus-part-lines';
import { CardFactory } from '../../src/card-factory';
import { CardPart } from '../../src/cards/card-part';
import { clearLines, setValue } from './helpers';

const bf = new BusFactory(new BusPartFactory());
const bgf = new BusGroupFactory(bf);
const cf = new CardFactory();

const card = cf.createRegisterAD();
const bgs = bgf.createBusGroups();
card.connect(bgs.z);

const dataIn = new CardPart();
const ctrlIn = new CardPart();
bgs.z.dataControlBus.dataPart.connect(dataIn);
bgs.z.controlZBus.regABCDPart.connect(ctrlIn);

const dataOut = bgs.z.dataControlBus.dataPart;

test('ld sel A', function () {
  setValue(dataIn, 0xdc);
  ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RLA);
  clearLines(ctrlIn, dataIn);
  expect(dataOut.value.isZero);
  ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RSA);
  expect(dataOut.value.toUnsignedNumber()).toBe(0xdc);
});

test('ld sel D', function () {
  setValue(dataIn, 0xbc);
  ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RLD);
  clearLines(ctrlIn, dataIn);
  expect(dataOut.value.isZero);
  ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RSD);
  expect(dataOut.value.toUnsignedNumber()).toBe(0xbc);
});

test('ld clr A', function () {
  setValue(dataIn, 0xba);
  ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RLA);
  clearLines(ctrlIn, dataIn);
  expect(dataOut.value.isZero);
  ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RSA);
  expect(dataOut.value.toUnsignedNumber()).toBe(0xba);
  ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RLA);
  expect(dataOut.value.isZero);
});

test('ld clr D', function () {
  setValue(dataIn, 0x98);
  ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RLD);
  clearLines(ctrlIn, dataIn);
  expect(dataOut.value.isZero);
  ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RSD);
  expect(dataOut.value.toUnsignedNumber()).toBe(0x98);
  ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RLD);
  expect(dataOut.value.isZero);
});
