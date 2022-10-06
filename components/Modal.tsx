import { Fragment, ReactNode } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Button, { BaseButtonTypes } from './Button'

export interface Action {
  button: BaseButtonTypes['variant']
  name: string
  action?: (val?: any) => void
}

const ActionButton = ({
  button,
  name,
  action,
  handleCloseModal,
  submit,
}: {
  button: Action['button']
  name: Action['name']
  action?: Action['action']
  handleCloseModal: () => void
  submit?: boolean
}) => {
  return (
    <Button
      variant={button}
      className="ml-2"
      onClick={() => {
        handleCloseModal()
        if (action) action()
      }}
      type={submit ? 'submit' : 'button'}
    >
      {name}
    </Button>
  )
}

export function Modal({
  children,
  actions,
  open,
  handleStateChange,
}: {
  children: ReactNode
  actions: Action[]
  open: boolean
  handleStateChange: (val: boolean) => void
}) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleStateChange}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 transition-opacity bg-gray-800 bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto">
          <form className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative z-50 px-4 pt-5 pb-4 overflow-hidden text-left transition-all transform border rounded-lg shadow-xl bg-[#2E3748] border-white/10 sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md text-white bg-[#2E3748] hover:text-white/75 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ring-offset-white dark:ring-offset-black"
                    onClick={() => handleStateChange(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                  </button>
                </div>
                <div>{children}</div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  {actions.map((action, key) => (
                    <ActionButton
                      {...action}
                      key={key}
                      handleCloseModal={() => handleStateChange(false)}
                    />
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </form>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
