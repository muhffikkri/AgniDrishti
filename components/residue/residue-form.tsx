"use client";

import { useMemo, useState } from "react";
import { Camera, Check, Sparkles } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { ProvenanceBadge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { useAppStore } from "@/context/AppStore";
import { estimateResidue } from "@/modules/residue/estimate";
import { validateResidueForm, hasErrors, type ResidueFormInput } from "@/lib/validation/residue";
import { formatNumber } from "@/lib/format/format";
import type { ResidueRecord } from "@/lib/types";

const CROPS = ["wheat", "rice", "maize", "sugarcane", "other"];
const RESIDUES = ["straw", "husk", "stalk", "bagasse"];
const UNITS = ["acres", "ha"];

const blank: ResidueFormInput = {
  farmerId: "",
  zoneId: "",
  cropType: "",
  residueType: "",
  fieldAreaValue: 0,
  fieldAreaUnit: "acres",
  harvestDate: "",
  condition: "dry",
  handlingForm: "loose",
  estimatedQuantityTonnes: 0,
  availableFrom: "",
  availableUntil: "",
  notes: "",
};

export function ResidueForm() {
  const { state, addResidue } = useAppStore();
  const { notify } = useToast();
  const [form, setForm] = useState<ResidueFormInput>({ ...blank });
  const [yieldPerAcre, setYieldPerAcre] = useState(0.6);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [submitted, setSubmitted] = useState(false);

  const suggestion = useMemo(
    () =>
      estimateResidue({
        fieldAreaValue: form.fieldAreaValue,
        fieldAreaUnit: form.fieldAreaUnit,
        yieldPerAcreTonnes: yieldPerAcre,
      }),
    [form.fieldAreaValue, form.fieldAreaUnit, yieldPerAcre]
  );

  const set = <K extends keyof ResidueFormInput>(key: K, value: ResidueFormInput[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateResidueForm(form);
    setErrors(errs);
    if (hasErrors(errs)) {
      notify("Please fix the highlighted fields.", "danger");
      return;
    }

    const residue: ResidueRecord = {
      id: `RES-${String(state.residues.length + 1).padStart(3, "0")}`,
      farmerId: form.farmerId || undefined,
      zoneId: form.zoneId,
      cropType: form.cropType,
      residueType: form.residueType,
      fieldAreaValue: form.fieldAreaValue,
      fieldAreaUnit: form.fieldAreaUnit as ResidueRecord["fieldAreaUnit"],
      harvestDate: form.harvestDate,
      condition: form.condition as ResidueRecord["condition"],
      handlingForm: form.handlingForm as ResidueRecord["handlingForm"],
      estimatedQuantityTonnes: form.estimatedQuantityTonnes,
      measuredQuantityTonnes: null,
      availableFrom: form.availableFrom,
      availableUntil: form.availableUntil,
      verificationStatus: "unverified",
      provenance: "simulated",
      notes: form.notes,
    };

    addResidue(residue);
    notify(`Residue ${residue.id} registered (estimated, unverified).`, "success");
    setForm({ ...blank });
    setSubmitted(true);
    setErrors({});
  };

  return (
    <form onSubmit={onSubmit} noValidate className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="flex flex-col gap-4 lg:col-span-2">
        <Card>
          <CardHeader title="1. Farmer and location" subtitle="Demo profile; no real personal data." />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Farmer / profile ID (optional)" htmlFor="farmerId">
              <Input
                id="farmerId"
                value={form.farmerId}
                onChange={(e) => set("farmerId", e.target.value)}
                placeholder="e.g. F-100"
              />
            </Field>
            <Field label="Zone" htmlFor="zoneId" required error={errors.zoneId}>
              <Select id="zoneId" value={form.zoneId} onChange={(e) => set("zoneId", e.target.value)}>
                <option value="">Select a zone…</option>
                {state.riskZones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="2. Crop and residue characteristics"
            subtitle="General characteristics, not a quality guarantee."
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Crop type" htmlFor="cropType" required error={errors.cropType}>
              <Select
                id="cropType"
                value={form.cropType}
                onChange={(e) => set("cropType", e.target.value)}
              >
                <option value="">Select crop</option>
                {CROPS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Residue type" htmlFor="residueType" required error={errors.residueType}>
              <Select
                id="residueType"
                value={form.residueType}
                onChange={(e) => set("residueType", e.target.value)}
              >
                <option value="">Select residue</option>
                {RESIDUES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Residue condition" htmlFor="condition">
              <Select
                id="condition"
                value={form.condition}
                onChange={(e) => set("condition", e.target.value)}
              >
                <option value="dry">Dry</option>
                <option value="slightly_damp">Slightly damp</option>
                <option value="wet">Wet</option>
              </Select>
            </Field>
            <Field label="Handling form" htmlFor="handlingForm">
              <Select
                id="handlingForm"
                value={form.handlingForm}
                onChange={(e) => set("handlingForm", e.target.value)}
              >
                <option value="loose">Loose</option>
                <option value="baled">Baled</option>
                <option value="chopped">Chopped</option>
              </Select>
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="3. Estimated quantity and availability"
            subtitle="Estimated quantity is not a measured weight."
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Field area" htmlFor="fieldAreaValue" error={errors.fieldAreaValue} required>
              <div className="flex gap-2">
                <Input
                  id="fieldAreaValue"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.fieldAreaValue || ""}
                  onChange={(e) => set("fieldAreaValue", Number(e.target.value))}
                />
                <select
                  aria-label="Field area unit"
                  value={form.fieldAreaUnit}
                  onChange={(e) => set("fieldAreaUnit", e.target.value)}
                  className="w-24 rounded border border-line bg-field px-2 text-body text-ink-primary"
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </Field>
            <Field
              label="Assumed residue yield (t/acre)"
              htmlFor="yieldPerAcre"
              hint="Illustrative assumption used to suggest an estimate."
            >
              <Input
                id="yieldPerAcre"
                type="number"
                step="0.05"
                min="0"
                value={yieldPerAcre}
                onChange={(e) => setYieldPerAcre(Number(e.target.value))}
              />
            </Field>
            <Field
              label="Estimated quantity (t)"
              htmlFor="estimatedQuantityTonnes"
              required
              error={errors.estimatedQuantityTonnes}
              hint="Recorded as an estimate, kept separate from any measured weight."
            >
              <div className="flex gap-2">
                <Input
                  id="estimatedQuantityTonnes"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.estimatedQuantityTonnes}
                  onChange={(e) => set("estimatedQuantityTonnes", Number(e.target.value))}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => set("estimatedQuantityTonnes", suggestion.estimatedQuantityTonnes)}
                >
                  <Sparkles className="h-3.5 w-3.5" /> Use estimate
                </Button>
              </div>
            </Field>
            <div />
            <Field label="Available from" htmlFor="availableFrom" required error={errors.availableFrom}>
              <Input
                id="availableFrom"
                type="date"
                value={form.availableFrom}
                onChange={(e) => set("availableFrom", e.target.value)}
              />
            </Field>
            <Field label="Available until" htmlFor="availableUntil" required error={errors.availableUntil}>
              <Input
                id="availableUntil"
                type="date"
                value={form.availableUntil}
                onChange={(e) => set("availableUntil", e.target.value)}
              />
            </Field>
            <Field label="Harvest date" htmlFor="harvestDate" required error={errors.harvestDate}>
              <Input
                id="harvestDate"
                type="date"
                value={form.harvestDate}
                onChange={(e) => set("harvestDate", e.target.value)}
              />
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader title="4. Photo and notes (optional)" />
          <div className="flex flex-col gap-3">
            <Field
              label="Residue photo"
              htmlFor="photo"
              hint="A photo is stored for context only. It is not treated as a precise mass or moisture measurement."
            >
              <label
                htmlFor="photo"
                className="flex cursor-pointer items-center gap-2 rounded border border-dashed border-line bg-field px-3 py-3 text-body text-ink-secondary hover:border-brand/50"
              >
                <Camera className="h-4 w-4" />
                Attach a field photo
              </label>
              <input id="photo" type="file" accept="image/*" className="sr-only" />
            </Field>
            <Field label="Notes" htmlFor="notes">
              <Textarea
                id="notes"
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                placeholder="Any handling or quality context for a buyer (optional)."
              />
            </Field>
          </div>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card className="sticky top-20">
          <CardHeader
            title="5. Estimate summary"
            action={<ProvenanceBadge provenance="derived" />}
          />
          <dl className="flex flex-col gap-2 text-body">
            <div className="flex justify-between">
              <dt className="text-ink-muted">Suggested estimate</dt>
              <dd className="num font-semibold">{formatNumber(suggestion.estimatedQuantityTonnes)} t</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-muted">Recorded estimate</dt>
              <dd className="num">{formatNumber(form.estimatedQuantityTonnes)} t</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-muted">Field area</dt>
              <dd className="num">
                {formatNumber(form.fieldAreaValue)} {form.fieldAreaUnit}
              </dd>
            </div>
          </dl>

          <div className="mt-3 rounded border border-line bg-field px-3 py-2">
            <p className="eyebrow mb-1">Formula</p>
            <p className="text-meta text-ink-secondary">{suggestion.formula}</p>
            <ul className="mt-2 list-disc pl-4 text-meta text-ink-muted">
              {suggestion.assumptions.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>

          <Button type="submit" className="mt-3 w-full">
            <Check className="h-4 w-4" /> Register residue (demo)
          </Button>
          <p className="mt-2 text-meta text-ink-muted">
            Registered supply is never shown as verified or collected.
          </p>
          {submitted ? (
            <p className="mt-2 flex items-center gap-1 text-meta text-brand">
              <Check className="h-3.5 w-3.5" /> Registered. See the list below.
            </p>
          ) : null}
          <div className="mt-2">
            <ProvenanceBadge provenance="simulated" />
          </div>
        </Card>
      </div>
    </form>
  );
}
