import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";
import LoginForm from "@/app/login/login-form";

type LoginPageProps = {
  searchParams?: Promise<{
    next?: string | string[];
  }>;
};

function normalizeNextPath(next: string | string[] | undefined) {
  const value = Array.isArray(next) ? next[0] : next;

  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  return value;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = searchParams ? await searchParams : {};
  const nextPath = normalizeNextPath(params.next);
  const user = await getCurrentUser();

  if (user) {
    redirect(nextPath);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-5 py-10">
      <section className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <p className="text-sm font-medium text-zinc-500">ComiLink</p>
          <h1 className="mt-2 text-2xl font-semibold text-zinc-950">Log in</h1>
        </div>
        <LoginForm nextPath={nextPath} />
      </section>
    </main>
  );
}
