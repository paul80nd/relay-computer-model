'use strict';

import * as assert from 'assert';
import { BitValue } from '../../src/bit_value';
import { BusFactory } from '../../src/bus/bus';
import { BusGroupFactory } from '../../src/bus/bus_groups';
import { BusPartFactory } from '../../src/bus/bus_parts';
import { RegABCDLines } from '../../src/bus/bus_part_lines';
import { CardFactory } from '../../src/card_factory';
import { CardPart } from '../../src/cards/card_part';

suite('card-register-bc', () => {

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
    assert.ok(dataOut.value.isZero);
    ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RSB);
    assert.equal(dataOut.value.toUnsignedNumber(), 0xdc);
  });

  test('ld sel C', function () {
    dataIn.value = BitValue.fromUnsignedNumber(0xbc);
    ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RLC);
    ctrlIn.value = BitValue.Zero;
    dataIn.value = BitValue.Zero;
    assert.ok(dataOut.value.isZero);
    ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RSC);
    assert.equal(dataOut.value.toUnsignedNumber(), 0xbc);
  });

  test('ld clr B', function () {
    dataIn.value = BitValue.fromUnsignedNumber(0xba);
    ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RLB);
    ctrlIn.value = BitValue.Zero;
    dataIn.value = BitValue.Zero;
    assert.ok(dataOut.value.isZero);
    ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RSB);
    assert.equal(dataOut.value.toUnsignedNumber(), 0xba);
    ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RLB);
    assert.ok(dataOut.value.isZero);
  });

  test('ld clr C', function () {
    dataIn.value = BitValue.fromUnsignedNumber(0x98);
    ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RLC);
    ctrlIn.value = BitValue.Zero;
    dataIn.value = BitValue.Zero;
    assert.ok(dataOut.value.isZero);
    ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RSC);
    assert.equal(dataOut.value.toUnsignedNumber(), 0x98);
    ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RLC);
    assert.ok(dataOut.value.isZero);
  });

  test('ld sel B bus', function () {
    dataIn.value = BitValue.fromUnsignedNumber(0xdc);
    ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RLB);
    ctrlIn.value = BitValue.Zero;
    dataIn.value = BitValue.Zero;
    assert.ok(bOut.value.isZero);
    ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RSB);
    assert.equal(bOut.value.toUnsignedNumber(), 0xdc);
  });

  test('ld sel C bus', function () {
    dataIn.value = BitValue.fromUnsignedNumber(0xbc);
    ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RLC);
    ctrlIn.value = BitValue.Zero;
    dataIn.value = BitValue.Zero;
    assert.ok(cOut.value.isZero);
    ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RSC);
    assert.equal(cOut.value.toUnsignedNumber(), 0xbc);
  });

  test('ld clr B bus', function () {
    dataIn.value = BitValue.fromUnsignedNumber(0xba);
    ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RLB);
    ctrlIn.value = BitValue.Zero;
    dataIn.value = BitValue.Zero;
    assert.ok(bOut.value.isZero);
    ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RSB);
    assert.equal(bOut.value.toUnsignedNumber(), 0xba);
    ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RLB);
    assert.ok(bOut.value.isZero);
  });

  test('ld clr C bus', function () {
    dataIn.value = BitValue.fromUnsignedNumber(0x98);
    ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RLC);
    ctrlIn.value = BitValue.Zero;
    dataIn.value = BitValue.Zero;
    assert.ok(cOut.value.isZero);
    ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RSC);
    assert.equal(cOut.value.toUnsignedNumber(), 0x98);
    ctrlIn.value = BitValue.Zero.flipBit(RegABCDLines.RLC);
    assert.ok(cOut.value.isZero);
  });

});

