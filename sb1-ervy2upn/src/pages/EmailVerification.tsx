import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { BarChart, CheckCircle, XCircle, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';



export default function EmailVerification() {
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = React.useState<
    'loading' | 'success' | 'error'
  >('loading');
  const { verifyEmail } = useAuth();
  const { t } = useLanguage();

  React.useEffect(() => {
    const token = searchParams.get('token');
    const type = searchParams.get('type');

    if (token && type === 'email_verification') {
      verifyEmail(token)
        .then(() => setVerificationStatus('success'))
        .catch(() => setVerificationStatus('error'));
    } else {
      setVerificationStatus('error');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <img
              src="https://i.postimg.cc/0Q32pZbR/logo-png.png"
              alt="CS LABZ"
              className="h-8 md:h-12"
            />
            <div className="flex items-center space-x-4"></div>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white shadow-lg rounded-lg p-8 text-center">
            {verificationStatus === 'loading' && (
              <div>
                <Loader className="w-16 h-16 text-blue-600 mx-auto animate-spin" />
                <h2 className="mt-4 text-xl font-semibold text-gray-900">
                  {t('verify.checking')}
                </h2>
              </div>
            )}

            {verificationStatus === 'success' && (
              <div>
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <h2 className="mt-4 text-xl font-semibold text-gray-900">
                  {t('verify.success')}
                </h2>
                <p className="mt-2 text-gray-600">
                  {t('verify.success.message')}
                </p>
                <Link
                  to="/auth/login"
                  className="mt-6 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {t('auth.signin.button')}
                </Link>
              </div>
            )}

            {verificationStatus === 'error' && (
              <div>
                <XCircle className="w-16 h-16 text-red-500 mx-auto" />
                <h2 className="mt-4 text-xl font-semibold text-gray-900">
                  {t('verify.error')}
                </h2>
                <p className="mt-2 text-gray-600">
                  {t('verify.error.message')}
                </p>
                <Link
                  to="/auth/signup"
                  className="mt-6 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {t('verify.tryAgain')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
