export interface Book {
  id?: number;
  title: string;
  author: string;
  isbn?: string;
  description?: string;
  price: number;
  image_url?: string;
  category?: string;
  publish_date?: Date;
  stock_quantity?: number;
  created_at?: Date;
  updated_at?: Date;
}