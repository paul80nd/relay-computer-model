import { TestComputer } from "./helpers";

test('increment xy', function () {
  const sut = new TestComputer();
  sut.runToHalt([0xB0, 0xB0, 0xB0, 0xB0, 0xAE]);

  expect(sut.pcAddress).toBe(0x0005);
  expect(sut.registerX).toBe(0x00);
  expect(sut.registerY).toBe(0x04);
});
