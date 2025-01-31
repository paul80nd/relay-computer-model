import { BitValue } from '../../bit-value';
import { CardOutput, ICardOutput } from '../card-output';
import { IBusPart, IDataBusPart, IRegisterABCDBusPart } from '../../bus/bus-parts';

export interface IRegisterCardPart {

  value: ICardOutput;
  load: boolean;
  select: boolean;

  isSelectable: boolean;

  connect(dataPart: IDataBusPart, ctrlPart: IBusPart): void;
  connect(dataPart: IDataBusPart, ctrlPart: IBusPart, dataPartOut: IDataBusPart): void;
  connectCardPart(cardPart: ICardOutput, ctrlPart: IBusPart, dataPartOut: IDataBusPart): void;
  connectDirect(registerConnect: IDataBusPart): void;
}

export class RegisterCardPart implements IRegisterCardPart {

  value: CardOutput;
  load: boolean = false;
  select: boolean = false;

  isSelectable: boolean;

  private dataPart: IDataBusPart | undefined;
  private cardPart: ICardOutput | undefined;
  private ctrlPart: IRegisterABCDBusPart | undefined;

  private valueOut: CardOutput;

  constructor(private loadLine: number, private selectLine: number | undefined = undefined) {

    this.isSelectable = (selectLine !== undefined);

    this.value = new CardOutput();
    this.valueOut = new CardOutput();
  }

  connect(dataPartIn: IDataBusPart, ctrlPart: IBusPart, dataPartOut: IDataBusPart | undefined = undefined) {
    // Inputs
    this.dataPart = dataPartIn;
    this.dataPart.subscribe(this.update);
    this.ctrlPart = ctrlPart;
    this.ctrlPart.subscribe(this.update);
    // Outputs
    if (dataPartOut) { dataPartOut.connect(this.valueOut); }
  }
  connectCardPart(cardPart: ICardOutput, ctrlPart: IBusPart, dataPartOut: IDataBusPart) {
    // Inputs
    this.cardPart = cardPart;
    this.cardPart.subscribe(this.update);
    this.ctrlPart = ctrlPart;
    this.ctrlPart.subscribe(this.update);
    // Outputs
    if (dataPartOut) { dataPartOut.connect(this.valueOut); }
  }
  connectDirect(registerConnect: IDataBusPart) {
    // Outputs
    registerConnect.connect(this.value);
  }

  private update = () => {

    const value = this.dataPart ? this.dataPart.value : (this.cardPart ? this.cardPart.value : BitValue.Zero);

    if (this.ctrlPart) {

      const ld = this.ctrlPart.value.bit(this.loadLine);
      const sel = this.selectLine ? this.ctrlPart.value.bit(this.selectLine) : false;

      if (ld && sel) {
        // Loading and Selecting -> Clears Register
        if (!this.load) { this.load = true; }
        if (!this.select) { this.select = true; }
        this.value.value = BitValue.Zero;
        this.valueOut.value = BitValue.Zero;
      } else if (ld) {
        // Loading -> Sets Register
        if (!this.load) { this.load = true; }
        if (!this.select) { this.select = true; }
        this.value.value = value;
        this.valueOut.value = BitValue.Zero;
      } else if (sel) {
        // Selecting -> Gate Register
        if (this.load) { this.load = false; }
        if (!this.select) { this.select = true; }
        this.valueOut.value = this.value.value;
      } else {
        if (this.load) { this.load = false; }
        if (this.select) { this.select = false; }
        this.valueOut.value = BitValue.Zero;
      }
    }
  }
}
