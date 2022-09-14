'use strict';

import * as assert from 'assert';
import { BitValue } from '../../src/bit_value';
import { BusFactory } from '../../src/bus/bus';
import { BusGroupFactory } from '../../src/bus/bus_groups';
import { BusPartFactory } from '../../src/bus/bus_parts';
import { RegABCDLines } from '../../src/bus/bus_part_lines';
import { CardFactory } from '../../src/cards/cards';
import { CardPart } from '../../src/cards/card_part';

suite('card-register-ad', () => {

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
    dataIn.value = BitValue.fromUnsignedNumber(0xdc);
    ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RLA);
    ctrlIn.value = BitValue.Zero;
    dataIn.value = BitValue.Zero;
    assert.ok(dataOut.value.isZero);
    ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RSA);
    assert.equal(dataOut.value.toUnsignedNumber(), 0xdc);
  });

  test('ld sel D', function () {
    dataIn.value = BitValue.fromUnsignedNumber(0xbc);
    ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RLD);
    ctrlIn.value = BitValue.Zero;
    dataIn.value = BitValue.Zero;
    assert.ok(dataOut.value.isZero);
    ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RSD);
    assert.equal(dataOut.value.toUnsignedNumber(), 0xbc);
  });

  test('ld clr A', function () {
    dataIn.value = BitValue.fromUnsignedNumber(0xba);
    ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RLA);
    ctrlIn.value = BitValue.Zero;
    dataIn.value = BitValue.Zero;
    assert.ok(dataOut.value.isZero);
    ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RSA);
    assert.equal(dataOut.value.toUnsignedNumber(), 0xba);
    ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RLA);
    assert.ok(dataOut.value.isZero);
  });

  test('ld clr D', function () {
    dataIn.value = BitValue.fromUnsignedNumber(0x98);
    ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RLD);
    ctrlIn.value = BitValue.Zero;
    dataIn.value = BitValue.Zero;
    assert.ok(dataOut.value.isZero);
    ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RSD);
    assert.equal(dataOut.value.toUnsignedNumber(), 0x98);
    ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RLD);
    assert.ok(dataOut.value.isZero);
  });


});

