import Button from '@/components/Button'
import { useNotification } from 'context/NotificationContext'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Auth from 'utils/helpers/auth'
import { inputClass } from 'utils/classes'
import * as Yup from 'yup'
import { useEffect } from 'react'
import { useAuth } from 'context/AuthContext'
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
      const signupResponse = await auth.signup(
        provider,
        values?.email,
        values?.password
      )

      if (signupResponse?.success) {
        router.push('/app/dashboard')
      }

      if (auth.error) {
        setNotification({
          show: true,
          text: auth.error.message,
          variant: 'error'
        })
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
          Sign up to Patient Care
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
          {({ values, errors: e, touched, isSubmitting }) => (
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
                  Sign up
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
            Sign up with Google
          </Button>
        </div>

        <p className='mt-10 text-center text-sm text-gray-500'>
          Already have an account?{' '}
          <Link
            href='/account/login'
            className='font-semibold leading-6 text-indigo-600 hover:text-indigo-500'
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
