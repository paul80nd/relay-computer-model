import { TestComputer } from "./helpers";

test('goto set m to 0x4321', function () {
  const sut = new TestComputer();
  sut.runToHalt([0xC0, 0x43, 0x21, 0xAE]);

  expect(sut.pcAddress).toBe(0x0004);
  expect(sut.registerM1).toBe(0x43);
  expect(sut.registerM2).toBe(0x21);
});
