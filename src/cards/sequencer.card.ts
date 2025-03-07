import { CardOutput } from './card-output';
import { BitValue } from '../bit-value';
import { ICardWBusGroup } from '../bus/bus-groups';
import { IAbortBusPart, IClockBusPart, IResetBusPart } from '../bus/bus-parts';
import { ClockLines, PulseLines, ResetLines, AbortLines } from '../bus/bus-part-lines';

export interface ISequencerCard {

  abort: BitValue;
  fsm: BitValue;
  pulse: BitValue;

  connect(dataBus: ICardWBusGroup): void;
}

export class SequencerCard implements ISequencerCard {

  abort: BitValue;
  fsm: BitValue;
  pulse: BitValue;

  private lastClock = false;

  private pulseOut: CardOutput;

  private resetPart: IResetBusPart | undefined;
  private clockPart: IClockBusPart | undefined;
  private abortPart: IAbortBusPart | undefined;

  constructor() {
    this.abort = BitValue.Zero;
    this.fsm = BitValue.Zero;
    this.pulse = BitValue.Zero;
    this.pulseOut = new CardOutput();
  }

  connect(busGroup: ICardWBusGroup) {
    // Inputs
    this.resetPart = busGroup.controlXBus.resetPart;
    this.resetPart.subscribe(this.reset);
    this.clockPart = busGroup.controlXBus.clockPart;
    this.clockPart.subscribe(this.clock);
    this.abortPart = busGroup.operationBus.abortPart;
    this.abortPart.subscribe(this.abortChanged);
    // Outputs
    busGroup.pulseBus.pulsePart.connect(this.pulseOut);
  }

  private reset = () => {
    const reset = this.resetPart?.value.bit(ResetLines.RES) ?? false;
    if (reset) {
      if (!this.fsm.bit(0) && !this.fsm.bit(1) && !this.fsm.bit(2)) {
        this.fsm = this.fsm.flipBit(0);
        this.derrivePulses();
      }
    }
  };

  private abortChanged = () => {
    if (this.abortPart && this.fsm.bit(5)) {
      const abort = this.abortPart.value;

      if (!this.abort.isEqualTo(abort)) { this.abort = abort; }
    }
  };

  private clock = () => {
    if (this.clockPart) {
      const clock = this.clockPart.value.bit(ClockLines.CLK);
      if (clock !== this.lastClock) {
        this.lastClock = clock;
        this.fsm = this.fsm.shiftLeft(24);
        if (this.fsm.bit(14) && this.abort.bit(AbortLines.AT14)) {
          this.fsm = this.fsm.flipBit(14);
          this.fsm = this.fsm.flipBit(0);
        }
        if (this.fsm.bit(12) && this.abort.bit(AbortLines.AT12)) {
          this.fsm = this.fsm.flipBit(12);
          this.fsm = this.fsm.flipBit(0);
        }
        if (this.fsm.bit(10) && this.abort.bit(AbortLines.AT10)) {
          this.fsm = this.fsm.flipBit(10);
          this.fsm = this.fsm.flipBit(0);
        }
        else if (this.fsm.bit(8) && this.abort.bit(AbortLines.AT08)) {
          this.fsm = this.fsm.flipBit(8);
          this.fsm = this.fsm.flipBit(0);
        }
        if (this.fsm.bit(0)) {
          this.abort = BitValue.Zero;
        }
        this.derrivePulses();
      }
    }
  };

  private derrivePulses = () => {
    let pulse = BitValue.Zero;
    const fsm = this.fsm;

    // P-A = S1 | S2
    if (fsm.bit(1) || fsm.bit(2) || fsm.bit(3)) { pulse = pulse.flipBit(PulseLines.A); }
    // P-B = S2'
    if (fsm.bit(2)) { pulse = pulse.flipBit(PulseLines.B); }
    // P-C = S5
    if (fsm.bit(5) || fsm.bit(6)) { pulse = pulse.flipBit(PulseLines.C); }
    // P-D = S5'
    if (fsm.bit(5)) { pulse = pulse.flipBit(PulseLines.D); }
    // P-E = S4 | S5
    if (fsm.bit(4) || fsm.bit(5) || fsm.bit(6)) { pulse = pulse.flipBit(PulseLines.E); }
    // P-F = S8
    if (fsm.bit(8) || fsm.bit(9)) { pulse = pulse.flipBit(PulseLines.F); }
    // P-G = S8'
    if (fsm.bit(8)) { pulse = pulse.flipBit(PulseLines.G); }
    // P-H = S11
    if (fsm.bit(11) || fsm.bit(12)) { pulse = pulse.flipBit(PulseLines.H); }
    // P-I = S11'
    if (fsm.bit(11)) { pulse = pulse.flipBit(PulseLines.I); }
    // P-J = S8 | S9
    if (fsm.bit(8) || fsm.bit(9) || fsm.bit(10)) { pulse = pulse.flipBit(PulseLines.J); }
    // P-K = S9'
    if (fsm.bit(9)) { pulse = pulse.flipBit(PulseLines.K); }
    // P-L = S12
    if (fsm.bit(12) || fsm.bit(13)) { pulse = pulse.flipBit(PulseLines.L); }
    // P-M = S12'
    if (fsm.bit(12)) { pulse = pulse.flipBit(PulseLines.M); }
    // P-N = S15 | S16
    if (fsm.bit(15) || fsm.bit(16) || fsm.bit(17)) { pulse = pulse.flipBit(PulseLines.N); }
    // P-O = S16'
    if (fsm.bit(16)) { pulse = pulse.flipBit(PulseLines.O); }
    // P-Q = S19
    if (fsm.bit(19) || fsm.bit(20)) { pulse = pulse.flipBit(PulseLines.Q); }
    // P-R = S19'
    if (fsm.bit(19)) { pulse = pulse.flipBit(PulseLines.R); }
    // P-S = S22
    if (fsm.bit(22) || fsm.bit(23)) { pulse = pulse.flipBit(PulseLines.S); }
    // P-T = S22'
    if (fsm.bit(22)) { pulse = pulse.flipBit(PulseLines.T); }

    this.pulse = pulse;
    this.pulseOut.value = pulse;

  };

}
