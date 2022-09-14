import { AuxControlCard, IAuxControlCard } from './aux_control.card';
import { ControlCard, IControlCard } from './control.card';
import { ControlSwitchesCard, IControlSwitchesCard } from './control_switches.card';
import { DecoderCard, IDecoderCard } from './decoder.card';
import { DisplayACard, IDisplayACard } from './display_a.card';
import { DisplayBCard, IDisplayBCard } from './display_b.card';
import { IIncrementerCard, IncrementerCard } from './incrementer.card';
import { IMemoryCard, MemoryCard } from './memory.card';
import { IRegisterADCard, RegisterADCard } from './register_ad.card';
import { IRegisterBCCard, RegisterBCCard } from './register_bc.card';
import { IRegisterICard, RegisterICard } from './register_i.card';
import { IRegisterPCCard, RegisterPCCard } from './register_pc.card';
import { AluLogicCard, IAluLogicCard } from './alu_logic.card';
import { AluArithmeticCard, IAluArithmeticCard } from './alu_arithmetic.card';
import { AluControlCard, IAluControlCard } from './alu_control.card';
import { ISequencerCard, SequencerCard } from './sequencer.card';
import { IRegisterJCard, RegisterJCard } from './register_j.card';
import { IRegisterMCard, RegisterMCard } from './register_m.card';
import { IRegisterXYCard, RegisterXYCard } from './register_xy.card';

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
      new DisplayBCard());
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
