import { IAluArithmeticCard } from './cards/alu-arithmetic.card';
import { IAluControlCard } from './cards/alu-control.card';
import { IAluLogicCard } from './cards/alu-logic.card';
import { IControlCard } from './cards/control.card';
import { IDecoderCard } from './cards/decoder.card';
import { IIncrementerCard } from './cards/incrementer.card';
import { IMemoryCard } from './cards/memory.card';
import { IRegisterADCard } from './cards/register-ad.card';
import { IRegisterBCCard } from './cards/register-bc.card';
import { IRegisterICard } from './cards/register-i.card';
import { IRegisterPCCard } from './cards/register-pc.card';
import { ISequencerCard } from './cards/sequencer.card';
import { ICardWBusGroup, ICardXBusGroup, ICardYBusGroup, ICardZBusGroup } from './bus/bus_groups';
import { ICardFactory } from './card_factory';
import { IRegisterMCard } from './cards/register-m.card';
import { IRegisterXYCard } from './cards/register-xy.card';
import { IRegisterJCard } from './cards/register-j.card';

export interface IBackplaneFactory {
  createWBackplane(): IWBackplane;
  createXBackplane(): IXBackplane;
  createYBackplane(): IYBackplane;
  createZBackplane(): IZBackplane;
}

export interface IWBackplane {
  readonly control: IControlCard;
  readonly decoder: IDecoderCard;
  readonly sequencer: ISequencerCard;

  connect(busGroup: ICardWBusGroup): void;
}

export interface IXBackplane {
  readonly incrementer: IIncrementerCard;
  readonly registerI: IRegisterICard;
  readonly registerPC: IRegisterPCCard;

  connect(busGroup: ICardXBusGroup): void;
}

export interface IYBackplane {
  readonly memory: IMemoryCard;
  readonly registerJ: IRegisterJCard;
  readonly registerM: IRegisterMCard;
  readonly registerXY: IRegisterXYCard;

  connect(busGroup: ICardYBusGroup): void;
}

export interface IZBackplane {
  readonly aluArithmetic: IAluArithmeticCard;
  readonly aluControl: IAluControlCard;
  readonly aluLogic: IAluLogicCard;
  readonly registerAD: IRegisterADCard;
  readonly registerBC: IRegisterBCCard;

  connect(busGroup: ICardZBusGroup): void;
}

export class BackplaneFactory implements IBackplaneFactory {

  constructor(private cardFactory: ICardFactory) { }

  createWBackplane(): IWBackplane {
    return new WBackplane(
      this.cardFactory.createControl(),
      this.cardFactory.createDecoder(),
      this.cardFactory.createSequencer()
    );
  }

  createXBackplane(): IXBackplane {
    return new XBackplane(
      this.cardFactory.createIncrementer(),
      this.cardFactory.createRegisterI(),
      this.cardFactory.createRegisterPC()
    );
  }

  createYBackplane(): IYBackplane {
    return new YBackplane(
      this.cardFactory.createMemory(),
      this.cardFactory.createRegisterJ(),
      this.cardFactory.createRegisterM(),
      this.cardFactory.createRegisterXY()
    );
  }

  createZBackplane(): IZBackplane {
    return new ZBackplane(
      this.cardFactory.createAluArithmetic(),
      this.cardFactory.createAluControl(),
      this.cardFactory.createAluLogic(),
      this.cardFactory.createRegisterAD(),
      this.cardFactory.createRegisterBC());
  }

}

class WBackplane implements IWBackplane {

  constructor(
    public control: IControlCard,
    public decoder: IDecoderCard,
    public sequencer: ISequencerCard) { }

  connect(busGroup: ICardWBusGroup) {
    this.control.connect(busGroup);
    this.decoder.connect(busGroup);
    this.sequencer.connect(busGroup);
  }

}

class XBackplane implements IXBackplane {

  constructor(
    public incrementer: IIncrementerCard,
    public registerI: IRegisterICard,
    public registerPC: IRegisterPCCard) { }

  connect(busGroup: ICardXBusGroup) {
    this.incrementer.connect(busGroup);
    this.registerI.connect(busGroup);
    this.registerPC.connect(busGroup);
  }
}

class YBackplane implements IYBackplane {

  constructor(
    public memory: IMemoryCard,
    public registerJ: IRegisterJCard,
    public registerM: IRegisterMCard,
    public registerXY: IRegisterXYCard) { }

  connect(busGroup: ICardYBusGroup) {
    this.memory.connect(busGroup);
    this.registerJ.connect(busGroup);
    this.registerM.connect(busGroup);
    this.registerXY.connect(busGroup);
  }

}

class ZBackplane implements IZBackplane {

  constructor(
    public aluArithmetic: IAluArithmeticCard,
    public aluControl: IAluControlCard,
    public aluLogic: IAluLogicCard,
    public registerAD: IRegisterADCard,
    public registerBC: IRegisterBCCard) { }

  connect(busGroup: ICardZBusGroup) {
    this.aluArithmetic.connect(busGroup);
    this.aluControl.connect(busGroup);
    this.aluLogic.connect(busGroup);
    this.registerAD.connect(busGroup);
    this.registerBC.connect(busGroup);
  }
}
