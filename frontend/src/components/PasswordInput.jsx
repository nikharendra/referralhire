import { useState } from 'react';

export default function PasswordInput({ value, onChange, name = 'password', placeholder = 'Password' }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="password-wrap">
      <input
        className="input"
        type={visible ? 'text' : 'password'}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />
      <button
        type="button"
        className="password-toggle"
        onClick={() => setVisible(!visible)}
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? '🙈' : '👁️'}
      </button>
    </div>
  );
}