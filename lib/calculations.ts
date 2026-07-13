import "server-only"

import {
  accountMappings,
  scoreCards,
  trialBalanceAccounts,
  type TrialBalanceAccount,
} from "@/lib/mock-data"

const currencyFormatter = new Intl.NumberFormat("en-AE", {
  style: "currency",
  currency: "AED",
  maximumFractionDigits: 0,
})

export function formatCurrency(value: number) {
  return currencyFormatter.format(value)
}

export function calculateTrialBalanceSummary(accounts: TrialBalanceAccount[] = trialBalanceAccounts) {
  const debit = accounts.reduce((sum, account) => sum + account.debit, 0)
  const credit = accounts.reduce((sum, account) => sum + account.credit, 0)
  const revenue = accounts
    .filter((account) => account.accountName.toLowerCase().includes("revenue"))
    .reduce((sum, account) => sum + account.credit - account.debit, 0)
  const costOfSales = accounts
    .filter((account) => account.accountName.toLowerCase().includes("cost of sales"))
    .reduce((sum, account) => sum + account.debit - account.credit, 0)
  const operatingExpenses = accounts
    .filter((account) =>
      ["expense", "fees", "salaries", "rent"].some((keyword) =>
        account.accountName.toLowerCase().includes(keyword)
      )
    )
    .reduce((sum, account) => sum + account.debit - account.credit, 0)
  const financeCosts = accounts
    .filter((account) => account.accountName.toLowerCase().includes("finance"))
    .reduce((sum, account) => sum + account.debit - account.credit, 0)
  const otherIncome = accounts
    .filter((account) => account.accountName.toLowerCase().includes("other income"))
    .reduce((sum, account) => sum + account.credit - account.debit, 0)

  return {
    debit,
    credit,
    balanced: Math.abs(debit - credit) < 1,
    revenue,
    costOfSales,
    grossProfit: revenue - costOfSales,
    operatingExpenses,
    financeCosts,
    otherIncome,
    profitBeforeTax: revenue - costOfSales - operatingExpenses - financeCosts + otherIncome,
  }
}

export function buildAiCommentaryPayload() {
  const summary = calculateTrialBalanceSummary()

  return {
    principle:
      "The system calculates financial outputs; AI may only explain already-calculated outputs and draft wording.",
    calculatedOutputs: {
      trialBalance: summary,
      scores: scoreCards,
      lowConfidenceMappings: accountMappings.filter((mapping) => mapping.confidence === "Low"),
    },
    requiredSafeWording: [
      "indicative",
      "requires professional review",
      "not professional advice",
    ],
  }
}
