import { MemoryLines, PulseLines, RegAuxLines } from '../../src/bus/bus-part-lines';
import { expectPart, LinesPart, TestFactory } from './helpers';

const pulse = new LinesPart;

const { cf, bgs } = TestFactory.Deps;
const card = cf.createControl();
card.connect(bgs.w);
pulse.connectOn(bgs.w.pulseBus.pulsePart);

const xbus = bgs.w.controlXBus;
const ybus = bgs.w.controlYBus;

test('fetch inc cycle A', function () {
  pulse.set(PulseLines.A);
  expectPart(xbus.auxRegisterPart).hasLinesSet(RegAuxLines.SPC);
  expectPart(ybus.memoryPart).hasLinesSet(MemoryLines.MER);
});

test('fetch inc cycle B', function () {
  pulse.set(PulseLines.B);
  expectPart(xbus.auxRegisterPart).hasLinesSet(RegAuxLines.LIC, RegAuxLines.LIN);
  expectPart(ybus.memoryPart).hasLinesSet();
});

test('fetch inc cycle C', function () {
  pulse.set(PulseLines.C);
  expectPart(xbus.auxRegisterPart).hasLinesSet(RegAuxLines.SIC);
  expectPart(ybus.memoryPart).hasLinesSet();
});

test('fetch inc cycle D', function () {
  pulse.set(PulseLines.D);
  expectPart(xbus.auxRegisterPart).hasLinesSet(RegAuxLines.LPC);
  expectPart(ybus.memoryPart).hasLinesSet();
});
