import Link from "next/link";

export default function HeroSection() {
  return (
    <>
      <main
        className="relative z-10 flex flex-col items-center justify-center text-center text-white px-6"
        style={{ minHeight: "80vh" }}
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-4">Welcome to Ryx</h1>
        <p className="text-lg md:text-2xl mb-8 max-w-2xl">
          Discover a new way to connect, share, and explore with our platform.
        </p>
        <div className="flex space-x-4">
          <Link
            href="/auth/signup"
            className="px-6 py-2 bg-white text-black rounded-full"
          >
            Get Started
          </Link>
          <Link
            href="/about"
            className="px-6 py-2 border border-white rounded-full"
          >
            Learn More
          </Link>
        </div>
      </main>
    </>
  );
}
