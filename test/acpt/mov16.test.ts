import { TestComputer } from "./helpers";

test('move m to xy', function () {
  const sut = new TestComputer();
  // ldi m, 0x4321; mov xy,m; hlt
  sut.runToHalt([0xC0, 0x43, 0x21, 0xA0, 0xAE]);

  expect(sut.pcAddress).toBe(0x0005);
  expect(sut.registerX).toBe(0x43);
  expect(sut.registerY).toBe(0x21);
});
