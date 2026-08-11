import * as React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login | YURVANA AGRO",
};

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
