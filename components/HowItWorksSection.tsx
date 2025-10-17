export default function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Paste YouTube URL",
      description: "Simply copy and paste any YouTube video link into Genno.",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
      ),
    },
    {
      number: "02",
      title: "AI Processing",
      description:
        "Our AI transcribes and analyzes the video content, extracting key points and structure.",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
    },
    {
      number: "03",
      title: "Get Your Blog",
      description:
        "Receive a beautifully formatted blog post ready to publish or edit.",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="py-32 bg-black">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              How it works
            </span>
          </h2>
          <p className="text-xl text-gray-400">
            Three simple steps to transform your video content
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-20 left-1/2 w-full h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 opacity-30" />
                )}

                <div className="relative text-center">
                  {/* Step Number */}
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full text-3xl font-bold text-white mb-6 shadow-lg shadow-purple-500/50">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-purple-400">
                      {step.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Demo Code Block */}
          <div className="mt-20 p-8 bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/20 rounded-2xl">
            <div className="flex items-start gap-4">
              <div className="flex flex-col gap-2 text-gray-600 select-none">
                <span>1</span>
                <span>2</span>
                <span>3</span>
              </div>
              <div className="flex-1">
                <pre className="text-gray-300 font-mono text-sm">
                  <code>
                    {`const url = "https://youtube.com/watch?v=...";
const blog = await genno.convert(url);
console.log(blog.content); // Your blog post ✨`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
