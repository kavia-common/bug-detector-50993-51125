import React from "react";

// PUBLIC_INTERFACE
export default function SettingsPage() {
  /** Basic settings placeholder UI. */
  return (
    <div className="container">
      <h2>Settings</h2>
      <p className="helper">Configure your app preferences (future options will be added here).</p>
      <div className="form-field">
        <label>Theme preference</label>
        <select disabled defaultValue="system">
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <button className="btn" disabled>Save (coming soon)</button>
    </div>
  );
}
