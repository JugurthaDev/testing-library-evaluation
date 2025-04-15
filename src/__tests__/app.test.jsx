import React from 'react'
import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app.jsx'

test('complete form journey - happy path', async () => {
  render(<App />)

  expect(
    screen.getByRole('heading', {name: /welcome home/i}),
  ).toBeInTheDocument()

  const fillFormLink = screen.getByRole('link', {name: /fill out the form/i})
  expect(fillFormLink).toBeInTheDocument()
  userEvent.click(fillFormLink)

  await waitFor(() => {
    expect(screen.getByRole('heading', {name: /page 1/i})).toBeInTheDocument()
  })

  expect(screen.getByRole('link', {name: /go home/i})).toBeInTheDocument()

  const foodInput = screen.getByLabelText(/favorite food/i)
  expect(foodInput).toBeInTheDocument()
  userEvent.type(foodInput, 'Les pâtes')

  const nextLink = screen.getByRole('link', {name: /next/i})
  expect(nextLink).toBeInTheDocument()
  userEvent.click(nextLink)

  await waitFor(() => {
    expect(screen.getByRole('heading', {name: /page 2/i})).toBeInTheDocument()
  })

  expect(screen.getByRole('link', {name: /go back/i})).toBeInTheDocument()

  const drinkInput = screen.getByLabelText(/favorite drink/i)
  expect(drinkInput).toBeInTheDocument()
  userEvent.type(drinkInput, 'Bière')

  const reviewLink = screen.getByRole('link', {name: /review/i})
  expect(reviewLink).toBeInTheDocument()
  userEvent.click(reviewLink)

  await waitFor(() => {
    expect(screen.getByRole('heading', {name: /confirm/i})).toBeInTheDocument()
  })

  expect(screen.getByText(/please confirm your choices/i)).toBeInTheDocument()

  expect(screen.getByLabelText(/favorite food/i)).toHaveTextContent('Les pâtes')
  expect(screen.getByLabelText(/favorite drink/i)).toHaveTextContent('Bière')

  expect(screen.getByRole('link', {name: /go back/i})).toBeInTheDocument()
  const confirmButton = screen.getByRole('button', {name: /confirm/i})
  expect(confirmButton).toBeInTheDocument()

  userEvent.click(confirmButton)

  await waitFor(() => {
    expect(
      screen.getByRole('heading', {name: /congrats\. you did it\./i}),
    ).toBeInTheDocument()
  })

  const goHomeLink = screen.getByRole('link', {name: /go home/i})
  expect(goHomeLink).toBeInTheDocument()
  userEvent.click(goHomeLink)

  await waitFor(() => {
    expect(
      screen.getByRole('heading', {name: /welcome home/i}),
    ).toBeInTheDocument()
  })
})

test('form submission with empty fields - error path', async () => {
  render(<App />)

  userEvent.click(screen.getByRole('link', {name: /fill out the form/i}))

  await waitFor(() => {
    expect(screen.getByRole('heading', {name: /page 1/i})).toBeInTheDocument()
  })
  userEvent.click(screen.getByRole('link', {name: /next/i}))

  await waitFor(() => {
    expect(screen.getByRole('heading', {name: /page 2/i})).toBeInTheDocument()
  })
  userEvent.type(screen.getByLabelText(/favorite drink/i), 'Bière')
  userEvent.click(screen.getByRole('link', {name: /review/i}))

  await waitFor(() => {
    expect(screen.getByRole('heading', {name: /confirm/i})).toBeInTheDocument()
  })
  userEvent.click(screen.getByRole('button', {name: /confirm/i}))

  await waitFor(() => {
    expect(
      screen.getByText(/oh no\. there was an error\./i),
    ).toBeInTheDocument()
  })
  expect(
    screen.getByText(/les champs food et drink sont obligatoires/i),
  ).toBeInTheDocument()
})

test('form submission with empty fields - complete error path', async () => {
  window.history.pushState({}, '', '/')
  render(<App />)

  expect(
    screen.getByRole('heading', {name: /welcome home/i}),
  ).toBeInTheDocument()

  const fillFormLink = screen.getByRole('link', {name: /fill out the form/i})
  expect(fillFormLink).toBeInTheDocument()
  userEvent.click(fillFormLink)

  await waitFor(() => {
    expect(screen.getByRole('heading', {name: /page 1/i})).toBeInTheDocument()
  })

  expect(screen.getByRole('link', {name: /go home/i})).toBeInTheDocument()

  const foodInput = screen.getByLabelText(/favorite food/i)
  expect(foodInput).toBeInTheDocument()

  const nextLink = screen.getByRole('link', {name: /next/i})
  expect(nextLink).toBeInTheDocument()
  userEvent.click(nextLink)

  await waitFor(() => {
    expect(screen.getByRole('heading', {name: /page 2/i})).toBeInTheDocument()
  })

  expect(screen.getByRole('link', {name: /go back/i})).toBeInTheDocument()

  const drinkInput = screen.getByLabelText(/favorite drink/i)
  expect(drinkInput).toBeInTheDocument()
  userEvent.type(drinkInput, 'Bière')

  const reviewLink = screen.getByRole('link', {name: /review/i})
  expect(reviewLink).toBeInTheDocument()
  userEvent.click(reviewLink)

  await waitFor(() => {
    expect(screen.getByRole('heading', {name: /confirm/i})).toBeInTheDocument()
  })

  expect(screen.getByText(/please confirm your choices/i)).toBeInTheDocument()

  expect(screen.getByLabelText(/favorite food/i)).toHaveTextContent('')
  expect(screen.getByLabelText(/favorite drink/i)).toHaveTextContent('Bière')

  expect(screen.getByRole('link', {name: /go back/i})).toBeInTheDocument()
  const confirmButton = screen.getByRole('button', {name: /confirm/i})
  expect(confirmButton).toBeInTheDocument()

  userEvent.click(confirmButton)

  await waitFor(() => {
    expect(
      screen.getByText(/oh no\. there was an error\./i),
    ).toBeInTheDocument()
  })

  expect(
    screen.getByText(/les champs food et drink sont obligatoires/i),
  ).toBeInTheDocument()

  expect(screen.getByRole('link', {name: /go home/i})).toBeInTheDocument()
  const tryAgainLink = screen.getByRole('link', {name: /try again/i})
  expect(tryAgainLink).toBeInTheDocument()

  userEvent.click(tryAgainLink)

  await waitFor(() => {
    expect(screen.getByRole('heading', {name: /page 1/i})).toBeInTheDocument()
  })
})

