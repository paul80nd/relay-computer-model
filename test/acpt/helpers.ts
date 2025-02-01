import { ClockCtrlLines } from "../../src/bus/bus-part-lines";
import { ComputerFactory, IComputer } from "../../src/computer";

export class TestComputer {

  sut: IComputer;

  constructor() {
    const rcf = new ComputerFactory()
    this.sut = rcf.createComputer(true);
    this.sut.controlSwitchesCard.toggleReset();
  }

  runToHalt(instructions: number[]) {
    this.sut.yBackplane.memory.loadProgram(0, instructions);
    while (!this.sut.displayBCard.clockCtrl.bit(ClockCtrlLines.HLT)) {
      this.sut.controlSwitchesCard.toggleClock();
    }
  }

  public memory(address: number) {
    return this.sut.yBackplane.memory.memoryArray[address];
  }

  public get pcAddress(): number {
    return this.sut.xBackplane.registerPC.pcAddress;
  }

  public get registerA(): number {
    return this.sut.zBackplane.registerAD.registerA.value.value.toUnsignedNumber();
  }

  public get registerB(): number {
    return this.sut.zBackplane.registerBC.registerB.value.value.toUnsignedNumber();
  }

  public get registerM1(): number {
    return this.sut.yBackplane.registerM.register.valueHi.value.toUnsignedNumber();
  }

  public get registerM2(): number {
    return this.sut.yBackplane.registerM.register.valueLo.value.toUnsignedNumber();
  }

  public get registerX(): number {
    return this.sut.yBackplane.registerXY.register.valueHi.value.toUnsignedNumber();
  }

  public get registerY(): number {
    return this.sut.yBackplane.registerXY.register.valueLo.value.toUnsignedNumber();
  }
}
