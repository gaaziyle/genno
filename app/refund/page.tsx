"use client";

import Link from "next/link";

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-gray-400/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#8952e0] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="text-white/92 font-semibold text-lg">Genno</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-white/64 hover:text-white/92 transition-colors text-sm"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-[#8952e0] hover:bg-[#7543c9] rounded-md text-white text-sm font-semibold transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/64 hover:text-white/92 transition-colors text-sm mb-6"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </Link>
          <h1 className="text-4xl font-bold text-white/92 mb-4">Refund Policy</h1>
          <p className="text-white/64">Last updated: 26.10.2025</p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-white/92 mb-4">1. General Policy</h2>
            <p className="text-white/80 leading-relaxed">
              We want you to be completely satisfied with Genno. If you&apos;re not happy with your subscription, we offer refunds under certain conditions as outlined in this policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white/92 mb-4">2. Subscription Refunds</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              For subscription plans, refunds are available under the following conditions:
            </p>
            <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
              <li>Requests made within 14 days of the initial subscription purchase</li>
              <li>First-time subscribers only (not applicable to renewals)</li>
              <li>Account has not been used extensively (defined as creating more than 10 business cards)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white/92 mb-4">3. How to Request a Refund</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              To request a refund, please:
            </p>
            <ol className="list-decimal list-inside text-white/80 space-y-2 ml-4">
              <li>Contact our support team through the contact form or email</li>
              <li>Include your account email and subscription details</li>
              <li>Provide a reason for the refund request</li>
              <li>Allow up to 5-7 business days for processing</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white/92 mb-4">4. Non-Refundable Items</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              The following are not eligible for refunds:
            </p>
            <ul className="list-disc list-inside text-white/80 space-y-2 ml-4">
              <li>Subscription renewals (automatic or manual)</li>
              <li>Partial month subscriptions</li>
              <li>Requests made after 14 days of purchase</li>
              <li>Accounts found to have violated our Terms of Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white/92 mb-4">5. Processing Time</h2>
            <p className="text-white/80 leading-relaxed">
              Once your refund is approved, it will be processed within 5-7 business days. The refund will be credited to the original payment method used for the purchase. Please allow additional time for your bank or payment provider to process the refund.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white/92 mb-4">6. Subscription Cancellation</h2>
            <p className="text-white/80 leading-relaxed">
              You may cancel your subscription at any time. Upon cancellation, you will retain access to premium features until the end of your current billing period. No refunds will be provided for the remainder of the billing period.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white/92 mb-4">7. Technical Issues</h2>
            <p className="text-white/80 leading-relaxed">
              If you experience technical issues that prevent you from using the service, please contact support first. We will work to resolve the issue before considering a refund request.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white/92 mb-4">8. Fraudulent Activity</h2>
            <p className="text-white/80 leading-relaxed">
              We reserve the right to deny refund requests if we suspect fraudulent activity or abuse of our refund policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white/92 mb-4">9. Changes to This Policy</h2>
            <p className="text-white/80 leading-relaxed">
              We reserve the right to modify this refund policy at any time. Changes will be effective immediately upon posting to our website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white/92 mb-4">10. Contact Information</h2>
            <p className="text-white/80 leading-relaxed">
              For questions about our refund policy or to request a refund, please contact our support team through our website or email us directly.
            </p>
          </section>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#8952e0] hover:bg-[#7543c9] rounded-md text-white font-semibold transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}