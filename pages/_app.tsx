import { UserProvider } from 'context/AuthContext'
import { ModalProvider } from 'context/ModalContext'
import { NotificationProvider } from 'context/NotificationContext'
import { AppProps } from 'next/app'
import { PatientProvider } from 'context/PatientContext'

import 'tailwindcss/tailwind.css'

function MyApp ({ Component, pageProps }: AppProps) {
  return (
    <>
      <NotificationProvider>
        <UserProvider>
          <ModalProvider>
            <Component {...pageProps} />
          </ModalProvider>
        </UserProvider>
      </NotificationProvider>

      {/* Init Tailwind colors that are being used dynamically */}
      <div className='hidden bg-indigo-600 border-indigo-600 bg-white/60 bg-red/60 bg-green/60' />
    </>
  )
}

export default MyApp
