import { CardPart } from './card-part';
import { BitValue } from '../bit-value';
import { ICardXBusGroup } from '../bus/bus-groups';
import { I2BLines, RegAuxLines } from '../bus/bus-part-lines';
import { IRegisterCardPart, RegisterCardPart } from './parts/register.cardpart';
import { IAddressBusPart, IDataBusPart, II2BBusPart, IInstructionBusPart } from '../bus/bus-parts';

export interface IIncrementerCard {

  increment: BitValue;
  register: IRegisterCardPart;

  connect(dataBus: ICardXBusGroup): void;
}

export class IncrementerCard implements IIncrementerCard {

  increment: BitValue;
  register: IRegisterCardPart;

  private addressPart: IAddressBusPart | undefined;

  private incrementOut: CardPart;

  constructor() {
    this.increment = BitValue.Zero;
    this.incrementOut = new CardPart();
    this.register = new RegisterCardPart(RegAuxLines.LIC, RegAuxLines.SIC);
  }

  connect(busGroup: ICardXBusGroup) {
    this.addressPart = busGroup.addressBus.addressPart;
    this.addressPart.subscribe(this.update);
    const ctrlPart = busGroup.controlXBus.auxRegisterPart;
    this.register.connectCardPart(this.incrementOut, ctrlPart, this.addressPart);
  }

  private update = () => {
    if (this.addressPart) {
      const addr = this.addressPart.value;
      let value = addr.increment();
      value = value.cap(16);

      if (!this.increment.isEqualTo(value)) { this.increment = value; }
      if (!this.incrementOut.value.isEqualTo(value)) { this.incrementOut.value = value; }
    }
  };
}
