import { CardOutput } from './card-output';
import { BitValue } from '../bit-value';
import { ICardWBusGroup } from '../bus/bus-groups';
import {
  IAluFunctionClBusPart, IInstructionBusPart, IOperationBusPart,
  IPulseBusPart,
  IConditionBusPart
} from '../bus/bus-parts';
import {
  AbortLines, AluFunctionClLines, I2BLines, MemoryLines, DataSwitchGateLines,
  OperationLines, PulseLines, RegABCDLines, RegAuxLines, RegJMXYLines, ConditionLines, ClockCtrlLines
} from '../bus/bus-part-lines';

export interface IControlCard {

  abort: BitValue;
  aluFunc: BitValue;
  auxReg: BitValue;
  clockCtrl: BitValue;
  i2b: BitValue;
  memory: BitValue;
  regABCD: BitValue;
  regJMXY: BitValue;

  connect(dataBus: ICardWBusGroup): void;
}

export class ControlCard implements IControlCard {

  abort: BitValue;
  aluFunc: BitValue;
  auxReg: BitValue;
  clockCtrl: BitValue;
  i2b: BitValue;
  memory: BitValue;
  regABCD: BitValue;
  regJMXY: BitValue;
  sds: BitValue;

  private abortOut: CardOutput;
  private aluFuncOut: CardOutput;
  private auxRegOut: CardOutput;
  private clockCtrlOut: CardOutput;
  private i2bOut: CardOutput;
  private memoryOut: CardOutput;
  private regABCDOut: CardOutput;
  private regJMXYOut: CardOutput;
  private sdsOut: CardOutput;

  private aluFuncClPart: IAluFunctionClBusPart | undefined;
  private aluConditionPart: IConditionBusPart | undefined;
  private instructionPart: IInstructionBusPart | undefined;
  private pulsePart: IPulseBusPart | undefined;
  private operationPart: IOperationBusPart | undefined;

  constructor() {
    this.abort = BitValue.Zero;
    this.abortOut = new CardOutput();
    this.aluFunc = BitValue.Zero;
    this.aluFuncOut = new CardOutput();
    this.auxReg = BitValue.Zero;
    this.auxRegOut = new CardOutput();
    this.clockCtrl = BitValue.Zero;
    this.clockCtrlOut = new CardOutput();
    this.i2b = BitValue.Zero;
    this.i2bOut = new CardOutput();
    this.memory = BitValue.Zero;
    this.memoryOut = new CardOutput();
    this.regABCD = BitValue.Zero;
    this.regABCDOut = new CardOutput();
    this.regJMXY = BitValue.Zero;
    this.regJMXYOut = new CardOutput();
    this.sds = BitValue.Zero;
    this.sdsOut = new CardOutput();
  }

  connect(busGroup: ICardWBusGroup) {
    // Inputs
    this.operationPart = busGroup.operationBus.operationPart;
    this.operationPart.subscribe(this.update);
    this.pulsePart = busGroup.pulseBus.pulsePart;
    this.pulsePart.subscribe(this.update);
    this.instructionPart = busGroup.controlInstructionBus.instructionPart;
    this.instructionPart.subscribe(this.update);
    this.aluFuncClPart = busGroup.controlInstructionBus.aluFunctionClPart;
    this.aluFuncClPart.subscribe(this.update);
    this.aluConditionPart = busGroup.controlInstructionBus.conditionPart;
    this.aluConditionPart.subscribe(this.update);
    // Outputs
    busGroup.controlInstructionBus.aluFunctionClPart.connect(this.aluFuncOut);
    busGroup.controlXBus.i2bPart.connect(this.i2bOut);
    busGroup.controlXBus.auxRegisterPart.connect(this.auxRegOut);
    busGroup.controlXBus.clockCtrlPart.connect(this.clockCtrlOut);
    busGroup.controlYBus.memoryPart.connect(this.memoryOut);
    busGroup.controlYBus.regJMXYPart.connect(this.regJMXYOut);
    busGroup.controlZBus.regABCDPart.connect(this.regABCDOut);
    busGroup.operationBus.abortPart.connect(this.abortOut);
    busGroup.controlYBus.sdsPart.connect(this.sdsOut)
  }

