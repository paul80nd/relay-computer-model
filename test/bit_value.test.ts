'use strict';

import * as assert from 'assert';
import * as sut from '../src/bit_value'

suite('bit-value', () => {

  test('zero instance', function () {
    const test = sut.BitValue.Zero;
    assert.equal(test.isZero(), true);
  });

  test('from/to unsigned', function () {
    const test = sut.BitValue.fromUnsignedNumber(4);
    assert.equal(test.toUnsignedNumber(), 4);
  });

  test('combine', function () {
    const test1 = sut.BitValue.fromUnsignedNumber(0b1100000);
    const test2 = sut.BitValue.fromUnsignedNumber(0b0110000);
    const test3 = sut.BitValue.fromUnsignedNumber(0b0000011);
    const test = sut.BitValue.combine([test1, test2, test3]);
    assert.equal(test.toUnsignedNumber(), 0b1110011);
  });

  test('from hilo', function () {
    const hi = sut.BitValue.fromUnsignedNumber(0xFE);
    const lo = sut.BitValue.fromUnsignedNumber(0xDC);
    const test = sut.BitValue.fromHiLo(hi, lo);
    assert.equal(test.toUnsignedNumber(), 0xFEDC);
  });

  test('bit', function () {
    const test = sut.BitValue.fromUnsignedNumber(0b10101010);
    assert.equal(test.bit(7), true);
    assert.equal(test.bit(6), false);
  });

  test('is zero', function () {
    const test = sut.BitValue.fromUnsignedNumber(0x0);
    assert.equal(test.isZero(), true);
  });

  test('isn\'t zero', function () {
    const test = sut.BitValue.fromUnsignedNumber(0x1);
    assert.equal(test.isZero(), false);
  });

  test('equal', function () {
    const test1 = sut.BitValue.fromUnsignedNumber(4);
    const test2 = sut.BitValue.fromUnsignedNumber(4);
    assert.equal(test1.isEqualTo(test2), true);
  });

  test('not equal', function () {
    const test1 = sut.BitValue.fromUnsignedNumber(6);
    const test2 = sut.BitValue.fromUnsignedNumber(2);
    assert.equal(test1.isEqualTo(test2), false);
  });

  test('flip bit', function () {
    let test = sut.BitValue.fromUnsignedNumber(0b10101010);
    test = test.flipBit(0);
    test = test.flipBit(1);
    test = test.flipBit(2);
    assert.equal(test.toUnsignedNumber(), 0b10101101);
  });

  test('increment', function () {
    let test = sut.BitValue.fromUnsignedNumber(0b10101010);
    test = test.increment();
    test = test.increment();
    test = test.increment();
    assert.equal(test.toUnsignedNumber(), 0b10101101);
  });

  test('not', function () {
    let test = sut.BitValue.fromUnsignedNumber(0b10101100);
    assert.equal(test.not().cap(8).toUnsignedNumber(), 0b01010011);
  });

  test('shiftLeft', function () {
    let test = sut.BitValue.fromUnsignedNumber(0b10101100);
    assert.equal(test.shiftLeft(8).toUnsignedNumber(), 0b01011001); // testing rotate left
  });

  test('and', function () {
    const test1 = sut.BitValue.fromUnsignedNumber(0b11110000);
    const test2 = sut.BitValue.fromUnsignedNumber(0b11001100);
    assert.equal(test1.and(test2).toUnsignedNumber(), 0b11000000);
  });

  test('or', function () {
    const test1 = sut.BitValue.fromUnsignedNumber(0b11110000);
    const test2 = sut.BitValue.fromUnsignedNumber(0b11001100);
    assert.equal(test1.or(test2).toUnsignedNumber(), 0b11111100);
  });

  test('xor', function () {
    const test1 = sut.BitValue.fromUnsignedNumber(0b11110000);
    const test2 = sut.BitValue.fromUnsignedNumber(0b11001100);
    assert.equal(test1.xor(test2).toUnsignedNumber(), 0b00111100);
  });

  test('add', function () {
    const test1 = sut.BitValue.fromUnsignedNumber(24);
    const test2 = sut.BitValue.fromUnsignedNumber(38);
    assert.equal(test1.add(test2).toUnsignedNumber(), 62);
  });

  test('hi part', function () {
    const test = sut.BitValue.fromUnsignedNumber(0xfedc);
    assert.equal(test.hiPart().toUnsignedNumber(), 0xfe);
  });

  test('lo part', function () {
    const test = sut.BitValue.fromUnsignedNumber(0xfedc);
    assert.equal(test.loPart().toUnsignedNumber(), 0xdc);
  });

  test('cap', function () {
    const test = sut.BitValue.fromUnsignedNumber(0xfedc);
    assert.equal(test.cap(12).toUnsignedNumber(), 0xedc);
  });

});
