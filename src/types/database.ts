export type Ingredient = {
  name: string;
  quantity: string | number;
  unit: string;
}

export type Recipe = {
  id: string;
  created_at: string;
  user_id: string;
  title: string;
  description: string | null;
  ingredients: Ingredient[];
  steps: string[];
  image_url: string | null;
}
