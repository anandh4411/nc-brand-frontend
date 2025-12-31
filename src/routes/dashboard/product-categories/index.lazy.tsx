import { createLazyFileRoute } from '@tanstack/react-router';
import ProductCategories from '@/features/product-categories';

export const Route = createLazyFileRoute('/dashboard/product-categories/')({
  component: ProductCategories,
});

