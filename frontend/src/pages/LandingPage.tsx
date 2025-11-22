import React from 'react';
import Loader from '../components/Loader';
import loaderConfig from '../config/loaderConfig';

const LandingPage: React.FC = () => {
  return (
    <Loader
      targetPath={loaderConfig.targetPath}
      autoRedirect={loaderConfig.autoRedirect}
      autoDelay={loaderConfig.autoDelay}
      logoSrc={loaderConfig.logoSrc}
    />
  );
};

export default LandingPage;
