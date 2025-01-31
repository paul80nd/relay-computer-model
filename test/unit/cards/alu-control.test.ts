import { AluFunctionClLines, ConditionLines } from '../../../src/bus/bus-part-lines';
import { expectPart, LinesPart, TestFactory, ValuePart } from './helpers';

const clPart = new LinesPart;
const opPart = new LinesPart;
const data = new ValuePart;

const { cf, bgs } = TestFactory.Deps;
const card = cf.createAluControl();
card.connect(bgs.z);
opPart.connectOn(bgs.z.controlZBus.aluOperationPart);
clPart.connectOn(bgs.z.dataControlBus.aluFunctionClPart);
data.connectOn(bgs.z.dataControlBus.dataPart);

const dcBus = bgs.z.dataControlBus;

test('Condition Default NZ', function () {
  // As ALU starts with no flags the NZ line is active
  expectPart(dcBus.conditionPart).hasLinesSet(ConditionLines.NZ);
});

test('Condition EZ/NZ', function () {
  data.set(0x12);
  clPart.flick(AluFunctionClLines.CL);
  expectPart(dcBus.conditionPart).hasLinesSet(ConditionLines.NZ);
  data.set(0x00);
  clPart.flick(AluFunctionClLines.CL);
  expectPart(dcBus.conditionPart).hasLinesSet(ConditionLines.EZ);
});

test('Condition SN', function () {
  data.set(0x80);
  clPart.flick(AluFunctionClLines.CL);
  expectPart(dcBus.conditionPart).hasLinesSet(ConditionLines.SN, ConditionLines.NZ);
  data.set(0x70);
  clPart.flick(AluFunctionClLines.CL);
  expectPart(dcBus.conditionPart).hasLinesSet(ConditionLines.NZ);
});
