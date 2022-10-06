import type { ReactNode } from 'react'

export type FieldsetBaseType = {
  /**
   * The input's required id, used to link the label and input, as well as the error message.
   */
  id: string
  /**
   * Error message to show input validation.
   */
  error?: string
  /**
   * Label to describe the input.
   */
  label?: string | ReactNode
  /**
   * Hint to show optional fields or a hint to the user of what to enter in the input.
   */
  hint?: string
}

type FieldsetType = FieldsetBaseType & {
  children: ReactNode
}

/**
 * @name Fieldset
 * @description A fieldset component, used to share markup for labels, hints, and errors for Input components.
 *
 * @example
 * <Fieldset error={error} hint={hint} id={id} label={label}>
 *   <input id={id} {...props} />
 * </Fieldset>
 */
export default function Fieldset({
  label,
  hint,
  id,
  children,
  error,
}: FieldsetType) {
  return (
    <div>
      {!!label && (
        <div className="flex justify-between mb-2">
          <label htmlFor={id} className="block font-medium text-neutral-300">
            {label}
          </label>

          {typeof hint === 'string' && (
            <span
              className="text-sm text-neutral-500 dark:text-neutral-400"
              id={`${id}-optional`}
            >
              {hint}
            </span>
          )}
        </div>
      )}

      {children}

      {error && (
        <div className="mt-2">
          <p
            className="text-sm text-red-600 dark:text-red-500"
            id={`${id}-error`}
          >
            {error}
          </p>
        </div>
      )}
    </div>
  )
}
