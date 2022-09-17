import { AbortLines, AluFunctionClLines, OperationLines, PulseLines, RegABCDLines } from '../../src/bus/bus-part-lines';
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

const zbus = bgs.w.controlZBus;
const cibus = bgs.w.controlInstructionBus;
const opbus = bgs.w.operationBus;

op.set(OperationLines.IALU);

test('alu D', function () {
  inst.set(0b10001111);
  pulse.set(PulseLines.D);
  expectPart(zbus.regABCDPart).hasLinesSet(RegABCDLines.RLD);
  expectPart(opbus.abortPart).hasLinesSet(AbortLines.AT08);
  expectPart(cibus.aluFunctionClPart).hasLinesSet(AluFunctionClLines.CL);
});

test('alu E', function () {
  inst.set(0b10001111);
  pulse.set(PulseLines.E);
  expectPart(zbus.regABCDPart).hasLinesSet();
  expectPart(opbus.abortPart).hasLinesSet();
  expectPart(cibus.aluFunctionClPart).hasLinesSet(AluFunctionClLines.F0, AluFunctionClLines.F1, AluFunctionClLines.F2);
});

test('alu dest', function () {
  pulse.set(PulseLines.D);
  inst.set(0b10001111);
  expectPart(zbus.regABCDPart).hasLinesSet(RegABCDLines.RLD);

  inst.set(0b10000111)
  expectPart(zbus.regABCDPart).hasLinesSet(RegABCDLines.RLA);
});
//   private updateAlu() {
//     if (this.pulsePart && this.instructionPart) {

//       if (pulse.bit(PulseLines.D)) {
//         // REG-LD
//         if (instr.bit(3)) {
//           regABCD = regABCD.flipBit(RegABCDLines.RLD);
//         } else {
//           regABCD = regABCD.flipBit(RegABCDLines.RLA);
//         }
//         // COND-LD
//         aluFunc = aluFunc.flipBit(AluFunctionClLines.CL);
//         // ABORT
//         abort = abort.flipBit(AbortLines.AT08);
//       }
//       if (pulse.bit(PulseLines.E)) {
//         // ALU-FUNC
//         if (instr.bit(0)) { aluFunc = aluFunc.flipBit(AluFunctionClLines.F0); }
//         if (instr.bit(1)) { aluFunc = aluFunc.flipBit(AluFunctionClLines.F1); }
//         if (instr.bit(2)) { aluFunc = aluFunc.flipBit(AluFunctionClLines.F2); }
//       }

//       if (!this.regABCD.isEqualTo(regABCD)) { this.regABCD = regABCD; }
//       this.regABCDOut.value = regABCD;

//       if (!this.aluFunc.isEqualTo(aluFunc)) { this.aluFunc = aluFunc; }
//       this.aluFuncOut.value = aluFunc;

//       if (!this.abort.isEqualTo(abort)) { this.abort = abort; }
//       this.abortOut.value = abort;
//     }
//   }
// export class ControlCard implements IControlCard {

//   connect(busGroup: ICardWBusGroup) {
//     // Inputs
//     this.operationPart = busGroup.operationBus.operationPart;
//     this.operationPart.subscribe(this.update);
//     this.pulsePart = busGroup.pulseBus.pulsePart;
//     this.pulsePart.subscribe(this.update);
//     this.instructionPart = busGroup.controlInstructionBus.instructionPart;
//     this.instructionPart.subscribe(this.update);
//     this.aluFuncClPart = busGroup.controlInstructionBus.aluFunctionClPart;
//     this.aluFuncClPart.subscribe(this.update);
//     this.aluConditionPart = busGroup.controlInstructionBus.conditionPart;
//     this.aluConditionPart.subscribe(this.update);
//     // Outputs
//     busGroup.controlInstructionBus.aluFunctionClPart.connect(this.aluFuncOut);
//     busGroup.controlXBus.i2bPart.connect(this.i2bOut);
//     busGroup.controlXBus.auxRegisterPart.connect(this.auxRegOut);
//     busGroup.controlYBus.memoryPart.connect(this.memoryOut);
//     busGroup.controlYBus.regJMXYPart.connect(this.regJMXYOut);
//     busGroup.controlZBus.regABCDPart.connect(this.regABCDOut);
//     busGroup.operationBus.abortPart.connect(this.abortOut);
//   }

