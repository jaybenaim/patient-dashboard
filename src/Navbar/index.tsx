import Button from '@/components/Button'
import { useAuth } from 'context/AuthContext'
import Link from 'next/link'
import cx from 'classnames'
import { useState } from 'react'
import Sidebar from './Sidebar'
import Image from 'next/image'
import { Bars3BottomLeftIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'

interface Props {}

const Navbar: React.FC<Props> = ({}) => {
  const { user, auth } = useAuth()
  const { email, fullName } = (user || {}) as IUser
  const router = useRouter()

  const [showSidebar, setShowSidebar] = useState<boolean>(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState<boolean>(false)

  const handleSignout = async () => {
    await auth.signOut()
    router.push('/account/login')
  }

  return (
    <header className='relative'>
      <nav className='bg-white border-b border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800'>
        <div className='flex flex-wrap justify-between items-center'>
          <div className='flex justify-start items-center'>
            <button
              id='toggleSidebar'
              aria-expanded='true'
              aria-controls='sidebar'
              className='hidden p-2 mr-3 text-gray-600 rounded cursor-pointer lg:inline hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700'
              onClick={() => setShowSidebar(show => !show)}
            >
              <Bars3BottomLeftIcon className='w-6 h-6' />
            </button>
            <button
              aria-expanded='true'
              aria-controls='sidebar'
              className='p-2 mr-2 text-gray-600 rounded-lg cursor-pointer lg:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
              onClick={() => setShowSidebar(show => !show)}
            >
              <Bars3BottomLeftIcon className='w-6 h-6' />
              <span className='sr-only'>Toggle sidebar</span>
            </button>
            <div className='flex mr-4'>
              <Image
                src='/logos/logo-small.png'
                className='mr-3 h-8 scale-150'
                alt='Patient Care Logo'
                height={32}
                width={32}
              />
              <span className='self-center text-2xl font-semibold whitespace-nowrap dark:text-white'>
                Patient Care
              </span>
            </div>
          </div>

          <div className='flex items-center lg:order-2'>
            <Button
              type='button'
              variant='none'
              className='flex mx-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600'
              id='user-menu-button'
              aria-expanded='false'
              data-dropdown-toggle='dropdown'
              onClick={() => setShowProfileDropdown(show => !show)}
            >
              <span className='sr-only'>Open user menu</span>
              <Image
                className='w-8 h-8 rounded-full'
                src='https://flowbite.com/docs/images/people/profile-picture-5.jpg'
                alt='user photo'
                width={32}
                height={32}
              />
            </Button>
            {/* <!-- Dropdown menu --> */}
            <div
              className={cx(
                'z-50 my-4 w-56 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600',
                showProfileDropdown ? 'absolute top-10 right-4' : 'hidden'
              )}
              id='dropdown'
            >
              <div className='py-3 px-4'>
                <span className='block text-sm font-semibold text-gray-900 dark:text-white'>
                  {fullName}
                </span>
                <span className='block text-sm font-light text-gray-500 truncate dark:text-gray-400'>
                  {email}
                </span>
              </div>

              <ul
                className='py-1 font-light text-gray-500 dark:text-gray-400'
                aria-labelledby='dropdown'
              >
                <li>
                  <Button
                    onClick={handleSignout}
                    variant='none'
                    className='w-full'
                  >
                    <span className='block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'>
                      Sign out
                    </span>
                  </Button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {showSidebar && (
        <>
          <div className='absolute inset-0 w-screen h-screen z-10 bg-black/10' />

          <Sidebar setShowSidebar={setShowSidebar} />
        </>
      )}
    </header>
  )
}

export default Navbar
