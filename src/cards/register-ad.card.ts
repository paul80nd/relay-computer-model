import { ICardZBusGroup } from '../bus/bus-groups';
import { RegABCDLines } from '../bus/bus-part-lines';
import { IRegisterCardPart, RegisterCardPart } from './parts/register.cardpart';

export interface IRegisterADCard {

  registerA: IRegisterCardPart;
  registerD: IRegisterCardPart;

  connect(dataBus: ICardZBusGroup): void;
}

export class RegisterADCard implements IRegisterADCard {

  registerA: IRegisterCardPart;
  registerD: IRegisterCardPart;

  constructor() {
    this.registerA = new RegisterCardPart(RegABCDLines.RLA, RegABCDLines.RSA);
    this.registerD = new RegisterCardPart(RegABCDLines.RLD, RegABCDLines.RSD);
  }

  connect(busGroup: ICardZBusGroup) {
    const dataPart = busGroup.dataControlBus.dataPart;
    const ctrlPart = busGroup.controlZBus.regABCDPart;
    this.registerA.connect(dataPart, ctrlPart, dataPart);
    this.registerD.connect(dataPart, ctrlPart, dataPart);
  }

}
