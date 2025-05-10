import {
  resolveValue,
  throwError,
  throwCustomError,
  rejectCustomError,
  MyAwesomeError,
} from './index';

describe('resolveValue', () => {
  test('should resolve provided value', async () => {
    await expect(resolveValue(42)).resolves.toBe(42);
    const obj = { foo: 'bar' };
    await expect(resolveValue(obj)).resolves.toBe(obj);
  });
});

describe('throwError', () => {
  test('should throw error with provided message', () => {
    expect(() => throwError('Test message')).toThrow('Test message');
  });

  test('should throw error with default message if message is not provided', () => {
    expect(() => throwError()).toThrow('Oops!');
  });
});

describe('throwCustomError', () => {
  test('should throw custom error', () => {
    expect(() => throwCustomError()).toThrow(MyAwesomeError);
    try {
      throwCustomError();
    } catch (err) {
      expect(err).toBeInstanceOf(MyAwesomeError);
      expect((err as Error).message).toBe('This is my awesome custom error!');
    }
  });
});

describe('rejectCustomError', () => {
  test('should reject custom error', async () => {
    await expect(rejectCustomError()).rejects.toBeInstanceOf(MyAwesomeError);
    await expect(rejectCustomError()).rejects.toThrow(
      'This is my awesome custom error!',
    );
  });
});
