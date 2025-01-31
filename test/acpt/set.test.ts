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

test('set a,9', function () {
  memory.loadProgram(0, [0x49,0xAE]);
  runToHalt();

  expect(pc.pcAddress).toBe(0x0002);
  expect(regA.value.value.toUnsignedNumber()).toBe(0x09);
});
