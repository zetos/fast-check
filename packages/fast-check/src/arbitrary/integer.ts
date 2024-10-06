import type { Arbitrary } from '../check/arbitrary/definition/Arbitrary';
import { IntegerArbitrary } from './_internals/IntegerArbitrary';

const safeNumberIsInteger = Number.isInteger;

/**
 * Constraints to be applied on {@link integer}
 * @remarks Since 2.6.0
 * @public
 */
export interface IntegerConstraints {
  /**
   * Lower bound for the generated integers (included)
   * @defaultValue -0x80000000
   * @remarks Since 2.6.0
   */
  min?: number;
  /**
   * Upper bound for the generated integers (included)
   * @defaultValue 0x7fffffff
   * @remarks Since 2.6.0
   */
  max?: number;
}

/**
 * Build fully set IntegerConstraints from a partial data
 * @internal
 */
function buildCompleteIntegerConstraints(constraints: IntegerConstraints): Required<IntegerConstraints> {
  const min = constraints.min !== undefined ? constraints.min : -0x80000000;
  const max = constraints.max !== undefined ? constraints.max : 0x7fffffff;
  return { min, max };
}

/**
 * For integers between min (included) and max (included)
 *
 * @param constraints - Constraints to apply when building instances (since 2.6.0)
 * 
 * @example
 * ```typescript
 * fc.integer();
 * // Note: All possible integers between `-2147483648` (included) and `2147483647` (included)
 * // Examples of generated values: -1064811759, -2147483638, 2032841726, 930965475, -1…
 * ```
 * 
 * @example
 * ```typescript
 * fc.integer({ min: -99, max: 99 });
 * // Note: All possible integers between `-99` (included) and `99` (included)
 * // Examples of generated values: 33, -94, 5, -2, 97…
 * ```
 * 
 * @example
 * ```typescript
 * fc.integer({ min: 65536 });
 * // Note: All possible integers between `65536` (included) and `2147483647` (included)
 * // Examples of generated values: 487771549, 1460850457, 1601368274, 1623935346, 65541…
 * ```
 *
 * @remarks Since 0.0.1
 * @public
 */
export function integer(constraints: IntegerConstraints = {}): Arbitrary<number> {
  const fullConstraints = buildCompleteIntegerConstraints(constraints);
  if (fullConstraints.min > fullConstraints.max) {
    throw new Error('fc.integer maximum value should be equal or greater than the minimum one');
  }
  if (!safeNumberIsInteger(fullConstraints.min)) {
    throw new Error('fc.integer minimum value should be an integer');
  }
  if (!safeNumberIsInteger(fullConstraints.max)) {
    throw new Error('fc.integer maximum value should be an integer');
  }
  return new IntegerArbitrary(fullConstraints.min, fullConstraints.max);
}
