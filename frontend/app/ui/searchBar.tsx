
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

type SearchBarProps = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="flex items-center gap-2 bg-white px-3 py-3 rounded-2xl border border-gray-200 w-fit">
      <input
        placeholder="Søk"
        value={value}
        onChange={onChange}
        className="outline-none bg-transparent text-sm"
      />
      <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />
    </div>
  );
}