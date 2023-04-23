import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import App from '../App';

test('searches for a movie and displays the results', async () => {
  const mockMovies = [
    { id: 1, title: 'Movie 1' },
    { id: 2, title: 'Movie 2' },
    { id: 3, title: 'Movie 3' },
  ];
  const mockResponse = { results: mockMovies };
  global.fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(mockResponse),
    })
  );
  render(<App />);
  const searchInput = screen.getByPlaceholderText('Search for a movie');
  const searchButton = screen.getByText('Search');
  fireEvent.change(searchInput, { target: { value: 'movie' } });
  fireEvent.click(searchButton);
  await waitFor(() => {
    expect(screen.getByText('Movie 1')).toBeInTheDocument();
    expect(screen.getByText('Movie 2')).toBeInTheDocument();
    expect(screen.getByText('Movie 3')).toBeInTheDocument();
  });
});