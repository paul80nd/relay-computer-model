import { BitValue } from '../bit-value';
import { CardOutput } from './card-output';
import { IControlSwitchesBusGroup } from '../bus/bus-groups';
import { ClockCtrlLines, ClockLines, DataSwitchGateLines, MemoryLines, RegABCDLines, RegAuxLines, ResetLines } from '../bus/bus-part-lines';

export interface IControlSwitchesCard {

  clock: boolean;
  clockSpeed: number;
  reset: boolean;
  restart: boolean;
  run: boolean;

  data: CardOutput;

  connect(busGroup: IControlSwitchesBusGroup): void;
  deposit(): void;
  depositNext(): void;
  examine(): void;
  examineNext(): void;
  loadAddr(): void;
  toggleClock(delay?: number): void;
  toggleReset(delay?: number): void;
  toggleRestart(delay?: number): void;
  toggleRunStop(): void;
}

enum AuxInstruction {
  Deposit,
  DepositNext,
  Examine,
  ExamineNext,
  LoadAddr
}

export class ControlSwitchesCard implements IControlSwitchesCard {

  clock = false;
  clockSpeed: number;
  reset = false;
  restart = false;
  run = false;

  private auxInstr: AuxInstruction | undefined;
  private auxRegOut: CardOutput;
  private auxState: number;
  private clockOut: CardOutput;
  private clockCtrlOut: CardOutput;
  data: CardOutput;
  private memoryOut: CardOutput;
  private regABCDOut: CardOutput;
  private resetOut: CardOutput;
  private sdsOut: CardOutput;

  constructor() {
    this.auxState = 0;
    this.clockSpeed = 500;
    this.auxRegOut = new CardOutput();
    this.clockOut = new CardOutput();
    this.clockCtrlOut = new CardOutput();
    this.data = new CardOutput();
    this.memoryOut = new CardOutput();
    this.regABCDOut = new CardOutput();
    this.resetOut = new CardOutput();
    this.sdsOut = new CardOutput();
    this.clockCtrlOut.value = this.clockCtrlOut.value.flipBit(ClockCtrlLines.FRZ);
  }

  connect(busGroup: IControlSwitchesBusGroup) {
    // Outputs
    busGroup.controlXBus.clockPart.connect(this.clockOut);
    busGroup.controlXBus.clockCtrlPart.connect(this.clockCtrlOut);
    busGroup.controlXBus.resetPart.connect(this.resetOut);
    busGroup.controlXBus.auxRegisterPart.connect(this.auxRegOut);
    busGroup.controlYBus.sdsPart.connect(this.sdsOut);
    busGroup.controlYBus.memoryPart.connect(this.memoryOut);
    busGroup.controlZBus.regABCDPart.connect(this.regABCDOut);
    busGroup.dataControlBus.dataPart.connect(this.data);
  }

  deposit(): void {
    if (this.auxState === 0) {
      this.auxInstr = AuxInstruction.Deposit;
      this.startAuxClock();
    }
  }
  depositNext(): void {
    if (this.auxState === 0) {
      this.auxInstr = AuxInstruction.DepositNext;
      this.startAuxClock();
    }
  }
  examine(): void {
    if (this.auxState === 0) {
      this.auxInstr = AuxInstruction.Examine;
      this.startAuxClock();
    }
  }
  examineNext(): void {
    if (this.auxState === 0) {
      this.auxInstr = AuxInstruction.ExamineNext;
      this.startAuxClock();
    }
  }
  loadAddr(): void {
    if (this.auxState === 0) {
      this.auxInstr = AuxInstruction.LoadAddr;
      this.startAuxClock();
    }
  }

  private startAuxClock(): void {
    this.auxState = 1;
    setTimeout(this.auxClockRun, 100);
  }