  private update = () => {
    if (this.operationPart) {
      const operation = this.operationPart.value;

      this.updateInstFetchAndInc();

      if (operation.bit(OperationLines.IMV8)) {
        this.updateMv8();
      } else if (operation.bit(OperationLines.IM16)) {
        this.updateMv16();
      } else if (operation.bit(OperationLines.ISET)) {
        this.updateSet();
      } else if (operation.bit(OperationLines.IALU)) {
        this.updateAlu();
      } else if (operation.bit(OperationLines.ISTR)) {
        this.updateStore();
      } else if (operation.bit(OperationLines.ILOD)) {
        this.updateLoad();
      } else if (operation.bit(OperationLines.IGTO)) {
        this.updateGoto();
      } else if (operation.bit(OperationLines.IMSC)) {
        this.updateMisc();
      }
    }
  };

  private updateInstFetchAndInc() {
    if (this.pulsePart) {
      const pulse = this.pulsePart.value;

      let auxReg = BitValue.Zero;
      let memory = BitValue.Zero;

      if (pulse.bit(PulseLines.A)) {
        // SEL-PC
        auxReg = auxReg.flipBit(RegAuxLines.SPC);
        // MEM-READ
        memory = memory.flipBit(MemoryLines.MER);
      }
      if (pulse.bit(PulseLines.B)) {
        // LD-INC
        auxReg = auxReg.flipBit(RegAuxLines.LIC);
        // LD-INST
        auxReg = auxReg.flipBit(RegAuxLines.LIN);
      }
      if (pulse.bit(PulseLines.C)) {
        // SEL-INC
        auxReg = auxReg.flipBit(RegAuxLines.SIC);
      }
      if (pulse.bit(PulseLines.D)) {
        // LD-PC
        auxReg = auxReg.flipBit(RegAuxLines.LPC);
      }

      this.sendAuxReg(auxReg);
      this.sendMemory(memory);
    }
  }

  private updateAlu() {
    if (this.pulsePart && this.instructionPart) {
      const pulse = this.pulsePart.value;
      const instr = this.instructionPart.value;
      let regABCD = BitValue.Zero;
      let abort = BitValue.Zero;
      let aluFunc = BitValue.Zero;

      if (pulse.bit(PulseLines.D)) {
        // REG-LD
        if (instr.bit(3)) {
          regABCD = regABCD.flipBit(RegABCDLines.RLD);
        } else {
          regABCD = regABCD.flipBit(RegABCDLines.RLA);
        }
        // COND-LD
        aluFunc = aluFunc.flipBit(AluFunctionClLines.CL);
        // ABORT
        abort = abort.flipBit(AbortLines.AT08);
      }
      if (pulse.bit(PulseLines.E)) {
        // ALU-FUNC
        if (instr.bit(0)) { aluFunc = aluFunc.flipBit(AluFunctionClLines.F0); }
        if (instr.bit(1)) { aluFunc = aluFunc.flipBit(AluFunctionClLines.F1); }
        if (instr.bit(2)) { aluFunc = aluFunc.flipBit(AluFunctionClLines.F2); }
      }

      this.sendRegABCD(regABCD);
      this.sendAluFunc(aluFunc);
      this.sendAbort(abort);
    }
  }

  private updateSet() {
    if (this.pulsePart && this.instructionPart) {
      const pulse = this.pulsePart.value;
      const instr = this.instructionPart.value;
      let regABCD = BitValue.Zero;
      let i2b = BitValue.Zero;
      let abort = BitValue.Zero;

      if (pulse.bit(PulseLines.D)) {
        // REG-LD
        if (instr.bit(5)) {
          regABCD = regABCD.flipBit(RegABCDLines.RLB);
        } else {
          regABCD = regABCD.flipBit(RegABCDLines.RLA);
        }
        // ABT-8
        abort = abort.flipBit(AbortLines.AT08);
      }
      if (pulse.bit(PulseLines.E)) {
        // IM-TO-BUS
        i2b = i2b.flipBit(I2BLines.I2B);
      }

      this.sendRegABCD(regABCD);
      this.sendI2B(i2b);
      this.sendAbort(abort);
    }
  }

