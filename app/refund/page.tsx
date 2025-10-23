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
          <h1 className="text-4xl font-bold text-white/92 mb-4">Refund Policy</h1>
          <p className="text-white/64">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="bg-[#1d2025] border border-gray-400/50 rounded-lg p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-white/92 mb-4">1. Overview</h2>
            <p className="text-white/80 leading-relaxed">
              At Genno, we strive to provide exceptional service and value to our customers. This refund policy outlines the circumstances under which refunds may be requested and processed for our AI-powered YouTube to blog conversion service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white/92 mb-4">2. Subscription Refunds</h2>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white/92">30-Day Money-Back Guarantee</h3>
              <p className="text-white/80 leading-relaxed">
                We offer a 30-day money-back guarantee for all new subscriptions. If you&apos;re not satisfied with our service within the first 30 days of your initial subscription, you may request a full refund.
              </p>
              
              <h3 className="text-lg font-medium text-white/92">Conditions for Refunds</h3>
              <ul className="list-disc list-inside text-white/80 space-y-1">
                <li>Refund requests must be made within 30 days of the initial subscription date</li>
                <li>The refund guarantee applies only to first-time subscribers</li>
                <li>Refunds are not available for subscription renewals</li>
                <li>Account must not have violated our Terms of Service</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white/92 mb-4">3. Credit Refunds</h2>
            <div className="space-y-4">
              <p className="text-white/80 leading-relaxed">
                Our service operates on a credit-based system. Please note:
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-1">
                <li>Used credits cannot be refunded</li>
                <li>Unused credits from the current billing period may be eligible for partial refund</li>
                <li>Credits expire at the end of each billing cycle and cannot be carried over</li>
                <li>Bonus credits from promotions are non-refundable</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white/92 mb-4">4. Service Issues</h2>
            <div className="space-y-4">
              <p className="text-white/80 leading-relaxed">
                If you experience technical issues or service disruptions, we may offer:
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-1">
                <li>Credit compensation for failed conversions due to system errors</li>
                <li>Extended service period for significant downtime</li>
                <li>Partial refunds for prolonged service unavailability</li>
              </ul>
              <p className="text-white/80 leading-relaxed">
                Please contact our support team immediately if you encounter any service issues.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white/92 mb-4">5. Non-Refundable Items</h2>
            <div className="space-y-4">
              <p className="text-white/80 leading-relaxed">
                The following are not eligible for refunds:
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-1">
                <li>Subscription renewals after the initial 30-day period</li>
                <li>Credits that have been successfully used for conversions</li>
                <li>Accounts terminated for Terms of Service violations</li>
                <li>Refund requests made after 30 days from the subscription date</li>
                <li>Partial month subscriptions due to mid-cycle cancellations</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white/92 mb-4">6. How to Request a Refund</h2>
            <div className="space-y-4">
              <p className="text-white/80 leading-relaxed">
                To request a refund, please follow these steps:
              </p>
              <ol className="list-decimal list-inside text-white/80 space-y-2">
                <li>Contact our support team at support@genno.ai</li>
                <li>Include your account email and subscription details</li>
                <li>Provide a brief explanation for the refund request</li>
                <li>Allow 3-5 business days for review and processing</li>
              </ol>
              
              <div className="mt-4 p-4 bg-[#171a1d] rounded-lg">
                <p className="text-white/92 font-medium">Contact Information:</p>
                <p className="text-white/80">Email: support@genno.ai</p>
                <p className="text-white/80">Response time: Within 24 hours</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white/92 mb-4">7. Refund Processing</h2>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white/92">Processing Time</h3>
              <ul className="list-disc list-inside text-white/80 space-y-1">
                <li>Refund requests are reviewed within 3-5 business days</li>
                <li>Approved refunds are processed within 5-10 business days</li>
                <li>Refunds are issued to the original payment method</li>
                <li>Bank processing times may vary (typically 3-5 additional business days)</li>
              </ul>
              
              <h3 className="text-lg font-medium text-white/92">Refund Methods</h3>
              <p className="text-white/80 leading-relaxed">
                Refunds will be processed using the same payment method used for the original purchase. If the original payment method is no longer available, alternative arrangements will be made on a case-by-case basis.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white/92 mb-4">8. Cancellation vs. Refund</h2>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white/92">Subscription Cancellation</h3>
              <p className="text-white/80 leading-relaxed">
                You can cancel your subscription at any time from your account settings. Cancellation will:
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-1">
                <li>Stop future billing cycles</li>
                <li>Allow you to use remaining credits until the end of the current period</li>
                <li>Not automatically trigger a refund</li>
              </ul>
              
              <h3 className="text-lg font-medium text-white/92">Requesting a Refund</h3>
              <p className="text-white/80 leading-relaxed">
                A refund request is separate from cancellation and must be explicitly requested through our support team within the eligible timeframe.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white/92 mb-4">9. Dispute Resolution</h2>
            <p className="text-white/80 leading-relaxed">
              If you disagree with a refund decision, you may appeal by providing additional information or documentation. We will review appeals within 5-7 business days. For unresolved disputes, you may contact your payment provider or relevant consumer protection agency.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white/92 mb-4">10. Policy Changes</h2>
            <p className="text-white/80 leading-relaxed">
              We reserve the right to modify this refund policy at any time. Changes will be posted on our website and will apply to future transactions. Existing subscriptions will be governed by the policy in effect at the time of purchase.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white/92 mb-4">11. Contact Us</h2>
            <p className="text-white/80 leading-relaxed">
              If you have any questions about our refund policy or need assistance with a refund request, please don&apos;t hesitate to contact us:
            </p>
            <div className="mt-4 p-4 bg-[#171a1d] rounded-lg">
              <p className="text-white/92">Email: support@genno.ai</p>
              <p className="text-white/92">Subject: Refund Request - [Your Account Email]</p>
              <p className="text-white/92">Response Time: Within 24 hours</p>
            </div>
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