  private auxClockRun = () => {
    if (this.auxState > 0) {

      let auxReg = BitValue.Zero;
      let memory = BitValue.Zero;
      let regABCD = BitValue.Zero;
      let sds = BitValue.Zero;

      if (this.auxState === 1 || this.auxState === 2 || this.auxState === 3) {
        // PULSE A
        if (this.auxInstr === AuxInstruction.Deposit || this.auxInstr === AuxInstruction.DepositNext) {
          // Sel-PC, Sel-DS and B2M
          auxReg = auxReg.flipBit(RegAuxLines.SPC);
          sds = sds.flipBit(DataSwitchGateLines.SDS);
          memory = memory.flipBit(MemoryLines.B2M);
        }
        if (this.auxInstr === AuxInstruction.Examine || this.auxInstr === AuxInstruction.ExamineNext) {
          // Sel-PC and Mem-Rd
          auxReg = auxReg.flipBit(RegAuxLines.SPC);
          memory = memory.flipBit(MemoryLines.MER);
        }
        if (this.auxInstr === AuxInstruction.LoadAddr) {
          // Sel-AS
          sds = sds.flipBit(DataSwitchGateLines.SAS);
        }
      }

      if (this.auxState === 1 || this.auxState === 2) {
        // PULSE B
        if (this.auxInstr === AuxInstruction.Deposit || this.auxInstr === AuxInstruction.DepositNext) {
          // Mem-WR
          memory = memory.flipBit(MemoryLines.MEW);
        }
        if (this.auxInstr === AuxInstruction.DepositNext || this.auxInstr === AuxInstruction.ExamineNext) {
          // Ld-INC
          auxReg = auxReg.flipBit(RegAuxLines.LIC);
        }
        if (this.auxInstr === AuxInstruction.Examine || this.auxInstr === AuxInstruction.ExamineNext) {
          // Ld-A
          regABCD = regABCD.flipBit(RegABCDLines.RLA);
        }
        if (this.auxInstr === AuxInstruction.LoadAddr) {
          // Ld-PC
          auxReg = auxReg.flipBit(RegAuxLines.LPC);
        }
      }

      if (this.auxState === 5 || this.auxState === 6) {
        // PULSE C
        if (this.auxInstr === AuxInstruction.DepositNext || this.auxInstr === AuxInstruction.ExamineNext) {
          // Sel-INC
          auxReg = auxReg.flipBit(RegAuxLines.SIC);
        }
      }

      if (this.auxState === 5) {
        // PULSE D
        if (this.auxInstr === AuxInstruction.DepositNext || this.auxInstr === AuxInstruction.ExamineNext) {
          // Ld-PC
          auxReg = auxReg.flipBit(RegAuxLines.LPC);
        }
      }

      if (!this.auxRegOut.value.isEqualTo(auxReg)) { this.auxRegOut.value = auxReg; }
      if (!this.memoryOut.value.isEqualTo(memory)) { this.memoryOut.value = memory; }
      if (!this.regABCDOut.value.isEqualTo(regABCD)) { this.regABCDOut.value = regABCD; }
      if (!this.sdsOut.value.isEqualTo(sds)) { this.sdsOut.value = sds; }

      if (this.auxState === 4) {
        // AUX-RESET (Short)
        if (this.auxInstr === AuxInstruction.Deposit || this.auxInstr === AuxInstruction.Examine || this.auxInstr === AuxInstruction.LoadAddr) {
          this.auxState = 0;
          return;     // Fall from method without setting callback timeout
        }
      }
      if (this.auxState === 7) {
        // AUX-RESET (Long)
        this.auxState = 0;
        return;
      }

      this.auxState += 1;
      setTimeout(this.auxClockRun, 100);
    }
  };

  toggleRunStop(): void {
    this.run = !this.run;
    if (this.run) {
      this.clockCtrlOut.value = this.clockCtrlOut.value.flipBit(ClockCtrlLines.FRZ);
    } else {
      this.clockCtrlOut.value = this.clockCtrlOut.value.flipBit(ClockCtrlLines.FRZ);
    }
  }

  toggleClock(delay?: number): void {
    if (!this.clock) {
      this.clock = true;
      if (!this.run) { this.clockOut.value = this.clockOut.value.flipBit(ClockLines.CLK); }
      if (delay) { setTimeout(this.restoreClock.bind(this), delay); } else { this.restoreClock(); }
    }
  }
  private restoreClock() {
    this.clock = false;
    if (this.clockOut.value.bit(ClockLines.CLK)) {
      this.clockOut.value = this.clockOut.value.flipBit(ClockLines.CLK);
    }
  }

  toggleReset(delay?: number): void {
    if (!this.reset) {
      this.reset = true;
      if (!this.run) { this.resetOut.value = this.resetOut.value.flipBit(ResetLines.RES); }
      if (delay) { setTimeout(this.restoreReset.bind(this), delay); } else { this.restoreReset(); }
    }
  }
  private restoreReset() {
    this.reset = false;
    if (this.resetOut.value.bit(ResetLines.RES)) {
      this.resetOut.value = this.resetOut.value.flipBit(ResetLines.RES);
    }
  }

  toggleRestart(delay?: number): void {
    if (!this.restart) {
      this.restart = true;
      this.clockCtrlOut.value = this.clockCtrlOut.value.flipBit(ClockCtrlLines.RST);
      if (delay) { setTimeout(this.restoreRestart.bind(this), delay); } else { this.restoreRestart(); }
    }
  }
  private restoreRestart() {
    this.restart = false;
    if (this.clockCtrlOut.value.bit(ClockCtrlLines.RST)) {
      this.clockCtrlOut.value = this.clockCtrlOut.value.flipBit(ClockCtrlLines.RST);
    }
  }

}
