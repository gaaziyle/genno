"use client";

import Link from "next/link";

export default function PrivacyPolicyPage() {
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
          <h1 className="text-4xl font-bold text-white/92 mb-4">Privacy Policy</h1>
          <p className="text-white/64">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="bg-[#1d2025] border border-gray-400/50 rounded-lg p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-white/92 mb-4">1. Introduction</h2>
            <p className="text-white/80 leading-relaxed">
              Welcome to Genno (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service that converts YouTube videos into blog posts. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white/92 mb-4">2. Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-white/92 mb-2">Personal Information</h3>
                <p className="text-white/80 leading-relaxed">
                  We may collect personal information that you voluntarily provide to us when you:
                </p>
                <ul className="list-disc list-inside text-white/80 mt-2 space-y-1">
                  <li>Register for an account</li>
                  <li>Use our services</li>
                  <li>Contact us for support</li>
                  <li>Subscribe to our newsletter</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-white/92 mb-2">Usage Information</h3>
                <p className="text-white/80 leading-relaxed">
                  We automatically collect certain information when you use our service, including:
                </p>
                <ul className="list-disc list-inside text-white/80 mt-2 space-y-1">
                  <li>YouTube URLs you submit for conversion</li>
                  <li>Generated blog content</li>
                  <li>Usage patterns and preferences</li>
                  <li>Device and browser information</li>
                  <li>IP address and location data</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white/92 mb-4">3. How We Use Your Information</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              We use the information we collect for various purposes, including:
            </p>
            <ul className="list-disc list-inside text-white/80 space-y-1">
              <li>Providing and maintaining our service</li>
              <li>Processing YouTube video conversions</li>
              <li>Improving our AI algorithms and service quality</li>
              <li>Sending you technical notices and support messages</li>
              <li>Responding to your comments and questions</li>
              <li>Analyzing usage patterns to enhance user experience</li>
              <li>Detecting and preventing fraud or abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white/92 mb-4">4. Information Sharing and Disclosure</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-white/80 space-y-1">
              <li>With your explicit consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and safety</li>
              <li>With trusted service providers who assist in our operations</li>
              <li>In connection with a business transfer or merger</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white/92 mb-4">5. Data Security</h2>
            <p className="text-white/80 leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white/92 mb-4">6. Data Retention</h2>
            <p className="text-white/80 leading-relaxed">
              We retain your personal information only for as long as necessary to fulfill the purposes outlined in this privacy policy, unless a longer retention period is required or permitted by law. When we no longer need your personal information, we will securely delete or anonymize it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibent text-white/92 mb-4">7. Your Rights</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              Depending on your location, you may have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside text-white/80 space-y-1">
              <li>Access to your personal information</li>
              <li>Correction of inaccurate information</li>
              <li>Deletion of your personal information</li>
              <li>Restriction of processing</li>
              <li>Data portability</li>
              <li>Objection to processing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white/92 mb-4">8. Cookies and Tracking</h2>
            <p className="text-white/80 leading-relaxed">
              We use cookies and similar tracking technologies to enhance your experience on our service. You can control cookie settings through your browser preferences. However, disabling cookies may affect the functionality of our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white/92 mb-4">9. Third-Party Services</h2>
            <p className="text-white/80 leading-relaxed">
              Our service may integrate with third-party services, including YouTube&apos;s API and AI processing services. These third parties have their own privacy policies, and we encourage you to review them. We are not responsible for the privacy practices of these third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white/92 mb-4">10. Children&apos;s Privacy</h2>
            <p className="text-white/80 leading-relaxed">
              Our service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white/92 mb-4">11. Changes to This Privacy Policy</h2>
            <p className="text-white/80 leading-relaxed">
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the &quot;Last updated&quot; date. You are advised to review this privacy policy periodically for any changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white/92 mb-4">12. Contact Us</h2>
            <p className="text-white/80 leading-relaxed">
              If you have any questions about this privacy policy or our privacy practices, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-[#171a1d] rounded-lg">
              <p className="text-white/92">Email: privacy@genno.ai</p>
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