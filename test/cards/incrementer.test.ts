'use strict';

import { BitValue } from '../../src/bit-value';
import { BusFactory } from '../../src/bus/bus';
import { BusGroupFactory } from '../../src/bus/bus-groups';
import { BusPartFactory } from '../../src/bus/bus-parts';
import { RegAuxLines } from '../../src/bus/bus-part-lines';
import { CardFactory } from '../../src/card-factory';
import { CardPart } from '../../src/cards/card-part';

const bf = new BusFactory(new BusPartFactory());
const bgf = new BusGroupFactory(bf);
const cf = new CardFactory();

const card = cf.createIncrementer();
const bgs = bgf.createBusGroups();
card.connect(bgs.x);

const addrIn = new CardPart();
const ctrlIn = new CardPart();
bgs.x.addressBus.addressPart.connect(addrIn);
bgs.x.controlXBus.auxRegisterPart.connect(ctrlIn);

const addrOut = bgs.y.addressBus.addressPart;

test('inc ld sel', function () {
  addrIn.value = BitValue.fromUnsignedNumber(0xabcd);
  ctrlIn.value = BitValue.Zero.flipBit(RegAuxLines.LIC);
  ctrlIn.value = BitValue.Zero;
  addrIn.value = BitValue.Zero;

  expect(addrOut.value.isZero);
  ctrlIn.value = BitValue.Zero.flipBit(RegAuxLines.SIC);
  expect(addrOut.value.toUnsignedNumber()).toBe(0xabce); // one higher
  ctrlIn.value = BitValue.Zero;
});

test('inc overflow ld sel', function () {
  addrIn.value = BitValue.fromUnsignedNumber(0xffff);
  ctrlIn.value = BitValue.Zero.flipBit(RegAuxLines.LIC);
  ctrlIn.value = BitValue.Zero;
  addrIn.value = BitValue.Zero;

  expect(addrOut.value.isZero);
  ctrlIn.value = BitValue.Zero.flipBit(RegAuxLines.SIC);
  expect(addrOut.value.toUnsignedNumber()).toBe(0x0); // overflowed
  ctrlIn.value = BitValue.Zero;
});
