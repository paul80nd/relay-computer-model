import { ComputerFactory } from "../../src";
import { ClockCtrlLines } from "../../src/bus/bus-part-lines";

const rcf = new ComputerFactory();
const rc = rcf.createComputer(true);

const memory = rc.yBackplane.memory;
const pc = rc.xBackplane.registerPC;
const regM = rc.yBackplane.registerM.register;

rc.controlSwitchesCard.toggleReset();

function runToHalt() {
  while (!rc.displayBCard.clockCtrl.bit(ClockCtrlLines.HLT)) {
    rc.controlSwitchesCard.toggleClock();
  }
}

test('goto set m to 0x4321', function () {
  memory.loadProgram(0, [0xC0, 0x43, 0x21, 0xAE]);
  runToHalt();

  expect(pc.pcAddress).toBe(0x0004);
  expect(regM.valueHi.value.toUnsignedNumber()).toBe(0x43);
  expect(regM.valueLo.value.toUnsignedNumber()).toBe(0x21);
});
