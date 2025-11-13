-- ============================================================================
-- CREDITS AND SUBSCRIPTIONS SCHEMA FOR GENNO
-- Execute this in your Supabase SQL Editor
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PART 1: USER_CREDITS TABLE
-- ============================================================================

-- Create user_credits table to track user credits
CREATE TABLE IF NOT EXISTS user_credits (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    clerk_user_id TEXT UNIQUE NOT NULL,
    credits INTEGER DEFAULT 3 NOT NULL CHECK (credits >= 0),
    total_credits_used INTEGER DEFAULT 0 NOT NULL,
    plan_type TEXT DEFAULT 'free' NOT NULL CHECK (plan_type IN ('free', 'starter', 'team')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    last_credit_reset TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    CONSTRAINT fk_user_credits_profile FOREIGN KEY (clerk_user_id) 
        REFERENCES profiles(clerk_user_id) ON DELETE CASCADE
);

-- Create indexes for user_credits
CREATE INDEX IF NOT EXISTS idx_user_credits_clerk_user_id ON user_credits(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_user_credits_plan_type ON user_credits(plan_type);

-- Enable Row Level Security for user_credits
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;

-- Create policies for user_credits
CREATE POLICY "Users can view their own credits" 
    ON user_credits FOR SELECT 
    USING (clerk_user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can update their own credits" 
    ON user_credits FOR UPDATE 
    USING (clerk_user_id = current_setting('app.current_user_id', true));

-- Function to automatically update user_credits.updated_at
CREATE OR REPLACE FUNCTION update_user_credits_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user_credits updated_at
DROP TRIGGER IF EXISTS update_user_credits_updated_at ON user_credits;
CREATE TRIGGER update_user_credits_updated_at
    BEFORE UPDATE ON user_credits
    FOR EACH ROW
    EXECUTE FUNCTION update_user_credits_updated_at();

-- ============================================================================
-- PART 2: SUBSCRIPTIONS TABLE
-- ============================================================================

-- Create subscriptions table to track Paddle subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    clerk_user_id TEXT NOT NULL,
    paddle_subscription_id TEXT UNIQUE,
    paddle_customer_id TEXT,
    plan_type TEXT NOT NULL CHECK (plan_type IN ('free', 'starter', 'team')),
    status TEXT DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'past_due', 'canceled', 'paused', 'trialing')),
    price_id TEXT,
    billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
    amount DECIMAL(10, 2) DEFAULT 0.00,
    currency TEXT DEFAULT 'USD',
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at TIMESTAMP WITH TIME ZONE,
    canceled_at TIMESTAMP WITH TIME ZONE,
    trial_start TIMESTAMP WITH TIME ZONE,
    trial_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    metadata JSONB DEFAULT '{}'::JSONB,
    CONSTRAINT fk_subscriptions_profile FOREIGN KEY (clerk_user_id) 
        REFERENCES profiles(clerk_user_id) ON DELETE CASCADE
);

-- Create indexes for subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_clerk_user_id ON subscriptions(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_paddle_subscription_id ON subscriptions(paddle_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_type ON subscriptions(plan_type);

-- Enable Row Level Security for subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for subscriptions
CREATE POLICY "Users can view their own subscriptions" 
    ON subscriptions FOR SELECT 
    USING (clerk_user_id = current_setting('app.current_user_id', true));

-- Function to automatically update subscriptions.updated_at
CREATE OR REPLACE FUNCTION update_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for subscriptions updated_at
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_subscriptions_updated_at();

-- ============================================================================
-- PART 3: CREDIT_TRANSACTIONS TABLE (Optional - for audit trail)
-- ============================================================================

-- Create credit_transactions table to track credit usage history
CREATE TABLE IF NOT EXISTS credit_transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    clerk_user_id TEXT NOT NULL,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('deduct', 'add', 'reset', 'refund')),
    amount INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    reason TEXT,
    blog_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    metadata JSONB DEFAULT '{}'::JSONB,
    CONSTRAINT fk_credit_transactions_profile FOREIGN KEY (clerk_user_id) 
        REFERENCES profiles(clerk_user_id) ON DELETE CASCADE,
    CONSTRAINT fk_credit_transactions_blog FOREIGN KEY (blog_id) 
        REFERENCES blogs(id) ON DELETE SET NULL
);

