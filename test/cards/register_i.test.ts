'use strict';

import * as assert from 'assert';
import { BitValue } from '../../src/bit_value';
import { BusFactory } from '../../src/bus/bus';
import { BusGroupFactory } from '../../src/bus/bus_groups';
import { BusPartFactory } from '../../src/bus/bus_parts';
import { I2BLines, RegAuxLines } from '../../src/bus/bus_part_lines';
import { CardFactory } from '../../src/cards/cards';
import { CardPart } from '../../src/cards/card_part';

suite('card-register-i', () => {

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
    assert.equal(instrOut.value.toUnsignedNumber(), 0xdc);
  });

  test('i2b', function () {
    dataIn.value = BitValue.fromUnsignedNumber(0b01101011);
    ctrlIn.value = BitValue.Zero.flipBit(RegAuxLines.LIN);
    ctrlIn.value = BitValue.Zero;
    dataIn.value = BitValue.Zero;
    assert.equal(instrOut.value.toUnsignedNumber(), 0b01101011);
    assert.ok(dataOut.value.isZero);
    ctrlIn2.value = BitValue.Zero.flipBit(I2BLines.I2B);
    assert.equal(instrOut.value.toUnsignedNumber(), 0b01101011);
    assert.equal(dataOut.value.toUnsignedNumber(), 0b00001011);
    ctrlIn2.value = BitValue.Zero;
  });

  test('i2b sign ext', function () {
    dataIn.value = BitValue.fromUnsignedNumber(0b01011010);
    ctrlIn.value = BitValue.Zero.flipBit(RegAuxLines.LIN);
    ctrlIn.value = BitValue.Zero;
    dataIn.value = BitValue.Zero;
    assert.equal(instrOut.value.toUnsignedNumber(), 0b01011010);
    assert.ok(dataOut.value.isZero);
    ctrlIn2.value = BitValue.Zero.flipBit(I2BLines.I2B);
    assert.equal(instrOut.value.toUnsignedNumber(), 0b01011010);
    assert.equal(dataOut.value.toUnsignedNumber(), 0b11111010);
    ctrlIn2.value = BitValue.Zero;
  });

});
