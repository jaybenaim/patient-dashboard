import React, { ButtonHTMLAttributes } from 'react'

type TButtonVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'none'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  variant?: TButtonVariant
  fullWidth?: boolean
}

const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'primary',
  fullWidth,
  ...rest
}) => {
  // Base classes for the button
  const baseClasses =
    'rounded-lg shadow-md focus:outline-none inline-flex items-center space-x-2 disabled:cursor-not-allowed disabled:pointer-events-none disabled:bg-opacity-40'

  const variants = {
    none: '',
    primary:
      'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800',
    secondary:
      'py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700',
    success:
      'focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800',
    warning:
      'focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:focus:ring-yellow-900',
    danger:
      'focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900'
  }

  const buttonClass =
    variant !== 'none'
      ? `${baseClasses} ${variants[variant]} ${className} ${
          fullWidth && 'w-full justify-center'
        }`
      : `${className}`

  return (
    <button className={buttonClass} {...rest}>
      {rest.children}
    </button>
  )
}

export default Button
