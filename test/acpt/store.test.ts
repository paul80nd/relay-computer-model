import { TestComputer } from "./helpers";

test('store', function () {
  const sut = new TestComputer();
  // ldi a, -5 (0xFB); ldi m, 0x4321; str a
  sut.runToHalt([0x5B, 0xC0, 0x43, 0x21, 0x98, 0xAE]);
  expect(sut.pcAddress).toBe(0x0006);
  expect(sut.memory(0x4321)).toBe(0xFB)
});
