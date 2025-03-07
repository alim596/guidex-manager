const TextInput: React.FC<{
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}> = ({ label, value, placeholder, onChange }) => (
  <div className="mb-4">
    <label className="block text-gray-700 dark:text-white font-bold mb-2">
      {label}
    </label>
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      className="border rounded p-2 w-full bg-white text-gray-800 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary"
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);
export default TextInput;
