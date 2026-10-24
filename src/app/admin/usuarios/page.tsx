import { db } from "@/db";
import { users } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const items = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users);

  return (
    <main className="px-4 py-8 md:px-8">
      <h1 className="font-display text-3xl">Usuários e permissões</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Senhas nunca são exibidas. Apenas administradores acessam este painel.
      </p>
      <div className="mt-6 overflow-x-auto rounded-2xl ring-1 ring-white/8">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th>E-mail</th>
              <th>Papel</th>
              <th>Criado em</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-white/8">
                <td className="px-4 py-3">{item.name}</td>
                <td>{item.email}</td>
                <td>{item.role}</td>
                <td>{item.createdAt.toLocaleDateString("pt-BR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
