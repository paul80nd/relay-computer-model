'use strict';

import * as assert from 'assert';
import { BitValue } from '../../src/bit-value';
import { BusFactory } from '../../src/bus/bus';
import { BusGroupFactory } from '../../src/bus/bus-groups';
import { BusPartFactory } from '../../src/bus/bus-parts';
import { OperationLines } from '../../src/bus/bus-part-lines';
import { CardFactory } from '../../src/card-factory';
import { CardPart } from '../../src/cards/card-part';

suite('card-decoder', () => {

  const bf = new BusFactory(new BusPartFactory());
  const bgf = new BusGroupFactory(bf);
  const cf = new CardFactory();

  const card = cf.createDecoder();
  const bgs = bgf.createBusGroups();
  card.connect(bgs.w);

  const cpip = new CardPart();
  bgs.w.controlInstructionBus.instructionPart.connect(cpip);

  const cpop = bgs.w.operationBus.operationPart;

  test('goto', function () {
    cpip.value = BitValue.fromUnsignedNumber(0b11000000);
    assert.ok(cpop.value.bit(OperationLines.IGTO));
  });

  test('alu', function () {
    cpip.value = BitValue.fromUnsignedNumber(0b10000000);
    assert.ok(cpop.value.bit(OperationLines.IALU));
  });

  test('alu', function () {
    cpip.value = BitValue.fromUnsignedNumber(0b01000000);
    assert.ok(cpop.value.bit(OperationLines.ISET));
  });

  test('mov8', function () {
    cpip.value = BitValue.fromUnsignedNumber(0b00000000);
    assert.ok(cpop.value.bit(OperationLines.IMV8));
  });

  test('sequence', function () {
    cpip.value = BitValue.fromUnsignedNumber(0b01000000);
    cpip.value = BitValue.fromUnsignedNumber(0b00000000);
    cpip.value = BitValue.fromUnsignedNumber(0b10000000);
    assert.ok(!cpop.value.bit(OperationLines.ISET));
    assert.ok(!cpop.value.bit(OperationLines.IMV8));
    assert.ok(cpop.value.bit(OperationLines.IALU));
  });

});