-- Create indexes for credit_transactions
CREATE INDEX IF NOT EXISTS idx_credit_transactions_clerk_user_id ON credit_transactions(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at ON credit_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_type ON credit_transactions(transaction_type);

-- Enable Row Level Security for credit_transactions
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for credit_transactions
CREATE POLICY "Users can view their own credit transactions" 
    ON credit_transactions FOR SELECT 
    USING (clerk_user_id = current_setting('app.current_user_id', true));

-- ============================================================================
-- PART 4: HELPER FUNCTIONS
-- ============================================================================

-- Function to deduct credits and log transaction
CREATE OR REPLACE FUNCTION deduct_credit(
    p_clerk_user_id TEXT,
    p_amount INTEGER DEFAULT 1,
    p_reason TEXT DEFAULT 'Blog creation',
    p_blog_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_current_credits INTEGER;
    v_new_balance INTEGER;
BEGIN
    -- Get current credits
    SELECT credits INTO v_current_credits
    FROM user_credits
    WHERE clerk_user_id = p_clerk_user_id
    FOR UPDATE;

    -- Check if user has enough credits
    IF v_current_credits < p_amount THEN
        RETURN FALSE;
    END IF;

    -- Calculate new balance
    v_new_balance := v_current_credits - p_amount;

    -- Update credits
    UPDATE user_credits
    SET 
        credits = v_new_balance,
        total_credits_used = total_credits_used + p_amount,
        updated_at = TIMEZONE('utc', NOW())
    WHERE clerk_user_id = p_clerk_user_id;

    -- Log transaction
    INSERT INTO credit_transactions (
        clerk_user_id,
        transaction_type,
        amount,
        balance_after,
        reason,
        blog_id
    ) VALUES (
        p_clerk_user_id,
        'deduct',
        p_amount,
        v_new_balance,
        p_reason,
        p_blog_id
    );

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to add credits and log transaction
CREATE OR REPLACE FUNCTION add_credits(
    p_clerk_user_id TEXT,
    p_amount INTEGER,
    p_reason TEXT DEFAULT 'Credit purchase'
)
RETURNS BOOLEAN AS $$
DECLARE
    v_current_credits INTEGER;
    v_new_balance INTEGER;
BEGIN
    -- Get current credits
    SELECT credits INTO v_current_credits
    FROM user_credits
    WHERE clerk_user_id = p_clerk_user_id
    FOR UPDATE;

    -- Calculate new balance
    v_new_balance := v_current_credits + p_amount;

    -- Update credits
    UPDATE user_credits
    SET 
        credits = v_new_balance,
        updated_at = TIMEZONE('utc', NOW())
    WHERE clerk_user_id = p_clerk_user_id;

    -- Log transaction
    INSERT INTO credit_transactions (
        clerk_user_id,
        transaction_type,
        amount,
        balance_after,
        reason
    ) VALUES (
        p_clerk_user_id,
        'add',
        p_amount,
        v_new_balance,
        p_reason
    );

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to reset credits based on plan (called monthly)
CREATE OR REPLACE FUNCTION reset_monthly_credits(
    p_clerk_user_id TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    v_plan_type TEXT;
    v_new_credits INTEGER;
BEGIN
    -- Get user's plan type
    SELECT plan_type INTO v_plan_type
    FROM user_credits
    WHERE clerk_user_id = p_clerk_user_id;

    -- Determine credits based on plan
    CASE v_plan_type
        WHEN 'free' THEN v_new_credits := 3;
        WHEN 'starter' THEN v_new_credits := 100;
        WHEN 'team' THEN v_new_credits := 500;
        ELSE v_new_credits := 3;
    END CASE;

    -- Update credits
    UPDATE user_credits
    SET 
        credits = v_new_credits,
        last_credit_reset = TIMEZONE('utc', NOW()),
        updated_at = TIMEZONE('utc', NOW())
    WHERE clerk_user_id = p_clerk_user_id;

    -- Log transaction
    INSERT INTO credit_transactions (
        clerk_user_id,
        transaction_type,
        amount,
        balance_after,
        reason
    ) VALUES (
        p_clerk_user_id,
        'reset',
        v_new_credits,
        v_new_credits,
        'Monthly credit reset for ' || v_plan_type || ' plan'
    );

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to initialize credits for new user
CREATE OR REPLACE FUNCTION initialize_user_credits()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_credits (clerk_user_id, credits, plan_type)
    VALUES (NEW.clerk_user_id, 3, 'free')
    ON CONFLICT (clerk_user_id) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically create credits entry when profile is created
DROP TRIGGER IF EXISTS trigger_initialize_user_credits ON profiles;
CREATE TRIGGER trigger_initialize_user_credits
    AFTER INSERT ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION initialize_user_credits();

-- ============================================================================
-- PART 5: VIEWS FOR SUBSCRIPTION AND CREDIT ANALYTICS
-- ============================================================================

-- View for user subscription details with credits
CREATE OR REPLACE VIEW user_subscription_details AS
SELECT 
    p.clerk_user_id,
    p.email,
    p.first_name,
    p.last_name,
    p.username,
    uc.credits,
    uc.total_credits_used,
    uc.plan_type,
    uc.last_credit_reset,
    s.paddle_subscription_id,
    s.status as subscription_status,
    s.amount as subscription_amount,
    s.billing_cycle,
    s.current_period_start,
    s.current_period_end,
    s.trial_end,
    p.created_at as user_joined_date
FROM profiles p
LEFT JOIN user_credits uc ON p.clerk_user_id = uc.clerk_user_id
LEFT JOIN subscriptions s ON p.clerk_user_id = s.clerk_user_id
ORDER BY p.created_at DESC;

-- View for credit usage statistics
CREATE OR REPLACE VIEW credit_usage_stats AS
SELECT 
    clerk_user_id,
    COUNT(*) as total_transactions,
    SUM(CASE WHEN transaction_type = 'deduct' THEN amount ELSE 0 END) as total_credits_used,
    SUM(CASE WHEN transaction_type = 'add' THEN amount ELSE 0 END) as total_credits_added,
    MAX(created_at) as last_transaction_date
FROM credit_transactions
GROUP BY clerk_user_id;

-- ============================================================================
-- PART 6: TABLE COMMENTS
-- ============================================================================

COMMENT ON TABLE user_credits IS 'Tracks user credit balances and plan types';
COMMENT ON TABLE subscriptions IS 'Stores Paddle subscription information for users';
COMMENT ON TABLE credit_transactions IS 'Audit trail for all credit transactions';

COMMENT ON COLUMN user_credits.credits IS 'Current available credits for the user';
COMMENT ON COLUMN user_credits.total_credits_used IS 'Lifetime total credits used by the user';
COMMENT ON COLUMN user_credits.plan_type IS 'Current subscription plan: free, starter, or team';
COMMENT ON COLUMN user_credits.last_credit_reset IS 'Last time credits were reset (monthly)';

COMMENT ON COLUMN subscriptions.paddle_subscription_id IS 'Unique subscription ID from Paddle';
COMMENT ON COLUMN subscriptions.status IS 'Current subscription status from Paddle';
COMMENT ON COLUMN subscriptions.current_period_end IS 'When the current billing period ends';

-- ============================================================================
-- SETUP COMPLETE
-- ============================================================================

-- Verify tables were created
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name IN ('user_credits', 'subscriptions', 'credit_transactions')
ORDER BY table_name;
