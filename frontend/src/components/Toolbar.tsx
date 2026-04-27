import { Search } from "lucide-react";

type ToolbarOption = {
  value: string;
  label: string;
};

export function Toolbar({
  search,
  onSearchChange,
  onSearch,
  selectValue,
  onSelectChange,
  options,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  selectValue: string;
  onSelectChange: (value: string) => void;
  options: ToolbarOption[];
}) {
  return (
    <div className="toolbar">
      <div className="search-box">
        <Search size={24} />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onSearch();
            }
          }}
          placeholder="Kullanıcı adı ile ara..."
        />
      </div>
      <select value={selectValue} onChange={(event) => onSelectChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
