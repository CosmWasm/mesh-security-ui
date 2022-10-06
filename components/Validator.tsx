import Button from './Button'

interface Action {
  name: string
  onClick: () => any
}

interface ValidatorProps {
  address: string
  actions: Action[]
}

export default function Validator({ address, actions }: ValidatorProps) {
  return (
    <div className="border rounded-lg border-black/10 dark:border-white/10 py-1.5 px-4 flex flex-col sm:flex-row items-center sm:justify-between">
      <p className="text-sm font-semibold">{address}</p>
      <div className="flex flex-row space-x-2">
        {actions.map((action, key) => (
          <Button variant="secondary" key={key} onClick={action.onClick}>
            {action.name}
          </Button>
        ))}
      </div>
    </div>
  )
}
