import { BackplaneFactory, IWBackplane, IXBackplane, IYBackplane, IZBackplane } from './backplanes';
import { BusFactory } from './bus/bus';
import { BusGroupFactory } from './bus/bus-groups';
import { BusPartFactory } from './bus/bus-parts';
import { CardFactory } from './card-factory';
import { IAuxControlCard, IControlSwitchesCard, IDisplayACard, IDisplayBCard } from './cards';

export interface IComputer {
  controlSwitchesCard: IControlSwitchesCard;
  displayACard: IDisplayACard;
  displayBCard: IDisplayBCard;
  auxControlCard: IAuxControlCard;
  wBackplane: IWBackplane;
  xBackplane: IXBackplane;
  yBackplane: IYBackplane;
  zBackplane: IZBackplane;
}

export interface IComputerFactory {
  createComputer(withoutClock?:boolean): IComputer;
}

export class ComputerFactory implements IComputerFactory {

  createComputer(clockDisabled?:boolean): IComputer {

    const busFactory = new BusFactory(new BusPartFactory());
    const busGroupFactory = new BusGroupFactory(busFactory);
    const cardFactory = new CardFactory();
    const backplaneFactory = new BackplaneFactory(cardFactory);

    const cables = busGroupFactory.createBusGroups();
    const cards = cardFactory.createCards();

    const controlSwitchesBusGroup = cables.controlSwitches;
    const controlSwitchesCard = cards.getControlSwitches();
    controlSwitchesCard.connect(controlSwitchesBusGroup);

    const displayABusGroup = cables.displayA;
    const displayACard = cards.getDisplayA();
    displayACard.connect(displayABusGroup);

    const displayBBusGroup = cables.displayB;
    const displayBCard = cards.getDisplayB();
    displayBCard.connect(displayBBusGroup);

    const auxControlBusGroup = cables.auxControl;
    const auxControlCard = cards.getAuxControl();
    auxControlCard.connect(controlSwitchesBusGroup, auxControlBusGroup);

    const wBusGroup = cables.w;
    const wBackplane = backplaneFactory.createWBackplane();
    wBackplane.connect(wBusGroup);

    const xBusGroup = cables.x;
    const xBackplane = backplaneFactory.createXBackplane(clockDisabled);
    xBackplane.connect(xBusGroup);

    const yBusGroup = cables.y;
    const yBackplane = backplaneFactory.createYBackplane();
    yBackplane.connect(yBusGroup);

    const zBusGroup = cables.z;
    const zBackplane = backplaneFactory.createZBackplane();
    zBackplane.connect(zBusGroup);

    return {
      controlSwitchesCard,
      displayACard,
      displayBCard,
      auxControlCard,
      wBackplane,
      xBackplane,
      yBackplane,
      zBackplane
    };
  }

}
