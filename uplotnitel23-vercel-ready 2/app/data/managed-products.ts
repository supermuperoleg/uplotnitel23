export type ManagedProduct = {
  id: number;
  title: string;
  sku: string;
  description: string;
  category: string;
  brandKey: string;
  brandLabel: string;
  brandAliases: string[];
  height: string | null;
  width: string | null;
  price: string | null;
  imageUrl: string | null;
  createdAt: number;
};

type ProductRow = {
  id: number;
  title: string;
  sku: string;
  description: string;
  category: string;
  brand_key: string;
  brand_label: string;
  brand_aliases: string;
  height: string | null;
  width: string | null;
  price: string | null;
  image_key: string | null;
  created_at: number;
};

export async function getManagedProducts(): Promise<ManagedProduct[]> {
  return [];
}
