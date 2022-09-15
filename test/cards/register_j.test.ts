'use strict';

import * as assert from 'assert';
import { BitValue } from '../../src/bit-value';
import { BusFactory } from '../../src/bus/bus';
import { BusGroupFactory } from '../../src/bus/bus-groups';
import { BusPartFactory } from '../../src/bus/bus-parts';
import { RegJMXYLines } from '../../src/bus/bus-part-lines';
import { CardFactory } from '../../src/card-factory';
import { CardPart } from '../../src/cards/card-part';

suite('card-register-j', () => {

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
  const dataOut = bgs.y.dataControlBus.dataPart;

  test('ld J1 J1 sel J', function () {
    dataIn.value = BitValue.fromUnsignedNumber(0xab);
    ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.LJ1);
    ctrlIn.value = BitValue.Zero;
    dataIn.value = BitValue.Zero;

    dataIn.value = BitValue.fromUnsignedNumber(0xcd);
    ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.LJ2);
    ctrlIn.value = BitValue.Zero;
    dataIn.value = BitValue.Zero;

    assert.ok(addrOut.value.isZero);
    ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.SEJ);
    assert.equal(addrOut.value.toUnsignedNumber(), 0xabcd);
    ctrlIn.value = BitValue.Zero;
  });

});

