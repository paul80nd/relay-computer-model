import { BitValue } from "../bit-value";
import { ICardXBusGroup } from "../bus/bus-groups";
import { ClockCtrlLines, ClockLines } from "../bus/bus-part-lines";
import { CardOutput, ICardOutput } from "./card-output";

export interface IClockCard {
  clockEnabled: ICardOutput;
  clockType: ICardOutput;
  clockSpeed: ICardOutput;

  clock: BitValue;
  stages: BitValue;

  connect(busGroup: ICardXBusGroup): void;
  toggleEnabled(): void;
  toggleClockType(): void;
  setClockSpeed(speed: number): void;
  nextClockSpeed(): void;
}

export class ClockCard implements IClockCard {

  clockEnabled: CardOutput;
  clockType: CardOutput;
  clockSpeed: CardOutput;

  clock: BitValue;
  stages: BitValue;

  private clockOut: CardOutput;

  runCrystal = false;
  runRelay = false;
  freeze = true;  // freeze line will be on by default
  delay = 0;

  constructor(clockDisabled?:boolean) {
    this.clockOut = new CardOutput();
    this.clockEnabled = new CardOutput();
    this.clockEnabled.value = this.clockEnabled.value.flipBit(clockDisabled ? 1 : 0);
    this.clockType = new CardOutput();
    this.clockSpeed = new CardOutput();
    this.clockSpeed.value = BitValue.fromUnsignedNumber(2);
    this.clock = BitValue.Zero;
    this.stages = BitValue.Zero;
  }

  connect(busGroup: ICardXBusGroup) {
    this.clockEnabled.subscribe(this.update);
    this.clockType.subscribe(this.update);
    this.clockSpeed.subscribe(this.updateSpeed);
    busGroup.controlXBus.clockPart.connect(this.clockOut);
    busGroup.controlXBus.clockPart.subscribe(v => this.clock = v);
    busGroup.controlXBus.clockCtrlPart.subscribe(this.updateCtrl);
  }

  private update = () => {
    if (!this.clockEnabled.value.bit(0)) {
      // Powered off
      this.runCrystal = false;
      this.runRelay = false;
      this.stages = BitValue.Zero;
      this.clockOut.value = BitValue.Zero;
    } else {
      // Powered on

      // Kick off clock if type changed or not running
      if (this.clockType.value.bit(0) && !this.runCrystal) {
        // Crystal clock
        this.runCrystal = true;
        this.runRelay = false;
        this.stages = BitValue.Zero;
        this.clockOut.value = BitValue.Zero;
        this.delay = 2000 * Math.pow(2, 0 - this.clockSpeed.value.toUnsignedNumber());
        this.clockRunCrystal();
      } else if (!this.runRelay) {
        // Relay clock
        this.runRelay = true;
        this.runCrystal = false;
        this.stages = BitValue.Zero;
        this.clockOut.value = BitValue.Zero;
        this.delay = 300;
        this.clockRunRelay();
      }
    }
  };

  private updateSpeed = (v: BitValue) => {
    // Accept frequency change if crystal clock running
    if (this.runCrystal) {
      this.delay = 2000 * Math.pow(2, 0 - v.toUnsignedNumber());
    }
  };

  private updateCtrl = (v: BitValue) => {
    this.freeze = v.bit(ClockCtrlLines.FRZ);
    // freeze overrides everything
    if (!this.freeze) {
      if (!v.bit(ClockCtrlLines.RST)) {
        // Restart vetos halt
        if (v.bit(ClockCtrlLines.HLT)) {
          // halt causes freeze
          this.freeze = true;
        }
      }
    }

  };

  toggleEnabled(): void {
    this.clockEnabled.value = this.clockEnabled.value.flipBit(0);
  }

  toggleClockType(): void {
    this.clockType.value = this.clockType.value.flipBit(0);
  }

  nextClockSpeed(): void {
    this.clockSpeed.value = this.clockSpeed.value.increment().cap(3);
  }

  setClockSpeed(speed: number): void {
    this.clockSpeed.value = BitValue.fromUnsignedNumber(speed).cap(3);
  }

  // .25Hz 2000 0 1
  // .5Hz 1000  1 1/2
  // 1Hz  500   2 1/4
  // 2Hz  250   3 1/8
  // 4Hz  125   4 1/16
  // 8Hz  62    5 1/32
  // 16Hz 31    6 1/64
  // 32Hz 16    7 1/128

  private clockRunCrystal = () => {
    if (this.runCrystal) {
      // only change state if not frozen or currently high
      if (!this.freeze || this.clockOut.value.bit(ClockLines.CLK)) {
        this.clockOut.value = this.clockOut.value.flipBit(ClockLines.CLK);
      }
      // for purposes of simulation the timeout continues to allow un-freeze to take effect
      setTimeout(this.clockRunCrystal, this.delay);
    }
  };

  private clockRunRelay = () => {
    if (this.runRelay) {
      // Relay Clock 0011 3 off / 0110 6 on / 1100 12 off / 1001 9 on
      let stage = this.stages.toUnsignedNumber();
      let clk = BitValue.Zero;
      if (stage === 3) {
        if (!this.freeze) {
          stage = 6;
          clk = clk.flipBit(ClockLines.CLK);
        }
      } else if (stage === 6) {
        stage = 12;
      } else if (stage === 12) {
        if (!this.freeze) {
          stage = 9;
          clk = clk.flipBit(ClockLines.CLK);
        }
      } else {
        stage = 3;
      }
      this.stages = BitValue.fromUnsignedNumber(stage);
      this.clockOut.value = clk;
      setTimeout(this.clockRunRelay, this.delay);
    }
  }

}