  private updateMv8() {
    if (this.pulsePart && this.instructionPart) {
      const pulse = this.pulsePart.value;
      const instr = this.instructionPart.value;
      let regABCD = BitValue.Zero;
      let regJMXY = BitValue.Zero;
      let abort = BitValue.Zero;

      if (pulse.bit(PulseLines.C)) {
        // REG-SEL
        if (!instr.bit(2)) {
          if (!instr.bit(1)) {
            if (!instr.bit(0)) {
              regABCD = regABCD.flipBit(RegABCDLines.RSA);
            } else {
              regABCD = regABCD.flipBit(RegABCDLines.RSB);
            }
          } else {
            if (!instr.bit(0)) {
              regABCD = regABCD.flipBit(RegABCDLines.RSC);
            } else {
              regABCD = regABCD.flipBit(RegABCDLines.RSD);
            }
          }
        } else {
          if (!instr.bit(1)) {
            if (!instr.bit(0)) {
              regJMXY = regJMXY.flipBit(RegJMXYLines.SM1);
            } else {
              regJMXY = regJMXY.flipBit(RegJMXYLines.SM2);
            }
          } else {
            if (!instr.bit(0)) {
              regJMXY = regJMXY.flipBit(RegJMXYLines.SEX);
            } else {
              regJMXY = regJMXY.flipBit(RegJMXYLines.SEY);
            }
          }
        }
      }

      if (pulse.bit(PulseLines.D)) {
        // REG-LD
        if (!instr.bit(5)) {
          if (!instr.bit(4)) {
            if (!instr.bit(3)) {
              regABCD = regABCD.flipBit(RegABCDLines.RLA);
            } else {
              regABCD = regABCD.flipBit(RegABCDLines.RLB);
            }
          } else {
            if (!instr.bit(3)) {
              regABCD = regABCD.flipBit(RegABCDLines.RLC);
            } else {
              regABCD = regABCD.flipBit(RegABCDLines.RLD);
            }
          }
        } else {
          if (!instr.bit(4)) {
            if (!instr.bit(3)) {
              regJMXY = regJMXY.flipBit(RegJMXYLines.LM1);
            } else {
              regJMXY = regJMXY.flipBit(RegJMXYLines.LM2);
            }
          } else {
            if (!instr.bit(3)) {
              regJMXY = regJMXY.flipBit(RegJMXYLines.LDX);
            } else {
              regJMXY = regJMXY.flipBit(RegJMXYLines.LDY);
            }
          }
        }
        // ABT-8
        abort = abort.flipBit(AbortLines.AT08);
      }

      this.sendRegABCD(regABCD);
      this.sendRegJMXY(regJMXY);
      this.sendAbort(abort);
    }
  }

  private updateMv16() {
    if (this.pulsePart && this.instructionPart) {
      const pulse = this.pulsePart.value;
      const instr = this.instructionPart.value;
      let regJMXY = BitValue.Zero;
      let regAux = BitValue.Zero;
      let sds = BitValue.Zero;
      let abort = BitValue.Zero;

      if (pulse.bit(PulseLines.D)) {
        // ABT-10
        abort = abort.flipBit(AbortLines.AT10);
      }

      if (pulse.bit(PulseLines.F)) {
        // REG-SEL
        if (!instr.bit(1)) {
          if (!instr.bit(0)) {
            regJMXY = regJMXY.flipBit(RegJMXYLines.SEM);
          } else {
            regJMXY = regJMXY.flipBit(RegJMXYLines.SXY);
          }
        } else {
          if (!instr.bit(0)) {
            regJMXY = regJMXY.flipBit(RegJMXYLines.SEJ);
          } else {
            sds = sds.flipBit(DataSwitchGateLines.SAS);
          }
        }
      }

      if (pulse.bit(PulseLines.G)) {
        // REG-LD
        if (!instr.bit(2)) {
          regJMXY = regJMXY.flipBit(RegJMXYLines.LXY);
        } else {
          regAux = regAux.flipBit(RegAuxLines.LPC);
        }
      }

      this.sendAuxReg(regAux);
      this.sendSds(sds);
      this.sendRegJMXY(regJMXY);
      this.sendAbort(abort);
    }
  }

