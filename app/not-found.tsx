import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center space-y-8 px-4">
        {/* Animated 404 */}
        <div className="relative">
          <h1 className="text-9xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            404
          </h1>
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-orange-600/20 blur-3xl -z-10" />
        </div>

        {/* Message */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white">Page Not Found</h2>
          <p className="text-gray-400 max-w-md mx-auto">
            Oops! The page you&apos;re looking for doesn&apos;t exist. It might
            have been moved or deleted.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-4 bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 rounded-lg text-white font-semibold transition-all transform hover:scale-105"
          >
            Back to Home
          </Link>
          <Link
            href="#contact"
            className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg text-white font-semibold transition-all"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
