import { z } from 'zod';
export const salesDealSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  contact: z.string().uuid('Select an existing contact'),
  product: z.string().uuid('Select an active product'),
  value: z.coerce.number().finite().min(0, 'Value cannot be negative'),
});
export function productLabel(product: { name: string; parent_id: string | null }, products: { id: string; name: string }[]) {
  const parent = products.find(p => p.id === product.parent_id);
  return parent ? `${parent.name} · ${product.name}` : product.name;
}