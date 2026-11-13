"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { Field } from "@/components/shared/form-field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { BARRIER_CATEGORY_META } from "@/config/barrier-categories";
import { CURRENCY_META, RATES_DISCLAIMER } from "@/config/currencies";
import { convertAmount, formatCurrency } from "@/lib/currency";
import { formatDay } from "@/lib/format";
import { newId } from "@/lib/id";
import { Receipt } from "lucide-react";
import { CURRENCY_CODES, type BarrierCategory, type CurrencyCode, type Expense } from "@/types";

import { blankExpenseForm, ExpenseEditor, formFromExpense, type ExpenseFormState } from "./expense-editor";
import type { StepBaseProps } from "./types";

const QUICK_ADD: { name: string; category: BarrierCategory }[] = [
  { name: "Application fee", category: "application_fees" },
  { name: "Exam registration", category: "exam_fees" },
  { name: "Tuition or programme fee", category: "tuition" },
  { name: "Laptop or equipment", category: "technology" },
  { name: "Travel", category: "transportation" },
  { name: "Books and materials", category: "learning_materials" },
  { name: "Accommodation", category: "housing" },
];

interface StepExpensesProps extends StepBaseProps {
  onCurrencyChange: (currency: CurrencyCode) => void;
}

type Editing = { id: string | null; form: ExpenseFormState } | null;

export function StepExpenses({ draft, apply, errors, onCurrencyChange }: StepExpensesProps) {
  const [editing, setEditing] = useState<Editing>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const total = draft.expenses.reduce(
    (sum, e) => sum + convertAmount(e.amount, e.currency, draft.currency),
    0,
  );
  const mandatoryTotal = draft.expenses
    .filter((e) => e.mandatory)
    .reduce((sum, e) => sum + convertAmount(e.amount, e.currency, draft.currency), 0);
  const mixedCurrencies = draft.expenses.some((e) => e.currency !== draft.currency);

  function save(values: Omit<Expense, "id">) {
    const id = editing?.id;
    apply((d) => ({
      ...d,
      expenses: id
        ? d.expenses.map((e) => (e.id === id ? { ...values, id } : e))
        : [...d.expenses, { ...values, id: newId() }],
    }));
    setEditing(null);
  }

  function remove(id: string) {
    apply((d) => ({
      ...d,
      expenses: d.expenses.filter((e) => e.id !== id),
      claims: d.claims.filter((c) => c.expenseId !== id),
    }));
    setConfirmDeleteId(null);
  }

  const startNew = (preset?: { name: string; category: BarrierCategory }) =>
    setEditing({
      id: null,
      form: { ...blankExpenseForm(draft.currency), ...(preset ?? {}) },
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-muted/50 p-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Total expenses</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight text-navy" aria-live="polite">
            {formatCurrency(Math.round(total * 100) / 100, draft.currency)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {draft.expenses.length} expense{draft.expenses.length === 1 ? "" : "s"}
            {draft.expenses.length > 0 && mandatoryTotal !== total
              ? ` · ${formatCurrency(Math.round(mandatoryTotal * 100) / 100, draft.currency)} mandatory`
              : ""}
          </p>
        </div>
        <Field id="base-currency" label="Show totals in" className="sm:w-56">
          <Select
            id="base-currency"
            value={draft.currency}
            onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
          >
            {CURRENCY_CODES.map((code) => (
              <option key={code} value={code}>
                {code} · {CURRENCY_META[code].name}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      {mixedCurrencies ? <p className="-mt-3 text-xs text-muted-foreground">{RATES_DISCLAIMER}</p> : null}

      {draft.expenses.length === 0 && !editing ? (
        <EmptyState
          compact
          icon={Receipt}
          title="No expenses yet"
          description="Add each cost separately, from fees to travel. Small costs are often what stops an application."
        />
      ) : (
        <ul className="divide-y divide-border rounded-xl border border-border bg-card">
          {draft.expenses.map((expense) => {
            const meta = BARRIER_CATEGORY_META[expense.category];
            const Icon = meta.icon;
            const confirming = confirmDeleteId === expense.id;
            const claimCount = draft.claims.filter((c) => c.expenseId === expense.id).length;
            return (
              <li key={expense.id} className="flex flex-wrap items-center gap-x-4 gap-y-3 p-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1 basis-48">
                  <p className="truncate text-sm font-medium text-navy">{expense.name}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                    <span>{meta.label}</span>
                    <Badge tone={expense.mandatory ? "info" : "neutral"}>
                      {expense.mandatory ? "Mandatory" : "Optional"}
                    </Badge>
                    {expense.deadline ? <span>Due {formatDay(expense.deadline)}</span> : null}
                  </div>
                </div>
                <p className="text-sm font-semibold text-navy">
                  {formatCurrency(expense.amount, expense.currency)}
                  {expense.currency !== draft.currency ? (
                    <span className="block text-right text-xs font-normal text-muted-foreground">
                      ≈ {formatCurrency(convertAmount(expense.amount, expense.currency, draft.currency), draft.currency)}
                    </span>
                  ) : null}
                </p>
                <div className="flex items-center gap-1">
                  {confirming ? (
                    <>
                      <span className="mr-1 text-xs text-muted-foreground">
                        Delete{claimCount > 0 ? ` and ${claimCount} plan item${claimCount === 1 ? "" : "s"}` : ""}?
                      </span>
                      <Button size="sm" variant="outline" onClick={() => remove(expense.id)}>
                        Yes, delete
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setConfirmDeleteId(null)}>
                        Keep
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label={`Edit ${expense.name}`}
                        onClick={() => setEditing({ id: expense.id, form: formFromExpense(expense) })}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label={`Delete ${expense.name}`}
                        onClick={() => setConfirmDeleteId(expense.id)}
                      >
                        <Trash2 />
                      </Button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {errors.expenses ? (
        <p role="alert" className="text-sm font-medium text-destructive-foreground">
          {errors.expenses}
        </p>
      ) : null}

      {editing ? (
        <ExpenseEditor
          key={editing.id ?? "new"}
          initial={editing.form}
          isEditing={editing.id !== null}
          onSave={save}
          onCancel={() => setEditing(null)}
        />
      ) : (
        <div className="space-y-3">
          <Button onClick={() => startNew()}>
            <Plus /> Add expense
          </Button>
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">Common costs, one click to start:</p>
            <ul className="flex flex-wrap gap-2">
              {QUICK_ADD.map((preset) => (
                <li key={preset.name}>
                  <button
                    type="button"
                    onClick={() => startNew(preset)}
                    className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-navy transition-colors hover:bg-muted"
                  >
                    + {preset.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
