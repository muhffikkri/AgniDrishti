"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/overview");
  }, [router]);
  return (
    <main className="p-8 text-body text-ink-secondary">
      <a className="text-brand underline" href="/overview/">
        Open the AgniDrishti overview
      </a>
    </main>
  );
}