  private updateStore() {
    if (this.pulsePart && this.instructionPart) {
      const pulse = this.pulsePart.value;
      const instr = this.instructionPart.value;
      let memory = this.memory;
      let regABCD = BitValue.Zero;
      let regJMXY = BitValue.Zero;
      let abort = BitValue.Zero;

      if (pulse.bit(PulseLines.D)) {
        // ABT-12
        abort = abort.flipBit(AbortLines.AT12);
      }

      if (pulse.bit(PulseLines.J)) {
        // SEL-M/B2M
        regJMXY = regJMXY.flipBit(RegJMXYLines.SEM);
        memory = memory.flipBit(MemoryLines.B2M);
        // REG-SEL
        if (!instr.bit(1)) {
          if (!instr.bit(0)) {
            regABCD = regABCD.flipBit(RegABCDLines.RSA);
          } else {
            regABCD = regABCD.flipBit(RegABCDLines.RSB);
          }
        } else {
          if (!instr.bit(0)) {
            regABCD = regABCD.flipBit(RegABCDLines.RSC);
          } else {
            regABCD = regABCD.flipBit(RegABCDLines.RSD);
          }
        }
      }

      if (pulse.bit(PulseLines.K)) {
        // MEM-WRITE
        memory = memory.flipBit(MemoryLines.MEW);
      }

      this.sendMemory(memory);
      this.sendRegABCD(regABCD);
      this.sendRegJMXY(regJMXY);
      this.sendAbort(abort);
    }
  }

  private updateLoad() {
    if (this.pulsePart && this.instructionPart) {
      const pulse = this.pulsePart.value;
      const instr = this.instructionPart.value;
      let memory = this.memory;
      let regABCD = BitValue.Zero;
      let regJMXY = BitValue.Zero;
      let abort = BitValue.Zero;

      if (pulse.bit(PulseLines.D)) {
        // ABT-12
        abort = abort.flipBit(AbortLines.AT12);
      }

      if (pulse.bit(PulseLines.J)) {
        // SEL-M/MER
        regJMXY = regJMXY.flipBit(RegJMXYLines.SEM);
        memory = memory.flipBit(MemoryLines.MER);
      }

      if (pulse.bit(PulseLines.K)) {
        // REG-LD
        if (!instr.bit(1)) {
          if (!instr.bit(0)) {
            regABCD = regABCD.flipBit(RegABCDLines.RLA);
          } else {
            regABCD = regABCD.flipBit(RegABCDLines.RLB);
          }
        } else {
          if (!instr.bit(0)) {
            regABCD = regABCD.flipBit(RegABCDLines.RLC);
          } else {
            regABCD = regABCD.flipBit(RegABCDLines.RLD);
          }
        }
      }

      this.sendMemory(memory);
      this.sendRegABCD(regABCD);
      this.sendRegJMXY(regJMXY);
      this.sendAbort(abort);
    }
  }

