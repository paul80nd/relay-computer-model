import { ICardXBusGroup } from '../bus/bus-groups';
import { RegAuxLines } from '../bus/bus-part-lines';
import { IRegisterCardPart, RegisterCardPart } from './parts/register.cardpart';

export interface IRegisterPCCard {

  register: IRegisterCardPart;
  pcAddress: number;

  connect(dataBus: ICardXBusGroup): void;
}

export class RegisterPCCard implements IRegisterPCCard {

  register: IRegisterCardPart;
  pcAddress = 0;

  constructor() {
    this.register = new RegisterCardPart(RegAuxLines.LPC, RegAuxLines.SPC);
  }

  connect(busGroup: ICardXBusGroup) {
    const addressPart = busGroup.addressBus.addressPart;
    const ctrlPart = busGroup.controlXBus.auxRegisterPart;
    this.register.connect(addressPart, ctrlPart, addressPart);
    this.register.value.subscribe(e => this.pcAddress = e.toUnsignedNumber());
  }
}
