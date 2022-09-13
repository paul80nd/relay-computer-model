'use strict';

import * as assert from 'assert';
import { BitValue } from '../../src/bit_value';
import { BusFactory } from '../../src/bus/bus';
import { BusGroupFactory } from '../../src/bus/bus_groups';
import { BusPartFactory } from '../../src/bus/bus_parts';
import { RegJMXYLines } from '../../src/bus/bus_part_lines';
import { CardFactory } from '../../src/cards';
import { CardPart } from '../../src/cards/card_part';

suite('card-register-xy', () => {

  const bf = new BusFactory(new BusPartFactory());
  const bgf = new BusGroupFactory(bf);
  const cf = new CardFactory();

  const card = cf.createRegisterXY();
  const bgs = bgf.createBusGroups();
  card.connect(bgs.y);

  const dataIn = new CardPart();
  const ctrlIn = new CardPart();
  bgs.y.dataControlBus.dataPart.connect(dataIn);
  bgs.y.controlYBus.regJMXYPart.connect(ctrlIn);

  const dataOut = bgs.z.dataControlBus.dataPart;

  test('ld sel X', function () {
    dataIn.value = BitValue.fromUnsignedNumber(0xdc);
    ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.LDX);
    ctrlIn.value = BitValue.Zero;
    dataIn.value = BitValue.Zero;
    assert.ok(dataOut.value.isZero);
    ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.SEX);
    assert.equal(dataOut.value.toUnsignedNumber(), 0xdc);
    ctrlIn.value = BitValue.Zero;
  });

  test('ld sel Y', function () {
    dataIn.value = BitValue.fromUnsignedNumber(0xbc);
    ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.LDY);
    ctrlIn.value = BitValue.Zero;
    dataIn.value = BitValue.Zero;
    assert.ok(dataOut.value.isZero);
    ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.SEY);
    assert.equal(dataOut.value.toUnsignedNumber(), 0xbc);
    ctrlIn.value = BitValue.Zero;
  });

  test('ld clr X', function () {
    dataIn.value = BitValue.fromUnsignedNumber(0xba);
    ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.LDX);
    ctrlIn.value = BitValue.Zero;
    dataIn.value = BitValue.Zero;
    assert.ok(dataOut.value.isZero);
    ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.SEX);
    assert.equal(dataOut.value.toUnsignedNumber(), 0xba);
    ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.LDX);
    assert.ok(dataOut.value.isZero);
  });

  test('ld clr Y', function () {
    dataIn.value = BitValue.fromUnsignedNumber(0x98);
    ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.LDY);
    ctrlIn.value = BitValue.Zero;
    dataIn.value = BitValue.Zero;
    assert.ok(dataOut.value.isZero);
    ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.SEY);
    assert.equal(dataOut.value.toUnsignedNumber(), 0x98);
    ctrlIn.value = BitValue.Zero.flipBit(RegJMXYLines.LDY);
    assert.ok(dataOut.value.isZero);
  });

});

