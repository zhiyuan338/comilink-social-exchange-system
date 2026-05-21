import Link from "next/link";
import { getCurrentUser } from "@/app/lib/auth";
import LogoutButton from "@/app/logout-button";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-5 py-10">
      <section className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-zinc-500">ComiLink</p>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-950">
          Account system
        </h1>
        <div className="mt-6 rounded-md bg-zinc-50 p-4 text-sm text-zinc-700">
          {user ? (
            <p>
              Signed in as{" "}
              <span className="font-semibold text-zinc-950">
                {user.username}
              </span>{" "}
              ({user.qq})
            </p>
          ) : (
            <p>Not signed in.</p>
          )}
        </div>
        <div className="mt-6 flex gap-3">
          {user ? (
            <LogoutButton />
          ) : (
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800"
              href="/login"
            >
              Log in
            </Link>
          )}
          <Link
            className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50"
            href="/api/me"
          >
            Current user API
          </Link>
        </div>
      </section>
    </main>
  );
}
