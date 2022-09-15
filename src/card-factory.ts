import {
  AluArithmeticCard, AluControlCard, AluLogicCard, AuxControlCard,
  ControlCard, ControlSwitchesCard, DecoderCard, DisplayACard,
  DisplayBCard, IAluArithmeticCard, IAluControlCard, IAluLogicCard,
  IAuxControlCard, IControlCard, IControlSwitchesCard, IDecoderCard,
  IDisplayACard, IDisplayBCard, IIncrementerCard, IMemoryCard,
  IncrementerCard, IRegisterADCard, IRegisterBCCard, IRegisterICard,
  IRegisterJCard, IRegisterMCard, IRegisterPCCard, IRegisterXYCard,
  ISequencerCard, MemoryCard, RegisterADCard, RegisterBCCard,
  RegisterICard, RegisterJCard, RegisterMCard, RegisterPCCard,
  RegisterXYCard, SequencerCard
} from './cards';

export interface ICardFactory {
  createAluArithmetic(): IAluArithmeticCard;
  createAluControl(): IAluControlCard;
  createAluLogic(): IAluLogicCard;
  createCards(): ICards;
  createControl(): IControlCard;
  createDecoder(): IDecoderCard;
  createIncrementer(): IIncrementerCard;
  createMemory(): IMemoryCard;
  createRegisterAD(): IRegisterADCard;
  createRegisterBC(): IRegisterBCCard;
  createRegisterI(): IRegisterICard;
  createRegisterJ(): IRegisterJCard;
  createRegisterM(): IRegisterMCard;
  createRegisterPC(): IRegisterPCCard;
  createRegisterXY(): IRegisterXYCard;
  createSequencer(): ISequencerCard;
}

export interface ICards {
  getAuxControl(): IAuxControlCard;
  getControlSwitches(): IControlSwitchesCard;
  getDisplayA(): IDisplayACard;
  getDisplayB(): IDisplayBCard;
}

class Cards implements ICards {

  constructor(
    private auxControl: IAuxControlCard,
    private controlSwitches: IControlSwitchesCard,
    private displayA: IDisplayACard,
    private displayB: IDisplayBCard) { }

  getAuxControl(): IAuxControlCard { return this.auxControl; }
  getControlSwitches(): IControlSwitchesCard { return this.controlSwitches; }
  getDisplayA(): IDisplayACard { return this.displayA; }
  getDisplayB(): IDisplayBCard { return this.displayB; }
}

export class CardFactory implements ICardFactory {

  createCards(): ICards {
    return new Cards(
      new AuxControlCard(),
      new ControlSwitchesCard(),
      new DisplayACard(),
      new DisplayBCard()
    );
  }

  createAluArithmetic(): IAluArithmeticCard { return new AluArithmeticCard(); }
  createAluControl(): IAluControlCard { return new AluControlCard(); }
  createAluLogic(): IAluLogicCard { return new AluLogicCard(); }
  createControl(): IControlCard { return new ControlCard(); }
  createDecoder(): IDecoderCard { return new DecoderCard(); }
  createIncrementer(): IIncrementerCard { return new IncrementerCard(); }
  createMemory(): IMemoryCard { return new MemoryCard(); }
  createRegisterAD(): IRegisterADCard { return new RegisterADCard(); }
  createRegisterBC(): IRegisterBCCard { return new RegisterBCCard(); }
  createRegisterI(): IRegisterICard { return new RegisterICard(); }
  createRegisterJ(): IRegisterJCard { return new RegisterJCard(); }
  createRegisterM(): IRegisterMCard { return new RegisterMCard(); }
  createRegisterPC(): IRegisterPCCard { return new RegisterPCCard(); }
  createRegisterXY(): IRegisterXYCard { return new RegisterXYCard(); }
  createSequencer(): ISequencerCard { return new SequencerCard(); }

}
