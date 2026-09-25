import { Select } from "@/components/ui/Input";
import { SAMPLE_CATEGORIES } from "@/lib/sample-data";

export function CategorySelect(props: React.ComponentPropsWithoutRef<typeof Select>) {
  return (
    <Select {...props}>
      <option value="">Select a category</option>
      {SAMPLE_CATEGORIES.map((c) => (
        <option key={c.slug} value={c.slug}>
          {c.name}
        </option>
      ))}
    </Select>
  );
}
