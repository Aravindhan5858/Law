import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LoaderConfig {
  enabled: boolean;
  autoRedirect: boolean;
  autoDelay: number;
  targetPath: string;
}

interface LoaderContextType {
  config: LoaderConfig;
  setConfig: (config: Partial<LoaderConfig>) => void;
  showLoader: boolean;
  setShowLoader: (show: boolean) => void;
}

const defaultConfig: LoaderConfig = {
  enabled: false,
  autoRedirect: false,
  autoDelay: 5000,
  targetPath: '/home',
};

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const useLoaderContext = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error('useLoaderContext must be used within LoaderProvider');
  }
  return context;
};

interface LoaderProviderProps {
  children: ReactNode;
  initialConfig?: Partial<LoaderConfig>;
}

export const LoaderProvider: React.FC<LoaderProviderProps> = ({
  children,
  initialConfig = {},
}) => {
  const [config, setConfigState] = useState<LoaderConfig>({
    ...defaultConfig,
    ...initialConfig,
  });
  const [showLoader, setShowLoader] = useState(false);

  const setConfig = (newConfig: Partial<LoaderConfig>) => {
    setConfigState((prev) => ({ ...prev, ...newConfig }));
  };

  return (
    <LoaderContext.Provider
      value={{
        config,
        setConfig,
        showLoader,
        setShowLoader,
      }}
    >
      {children}
    </LoaderContext.Provider>
  );
};

export default LoaderContext;
