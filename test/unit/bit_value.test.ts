'use strict';

import * as sut from '../../src/bit-value';

test('zero instance', function () {
  const test = sut.BitValue.Zero;
  expect(test.isZero()).toBe(true);
});

test('from/to unsigned', function () {
  const test = sut.BitValue.fromUnsignedNumber(4);
  expect(test.toUnsignedNumber()).toBe(4);
});

test('combine', function () {
  const test1 = sut.BitValue.fromUnsignedNumber(0b1100000);
  const test2 = sut.BitValue.fromUnsignedNumber(0b0110000);
  const test3 = sut.BitValue.fromUnsignedNumber(0b0000011);
  const test = sut.BitValue.combine([test1, test2, test3]);
  expect(test.toUnsignedNumber()).toBe(0b1110011);
});

test('from hilo', function () {
  const hi = sut.BitValue.fromUnsignedNumber(0xFE);
  const lo = sut.BitValue.fromUnsignedNumber(0xDC);
  const test = sut.BitValue.fromHiLo(hi, lo);
  expect(test.toUnsignedNumber()).toBe(0xFEDC);
});

test('bit', function () {
  const test = sut.BitValue.fromUnsignedNumber(0b10101010);
  expect(test.bit(7)).toBe(true);
  expect(test.bit(6)).toBe(false);
});

test('is zero', function () {
  const test = sut.BitValue.fromUnsignedNumber(0x0);
  expect(test.isZero()).toBe(true);
});

test('isn\'t zero', function () {
  const test = sut.BitValue.fromUnsignedNumber(0x1);
  expect(test.isZero()).toBe(false);
});

test('equal', function () {
  const test1 = sut.BitValue.fromUnsignedNumber(4);
  const test2 = sut.BitValue.fromUnsignedNumber(4);
  expect(test1.isEqualTo(test2)).toBe(true);
});

test('not equal', function () {
  const test1 = sut.BitValue.fromUnsignedNumber(6);
  const test2 = sut.BitValue.fromUnsignedNumber(2);
  expect(test1.isEqualTo(test2)).toBe(false);
});

test('flip bit', function () {
  let test = sut.BitValue.fromUnsignedNumber(0b10101010);
  test = test.flipBit(0);
  test = test.flipBit(1);
  test = test.flipBit(2);
  expect(test.toUnsignedNumber()).toBe(0b10101101);
});

test('increment', function () {
  let test = sut.BitValue.fromUnsignedNumber(0b10101010);
  test = test.increment();
  test = test.increment();
  test = test.increment();
  expect(test.toUnsignedNumber()).toBe(0b10101101);
});

test('not', function () {
  const test = sut.BitValue.fromUnsignedNumber(0b10101100);
  expect(test.not().cap(8).toUnsignedNumber()).toBe(0b01010011);
});

test('shiftLeft', function () {
  const test = sut.BitValue.fromUnsignedNumber(0b10101100);
  expect(test.shiftLeft(8).toUnsignedNumber()).toBe(0b01011001); // testing rotate left
});

test('and', function () {
  const test1 = sut.BitValue.fromUnsignedNumber(0b11110000);
  const test2 = sut.BitValue.fromUnsignedNumber(0b11001100);
  expect(test1.and(test2).toUnsignedNumber()).toBe(0b11000000);
});

test('or', function () {
  const test1 = sut.BitValue.fromUnsignedNumber(0b11110000);
  const test2 = sut.BitValue.fromUnsignedNumber(0b11001100);
  expect(test1.or(test2).toUnsignedNumber()).toBe(0b11111100);
});

test('xor', function () {
  const test1 = sut.BitValue.fromUnsignedNumber(0b11110000);
  const test2 = sut.BitValue.fromUnsignedNumber(0b11001100);
  expect(test1.xor(test2).toUnsignedNumber()).toBe(0b00111100);
});

test('add', function () {
  const test1 = sut.BitValue.fromUnsignedNumber(24);
  const test2 = sut.BitValue.fromUnsignedNumber(38);
  expect(test1.add(test2).toUnsignedNumber()).toBe(62);
});

test('hi part', function () {
  const test = sut.BitValue.fromUnsignedNumber(0xfedc);
  expect(test.hiPart().toUnsignedNumber()).toBe(0xfe);
});

test('lo part', function () {
  const test = sut.BitValue.fromUnsignedNumber(0xfedc);
  expect(test.loPart().toUnsignedNumber()).toBe(0xdc);
});

test('cap', function () {
  const test = sut.BitValue.fromUnsignedNumber(0xfedc);
  expect(test.cap(12).toUnsignedNumber()).toBe(0xedc);
});
