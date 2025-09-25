import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { LockConfig, VisitorActionState, ContentType } from '../types';
import { SocialIcon } from '../components/icons/SocialIcons';

const ViewerPage: React.FC = () => {
  const { config: base64Config } = useParams<{ config: string }>();
  const [lockConfig, setLockConfig] = useState<LockConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionStates, setActionStates] = useState<VisitorActionState[]>([]);
  const [unlockPhase, setUnlockPhase] = useState<'locked' | 'thankyou' | 'unlocked'>('locked');
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!base64Config) {
      setError("Configuration not found.");
      return;
    }

    try {
      const jsonConfig = atob(base64Config);
      const parsedConfig: LockConfig = JSON.parse(jsonConfig);
      
      if (!parsedConfig.title || !parsedConfig.contentValue || !Array.isArray(parsedConfig.actions)) {
          throw new Error("Invalid configuration data.");
      }

      setLockConfig(parsedConfig);
      setActionStates(
        parsedConfig.actions.map(action => ({
          ...action,
          isClicked: false,
          isConfirmed: false,
        }))
      );
    } catch (e) {
      console.error("Failed to parse config:", e);
      setError("Invalid or corrupted link. Please check the URL and try again.");
    }
  }, [base64Config]);

  const isUnlocked = useMemo(() => {
    if (!lockConfig) return false;
    if (actionStates.length === 0) return true;
    return actionStates.every(a => a.isConfirmed);
  }, [actionStates, lockConfig]);

  useEffect(() => {
    if (isUnlocked && unlockPhase === 'locked') {
      setUnlockPhase('thankyou');
    }
  }, [isUnlocked, unlockPhase]);

  useEffect(() => {
    if (unlockPhase === 'thankyou') {
      if (countdown <= 0) {
        if (lockConfig?.contentType === ContentType.URL) {
          window.location.href = lockConfig.contentValue;
        } else {
          setUnlockPhase('unlocked');
        }
        return;
      }

      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [unlockPhase, countdown, lockConfig]);

  const handleActionClick = (actionId: string) => {
    const action = actionStates.find(a => a.id === actionId);
    if (action && !action.isConfirmed) {
      window.open(action.url, '_blank', 'noopener,noreferrer');
      setActionStates(prevStates =>
        prevStates.map(state =>
          state.id === actionId ? { ...state, isClicked: true } : state
        )
      );
    }
  };

  const handleConfirmClick = (actionId: string) => {
    setActionStates(prevStates =>
      prevStates.map(state =>
        state.id === actionId ? { ...state, isConfirmed: true } : state
      )
    );
  };
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error</h2>
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!lockConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
      </div>
    );
  }

  const UnlockedContent = () => {
    if (lockConfig.contentType === ContentType.URL) {
      return (
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Content Unlocked!</h3>
          <p className="mb-6 text-gray-600 dark:text-gray-400">You can now access the content.</p>
          <a
            href={lockConfig.contentValue}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 text-lg font-semibold rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 transition"
          >
            Access Content
          </a>
        </div>
      );
    }
    
    if (lockConfig.contentType === ContentType.Text) {
      return (
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Content Unlocked!</h3>
          <div 
            className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: lockConfig.contentValue }}
          />
        </div>
      );
    }

    return null;
  }

  const renderContent = () => {
    switch (unlockPhase) {
      case 'locked':
        return (
          <div className="space-y-4">
            {actionStates.map(action => (
              <div key={action.id} className="w-full">
                {!action.isConfirmed ? (
                  <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
                    <button
                      onClick={() => handleActionClick(action.id)}
                      disabled={action.isClicked}
                      className={`w-full sm:flex-1 flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition ${
                        action.isClicked
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
                      }`}
                    >
                      <SocialIcon platform={action.platform} className="w-5 h-5 mr-3" />
                      Visit {action.platform}
                    </button>
                    {action.isClicked && (
                      <button
                        onClick={() => handleConfirmClick(action.id)}
                        className="w-full sm:w-auto px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Confirm
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center px-4 py-3 text-base font-medium rounded-md bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Completed: {action.platform}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      case 'thankyou':
        return (
          <div className="text-center animate-fade-in-slide-up">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Thank you!</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {lockConfig?.contentType === ContentType.URL ? 'Redirecting to content in...' : 'Revealing content in...'}
            </p>
            <p className="text-4xl font-bold mt-4 text-indigo-600 dark:text-indigo-400">{countdown}</p>
          </div>
        );
      case 'unlocked':
        return (
          <div className="animate-fade-in-slide-up">
            <UnlockedContent />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeInSlideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-slide-up {
          animation: fadeInSlideUp 0.5s ease-in-out;
        }
      `}</style>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 sm:p-8">
          
          {lockConfig.logo && (
            <div className="flex justify-center mb-6">
              {lockConfig.logo.type === 'text' ? (
                <h1 className="text-3xl font-bold tracking-wider">{lockConfig.logo.value}</h1>
              ) : (
                <img src={lockConfig.logo.value} alt="Logo" className="max-h-16 max-w-xs object-contain" />
              )}
            </div>
          )}

          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold">{lockConfig.title}</h2>
            {lockConfig.subtitle && (
              <p className="mt-2 text-gray-600 dark:text-gray-400">{lockConfig.subtitle}</p>
            )}
          </div>
          
          {renderContent()}

        </div>
      </div>
    </>
  );
};

export default ViewerPage;
