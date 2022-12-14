import { ICardYBusGroup } from '../bus/bus-groups';
import { RegJMXYLines } from '../bus/bus-part-lines';
import { IRegisterYCardPart, RegisterYCardPart } from './parts/register-y.cardpart';

export interface IRegisterMCard {

  register: IRegisterYCardPart;

  connect(dataBus: ICardYBusGroup): void;
}

export class RegisterMCard implements IRegisterMCard {

  register: IRegisterYCardPart;

  constructor() {
    this.register = new RegisterYCardPart(
      RegJMXYLines.LM1, RegJMXYLines.SM1,
      RegJMXYLines.LM2, RegJMXYLines.SM2,
      undefined, RegJMXYLines.SEM);
  }

  connect(busGroup: ICardYBusGroup) {
    const addressPart = busGroup.addressBus.addressPart;
    const dataPart = busGroup.dataControlBus.dataPart;
    const ctrlPart = busGroup.controlYBus.regJMXYPart;
    this.register.connect(dataPart, addressPart, ctrlPart, dataPart);
  }

}
