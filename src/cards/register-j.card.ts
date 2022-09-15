import { ICardYBusGroup } from '../bus/bus-groups';
import { RegJMXYLines } from '../bus/bus-part-lines';
import { IRegisterYCardPart, RegisterYCardPart } from './parts/register-y.cardpart';

export interface IRegisterJCard {

  register: IRegisterYCardPart;

  connect(dataBus: ICardYBusGroup): void;
}

export class RegisterJCard implements IRegisterJCard {

  register: IRegisterYCardPart;

  constructor() {
    this.register = new RegisterYCardPart(
      RegJMXYLines.LJ1, undefined,
      RegJMXYLines.LJ2, undefined,
      undefined, RegJMXYLines.SEJ);
  }

  connect(busGroup: ICardYBusGroup) {
    const addressPart = busGroup.addressBus.addressPart;
    const dataPart = busGroup.dataControlBus.dataPart;
    const ctrlPart = busGroup.controlYBus.regJMXYPart;
    this.register.connect(dataPart, addressPart, ctrlPart, dataPart);
  }

}
