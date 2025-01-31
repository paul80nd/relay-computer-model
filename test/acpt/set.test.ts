import { TestComputer } from "./helpers";

test('set a 9', function () {
  const sut = new TestComputer();
  sut.runToHalt([0x49,0xAE]);

  expect(sut.pcAddress).toBe(0x0002);
  expect(sut.registerA).toBe(0x09);
});

test('set b -5', function () {
  const sut = new TestComputer();
  sut.runToHalt([0x7B,0xAE]);

  expect(sut.pcAddress).toBe(0x0002);
  expect(sut.registerB).toBe(0xFB);
});
