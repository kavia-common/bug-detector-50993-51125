import { render, screen } from '@testing-library/react';
import App from './App';

test('renders navbar brand', () => {
  render(<App />);
  const el = screen.getByText(/Bug Detector/i);
  expect(el).toBeInTheDocument();
});
