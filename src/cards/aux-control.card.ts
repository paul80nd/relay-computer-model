import { CardOutput } from './card-output';
import { BitValue } from '../bit-value';
import { IAuxControlBusGroup, IControlSwitchesBusGroup } from '../bus/bus-groups';
import { IDataBusPart, IDataSwitchGateBusPart } from '../bus/bus-parts';
import { DataSwitchGateLines } from '../bus/bus-part-lines';

export interface IAuxControlCard {
  connect(busGroup1: IControlSwitchesBusGroup, busGroup2: IAuxControlBusGroup): void;
}

export class AuxControlCard implements IAuxControlCard {

  private addr: CardOutput;
  private data: CardOutput;
  private dataPart: IDataBusPart | undefined;
  private sds: IDataSwitchGateBusPart | undefined;

  constructor() {
    this.addr = new CardOutput();
    this.data = new CardOutput();
  }

  connect(busGroup1: IControlSwitchesBusGroup, busGroup2: IAuxControlBusGroup) {
    // Inputs
    this.dataPart = busGroup1.dataControlBus.dataPart;
    this.dataPart.subscribe(this.update);
    this.sds = busGroup2.controlYBus.sdsPart;
    this.sds.subscribe(this.update);

    // Outputs
    busGroup2.dataControlBus.dataPart.connect(this.data);
    busGroup2.addressBus.addressPart.connect(this.addr);
  }

  private update = () => {
    // Gates the contents of the data switches to the data bus when SDS/SAS selected
    if (this.sds && this.dataPart) {
      this.data.value = this.sds.value.bit(DataSwitchGateLines.SDS) ? this.dataPart.value : BitValue.Zero;
      this.addr.value = this.sds.value.bit(DataSwitchGateLines.SAS) ? this.dataPart.value : BitValue.Zero;
    }
  };

}