test('navigation entre les pages avec Go back et Go home', async () => {
  window.history.pushState({}, '', '/')
  render(<App />)

  const fillFormLink = screen.getByRole('link', {name: /fill out the form/i})
  expect(fillFormLink).toBeInTheDocument()
  userEvent.click(fillFormLink)

  await waitFor(() => {
    expect(screen.getByRole('heading', {name: /page 1/i})).toBeInTheDocument()
  })

  userEvent.click(screen.getByRole('link', {name: /go home/i}))
  await waitFor(() => {
    expect(
      screen.getByRole('heading', {name: /welcome home/i}),
    ).toBeInTheDocument()
  })

  const fillFormLinkAgain = screen.getByRole('link', {
    name: /fill out the form/i,
  })
  expect(fillFormLinkAgain).toBeInTheDocument()
  userEvent.click(fillFormLinkAgain)

  await waitFor(() => {
    expect(screen.getByRole('heading', {name: /page 1/i})).toBeInTheDocument()
  })
  userEvent.type(screen.getByLabelText(/favorite food/i), 'Les pâtes')
  userEvent.click(screen.getByRole('link', {name: /next/i}))

  await waitFor(() => {
    expect(screen.getByRole('heading', {name: /page 2/i})).toBeInTheDocument()
  })
  userEvent.click(screen.getByRole('link', {name: /go back/i}))

  await waitFor(() => {
    expect(screen.getByRole('heading', {name: /page 1/i})).toBeInTheDocument()
  })

  expect(screen.getByLabelText(/favorite food/i)).toHaveValue('Les pâtes')
})

test('network error handling in UI', async () => {
  const originalFetch = global.fetch
  global.fetch = jest.fn(() => Promise.reject(new Error('Network error')))

  window.history.pushState({}, '', '/')
  render(<App />)

  const fillFormLink = screen.getByRole('link', {name: /fill out the form/i})
  expect(fillFormLink).toBeInTheDocument()
  userEvent.click(fillFormLink)

  await waitFor(() => {
    expect(screen.getByRole('heading', {name: /page 1/i})).toBeInTheDocument()
  })

  userEvent.type(screen.getByLabelText(/favorite food/i), 'Les pâtes')
  userEvent.click(screen.getByRole('link', {name: /next/i}))

  await waitFor(() => {
    expect(screen.getByRole('heading', {name: /page 2/i})).toBeInTheDocument()
  })

  userEvent.type(screen.getByLabelText(/favorite drink/i), 'Bière')
  userEvent.click(screen.getByRole('link', {name: /review/i}))

  await waitFor(() => {
    expect(screen.getByRole('heading', {name: /confirm/i})).toBeInTheDocument()
  })

  userEvent.click(screen.getByRole('button', {name: /confirm/i}))

  await waitFor(() => {
    expect(
      screen.getByText(/oh no\. there was an error\./i),
    ).toBeInTheDocument()
  })

  expect(screen.getByText(/network error/i, {exact: false})).toBeInTheDocument()
  global.fetch = originalFetch
})

test('soumission de formulaire via onSubmit', async () => {
  window.history.pushState({}, '', '/')
  render(<App />)

  const fillFormLink = screen.getByRole('link', {name: /fill out the form/i})
  userEvent.click(fillFormLink)

  await waitFor(() => {
    expect(screen.getByRole('heading', {name: /page 1/i})).toBeInTheDocument()
  })

  const foodInput = screen.getByLabelText(/favorite food/i)
  userEvent.type(foodInput, 'Les pâtes{enter}')

  await waitFor(() => {
    expect(screen.getByRole('heading', {name: /page 2/i})).toBeInTheDocument()
  })

  const drinkInput = screen.getByLabelText(/favorite drink/i)
  userEvent.type(drinkInput, 'Bière{enter}')

  await waitFor(() => {
    expect(screen.getByRole('heading', {name: /confirm/i})).toBeInTheDocument()
  })
})

test('accès direct aux différentes routes', async () => {
  window.history.pushState({}, '', '/error')
  render(<App />)

  expect(screen.getByText(/oh no\. there was an error\./i)).toBeInTheDocument()

  window.history.pushState({}, '', '/success')
  render(<App />)

  expect(screen.getByRole('heading', {name: /congrats/i})).toBeInTheDocument()
})
