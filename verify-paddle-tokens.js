// Paddle Token Verification Script
// Run this to verify your Paddle configuration

console.log('🔍 Paddle Configuration Check\n');

// Check environment variables
const tokens = {
  sandbox: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN_SANDBOX,
  production: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
};

console.log('📋 Client Tokens:');
console.log('  Sandbox:', tokens.sandbox ? `${tokens.sandbox.substring(0, 15)}... (${tokens.sandbox.length} chars)` : '❌ MISSING');
console.log('  Production:', tokens.production ? `${tokens.production.substring(0, 15)}... (${tokens.production.length} chars)` : '❌ MISSING');

// Validate token format
console.log('\n✅ Token Format Validation:');
if (tokens.sandbox) {
  const validSandbox = tokens.sandbox.startsWith('test_') && tokens.sandbox.length > 30;
  console.log('  Sandbox:', validSandbox ? '✅ Valid' : '⚠️  Invalid format (should start with "test_" and be 30+ chars)');
}

if (tokens.production) {
  const validProd = tokens.production.startsWith('live_') && tokens.production.length > 30;
  console.log('  Production:', validProd ? '✅ Valid' : '⚠️  Invalid format (should start with "live_" and be 30+ chars)');
}

// Check price IDs
console.log('\n💰 Price IDs:');
const priceIds = {
  starterMonthlySandbox: process.env.NEXT_PUBLIC_STARTER_MONTHLY_PRICEID_SANDBOX,
  starterYearlySandbox: process.env.NEXT_PUBLIC_STARTER_YEARLY_PRICEID_SANDBOX,
  teamMonthlySandbox: process.env.NEXT_PUBLIC_TEAM_MONTHLY_PRICEID_SANDBOX,
  teamYearlySandbox: process.env.NEXT_PUBLIC_TEAM_YEARLY_PRICEID_SANDBOX,
  starterMonthlyProd: process.env.NEXT_PUBLIC_STARTER_MONTHLY_PRICE_ID,
  starterYearlyProd: process.env.NEXT_PUBLIC_STARTER_YEARLY_PRICE_ID,
  teamMonthlyProd: process.env.NEXT_PUBLIC_TEAM_MONTHLY_PRICE_ID,
  teamYearlyProd: process.env.NEXT_PUBLIC_TEAM_YEARLY_PRICE_ID,
};

console.log('  Sandbox:');
console.log('    Starter Monthly:', priceIds.starterMonthlySandbox || '❌ MISSING');
console.log('    Starter Yearly:', priceIds.starterYearlySandbox || '❌ MISSING');
console.log('    Team Monthly:', priceIds.teamMonthlySandbox || '❌ MISSING');
console.log('    Team Yearly:', priceIds.teamYearlySandbox || '❌ MISSING');

console.log('  Production:');
console.log('    Starter Monthly:', priceIds.starterMonthlyProd || '❌ MISSING');
console.log('    Starter Yearly:', priceIds.starterYearlyProd || '❌ MISSING');
console.log('    Team Monthly:', priceIds.teamMonthlyProd || '❌ MISSING');
console.log('    Team Yearly:', priceIds.teamYearlyProd || '❌ MISSING');

console.log('\n📝 Next Steps:');
if (!tokens.production || tokens.production.length < 30) {
  console.log('  ⚠️  Your production client token appears incomplete');
  console.log('  → Go to Paddle Dashboard → Developer Tools → Authentication');
  console.log('  → Copy the full "Client-side token" (starts with "live_")');
  console.log('  → Update NEXT_PUBLIC_PADDLE_CLIENT_TOKEN in .env.local');
}

console.log('\n🔗 Paddle Dashboard Links:');
console.log('  Sandbox: https://sandbox-vendors.paddle.com/authentication-v2');
console.log('  Production: https://vendors.paddle.com/authentication-v2');
