jest.mock('lodash', () => ({ random: jest.fn() }));

import { random } from 'lodash';
import {
  getBankAccount,
  TransferFailedError,
  SynchronizationFailedError,
  InsufficientFundsError,
} from './index';

describe('BankAccount', () => {
  beforeEach(() => {
    (random as jest.Mock).mockClear();
  });

  test('should create account with initial balance', () => {
    const account = getBankAccount(100);
    expect(account.getBalance()).toBe(100);
  });

  test('should throw InsufficientFundsError when withdrawing more than balance', () => {
    const account = getBankAccount(50);
    expect(() => account.withdraw(60)).toThrow(InsufficientFundsError);
    expect(() => account.withdraw(60)).toThrow(
      'Insufficient funds: cannot withdraw more than 50',
    );
  });

  test('should throw InsufficientFundsError when transferring more than balance', () => {
    const accountA = getBankAccount(30);
    const accountB = getBankAccount(20);
    expect(() => accountA.transfer(40, accountB)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw TransferFailedError when transferring to same account', () => {
    const account = getBankAccount(100);
    expect(() => account.transfer(50, account)).toThrow(TransferFailedError);
    expect(() => account.transfer(50, account)).toThrow('Transfer failed');
  });

  test('should deposit money and support chaining', () => {
    const account = getBankAccount(20);
    const returned = account.deposit(30);
    expect(account.getBalance()).toBe(50);
    expect(returned).toBe(account);
  });

  test('should withdraw money and support chaining', () => {
    const account = getBankAccount(80);
    const returned = account.withdraw(30);
    expect(account.getBalance()).toBe(50);
    expect(returned).toBe(account);
  });

  test('should transfer money between accounts and support chaining', () => {
    const accountA = getBankAccount(100);
    const accountB = getBankAccount(50);
    const returned = accountA.transfer(40, accountB);
    expect(accountA.getBalance()).toBe(60);
    expect(accountB.getBalance()).toBe(90);
    expect(returned).toBe(accountA);
  });

  describe('fetchBalance', () => {
    test('should return number when request does not fail', async () => {
      (random as jest.Mock).mockReturnValueOnce(42).mockReturnValueOnce(1);

      const account = getBankAccount(0);
      await expect(account.fetchBalance()).resolves.toBe(42);
    });

    test('should return null when request fails', async () => {
      (random as jest.Mock).mockReturnValueOnce(24).mockReturnValueOnce(0);

      const account = getBankAccount(0);
      await expect(account.fetchBalance()).resolves.toBeNull();
    });
  });

  describe('synchronizeBalance', () => {
    test('should set new balance if fetchBalance returns number', async () => {
      (random as jest.Mock).mockReturnValueOnce(77).mockReturnValueOnce(1);

      const account = getBankAccount(10);
      await account.synchronizeBalance();
      expect(account.getBalance()).toBe(77);
    });

    test('should throw SynchronizationFailedError if fetchBalance returns null', async () => {
      (random as jest.Mock).mockReturnValueOnce(5).mockReturnValueOnce(0);

      const account = getBankAccount(10);
      await expect(account.synchronizeBalance()).rejects.toThrow(
        SynchronizationFailedError,
      );
      await expect(account.synchronizeBalance()).rejects.toThrow(
        'Synchronization failed',
      );
    });
  });
});
