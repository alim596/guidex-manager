const NumberInput: React.FC<{
  label: string;
  value: number;
  placeholder: string;
  onChange: (value: number) => void;
}> = ({ label, value, placeholder, onChange }) => (
  <div className="mb-4">
    <label className="block text-gray-700 dark:text-white font-bold mb-2">
      {label}
    </label>
    <input
      type="number"
      value={value}
      placeholder={placeholder}
      className="border rounded p-2 w-full bg-white text-gray-800 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:ring-blue-500 dark:focus:ring-blue-400"
      onChange={(e) => onChange(Number(e.target.value))}
    />
  </div>
);
export default NumberInput;
