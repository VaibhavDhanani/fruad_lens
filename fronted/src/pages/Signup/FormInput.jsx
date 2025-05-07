import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

const FormInput = ({
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
  icon: Icon,
  type = 'text',
  required = true,
}) => {
  return (
    <div className="mb-5">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="pl-10 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 
          focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600
          hover:border-blue-400 transition-all"
        />
      </div>
    </div>
  );
};

export default FormInput;