  private updateGoto() {
    if (this.pulsePart && this.instructionPart && this.aluConditionPart) {
      const pulse = this.pulsePart.value;
      const instr = this.instructionPart.value;
      const alu = this.aluConditionPart.value;

      let auxReg = this.auxReg;
      let memory = this.memory;
      let regJMXY = BitValue.Zero;

      if (pulse.bit(PulseLines.J) || pulse.bit(PulseLines.N)) {
        // SEL-PC & MEM-RD
        auxReg = auxReg.flipBit(RegAuxLines.SPC);
        memory = memory.flipBit(MemoryLines.MER);
      }
      if (pulse.bit(PulseLines.K) || pulse.bit(PulseLines.O)) {
        // LD-INC
        auxReg = auxReg.flipBit(RegAuxLines.LIC);
      }
      if (pulse.bit(PulseLines.K)) {
        // LD-M1/J1
        if (instr.bit(5)) {
          regJMXY = regJMXY.flipBit(RegJMXYLines.LJ1);
        } else {
          regJMXY = regJMXY.flipBit(RegJMXYLines.LM1);
        }
      }
      if (pulse.bit(PulseLines.O)) {
        // LD-M2/J2
        if (instr.bit(5)) {
          regJMXY = regJMXY.flipBit(RegJMXYLines.LJ2);
        } else {
          regJMXY = regJMXY.flipBit(RegJMXYLines.LM2);
        }
      }
      if (pulse.bit(PulseLines.L) || pulse.bit(PulseLines.Q)) {
        // SEL-INC
        auxReg = auxReg.flipBit(RegAuxLines.SIC);
      }
      if (pulse.bit(PulseLines.M) || pulse.bit(PulseLines.R)) {
        // LD-PC
        auxReg = auxReg.flipBit(RegAuxLines.LPC);
      }
      if (pulse.bit(PulseLines.R)) {
        // LD-XY (optional)
        if (instr.bit(0)) {
          regJMXY = regJMXY.flipBit(RegJMXYLines.LXY);
        }
      }
      if (pulse.bit(PulseLines.S)) {
        // SEL-J
        regJMXY = regJMXY.flipBit(RegJMXYLines.SEJ);
      }
      if (pulse.bit(PulseLines.T)) {
        // LD-PC (optional)
        if ((instr.bit(1) && alu.bit(ConditionLines.NZ)) ||
          (instr.bit(2) && alu.bit(ConditionLines.EZ)) ||
          (instr.bit(3) && alu.bit(ConditionLines.CY)) ||
          (instr.bit(4) && alu.bit(ConditionLines.SN))) {
          auxReg = auxReg.flipBit(RegAuxLines.LPC);
        }
      }

      this.sendAuxReg(auxReg);
      this.sendMemory(memory);
      this.sendRegJMXY(regJMXY);
    }
  }

  private updateMisc() {
    if (this.pulsePart && this.instructionPart) {
      const pulse = this.pulsePart.value;
      const instr = this.instructionPart.value;
      let clockCtrl = BitValue.Zero;
      let sds = BitValue.Zero;
      let regAux = BitValue.Zero;
      let abort = BitValue.Zero;

      if (pulse.bit(PulseLines.D)) {
        // ABT-10
        abort = abort.flipBit(AbortLines.AT10);
      }

      if (instr.bit(1)) {
        if (!instr.bit(0)) {
          // HALT
          if (pulse.bit(PulseLines.G)) {
            clockCtrl = clockCtrl.flipBit(ClockCtrlLines.HLT);
          }
        } else {
          // HALT & RELOAD
          if (pulse.bit(PulseLines.F)) {
            sds = sds.flipBit(DataSwitchGateLines.SAS);
          }
          if (pulse.bit(PulseLines.G)) {
            regAux = regAux.flipBit(RegAuxLines.LPC);
            clockCtrl = clockCtrl.flipBit(ClockCtrlLines.HLT);
          }
        }
      }

      this.sendAuxReg(regAux);
      this.sendClockCtrl(clockCtrl);
      this.sendSds(sds);
      this.sendAbort(abort);
    }
  }

  private sendAbort(v: BitValue) { if (!this.abort.isEqualTo(v)) { this.abort = v; } this.abortOut.value = v; }
  private sendAluFunc(v: BitValue) { if (!this.aluFunc.isEqualTo(v)) { this.aluFunc = v; } this.aluFuncOut.value = v; }
  private sendAuxReg(v: BitValue) { if (!this.auxReg.isEqualTo(v)) { this.auxReg = v; } this.auxRegOut.value = v; }
  private sendClockCtrl(v: BitValue) { if (!this.clockCtrl.isEqualTo(v)) { this.clockCtrl = v; } this.clockCtrlOut.value = v; }
  private sendI2B(v: BitValue) { if (!this.i2b.isEqualTo(v)) { this.i2b = v; } this.i2bOut.value = v; }
  private sendMemory(v: BitValue) { if (!this.memory.isEqualTo(v)) { this.memory = v; } this.memoryOut.value = v; }
  private sendRegABCD(v: BitValue) { if (!this.regABCD.isEqualTo(v)) { this.regABCD = v; } this.regABCDOut.value = v; }
  private sendRegJMXY(v: BitValue) { if (!this.regJMXY.isEqualTo(v)) { this.regJMXY = v; } this.regJMXYOut.value = v; }
  private sendSds(v: BitValue) { if (!this.sds.isEqualTo(v)) { this.sds = v; } this.sdsOut.value = v; }
}
