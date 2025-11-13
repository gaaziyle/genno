import { initializePaddle, Paddle } from '@paddle/paddle-js';

// Paddle instance singleton
let paddleInstance: Paddle | undefined;

/**
 * Initialize Paddle.js
 */
export async function initPaddle(): Promise<Paddle | undefined> {
  if (paddleInstance) {
    console.log('✅ Paddle already initialized, reusing instance');
    return paddleInstance;
  }

  // Use LIVE on genno.io, SANDBOX on localhost
  const isProductionDomain =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'genno.io' ||
      window.location.hostname === 'www.genno.io');

  const sandboxToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN_SANDBOX;
  const liveToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;

  // On genno.io, use live token; on localhost, use sandbox
  const clientToken = isProductionDomain
    ? liveToken || sandboxToken // Production domain: try live first
    : sandboxToken || liveToken; // Localhost: try sandbox first

  const environment =
    isProductionDomain && liveToken ? 'production' : 'sandbox';

  console.log('🔍 Paddle initialization check:', {
    hostname: typeof window !== 'undefined' ? window.location.hostname : 'SSR',
    isProductionDomain,
    hasSandboxToken: !!sandboxToken,
    hasLiveToken: !!liveToken,
    environment,
    tokenLength: clientToken?.length || 0,
    tokenPrefix: clientToken?.substring(0, 10) + '...',
  });

  if (!clientToken) {
    console.error('❌ Paddle client token is not configured');
    console.error('📋 Available tokens:', {
      hasLiveToken: !!liveToken,
      hasSandboxToken: !!sandboxToken,
    });
    return undefined;
  }

  console.log(
    `✅ Paddle ${environment} client token found, initializing...`
  );

  try {
    paddleInstance = await initializePaddle({
      environment: environment as 'production' | 'sandbox',
      token: clientToken,
      eventCallback: (event) => {
        console.log('🎯 Paddle event:', event);

        if (event.name === 'checkout.completed') {
          console.log('✅ Checkout completed:', event.data);
          // Redirect after successful checkout
          window.location.href = '/dashboard/subscription?success=true';
        }

        if (event.name === 'checkout.error') {
          console.error('❌ Checkout error:', event.data);
          if ((event.data as any)?.detail) {
            console.error('📋 Error details:', (event.data as any).detail);
          }
        }
      },
    });

    console.log(`✅ Paddle initialized successfully (${environment})`);
    return paddleInstance;
  } catch (error) {
    console.error('❌ Failed to initialize Paddle:', error);
    return undefined;
  }
}

export function getPaddleInstance(): Paddle | undefined {
  return paddleInstance;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  credits: number;
  features: string[];
  priceIds: {
    monthly: string;
    yearly: string;
  };
  popular?: boolean;
  buttonText: string;
}

// Price IDs for different environments
const PRICE_IDS = {
  sandbox: {
    // Starter Plan
    starterMonthly: process.env.NEXT_PUBLIC_STARTER_MONTHLY_PRICEID_SANDBOX || '',
    starterYearly: process.env.NEXT_PUBLIC_STARTER_YEARLY_PRICEID_SANDBOX || '',
    // Team Plan
    teamMonthly: process.env.NEXT_PUBLIC_TEAM_MONTHLY_PRICEID_SANDBOX || '',
    teamYearly: process.env.NEXT_PUBLIC_TEAM_YEARLY_PRICEID_SANDBOX || '',
  },
  production: {
    // Starter Plan
    starterMonthly: process.env.NEXT_PUBLIC_STARTER_MONTHLY_PRICE_ID || '',
    starterYearly: process.env.NEXT_PUBLIC_STARTER_YEARLY_PRICE_ID || '',
    // Team Plan
    teamMonthly: process.env.NEXT_PUBLIC_TEAM_MONTHLY_PRICE_ID || '',
    teamYearly: process.env.NEXT_PUBLIC_TEAM_YEARLY_PRICE_ID || '',
  },
};

/**
 * Get pricing plans with environment-specific price IDs
 */
export function getPricingPlans(): PricingPlan[] {
  const isProductionDomain =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'genno.io' ||
      window.location.hostname === 'www.genno.io');

  const liveToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
  const environment = isProductionDomain && liveToken ? 'production' : 'sandbox';
  const priceIds = PRICE_IDS[environment];

  console.log('🏷️ Pricing plans environment:', {
    hostname: typeof window !== 'undefined' ? window.location.hostname : 'SSR',
    isProductionDomain,
    hasLiveToken: !!liveToken,
    environment,
    priceIds,
  });

  return [
    {
      id: 'free',
      name: 'Free',
      description: 'Perfect for trying out Genno',
      price: {
        monthly: 0,
        yearly: 0,
      },
      credits: 3,
      features: [
        '3 blog posts per month',
        'Basic AI transcription',
        'Standard templates',
        'Community support',
        'Export to Markdown',
      ],
      buttonText: 'Get Started Free',
      popular: false,
      priceIds: {
        monthly: '',
        yearly: '',
      },
    },
    {
      id: 'starter',
      name: 'Starter',
      description: 'Best for content creators',
      price: {
        monthly: 9.99,
        yearly: 95.9,
      },
      credits: 100,
      features: [
        '100 blog posts per month',
        'Advanced AI transcription',
        'Custom templates',
        'Priority support',
        'All export formats',
        'SEO optimization',
        'Analytics dashboard',
      ],
      buttonText: 'Start 14-Day Trial',
      popular: true,
      priceIds: {
        monthly: priceIds.starterMonthly,
        yearly: priceIds.starterYearly,
      },
    },
    {
      id: 'team',
      name: 'Team',
      description: 'For teams and agencies',
      price: {
        monthly: 99.99,
        yearly: 959.9,
      },
      credits: 500,
      features: [
        '500 blog posts per month',
        'Premium AI transcription',
        'Unlimited custom templates',
        '24/7 premium support',
        'Team collaboration',
        'API access',
        'White-label options',
        'Advanced analytics',
      ],
      buttonText: 'Start 14-Day Trial',
      popular: false,
      priceIds: {
        monthly: priceIds.teamMonthly,
        yearly: priceIds.teamYearly,
      },
    },
  ];
}

