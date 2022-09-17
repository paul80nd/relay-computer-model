import { BusFactory } from '../../src/bus/bus';
import { BusGroupFactory } from '../../src/bus/bus-groups';
import { BusPartFactory } from '../../src/bus/bus-parts';
import { MemoryLines, PulseLines, RegAuxLines } from '../../src/bus/bus-part-lines';
import { CardFactory } from '../../src/card-factory';
import { CardPart } from '../../src/cards/card-part';
import { expectPart, setLines } from './helpers';

const bf = new BusFactory(new BusPartFactory());
const bgf = new BusGroupFactory(bf);
const cf = new CardFactory();

const card = cf.createControl();
const bgs = bgf.createBusGroups();
card.connect(bgs.w);

const pulseIn = new CardPart();
bgs.w.pulseBus.pulsePart.connect(pulseIn);

const xbus = bgs.w.controlXBus;
const ybus = bgs.w.controlYBus;

test('fetch inc cycle A', function () {
  setLines(pulseIn, PulseLines.A);
  expectPart(xbus.auxRegisterPart).hasLinesSet(RegAuxLines.SPC);
  expectPart(ybus.memoryPart).hasLinesSet(MemoryLines.MER);
});

test('fetch inc cycle B', function () {
  setLines(pulseIn, PulseLines.B);
  expectPart(xbus.auxRegisterPart).hasLinesSet(RegAuxLines.LIC, RegAuxLines.LIN);
  expectPart(ybus.memoryPart).hasLinesSet();
});

test('fetch inc cycle C', function () {
  setLines(pulseIn, PulseLines.C);
  expectPart(xbus.auxRegisterPart).hasLinesSet(RegAuxLines.SIC);
  expectPart(ybus.memoryPart).hasLinesSet();
});

test('fetch inc cycle D', function () {
  setLines(pulseIn, PulseLines.D);
  expectPart(xbus.auxRegisterPart).hasLinesSet(RegAuxLines.LPC);
  expectPart(ybus.memoryPart).hasLinesSet();
});
