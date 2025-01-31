import { CardOutput } from './card-output';
import { BitValue } from '../bit-value';
import { ICardWBusGroup } from '../bus/bus-groups';
import { IInstructionBusPart } from '../bus/bus-parts';
import { OperationLines } from '../bus/bus-part-lines';

export interface IDecoderCard {

  operation: BitValue;

  connect(dataBus: ICardWBusGroup): void;
}

export class DecoderCard implements IDecoderCard {

  operation: BitValue;

  private instrPart: IInstructionBusPart | undefined;

  private operationOut: CardOutput;

  constructor() {
    this.operation = BitValue.Zero;
    this.operationOut = new CardOutput();
  }

  connect(busGroup: ICardWBusGroup) {
    // Inputs
    this.instrPart = busGroup.controlInstructionBus.instructionPart;
    this.instrPart.subscribe(this.update);
    // Outputs
    busGroup.operationBus.operationPart.connect(this.operationOut);
  }

  private update = () => {
    if (this.instrPart) {
      const opCode = this.instrPart.value;
      let oper = BitValue.Zero;

      if (opCode.bit(7) && opCode.bit(6)) {
        // 11xxxxxx GOTO
        oper = oper.flipBit(OperationLines.IGTO);
      }
      else if (!opCode.bit(7) && opCode.bit(6)) {
        // 01xxxxxx SET-AB
        oper = oper.flipBit(OperationLines.ISET);
      }
      else if (!opCode.bit(7) && !opCode.bit(6)) {
        // 00xxxxxx MOVE-8
        oper = oper.flipBit(OperationLines.IMV8);
      }
      else {
        // 10------
        if (!opCode.bit(5) && !opCode.bit(4)) {
          // 1000xxxx ALU
          oper = oper.flipBit(OperationLines.IALU);
        }
        else if (opCode.bit(5) && !opCode.bit(4) && !opCode.bit(3)) {
          // 10100xxx MOVE16
          oper = oper.flipBit(OperationLines.IM16);
        }
        else if (opCode.bit(5) && !opCode.bit(4) && opCode.bit(3)) {
          // 10101xxx MISC
          oper = oper.flipBit(OperationLines.IMSC);
        }
      }

      if (!this.operation.isEqualTo(oper)) { this.operation = oper; }
      this.operationOut.value = oper;
    }
  };
}
