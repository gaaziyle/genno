"use client";

import Link from "next/link";

export default function TermsOfServicePage() {
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
          <h1 className="text-4xl font-bold text-white/92 mb-4">Terms of Service</h1>
          <p className="text-white/64">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="bg-[#1d2025] border border-gray-400/50 rounded-lg p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-white/92 mb-4">1. Acceptance of Terms</h2>
            <p className="text-white/80 leading-relaxed">
              By accessing and using Genno (&quot;the Service&quot;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white/92 mb-4">2. Description of Service</h2>
            <p className="text-white/80 leading-relaxed">
              Genno is a web-based service that uses artificial intelligence to convert YouTube videos into blog posts. The service includes features such as content generation, analytics, and blog management tools. We reserve the right to modify, suspend, or discontinue the service at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white/92 mb-4">3. User Accounts</h2>
            <div className="space-y-4">
              <p className="text-white/80 leading-relaxed">
                To use certain features of the Service, you must create an account. You agree to:
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-1">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized use</li>
                <li>Be responsible for all activities under your account</li>
                <li>Use the service only for lawful purposes</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white/92 mb-4">4. Acceptable Use</h2>
            <div className="space-y-4">
              <p className="text-white/80 leading-relaxed">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-1">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Upload malicious code or viruses</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use the service for spam or unsolicited communications</li>
                <li>Convert content you don&apos;t have rights to use</li>
                <li>Generate content that is harmful, offensive, or illegal</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white/92 mb-4">5. Content and Intellectual Property</h2>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white/92">Your Content</h3>
              <p className="text-white/80 leading-relaxed">
                You retain ownership of any content you submit to the Service. By using our service, you grant us a limited license to process your content for the purpose of providing the service.
              </p>
              
              <h3 className="text-lg font-medium text-white/92">Generated Content</h3>
              <p className="text-white/80 leading-relaxed">
                Content generated by our AI service is provided to you for your use. However, you are responsible for ensuring that your use of generated content complies with applicable laws and doesn&apos;t infringe on third-party rights.
              </p>
              
              <h3 className="text-lg font-medium text-white/92">Our Service</h3>
              <p className="text-white/80 leading-relaxed">
                The Service, including its design, functionality, and underlying technology, is owned by us and protected by intellectual property laws.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white/92 mb-4">6. Subscription and Billing</h2>
            <div className="space-y-4">
              <p className="text-white/80 leading-relaxed">
                Our service operates on a credit-based system with various subscription plans:
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-1">
                <li>Free plan: 3 credits per month</li>
                <li>Starter plan: 100 credits per month</li>
                <li>Team plan: 500 credits per month</li>
              </ul>
              <p className="text-white/80 leading-relaxed">
                Subscription fees are billed in advance and are non-refundable except as required by law. You may cancel your subscription at any time, and cancellation will take effect at the end of your current billing period.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white/92 mb-4">7. Privacy</h2>
            <p className="text-white/80 leading-relaxed">
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices regarding the collection and use of your information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white/92 mb-4">8. Disclaimers and Limitations</h2>
            <div className="space-y-4">
              <p className="text-white/80 leading-relaxed">
                THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND. WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-1">
                <li>Merchantability and fitness for a particular purpose</li>
                <li>Accuracy or completeness of generated content</li>
                <li>Uninterrupted or error-free service</li>
                <li>Security of data transmission</li>
              </ul>
              <p className="text-white/80 leading-relaxed">
                IN NO EVENT SHALL WE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICE.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white/92 mb-4">9. Indemnification</h2>
            <p className="text-white/80 leading-relaxed">
              You agree to indemnify and hold us harmless from any claims, damages, or expenses arising from your use of the Service, your violation of these terms, or your infringement of any third-party rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white/92 mb-4">10. Termination</h2>
            <p className="text-white/80 leading-relaxed">
              We may terminate or suspend your account and access to the Service at our sole discretion, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white/92 mb-4">11. Governing Law</h2>
            <p className="text-white/80 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts in [Your Jurisdiction].
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white/92 mb-4">12. Changes to Terms</h2>
            <p className="text-white/80 leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the updated Terms on our website. Your continued use of the Service after such changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white/92 mb-4">13. Contact Information</h2>
            <p className="text-white/80 leading-relaxed">
              If you have any questions about these Terms, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-[#171a1d] rounded-lg">
              <p className="text-white/92">Email: legal@genno.ai</p>
              <p className="text-white/92">Address: [Your Company Address]</p>
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