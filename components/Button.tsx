import type { PropsOf } from '@headlessui/react/dist/types'
import { classNames } from 'util/css'

export const baseButtonClassNames = [
  'inline-flex items-center px-4 py-2',
  'border border-transparent text-sm font-medium rounded-md',
  'focus:outline focus:outline-primary-500 focus:outline-offset-2 focus:outline-2',
  'disabled:opacity-40 disabled:cursor-not-allowed',
]

export const buttonVariantClassNames = {
  primary: 'text-white bg-primary-600 hover:bg-primary-700 shadow-sm',
  secondary: 'text-black bg-white hover:bg-white/75 shadow-sm',
  outline:
    'text-inherit bg-transparent border-black dark:border-white/25 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900',
  danger:
    'text-red-600 bg-transparent dark:border-red-600 hover:bg-red-600 hover:text-white shadow-sm',
}

export type BaseButtonTypes = {
  /**
   * Inferred from the keys of 'buttonVariantClassNames'
   */
  variant?: keyof typeof buttonVariantClassNames
  anchor?: boolean
}

export type ButtonTypes = PropsOf<'button'> & BaseButtonTypes & PropsOf<'a'>

export default function Button({
  anchor = false,
  className = '',
  variant = 'primary',
  type = 'button',
  children,
  ...rest
}: ButtonTypes) {
  const cachedClassNames = classNames(
    ...baseButtonClassNames,
    buttonVariantClassNames[variant],
    className,
  )

  if (anchor) {
    return (
      <a className={cachedClassNames} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <button className={cachedClassNames} type={type} {...rest}>
      {children}
    </button>
  )
}
