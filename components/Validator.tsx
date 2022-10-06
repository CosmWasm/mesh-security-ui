import Button from './Button'

interface Action {
  name: string
  disabled?: boolean
  onClick: () => any
}

interface ValidatorProps {
  address: string
  text?: string
  actions: Action[]
}

export default function Validator({ address, text, actions }: ValidatorProps) {
  return (
    <div className="border rounded-lg border-black/10 dark:border-white/10 py-1.5 px-4 flex flex-col sm:flex-row items-center sm:justify-between">
      <div className="flex flex-col items-center sm:flex-row">
        <p className="text-sm font-semibold">{address}</p>
      </div>
      <div className="flex flex-row space-x-2">
        {actions.map((action, key) => (
          <Button
            variant="secondary"
            disabled={action.disabled}
            key={key}
            onClick={action.onClick}
          >
            {action.name}
          </Button>
        ))}
      </div>
    </div>
  )
}
