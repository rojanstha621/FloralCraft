import Link from "next/link";
import type { ReactNode } from "react";
import { ExternalLink, LogOut } from "lucide-react";
import type { AdminSession } from "@/lib/auth/session";
import { AdminNavigation } from "./admin-navigation";
import { AdminNotice } from "./admin-notice";

export function AdminShell({
  session,
  title,
  description,
  notice,
  actions,
  children,
}: {
  session: AdminSession;
  title: string;
  description?: string;
  notice?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="admin-root">
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-brand">
            <Link href="/admin">Petal Craft</Link>
            <p>Studio administration</p>
          </div>
          <AdminNavigation />
          <div className="admin-account">
            <span>Signed in as</span>
            <p>{session.email}</p>
            <div>
              <Link href="/" target="_blank">
                View store <ExternalLink aria-hidden="true" />
              </Link>
              <form action="/api/admin/logout" method="post">
                <button type="submit">
                  Sign out <LogOut aria-hidden="true" />
                </button>
              </form>
            </div>
          </div>
        </aside>
        <main className="admin-main">
          <header className="admin-page-header">
            <div>
              <p>Petal Craft control room</p>
              <h1>{title}</h1>
              {description && <span>{description}</span>}
            </div>
            {actions && <div className="admin-header-actions">{actions}</div>}
          </header>
          <AdminNotice message={notice} />
          {children}
        </main>
      </div>
    </div>
  );
}

export const adminCard = "admin-card";
export const adminInput = "admin-input";
export const adminTextarea = "admin-input admin-textarea";
export const adminButton = "admin-primary-button";
