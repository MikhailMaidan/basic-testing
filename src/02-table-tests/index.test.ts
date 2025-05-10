import { simpleCalculator, Action } from './index';

describe('simpleCalculator table-driven tests', () => {
  const validCases: Array<{
    a: number;
    b: number;
    action: Action;
    expected: number;
  }> = [
    { a: 1, b: 2, action: Action.Add, expected: 3 },
    { a: 10, b: 5, action: Action.Subtract, expected: 5 },
    { a: 6, b: 4, action: Action.Multiply, expected: 24 },
    { a: 20, b: 4, action: Action.Divide, expected: 5 },
    { a: 2, b: 3, action: Action.Exponentiate, expected: 8 },
  ];

  test.each(validCases)(
    'calculates $a $action $b = $expected',
    ({ a, b, action, expected }) => {
      expect(simpleCalculator({ a, b, action })).toBe(expected);
    },
  );

  const invalidCases: Array<{ a: unknown; b: unknown; action: unknown }> = [
    { a: 2, b: 3, action: 'invalid' },

    { a: '5', b: 3, action: Action.Add },
    { a: 5, b: null, action: Action.Subtract },
  ];

  test.each(invalidCases)('returns null for invalid input %#', (input) => {
    expect(simpleCalculator(input)).toBeNull();
  });
});
