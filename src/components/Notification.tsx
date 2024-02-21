import Link from 'next/link'
import cx from 'classnames'

const Notification: React.FC<NotificationProps> = ({
  text,
  href,
  ctaText,
  variant = 'default'
}) => {
  const variants = {
    default: 'bg-white/60',
    success: 'bg-green-400/60',
    error: 'bg-red-400/60'
  }

  return (
    <div
      className={cx(
        'backdrop-blur-xl z-20 max-w-md absolute right-5 top-5 rounded-lg p-6 shadow',
        variants[variant]
      )}
    >
      <h1 className='text-xl text-slate-700 font-medium'>{text}</h1>
      {ctaText && (
        <div className='flex justify-between items-center'>
          <Link
            href={href || '#'}
            className='text-slate-500 hover:text-slate-700 text-sm inline-flex space-x-1 items-center'
          >
            <span>{ctaText}</span>
            <svg
              className='w-3 h-3'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                stroke-linecap='round'
                stroke-linejoin='round'
                stroke-width='2'
                d='M17 8l4 4m0 0l-4 4m4-4H3'
              ></path>
            </svg>
          </Link>
        </div>
      )}
    </div>
  )
}

export default Notification
