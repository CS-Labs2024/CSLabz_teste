import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageToggle() {
  const { language, changeLanguage } = useLanguage();

  return (
    <button
      onClick={() => changeLanguage(language === 'en-US' ? 'pt-BR' : 'en-US')}
      className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      aria-label={
        language === 'en-US' ? 'Mudar para Português' : 'Switch to English'
      }
    >
      <Globe className="h-4 w-4 mr-2" />
      {language === 'en-US' ? 'Português' : 'English'}
    </button>
  );
}
