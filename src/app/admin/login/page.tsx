import { loginAction } from "@/app/admin/actions";
import { BrandLogo } from "@/components/BrandLogo";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="admin-shell grid min-h-screen place-items-center px-5">
      <form action={loginAction} className="admin-card grid w-full max-w-md gap-5 p-8">
        <BrandLogo className="h-16 w-44" tone="cream" />
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-saffron">Back-office</p>
          <h1 className="mt-3 text-3xl font-black text-bone">Connexion admin</h1>
        </div>
        {error ? (
          <p className="rounded-lg border border-ember/40 bg-ember/10 p-3 text-sm text-bone">
            {decodeURIComponent(error)}
          </p>
        ) : null}
        <label className="admin-label">
          Email
          <input className="admin-input" name="email" type="email" required />
        </label>
        <label className="admin-label">
          Mot de passe
          <input className="admin-input" name="password" type="password" required />
        </label>
        <button className="admin-button admin-button-primary" type="submit">Entrer</button>
      </form>
    </main>
  );
}
