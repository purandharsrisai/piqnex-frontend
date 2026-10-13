import { Select } from "@/components/ui/Input";
import { CATEGORIES } from "@/lib/categories";

export function CategorySelect(props: React.ComponentPropsWithoutRef<typeof Select>) {
  return (
    <Select {...props}>
      <option value="">Select a category</option>
      {CATEGORIES.map((c) => (
        <option key={c.slug} value={c.slug}>
          {c.name}
        </option>
      ))}
    </Select>
  );
}
