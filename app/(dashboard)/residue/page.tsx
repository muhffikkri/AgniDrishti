"use client";

import { useAppStore } from "@/context/AppStore";
import { PageHeader } from "@/components/ui/page";
import { ResidueForm } from "@/components/residue/residue-form";
import { ResidueList } from "@/components/residue/residue-list";

export default function ResiduePage() {
  const { state } = useAppStore();

  return (
    <>
      <PageHeader
        title="Residue Registry"
        subtitle="Register available straw with transparent quantity assumptions. Estimates are not measured weights."
      />
      <ResidueForm />
      <div className="mt-4">
        <ResidueList residues={state.residues} />
      </div>
    </>
  );
}
