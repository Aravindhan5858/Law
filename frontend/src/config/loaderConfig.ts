/**
 * Loader Configuration
 * 
 * This file controls the behavior of the landing page loader.
 * Modify these settings to customize the loader experience.
 */

export const loaderConfig = {
  /**
   * Enable/disable the loader globally
   * Set to false to skip the loader entirely
   */
  enabled: true,

  /**
   * Enable/disable automatic redirect
   * When true: Automatically navigates after `autoDelay` milliseconds
   * When false: User must click Continue button to navigate
   */
  autoRedirect: false,

  /**
   * Delay before auto-redirect (in milliseconds)
   * Only applies if autoRedirect is true
   */
  autoDelay: 5000,

  /**
   * Target path to navigate to after loader
   */
  targetPath: '/home',

  /**
   * Logo source path
   * Can be updated to use a different logo image
   */
  logoSrc: '/assets/legal_logo.svg',

  /**
   * Delay before showing the Continue button (in milliseconds)
   */
  buttonDelay: 3000,
};

export default loaderConfig;
