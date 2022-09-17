import { BusFactory } from '../../src/bus/bus';
import { BusGroupFactory } from '../../src/bus/bus-groups';
import { BusPartFactory } from '../../src/bus/bus-parts';
import { OperationLines } from '../../src/bus/bus-part-lines';
import { CardFactory } from '../../src/card-factory';
import { CardPart } from '../../src/cards/card-part';
import { setValue } from './helpers';

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
  setValue(cpip,0b11000000);
  expect(cpop.value.bit(OperationLines.IGTO));
});

test('alu', function () {
  setValue(cpip,0b10000000);
  expect(cpop.value.bit(OperationLines.IALU));
});

test('alu', function () {
  setValue(cpip,0b01000000);
  expect(cpop.value.bit(OperationLines.ISET));
});

test('mov8', function () {
  setValue(cpip,0b00000000);
  expect(cpop.value.bit(OperationLines.IMV8));
});

test('sequence', function () {
  setValue(cpip,0b01000000);
  setValue(cpip,0b00000000);
  setValue(cpip,0b10000000);
  expect(!cpop.value.bit(OperationLines.ISET));
  expect(!cpop.value.bit(OperationLines.IMV8));
  expect(cpop.value.bit(OperationLines.IALU));
});

