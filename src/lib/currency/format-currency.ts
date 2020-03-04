export function formatCurrency(amount: number, currency: string) {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: currency,
  });
}
