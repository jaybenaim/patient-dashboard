import Button from '@/components/Button'
import { fbAuth } from 'config/firebaseConfig'
import { useNotification } from 'context/NotificationContext'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Auth from 'utils/helpers/auth'
import { inputClass } from 'utils/classes'
import { BASE_URL } from 'utils/constants'
import * as Yup from 'yup'
import { useAuth } from 'context/AuthContext'
import { useEffect } from 'react'
import Image from 'next/image'

const auth = new Auth()

const Login = () => {
  const { user } = useAuth()
  const id = user?.id
  const { setNotification } = useNotification()
  const router = useRouter()

  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required('Required'),
    password: Yup.string().min(8, 'Too Short!').required('Required')
  })

  const handleSubmit = async (
    provider: 'google' | 'email',
    values?: { email: string; password: string }
  ) => {
    try {
      let loginResponse
      if (provider === 'email' && values) {
        loginResponse = await auth.loginWithEmail(values.email, values.password)
        console.log('loginResponse', loginResponse)
      } else if (provider === 'google') {
        loginResponse = await auth.loginWithProvider()
        console.log('loginResponse', loginResponse)
      }

      if (loginResponse?.success) {
        router.push('/app/dashboard')
      }
    } catch (err) {
      setNotification({
        show: true,
        text: 'Unable to login at this time',
        ctaText: 'Please try again later.',
        href: '/account/login'
      })
    }
  }

  const handleForgotPassword = async (email: string) => {
    try {
      fbAuth.sendPasswordResetEmail(email, {
        url: BASE_URL + '/account/signin?withPassword=true',
        handleCodeInApp: true
      })
    } catch (err) {
      console.log('Failed to send password reset link', err)
    }
  }

  useEffect(() => {
    if (id) {
      router.push('/app/dashboard')
    }
  }, [id])

  return (
    <div className='flex min-h-full flex-col justify-center px-6 py-12 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
        <Image
          className='mx-auto h-40 w-auto'
          src='/logos/logo.png'
          alt='Your Company'
          width={160}
          height={160}
        />
        <h2 className='mt-0 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
          Sign in to your account
        </h2>
      </div>

      <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
        <Formik
          initialValues={{
            email: '',
            password: ''
          }}
          validationSchema={validationSchema}
          onSubmit={values => handleSubmit('email', values)}
        >
          {({ values, isSubmitting }) => (
            <Form id='loginForm' className='space-y-6'>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Email address
                </label>
                <div className='mt-2'>
                  <Field
                    id='email'
                    name='email'
                    type='email'
                    autoComplete='email'
                    className={inputClass}
                  />
                  <ErrorMessage
                    name='email'
                    component='small'
                    className='error text-xs text-red-500'
                  />
                </div>
              </div>

              <div>
                <div className='flex items-center justify-between'>
                  <label
                    htmlFor='password'
                    className='block text-sm font-medium leading-6 text-gray-900'
                  >
                    Password
                  </label>
                  <div className='text-sm'>
                    <Button
                      variant='none'
                      className='font-semibold text-indigo-600 hover:text-indigo-500'
                      onClick={() => handleForgotPassword(values?.email)}
                    >
                      Forgot password?
                    </Button>
                  </div>
                </div>
                <div className='mt-2'>
                  <Field
                    id='password'
                    name='password'
                    type='password'
                    autoComplete='current-password'
                    required
                    className={inputClass}
                  />
                  <ErrorMessage
                    name='password'
                    component='small'
                    className='error text-xs text-red-500'
                  />
                </div>
              </div>

              <div>
                <Button type='submit' disabled={isSubmitting} fullWidth>
                  Sign in
                </Button>
              </div>
            </Form>
          )}
        </Formik>

        <p className='flex w-full text-xs justify-center my-2 text-gray-500'>
          or
        </p>

        <div>
          <Button
            onClick={() => {
              handleSubmit('google')
            }}
            fullWidth
            variant='secondary'
          >
            <Image
              src='/logos/google-logo.svg'
              alt='Google Logo'
              className='w-4 h-4 mr-2'
              height={16}
              width={16}
            />
            Sign in with Google
          </Button>
        </div>

        <p className='mt-10 text-center text-sm text-gray-500'>
          Not a member?{' '}
          <Link
            href='/account/signup'
            className='font-semibold leading-6 text-indigo-600 hover:text-indigo-500'
          >
            Create your account
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
