"use client";

import { Check } from "lucide-react";
import { type FormEvent, useState } from "react";

import { Field, fieldProps } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { BARRIER_CATEGORY_META } from "@/config/barrier-categories";
import { CURRENCY_META } from "@/config/currencies";
import { parseAmount } from "@/lib/currency";
import { validateExpenseForm, type FieldErrors } from "@/lib/gap/validation";
import { BARRIER_CATEGORIES, CURRENCY_CODES, type BarrierCategory, type CurrencyCode, type Expense } from "@/types";

export interface ExpenseFormState {
  name: string;
  amount: string;
  currency: CurrencyCode;
  category: BarrierCategory;
  mandatory: boolean;
  deadline: string;
}

export function blankExpenseForm(currency: CurrencyCode): ExpenseFormState {
  return { name: "", amount: "", currency, category: "tuition", mandatory: true, deadline: "" };
}

export function formFromExpense(expense: Expense): ExpenseFormState {
  return {
    name: expense.name,
    amount: String(expense.amount),
    currency: expense.currency,
    category: expense.category,
    mandatory: expense.mandatory,
    deadline: expense.deadline ?? "",
  };
}

interface ExpenseEditorProps {
  initial: ExpenseFormState;
  isEditing: boolean;
  onSave: (values: Omit<Expense, "id">) => void;
  onCancel: () => void;
}

/** Add / edit form for one expense. Holds its own field state and errors. */
export function ExpenseEditor({ initial, isEditing, onSave, onCancel }: ExpenseEditorProps) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState<FieldErrors>({});

  const set = <K extends keyof ExpenseFormState>(key: K, value: ExpenseFormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  function submit(event: FormEvent) {
    event.preventDefault();
    const found = validateExpenseForm(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    onSave({
      name: form.name.trim(),
      amount: parseAmount(form.amount) ?? 0,
      currency: form.currency,
      category: form.category,
      mandatory: form.mandatory,
      deadline: form.deadline || undefined,
    });
  }

  return (
    <form
      onSubmit={submit}
      aria-label={isEditing ? "Edit expense" : "Add expense"}
      className="rounded-xl border border-primary/30 bg-accent/40 p-5"
    >
      <h3 className="text-sm font-semibold text-navy">{isEditing ? "Edit expense" : "Add an expense"}</h3>

      <div className="mt-4 grid gap-4 sm:grid-cols-6">
        <Field id="exp-name" label="Name" required error={errors.name} className="sm:col-span-6">
          <Input
            {...fieldProps("exp-name", { error: errors.name })}
            value={form.name}
            placeholder="e.g. Exam registration fee"
            onChange={(e) => set("name", e.target.value)}
            autoFocus
          />
        </Field>

        <Field id="exp-amount" label="Amount" required error={errors.amount} className="sm:col-span-3">
          <Input
            {...fieldProps("exp-amount", { error: errors.amount })}
            inputMode="decimal"
            value={form.amount}
            placeholder="0.00"
            onChange={(e) => set("amount", e.target.value)}
          />
        </Field>

        <Field id="exp-currency" label="Currency" className="sm:col-span-3">
          <Select id="exp-currency" value={form.currency} onChange={(e) => set("currency", e.target.value as CurrencyCode)}>
            {CURRENCY_CODES.map((code) => (
              <option key={code} value={code}>
                {code} · {CURRENCY_META[code].name}
              </option>
            ))}
          </Select>
        </Field>

        <Field id="exp-category" label="Category" className="sm:col-span-2">
          <Select id="exp-category" value={form.category} onChange={(e) => set("category", e.target.value as BarrierCategory)}>
            {BARRIER_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {BARRIER_CATEGORY_META[category].label}
              </option>
            ))}
          </Select>
        </Field>

        <Field id="exp-required" label="Required or optional?" className="sm:col-span-2">
          <Select
            id="exp-required"
            value={form.mandatory ? "mandatory" : "optional"}
            onChange={(e) => set("mandatory", e.target.value === "mandatory")}
          >
            <option value="mandatory">Mandatory</option>
            <option value="optional">Optional</option>
          </Select>
        </Field>

        <Field id="exp-deadline" label="Due date" error={errors.deadline} hint="Optional." className="sm:col-span-2">
          <Input
            {...fieldProps("exp-deadline", { error: errors.deadline, hint: true })}
            type="date"
            value={form.deadline}
            onChange={(e) => set("deadline", e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button type="submit">
          <Check /> {isEditing ? "Save changes" : "Add expense"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