/**
 * Open Paddle checkout overlay
 * @param priceId - Paddle Price ID
 * @param customerEmail - Customer email address
 * @param userId - User ID to track subscription (Clerk user ID)
 * @param planName - Plan name for tracking
 * @param billingCycle - monthly or yearly
 */
export async function openCheckout(
  priceId: string,
  customerEmail: string,
  userId: string,
  planName: string,
  billingCycle: 'monthly' | 'yearly'
): Promise<void> {
  console.log('🔄 Starting checkout process...');

  if (!priceId || priceId.trim() === '') {
    const error = 'Price ID is required';
    console.error('❌', error);
    throw new Error(error);
  }

  if (!customerEmail || !customerEmail.includes('@')) {
    const error = 'Valid email address is required';
    console.error('❌', error);
    throw new Error(error);
  }

  if (!userId || userId.trim() === '') {
    const error = 'User ID is required';
    console.error('❌', error);
    throw new Error(error);
  }

  const paddle = await initPaddle();

  if (!paddle) {
    const error = 'Paddle is not initialized';
    console.error('❌', error);
    throw new Error(error);
  }

  // Determine environment for logging
  const isProductionDomain =
    window.location.hostname === 'genno.io' ||
    window.location.hostname === 'www.genno.io';
  const sandboxToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN_SANDBOX;
  const liveToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
  const environment = isProductionDomain && liveToken ? 'production' : 'sandbox';

  console.log('📋 Opening checkout with:', {
    priceId,
    customerEmail,
    userId,
    planName,
    billingCycle,
    environment,
    hasPaddleInstance: !!paddle,
  });

  try {
    // Get current URL for success/cancel redirects
    const baseUrl = window.location.origin;

    await paddle.Checkout.open({
      items: [
        {
          priceId: priceId,
          quantity: 1,
        },
      ],
      customer: {
        email: customerEmail,
      },
      customData: {
        clerkUserId: userId,
        planType: planName.toLowerCase(),
        billingCycle: billingCycle,
        userEmail: customerEmail,
      },
      settings: {
        displayMode: 'overlay',
        theme: 'dark',
        locale: 'en',
        allowLogout: false,
        showAddDiscounts: true,
        successUrl: `${baseUrl}/dashboard/subscription?success=true`,
      },
    });

    console.log('✅ Checkout opened successfully');
  } catch (error: any) {
    console.error('❌ Failed to open Paddle checkout');
    console.error('📋 Error details:', {
      message: error?.message,
      code: error?.code,
      detail: error?.detail,
      priceId,
    });

    let userMessage = 'Failed to open checkout. ';

    if (error?.detail?.includes('checkout_url')) {
      userMessage +=
        'Please set default checkout URLs in Paddle Dashboard.';
    } else if (error?.detail?.includes('blocked for this vendor')) {
      userMessage +=
        'Transaction checkout creation is blocked. Complete your Paddle account setup in the dashboard.';
    } else if (error?.message) {
      userMessage += error.message;
    } else if (error?.detail) {
      userMessage += error.detail;
    } else {
      userMessage += 'Unknown error occurred.';
    }

    throw new Error(userMessage);
  }
}

export async function testPaddleConfiguration(): Promise<{
  success: boolean;
  message: string;
  details: any;
}> {
  console.log('🧪 Testing Paddle configuration...');

  const isProductionDomain =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'genno.io' ||
      window.location.hostname === 'www.genno.io');

  const sandboxToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN_SANDBOX;
  const liveToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;

  const token = isProductionDomain
    ? liveToken || sandboxToken
    : sandboxToken || liveToken;

  const environment = isProductionDomain && liveToken ? 'production' : 'sandbox';

  if (!token) {
    return {
      success: false,
      message:
        'NEXT_PUBLIC_PADDLE_CLIENT_TOKEN or NEXT_PUBLIC_PADDLE_CLIENT_TOKEN_SANDBOX is not set',
      details: { token: 'Missing' },
    };
  }

  try {
    const paddle = await initPaddle();

    if (!paddle) {
      return {
        success: false,
        message: 'Paddle failed to initialize',
        details: { token: 'Present but invalid' },
      };
    }

    return {
      success: true,
      message: 'Paddle is configured correctly',
      details: {
        token: 'Valid',
        environment: environment,
        paddleInstance: 'Initialized',
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Paddle initialization failed: ${error.message}`,
      details: { error: error.message },
    };
  }
}
