import { CardOutput } from './card-output';
import { BitValue } from '../bit-value';
import { ICardZBusGroup } from '../bus/bus-groups';
import { IAluOperationBusPart, IDataBusPart } from '../bus/bus-parts';
import { AluOperationLines } from '../bus/bus-part-lines';

export interface IAluLogicCard {

  notValue: BitValue;
  shlValue: BitValue;
  orValue: BitValue;
  xorValue: BitValue;
  andValue: BitValue;

  connect(dataBus: ICardZBusGroup): void;
}

export class AluLogicCard implements IAluLogicCard {

  notValue: BitValue;
  shlValue: BitValue;
  orValue: BitValue;
  xorValue: BitValue;
  andValue: BitValue;

  private inputBPart: IDataBusPart | undefined;
  private inputCPart: IDataBusPart | undefined;
  private aluOpPart: IAluOperationBusPart | undefined;

  private valueOut: CardOutput;

  constructor() {
    this.notValue = BitValue.Zero;
    this.shlValue = BitValue.Zero;
    this.orValue = BitValue.Zero;
    this.xorValue = BitValue.Zero;
    this.andValue = BitValue.Zero;
    this.valueOut = new CardOutput();
  }

  connect(busGroup: ICardZBusGroup) {
    // Inputs
    this.inputBPart = busGroup.registerBCBus.registerBPart;
    this.inputBPart.subscribe(this.update);
    this.inputCPart = busGroup.registerBCBus.registerCPart;
    this.inputCPart.subscribe(this.update);
    this.aluOpPart = busGroup.controlZBus.aluOperationPart;
    this.aluOpPart.subscribe(this.update);
    // Outputs
    busGroup.dataControlBus.dataPart.connect(this.valueOut);
  }

  private update = () => {
    if (this.inputBPart && this.inputCPart && this.aluOpPart) {
      const b = this.inputBPart.value;
      const c = this.inputCPart.value;

      const notValue = b.not().cap(8);
      const shlValue = b.shiftLeft(8);
      const orValue = b.or(c);
      const xorValue = b.xor(c);
      const andValue = b.and(c);

      if (!this.notValue.isEqualTo(notValue)) { this.notValue = notValue; }
      if (!this.shlValue.isEqualTo(shlValue)) { this.shlValue = shlValue; }
      if (!this.orValue.isEqualTo(orValue)) { this.orValue = orValue; }
      if (!this.xorValue.isEqualTo(xorValue)) { this.xorValue = xorValue; }
      if (!this.andValue.isEqualTo(andValue)) { this.andValue = andValue; }

      const alu = this.aluOpPart.value;
      let valueOut = BitValue.Zero;
      if (alu.bit(AluOperationLines.NOT)) { valueOut = valueOut.or(notValue); }
      if (alu.bit(AluOperationLines.SHL)) { valueOut = valueOut.or(shlValue); }
      if (alu.bit(AluOperationLines.ORR)) { valueOut = valueOut.or(orValue); }
      if (alu.bit(AluOperationLines.XOR)) { valueOut = valueOut.or(xorValue); }
      if (alu.bit(AluOperationLines.AND)) { valueOut = valueOut.or(andValue); }
      this.valueOut.value = valueOut;
    }
  };
}