//   private update = () => {
//     if (this.operationPart) {
//       const operation = this.operationPart.value;

//       this.updateInstFetchAndInc();

//       if (operation.bit(OperationLines.IMV8)) {
//         this.updateMv8();
//       } else if (operation.bit(OperationLines.ISET)) {
//         this.updateSet();
//       } else if (operation.bit(OperationLines.IALU)) {
//         this.updateAlu();
//       } else if (operation.bit(OperationLines.IGTO)) {
//         this.updateGoto();
//       }
//     }
//   };



//   private updateSet() {
//     if (this.pulsePart && this.instructionPart) {
//       const pulse = this.pulsePart.value;
//       const instr = this.instructionPart.value;
//       let regABCD = BitValue.Zero;
//       let i2b = BitValue.Zero;
//       let abort = BitValue.Zero;

//       if (pulse.bit(PulseLines.D)) {
//         // REG-LD
//         if (instr.bit(5)) {
//           regABCD = regABCD.flipBit(RegABCDLines.RLB);
//         } else {
//           regABCD = regABCD.flipBit(RegABCDLines.RLA);
//         }
//         // ABT-8
//         abort = abort.flipBit(AbortLines.AT08);
//       }
//       if (pulse.bit(PulseLines.E)) {
//         // IM-TO-BUS
//         i2b = i2b.flipBit(I2BLines.I2B);
//       }

//       if (!this.regABCD.isEqualTo(regABCD)) { this.regABCD = regABCD; }
//       this.regABCDOut.value = regABCD;

//       if (!this.i2b.isEqualTo(i2b)) { this.i2b = i2b; }
//       this.i2bOut.value = i2b;

//       if (!this.abort.isEqualTo(abort)) { this.abort = abort; }
//       this.abortOut.value = abort;
//     }
//   }

//   private updateMv8() {
//     if (this.pulsePart && this.instructionPart) {
//       const pulse = this.pulsePart.value;
//       const instr = this.instructionPart.value;
//       let regABCD = BitValue.Zero;
//       let regJMXY = BitValue.Zero;
//       let abort = BitValue.Zero;

//       if (pulse.bit(PulseLines.C)) {
//         // REG-SEL
//         if (!instr.bit(2)) {
//           if (!instr.bit(1)) {
//             if (!instr.bit(0)) {
//               regABCD = regABCD.flipBit(RegABCDLines.RSA);
//             } else {
//               regABCD = regABCD.flipBit(RegABCDLines.RSB);
//             }
//           } else {
//             if (!instr.bit(0)) {
//               regABCD = regABCD.flipBit(RegABCDLines.RSC);
//             } else {
//               regABCD = regABCD.flipBit(RegABCDLines.RSD);
//             }
//           }
//         } else {
//           if (!instr.bit(1)) {
//             if (!instr.bit(0)) {
//               regJMXY = regJMXY.flipBit(RegJMXYLines.SM1);
//             } else {
//               regJMXY = regJMXY.flipBit(RegJMXYLines.SM2);
//             }
//           } else {
//             if (!instr.bit(0)) {
//               regJMXY = regJMXY.flipBit(RegJMXYLines.SEX);
//             } else {
//               regJMXY = regJMXY.flipBit(RegJMXYLines.SEY);
//             }
//           }
//         }
//       }

//       if (pulse.bit(PulseLines.D)) {
//         // REG-LD
//         if (!instr.bit(5)) {
//           if (!instr.bit(4)) {
//             if (!instr.bit(3)) {
//               regABCD = regABCD.flipBit(RegABCDLines.RLA);
//             } else {
//               regABCD = regABCD.flipBit(RegABCDLines.RLB);
//             }
//           } else {
//             if (!instr.bit(3)) {
//               regABCD = regABCD.flipBit(RegABCDLines.RLC);
//             } else {
//               regABCD = regABCD.flipBit(RegABCDLines.RLD);
//             }
//           }
//         } else {
//           if (!instr.bit(4)) {
//             if (!instr.bit(3)) {
//               regJMXY = regJMXY.flipBit(RegJMXYLines.LM1);
//             } else {
//               regJMXY = regJMXY.flipBit(RegJMXYLines.LM2);
//             }
//           } else {
//             if (!instr.bit(3)) {
//               regJMXY = regJMXY.flipBit(RegJMXYLines.LDX);
//             } else {
//               regJMXY = regJMXY.flipBit(RegJMXYLines.LDY);
//             }
//           }
//         }
//         // ABT-8
//         abort = abort.flipBit(AbortLines.AT08);
//       }

