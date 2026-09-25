import { Select } from "@/components/ui/Input";
import { CONDITION_OPTIONS } from "@/lib/types";

export function ConditionSelect(props: React.ComponentPropsWithoutRef<typeof Select>) {
  return (
    <Select {...props}>
      <option value="">Select condition</option>
      {CONDITION_OPTIONS.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </Select>
  );
}
