'use strict';

import * as assert from 'assert';
import { BitValue } from '../../src/bit-value';
import { BusFactory } from '../../src/bus/bus';
import { BusGroupFactory } from '../../src/bus/bus-groups';
import { BusPartFactory } from '../../src/bus/bus-parts';
import { RegAuxLines } from '../../src/bus/bus-part-lines';
import { CardFactory } from '../../src/card-factory';
import { CardPart } from '../../src/cards/card-part';

suite('card-register-pc', () => {

  const bf = new BusFactory(new BusPartFactory());
  const bgf = new BusGroupFactory(bf);
  const cf = new CardFactory();

  const card = cf.createRegisterPC();
  const bgs = bgf.createBusGroups();
  card.connect(bgs.x);

  const addrIn = new CardPart();
  const ctrlIn = new CardPart();
  bgs.x.addressBus.addressPart.connect(addrIn);
  bgs.x.controlXBus.auxRegisterPart.connect(ctrlIn);

  const addrOut = bgs.x.addressBus.addressPart;

  test('ld sel', function () {
    addrIn.value = BitValue.fromUnsignedNumber(0xdcba);
    ctrlIn.value = BitValue.Zero.flipBit(RegAuxLines.LPC);
    ctrlIn.value = BitValue.Zero;
    addrIn.value = BitValue.Zero;
    assert.ok(addrOut.value.isZero);
    ctrlIn.value = BitValue.Zero.flipBit(RegAuxLines.SPC);
    assert.equal(addrOut.value.toUnsignedNumber(), 0xdcba);
  });

  test('ld clr', function () {
    addrIn.value = BitValue.fromUnsignedNumber(0xabcd);
    ctrlIn.value = BitValue.Zero.flipBit(RegAuxLines.LPC);
    ctrlIn.value = BitValue.Zero;
    addrIn.value = BitValue.Zero;
    assert.ok(addrOut.value.isZero);
    ctrlIn.value = BitValue.Zero.flipBit(RegAuxLines.SPC);
    assert.equal(addrOut.value.toUnsignedNumber(), 0xabcd);
    ctrlIn.value = BitValue.Zero.flipBit(RegAuxLines.LPC);
    assert.ok(addrOut.value.isZero);
  });

});

