// app/auth/signin/page.tsx
export default function SignInPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Sign In</h1>
      <form className="space-y-4 max-w-sm">
        <input
          type="text"
          placeholder="Username"
          className="w-full border border-gray-300 p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border border-gray-300 p-2 rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Sign In
        </button>
      </form>
    </main>
  );
}
