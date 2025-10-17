export default function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for trying out Genno",
      features: [
        "5 videos per month",
        "Basic transcription",
        "Markdown export",
        "Community support",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      price: "$29",
      period: "/month",
      description: "Best for content creators",
      features: [
        "50 videos per month",
        "Advanced AI transcription",
        "All export formats",
        "Priority support",
        "Custom formatting",
        "API access",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For teams and agencies",
      features: [
        "Unlimited videos",
        "Dedicated AI model",
        "White-label solution",
        "24/7 premium support",
        "Custom integrations",
        "SLA guarantee",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-32 bg-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <div className="inline-block px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-sm font-semibold mb-6">
            Pricing
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Simple, transparent pricing
            </span>
          </h2>
          <p className="text-xl text-gray-400">
            Choose the plan that fits your needs. Upgrade or downgrade anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-2xl backdrop-blur-sm transition-all duration-300 ${
                plan.popular
                  ? "bg-gradient-to-b from-purple-900/40 to-blue-900/40 border-2 border-purple-500 scale-105 shadow-2xl shadow-purple-500/50"
                  : "bg-white/5 border border-white/10 hover:border-purple-500/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="px-4 py-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full text-white text-sm font-semibold">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                <div className="flex items-end justify-center gap-1">
                  <span className="text-5xl font-bold text-white">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-gray-400 mb-2">{plan.period}</span>
                  )}
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-4 rounded-lg font-semibold transition-all ${
                  plan.popular
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg shadow-purple-500/50"
                    : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Link */}
        <div className="text-center mt-16">
          <p className="text-gray-400">
            Have questions?{" "}
            <a
              href="#faq"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Check our FAQ
            </a>{" "}
            or{" "}
            <a
              href="#contact"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              contact us
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
