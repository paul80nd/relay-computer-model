import { ComputerFactory } from "../../src";
import { ClockCtrlLines } from "../../src/bus/bus-part-lines";

const rcf = new ComputerFactory();
const rc = rcf.createComputer(true);

const memory = rc.yBackplane.memory;
const pc = rc.xBackplane.registerPC;
const regA = rc.zBackplane.registerAD.registerA;

rc.controlSwitchesCard.toggleReset();

function runToHalt() {
  while (!rc.displayBCard.clockCtrl.bit(ClockCtrlLines.HLT)) {
    rc.controlSwitchesCard.toggleClock();
  }
}

test('hlt 1', function () {
  memory.loadProgram(0, [0xAE]);
  runToHalt();

  expect(pc.pcAddress).toBe(0x0001);
});

test('hlt 2', function () {
  memory.loadProgram(0, [0x00, 0xAE]);
  runToHalt();

  expect(pc.pcAddress).toBe(0x0001);
});

test('hlt 3', function () {
  memory.loadProgram(0, [0x00, 0x00, 0xAE]);
  runToHalt();

  expect(pc.pcAddress).toBe(0x0001);
});
