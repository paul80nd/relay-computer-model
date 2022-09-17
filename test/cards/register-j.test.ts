'use strict';

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

const card = cf.createRegisterJ();
const bgs = bgf.createBusGroups();
card.connect(bgs.y);

const addrIn = new CardPart();
const dataIn = new CardPart();
const ctrlIn = new CardPart();
bgs.y.addressBus.addressPart.connect(addrIn);
bgs.y.dataControlBus.dataPart.connect(dataIn);
bgs.y.controlYBus.regJMXYPart.connect(ctrlIn);

const addrOut = bgs.y.addressBus.addressPart;

test('ld J1 J1 sel J', function () {
  setValue(dataIn, 0xab);
  ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.LJ1);
  clearLines(ctrlIn);
  dataIn.value = BitValue.Zero;

  setValue(dataIn, 0xcd);
  ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.LJ2);
  clearLines(ctrlIn);
  dataIn.value = BitValue.Zero;

  expect(addrOut.value.isZero);
  ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.SEJ);
  expect(addrOut.value.toUnsignedNumber()).toBe(0xabcd);
  clearLines(ctrlIn);
});
