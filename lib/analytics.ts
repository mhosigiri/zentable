import React from 'react';
import { trackEvent } from '@/components/analytics/GoogleAnalytics';

// Common event tracking functions
export const analytics = {
  // User engagement events
  presentationCreated: (method: 'ai' | 'template' | 'import', slideCount?: number) => {
    trackEvent('presentation_created', {
      method,
      slide_count: slideCount,
    });
  },

  presentationExported: (format: 'pdf' | 'pptx' | 'image') => {
    trackEvent('presentation_exported', {
      export_format: format,
    });
  },

  themeChanged: (themeId: string) => {
    trackEvent('theme_changed', {
      theme_id: themeId,
    });
  },

  slideAdded: (method: 'ai' | 'template' | 'blank', templateType?: string) => {
    trackEvent('slide_added', {
      method,
      template_type: templateType,
    });
  },

  aiAssistantUsed: (action: string) => {
    trackEvent('ai_assistant_used', {
      action,
    });
  },

  presentationModeStarted: () => {
    trackEvent('presentation_mode_started');
  },

  userSignup: (method: 'email' | 'google' | 'github') => {
    trackEvent('sign_up', {
      method,
    });
  },

  userLogin: (method: 'email' | 'google' | 'github') => {
    trackEvent('login', {
      method,
    });
  },

  subscriptionUpgrade: (plan: string) => {
    trackEvent('subscription_upgrade', {
      plan,
      value: 1,
      currency: 'USD',
    });
  },

  // Page view tracking
  pageView: (pageName: string, additionalData?: Record<string, any>) => {
    trackEvent('page_view', {
      page_name: pageName,
      ...additionalData,
    });
  },

  // Feature usage tracking
  featureUsed: (featureName: string, additionalData?: Record<string, any>) => {
    trackEvent('feature_used', {
      feature_name: featureName,
      ...additionalData,
    });
  },

  // Error tracking
  error: (errorType: string, errorMessage?: string) => {
    trackEvent('error_occurred', {
      error_type: errorType,
      error_message: errorMessage,
    });
  },
};

// Higher-order component for page tracking
export const withPageTracking = (pageName: string) => {
  return <P extends object>(WrappedComponent: React.ComponentType<P>) => {
    const TrackedComponent: React.FC<P> = (props) => {
      React.useEffect(() => {
        analytics.pageView(pageName);
      }, []);

      return React.createElement(WrappedComponent, props);
    };

    TrackedComponent.displayName = `withPageTracking(${WrappedComponent.displayName || WrappedComponent.name})`;
    
    return TrackedComponent;
  };
};