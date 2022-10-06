import type { PropsOf } from '@headlessui/react/dist/types'
import { classNames } from 'util/css'
import type { ChangeEvent } from 'react'
import Fieldset, { FieldsetBaseType } from './Fieldset'

/**
 * Shared styles for all input components.
 */
export const inputClassNames = {
  base: [
    'shadow-sm sm:text-sm block w-full rounded-lg bg-[#2E3748] text-white',
    'focus:outline focus:outline-primary-500 focus:outline-offset-2 focus:outline-2 focus:ring-0 focus:ring-offset-0 placeholder:text-neutral-500',
  ],
  valid: 'border-white/10 focus:border-white/25',
  invalid: 'text-red-200 border-red-500 focus:border-red-500',
}

type InputProps = Omit<PropsOf<'input'> & FieldsetBaseType, 'className'> & {
  directory?: 'true'
  mozdirectory?: 'true'
  webkitdirectory?: 'true'
  leadingAddon?: string
  trailingAddon?: string
  trailingSelectProps?: TrailingSelectProps
}

/**
 * @name Input
 * @description A standard input component, defaults to the text type.
 *
 * @example
 * // Standard input
 * <Input id="first-name" name="first-name" />
 *
 * @example
 * // Input component with label, placeholder and type email
 * <Input id="email" name="email" type="email" autoComplete="email" label="Email" placeholder="name@email.com" />
 *
 * @example
 * // Input component with label and leading and trailing addons
 * <Input
 *   id="input-label-leading-trailing"
 *   label="Bid"
 *   placeholder="0.00"
 *   leadingAddon="$"
 *   trailingAddon="USD"
 * />
 *
 * @example
 * // Input component with label and trailing select
 * const [trailingSelectValue, trailingSelectValueSet] = useState('USD');
 *
 * <Input
 *   id="input-label-trailing-select"
 *   label="Bid"
 *   placeholder="0.00"
 *   trailingSelectProps={{
 *     id: 'currency',
 *     label: 'Currency',
 *     value: trailingSelectValue,
 *     onChange: (event) => trailingSelectValueSet(event.target.value),
 *     options: ['USD', 'CAD', 'EUR'],
 *   }}
 * />
 */
export default function Input({
  error,
  hint,
  label,
  leadingAddon,
  trailingAddon,
  trailingSelectProps,
  id,
  type = 'text',
  ...rest
}: InputProps) {
  const cachedClassNames = classNames(
    ...inputClassNames.base,
    error ? inputClassNames.invalid : inputClassNames.valid,
    leadingAddon && 'pl-7',
    trailingAddon && 'pr-12',
    trailingSelectProps && 'pr-16',
  )

  const describedBy = [
    ...(error ? [`${id}-error`] : []),
    ...(typeof hint === 'string' ? [`${id}-optional`] : []),
    ...(typeof trailingAddon === 'string' ? [`${id}-addon`] : []),
  ].join(' ')

  return (
    <Fieldset error={error} hint={hint} id={id} label={label}>
      <div className="relative rounded-md shadow-sm">
        {leadingAddon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-neutral-400 sm:text-sm">{leadingAddon}</span>
          </div>
        )}

        <input
          aria-describedby={describedBy}
          aria-invalid={error ? 'true' : undefined}
          className={cachedClassNames}
          id={id}
          type={type}
          {...rest}
        />

        {!trailingAddon && trailingSelectProps && (
          <TrailingSelect {...trailingSelectProps} />
        )}

        {trailingAddon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-neutral-400 sm:text-sm" id={`${id}-addon`}>
              {trailingAddon}
            </span>
          </div>
        )}
      </div>
    </Fieldset>
  )
}

type TrailingSelectProps = {
  id: string
  label: string
  options: string[]
  value: string
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void
}

function TrailingSelect({
  id,
  label,
  value,
  onChange,
  options,
}: TrailingSelectProps) {
  const cachedClassNames = classNames(
    'h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-neutral-500 dark:text-neutral-400 sm:text-sm rounded-md',
    'focus:outline focus:outline-primary-500 focus:outline-offset-2 focus:outline-2 focus:ring-0 focus:ring-offset-0 focus:border-transparent',
  )

  return (
    <div className="absolute inset-y-0 right-0 flex items-center">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>

      <select
        className={cachedClassNames}
        id={id}
        name={id}
        onChange={onChange}
        value={value}
      >
        {options.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  )
}