//       if (!this.regABCD.isEqualTo(regABCD)) { this.regABCD = regABCD; }
//       this.regABCDOut.value = regABCD;

//       if (!this.regJMXY.isEqualTo(regJMXY)) { this.regJMXY = regJMXY; }
//       this.regJMXYOut.value = regJMXY;

//       if (!this.abort.isEqualTo(abort)) { this.abort = abort; }
//       this.abortOut.value = abort;
//     }
//   }

//   private updateGoto() {
//     if (this.pulsePart && this.instructionPart && this.aluConditionPart) {
//       const pulse = this.pulsePart.value;
//       const instr = this.instructionPart.value;
//       const alu = this.aluConditionPart.value;

//       let auxReg = this.auxReg;
//       let memory = this.memory;
//       let regJMXY = BitValue.Zero;

//       if (pulse.bit(PulseLines.J) || pulse.bit(PulseLines.N)) {
//         // SEL-PC & MEM-RD
//         auxReg = auxReg.flipBit(RegAuxLines.SPC);
//         memory = memory.flipBit(MemoryLines.MER);
//       }
//       if (pulse.bit(PulseLines.K) || pulse.bit(PulseLines.O)) {
//         // LD-INC
//         auxReg = auxReg.flipBit(RegAuxLines.LIC);
//       }
//       if (pulse.bit(PulseLines.K)) {
//         // LD-M1/J1
//         if (instr.bit(5)) {
//           regJMXY = regJMXY.flipBit(RegJMXYLines.LJ1);
//         } else {
//           regJMXY = regJMXY.flipBit(RegJMXYLines.LM1);
//         }
//       }
//       if (pulse.bit(PulseLines.O)) {
//         // LD-M2/J2
//         if (instr.bit(5)) {
//           regJMXY = regJMXY.flipBit(RegJMXYLines.LJ2);
//         } else {
//           regJMXY = regJMXY.flipBit(RegJMXYLines.LM2);
//         }
//       }
//       if (pulse.bit(PulseLines.L) || pulse.bit(PulseLines.Q)) {
//         // SEL-INC
//         auxReg = auxReg.flipBit(RegAuxLines.SIC);
//       }
//       if (pulse.bit(PulseLines.M) || pulse.bit(PulseLines.R)) {
//         // LD-PC
//         auxReg = auxReg.flipBit(RegAuxLines.LPC);
//       }
//       if (pulse.bit(PulseLines.R)) {
//         // LD-XY (optional)
//         if (instr.bit(0)) {
//           regJMXY = regJMXY.flipBit(RegJMXYLines.LXY);
//         }
//       }
//       if (pulse.bit(PulseLines.S)) {
//         // SEL-J
//         regJMXY = regJMXY.flipBit(RegJMXYLines.SEJ);
//       }
//       if (pulse.bit(PulseLines.T)) {
//         // LD-PC (optional)
//         if ((instr.bit(1) && alu.bit(ConditionLines.NZ)) ||
//           (instr.bit(2) && alu.bit(ConditionLines.EZ)) ||
//           (instr.bit(3) && alu.bit(ConditionLines.CY)) ||
//           (instr.bit(4) && alu.bit(ConditionLines.SN))) {
//           auxReg = auxReg.flipBit(RegAuxLines.LPC);
//         }
//       }

//       if (!this.auxReg.isEqualTo(auxReg)) { this.auxReg = auxReg; }
//       this.auxRegOut.value = auxReg;
//       if (!this.memory.isEqualTo(memory)) { this.memory = memory; }
//       this.memoryOut.value = memory;
//       if (!this.regJMXY.isEqualTo(regJMXY)) { this.regJMXY = regJMXY; }
//       this.regJMXYOut.value = regJMXY;
//     }
//   }

// }
