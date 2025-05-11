jest.mock('path', () => {
  const originalPath = jest.requireActual('path');
  return {
    __esModule: true,
    ...originalPath,
    join: jest.fn(originalPath.join),
  };
});

import * as path from 'path';

import {
  readFileAsynchronously,
  doStuffByTimeout,
  doStuffByInterval,
} from './index';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, 1000);

    expect(callback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, 500);

    jest.advanceTimersByTime(499);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and interval', () => {
    const callback = jest.fn();
    doStuffByInterval(callback, 200);

    jest.advanceTimersByTime(600);
    expect(callback).toHaveBeenCalledTimes(3);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    doStuffByInterval(callback, 100);

    jest.advanceTimersByTime(250);
    expect(callback).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(100);
    expect(callback).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  const fakePath = 'test.txt';

  beforeAll(() => {
    jest.spyOn(path, 'join');
  });

  afterAll(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  test('should call join with pathToFile', async () => {
    const existsSpy = jest
      .spyOn(require('fs'), 'existsSync')
      .mockReturnValue(false);

    await readFileAsynchronously(fakePath);

    expect(path.join).toHaveBeenCalledWith(__dirname, fakePath);
    existsSpy.mockRestore();
  });

  test('should return null if file does not exist', async () => {
    jest.spyOn(require('fs'), 'existsSync').mockReturnValue(false);

    const result = await readFileAsynchronously(fakePath);
    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const sampleContent = 'hello world';

    jest.spyOn(require('fs'), 'existsSync').mockReturnValue(true);
    jest
      .spyOn(require('fs/promises'), 'readFile')
      .mockResolvedValue(Buffer.from(sampleContent));

    const result = await readFileAsynchronously(fakePath);
    expect(result).toBe(sampleContent);
  });
});
