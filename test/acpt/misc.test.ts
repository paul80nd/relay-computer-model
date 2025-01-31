import { TestComputer } from "./helpers";

test('hlt 1', function () {
  const sut = new TestComputer();
  sut.runToHalt([0xAE]);
  expect(sut.pcAddress).toBe(0x0001);
});

test('hlt 2', function () {
  const sut = new TestComputer();
  sut.runToHalt([0x00, 0xAE]);
  expect(sut.pcAddress).toBe(0x0002);
});

test('hlt 3', function () {
  const sut = new TestComputer();
  sut.runToHalt([0x00, 0x00, 0xAE]);
  expect(sut.pcAddress).toBe(0x0003);
});
