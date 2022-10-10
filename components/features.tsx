import { LinkIcon } from '@heroicons/react/24/outline'
import { FeatureProps } from './types'
import Link from 'next/link'

export const Product = ({ title, text, href }: FeatureProps) => {
  return (
    <Link href={href}>
      <a>
        <div className="[min-height:8rem] h-full p-5 transition duration-75 border rounded-lg border-black/10 hover:shadow-xl dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10">
          <h3 className="text-lg font-medium">{title}&ensp;&rarr;</h3>
          <p className="mt-1 text-black/75 dark:text-white/75">{text}</p>
        </div>
      </a>
    </Link>
  )
}

export const Dependency = ({ title, text, href }: FeatureProps) => {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      <div className="flex flex-row items-start h-full p-5 space-x-2 transition duration-75 border rounded-lg border-black/10 hover:shadow-xl dark:border-white/10 hover:border-primary dark:hover:border-primary">
        <LinkIcon className="flex-shrink-0 w-4 h-4 mt-1 text-black/75 dark:text-white/75" />
        <div>
          <h3 className="text-base font-medium">{title}&ensp;&rarr;</h3>
          <p className="mt-1 text-sm text-black/75 dark:text-white/75">
            {text}
          </p>
        </div>
      </div>
    </a>
  )
}
