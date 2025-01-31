import { AbortLines, ClockCtrlLines, OperationLines, PulseLines } from '../../src/bus/bus-part-lines';
import { expectPart, LinesPart, TestFactory, ValuePart } from './helpers';

const op = new LinesPart;
const inst = new ValuePart;
const pulse = new LinesPart;

const { cf, bgs } = TestFactory.Deps;
const card = cf.createControl();
card.connect(bgs.w);
op.connectOn(bgs.w.operationBus.operationPart);
inst.connectOn(bgs.w.controlInstructionBus.instructionPart)
pulse.connectOn(bgs.w.pulseBus.pulsePart);

const xbus = bgs.w.controlXBus;
const opbus = bgs.w.operationBus;

op.set(OperationLines.IMSC);

test('misc', function () {
  pulse.set(PulseLines.D);
  inst.set(0b10101110);
  expectPart(xbus.clockCtrlPart).hasLinesSet();
  expectPart(opbus.abortPart).hasLinesSet(AbortLines.AT10);
});

// Halt - MISC - 10 Cycles
// 1010111 r
// r = reload program counter (0-no reload, 1-reload from switches)

test('hlt', function () {
  pulse.set(PulseLines.G);
  inst.set(0b10101110);
  expectPart(xbus.clockCtrlPart).hasLinesSet(ClockCtrlLines.HLT);
  expectPart(opbus.abortPart).hasLinesSet();
});
