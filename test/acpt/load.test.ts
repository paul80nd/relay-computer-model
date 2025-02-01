import { TestComputer } from "./helpers";

test('load', function () {
  const sut = new TestComputer();
  // ldi m, 0004; ldr a; hlt; --; 0xED
  sut.runToHalt([0xC0, 0x00, 0x06, 0x90, 0xAE, 0x00, 0xED]);
  expect(sut.pcAddress).toBe(0x0005);
  expect(sut.registerA).toBe(0xED)
});
