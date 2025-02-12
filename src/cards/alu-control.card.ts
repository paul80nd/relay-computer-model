import { CardOutput, ICardOutput } from './card-output';
import { ICardZBusGroup } from '../bus/bus-groups';
import { IAluFunctionClBusPart, IAluOperationBusPart, IDataBusPart } from '../bus/bus-parts';
import { AluFunctionClLines, AluOperationLines, ConditionLines } from '../bus/bus-part-lines';
import { BitValue } from '../bit-value';

export interface IAluControlCard {

  condition: ICardOutput;
  func: BitValue;
  load: boolean;
  select: boolean;
  operation: ICardOutput;

  connect(dataBus: ICardZBusGroup): void;
}

export class AluControlCard implements IAluControlCard {

  condition: CardOutput;
  func: BitValue;
  load = false;
  select = false;
  operation: CardOutput;

  private aluOpPart: IAluOperationBusPart | undefined;
  private clPart: IAluFunctionClBusPart | undefined;
  private dataPart: IDataBusPart | undefined;

  private conditionOut: CardOutput;
  private operationOut: CardOutput;

  constructor() {
    this.condition = new CardOutput();
    this.func = BitValue.Zero;
    this.conditionOut = new CardOutput();
    this.operation = new CardOutput();
    this.operationOut = new CardOutput();
  }

  connect(busGroup: ICardZBusGroup) {
    // Inputs
    this.aluOpPart = busGroup.controlZBus.aluOperationPart;
    this.aluOpPart.subscribe(this.update);
    this.aluOpPart.subscribe(this.updateOp);
    this.dataPart = busGroup.dataControlBus.dataPart;
    this.dataPart.subscribe(this.update);
    this.clPart = busGroup.dataControlBus.aluFunctionClPart;
    this.clPart.subscribe(this.update);
    // Outputs
    busGroup.dataControlBus.conditionPart.connect(this.conditionOut);
    busGroup.controlZBus.aluOperationPart.connect(this.operationOut);
    // Initial State (NZ)
    let state = BitValue.Zero;
    state = state.flipBit(ConditionLines.NZ);
    this.condition.value = state;
    this.conditionOut.value = state;
  }

  private update = () => {
    if (this.clPart && this.dataPart && this.aluOpPart) {

      const value = this.dataPart.value;
      const ld = this.clPart.value.bit(AluFunctionClLines.CL);
      const func = this.clPart.value;
      let op = BitValue.Zero;

      if (!this.func.isEqualTo(func)) {
        this.func = func;
        if (func.bit(AluFunctionClLines.F2)) {
          if (func.bit(AluFunctionClLines.F1)) {
            if (func.bit(AluFunctionClLines.F0)) {
              op = op.flipBit(AluOperationLines.SHL);
            } else {
              op = op.flipBit(AluOperationLines.NOT);
            }
          } else {
            if (func.bit(AluFunctionClLines.F0)) {
              op = op.flipBit(AluOperationLines.XOR);
            } else {
              op = op.flipBit(AluOperationLines.ORR);
            }
          }
        } else {
          if (func.bit(AluFunctionClLines.F1)) {
            if (func.bit(AluFunctionClLines.F0)) {
              op = op.flipBit(AluOperationLines.AND);
            } else {
              op = op.flipBit(AluOperationLines.INC);
            }
          } else {
            if (func.bit(AluFunctionClLines.F0)) {
              op = op.flipBit(AluOperationLines.ADD);
            } else {
              op = op.flipBit(AluOperationLines.CLR);
            }
          }
        }
        this.operationOut.value = op;
      }

      if (ld) {
        // Loading -> Sets Register
        if (!this.load) { this.load = true; }
        if (!this.select) { this.select = true; }

        const z = value.isZero();
        const s = value.bit(7);
        const c = this.aluOpPart.value.bit(AluOperationLines.ICY);

        let valueOut = BitValue.Zero;
        if (z) { valueOut = valueOut.flipBit(ConditionLines.EZ); }
        if (!z) { valueOut = valueOut.flipBit(ConditionLines.NZ); }
        if (s) { valueOut = valueOut.flipBit(ConditionLines.SN); }
        if (c) { valueOut = valueOut.flipBit(ConditionLines.CY); }

        this.condition.value = valueOut;
        this.conditionOut.value = valueOut;
      } else {
        if (this.load) { this.load = false; }
        if (this.select) { this.select = false; }
      }
    }
  };

  private updateOp = () => {
    if (this.aluOpPart) {
      this.operation.value = this.aluOpPart.value;
    }
  };
}
