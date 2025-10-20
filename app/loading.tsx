export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center space-y-8">
        {/* Loading Spinner */}
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-purple-500/20" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 border-r-blue-500 animate-spin" />
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-orange-400/20 to-orange-600/20 blur-xl" />
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Loading Genno</h2>
          <p className="text-gray-400 text-sm">Please wait a moment...</p>
        </div>
      </div>
    </div>
  );
}
