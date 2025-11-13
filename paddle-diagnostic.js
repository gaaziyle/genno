// ============================================================================
// PADDLE DIAGNOSTIC SCRIPT
// ============================================================================
// 
// HOW TO USE:
// 1. Open your pricing page (http://localhost:3000/pricing)
// 2. Open browser console (F12)
// 3. Copy and paste this entire script
// 4. Press Enter
// 5. Review the diagnostic results
//
// ============================================================================

console.log('🔍 PADDLE DIAGNOSTIC SCRIPT');
console.log('============================\n');

// Check 1: Paddle Script Loaded
console.log('1️⃣ Checking if Paddle is loaded...');
if (typeof window.Paddle !== 'undefined') {
  console.log('✅ Paddle is loaded');
  console.log('   Paddle object:', window.Paddle);
} else {
  console.log('❌ Paddle is NOT loaded');
  console.log('   Solution: Check if Paddle script is blocked or failed to load');
}
console.log('');

// Check 2: Environment Variables
console.log('2️⃣ Checking environment variables...');
const env = {
  environment: process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT,
  clientTokenSandbox: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN_SANDBOX,
  clientTokenLive: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
  starterPriceSandbox: process.env.NEXT_PUBLIC_STARTER_PRICEID_SANDBOX,
  starterPriceLive: process.env.NEXT_PUBLIC_STARTER_PRICE_ID,
  teamPriceSandbox: process.env.NEXT_PUBLIC_TEAM_PRICEID_SANDBOX,
  teamPriceLive: process.env.NEXT_PUBLIC_TEAM_PRICE_ID,
};

console.log('Environment:', env.environment || '❌ NOT SET');

if (env.environment === 'sandbox') {
  console.log('📦 SANDBOX MODE');
  console.log('   Client Token:', env.clientTokenSandbox ? '✅ Set' : '❌ Missing');
  console.log('   Starter Price ID:', env.starterPriceSandbox || '❌ Missing');
  console.log('   Team Price ID:', env.teamPriceSandbox || '❌ Missing');
  
  if (!env.clientTokenSandbox) {
    console.log('   ⚠️  Missing: NEXT_PUBLIC_PADDLE_CLIENT_TOKEN_SANDBOX');
  }
  if (!env.starterPriceSandbox) {
    console.log('   ⚠️  Missing: NEXT_PUBLIC_STARTER_PRICEID_SANDBOX');
  }
  if (!env.teamPriceSandbox) {
    console.log('   ⚠️  Missing: NEXT_PUBLIC_TEAM_PRICEID_SANDBOX');
  }
} else if (env.environment === 'production') {
  console.log('🚀 PRODUCTION MODE');
  console.log('   Client Token:', env.clientTokenLive ? '✅ Set' : '❌ Missing');
  console.log('   Starter Price ID:', env.starterPriceLive || '❌ Missing');
  console.log('   Team Price ID:', env.teamPriceLive || '❌ Missing');
  
  if (!env.clientTokenLive) {
    console.log('   ⚠️  Missing: NEXT_PUBLIC_PADDLE_CLIENT_TOKEN');
  }
  if (!env.starterPriceLive) {
    console.log('   ⚠️  Missing: NEXT_PUBLIC_STARTER_PRICE_ID');
  }
  if (!env.teamPriceLive) {
    console.log('   ⚠️  Missing: NEXT_PUBLIC_TEAM_PRICE_ID');
  }
} else {
  console.log('❌ Environment not set or invalid');
  console.log('   Should be: "sandbox" or "production"');
}
console.log('');

// Check 3: Paddle Initialization
console.log('3️⃣ Checking Paddle initialization...');
if (window.Paddle) {
  try {
    console.log('✅ Paddle initialized');
    if (window.Paddle.Environment) {
      console.log('   Environment:', window.Paddle.Environment);
    }
  } catch (e) {
    console.log('⚠️  Paddle loaded but not initialized');
    console.log('   Error:', e.message);
  }
} else {
  console.log('❌ Paddle not initialized');
}
console.log('');

// Check 4: Network Connectivity
console.log('4️⃣ Checking network connectivity...');
fetch('https://cdn.paddle.com/paddle/v2/paddle.js', { method: 'HEAD' })
  .then(() => console.log('✅ Can reach Paddle CDN'))
  .catch(() => console.log('❌ Cannot reach Paddle CDN (network issue?)'));
console.log('');

// Check 5: Current Page
console.log('5️⃣ Checking current page...');
console.log('   URL:', window.location.href);
console.log('   Path:', window.location.pathname);
if (window.location.pathname === '/pricing') {
  console.log('✅ On pricing page');
} else {
  console.log('⚠️  Not on pricing page');
  console.log('   Navigate to /pricing to test checkout');
}
console.log('');

// Summary
console.log('📊 SUMMARY');
console.log('==========');

const issues = [];

if (typeof window.Paddle === 'undefined') {
  issues.push('Paddle script not loaded');
}

if (!env.environment) {
  issues.push('NEXT_PUBLIC_PADDLE_ENVIRONMENT not set');
}

if (env.environment === 'sandbox') {
  if (!env.clientTokenSandbox) issues.push('Missing sandbox client token');
  if (!env.starterPriceSandbox) issues.push('Missing sandbox starter price ID');
  if (!env.teamPriceSandbox) issues.push('Missing sandbox team price ID');
} else if (env.environment === 'production') {
  if (!env.clientTokenLive) issues.push('Missing production client token');
  if (!env.starterPriceLive) issues.push('Missing production starter price ID');
  if (!env.teamPriceLive) issues.push('Missing production team price ID');
}

if (issues.length === 0) {
  console.log('✅ All checks passed!');
  console.log('');
  console.log('🎯 NEXT STEPS:');
  console.log('1. Click "Start 14-Day Trial" button');
  console.log('2. Paddle checkout should open');
  console.log('3. If it fails, check Network tab for 403 error');
  console.log('4. Verify price IDs exist in Paddle Dashboard');
} else {
  console.log('❌ Issues found:');
  issues.forEach((issue, index) => {
    console.log(`   ${index + 1}. ${issue}`);
  });
  console.log('');
  console.log('🔧 FIXES:');
  console.log('1. Update your .env.local file');
  console.log('2. Restart your dev server');
  console.log('3. Clear browser cache');
  console.log('4. Run this diagnostic again');
}

console.log('');
console.log('📚 For more help, see: PADDLE_403_FIX.md');
console.log('============================');
