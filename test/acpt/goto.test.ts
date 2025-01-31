import { TestComputer } from "./helpers";

test('goto set m to 0x4321', function () {
  const sut = new TestComputer();
  sut.runToHalt([0xC0, 0x43, 0x21, 0xAE]);

  expect(sut.pcAddress).toBe(0x0004);
  expect(sut.registerM1).toBe(0x43);
  expect(sut.registerM2).toBe(0x21);
});

test('goto call 0x0005', function () {
  const sut = new TestComputer();
  sut.runToHalt([0xE7, 0x00, 0x05, 0xAE, 0xAE, 0xAE]);

  expect(sut.pcAddress).toBe(0x0006);
  expect(sut.registerX).toBe(0x00);
  expect(sut.registerY).toBe(0x03);
});
