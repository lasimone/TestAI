import { render, screen } from '@testing-library/react';
import DataDisplay from './data-display';

test('renders informational elements', () => {
  render(<DataDisplay />);
  const statusElement = screen.getByText(/Status:/i);
  expect(statusElement).toBeInTheDocument();

  const selectedElement = screen.getByText(/Selected Test:/i);
  expect(selectedElement).toBeInTheDocument();
});
