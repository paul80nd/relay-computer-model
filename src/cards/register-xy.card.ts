import { ICardYBusGroup } from '../bus/bus-groups';
import { RegJMXYLines } from '../bus/bus-part-lines';
import { IRegisterYCardPart, RegisterYCardPart } from './parts/register-y.cardpart';

export interface IRegisterXYCard {

  register: IRegisterYCardPart;

  connect(dataBus: ICardYBusGroup): void;
}

export class RegisterXYCard implements IRegisterXYCard {

  register: IRegisterYCardPart;

  constructor() {
    this.register = new RegisterYCardPart(
      RegJMXYLines.LDX, RegJMXYLines.SEX,
      RegJMXYLines.LDY, RegJMXYLines.SEY,
      RegJMXYLines.LXY, RegJMXYLines.SXY);
  }

  connect(busGroup: ICardYBusGroup) {
    const addressPart = busGroup.addressBus.addressPart;
    const dataPart = busGroup.dataControlBus.dataPart;
    const ctrlPart = busGroup.controlYBus.regJMXYPart;
    this.register.connect(dataPart, addressPart, ctrlPart, dataPart);
  }

}
