import React from 'react'
import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app.jsx'

test('cas passant', async () => {
  render(<App />)

  // 1 - L'utilisateur est sur la page d'accueil
  // 2 - Un titre "Welcome home" est dans le document
  expect(
    screen.getByRole('heading', {name: /welcome home/i}),
  ).toBeInTheDocument()

  // 3 - Un lien "Fill out the form" est dans le document
  const fillFormLink = screen.getByRole('link', {name: /fill out the form/i})
  expect(fillFormLink).toBeInTheDocument()
  userEvent.click(fillFormLink)

  // 5 - L'utilisateur est redirigé sur la page 1
  // 6 - Un titre "Page 1" est dans le document
  await waitFor(() => {
    expect(screen.getByRole('heading', {name: /page 1/i})).toBeInTheDocument()
  })

  // 7 - Un lien "Go home" est dans le document
  expect(screen.getByRole('link', {name: /go home/i})).toBeInTheDocument()

  // 8 - Un champ avec le label "Favorite food" est dans le document
  const foodInput = screen.getByLabelText(/favorite food/i)
  expect(foodInput).toBeInTheDocument()
  userEvent.type(foodInput, 'Les pâtes')

  // 10 - Un lien "Next" est dans le document
  const nextLink = screen.getByRole('link', {name: /next/i})
  expect(nextLink).toBeInTheDocument()
  userEvent.click(nextLink)

  // 12 - L'utilisateur est redirigé sur la page 2
  // 13 - Un titre "Page 2" est dans le document
  await waitFor(() => {
    expect(screen.getByRole('heading', {name: /page 2/i})).toBeInTheDocument()
  })

  // 14 - Un lien "Go back" est dans le document
  expect(screen.getByRole('link', {name: /go back/i})).toBeInTheDocument()

  // 15 - Un champ avec le label "Favorite drink" est dans le document
  const drinkInput = screen.getByLabelText(/favorite drink/i)
  expect(drinkInput).toBeInTheDocument()
  userEvent.type(drinkInput, 'Bière')

  // 17 - Un lien "Review" est dans le document
  const reviewLink = screen.getByRole('link', {name: /review/i})
  expect(reviewLink).toBeInTheDocument()
  userEvent.click(reviewLink)

  // 19 - L'utilisateur est redirigé sur la page de confirmation
  // 20 - Un titre "Confirm" est dans le document
  await waitFor(() => {
    expect(screen.getByRole('heading', {name: /confirm/i})).toBeInTheDocument()
  })

  // 21 - Un texte "Please confirm your choices" est dans le document
  expect(screen.getByText(/please confirm your choices/i)).toBeInTheDocument()

  // 22 - Un texte label "favorite food" a pour contenu "Les pâtes"
  // 23 - Un texte label "favorite drink" a pour contenu "Bière"
  expect(screen.getByLabelText(/favorite food/i)).toHaveTextContent('Les pâtes')
  expect(screen.getByLabelText(/favorite drink/i)).toHaveTextContent('Bière')

  // 24 - Un lien "Go back" est dans le document
  // 25 - Un bouton "Confirm" est dans le document
  expect(screen.getByRole('link', {name: /go back/i})).toBeInTheDocument()
  const confirmButton = screen.getByRole('button', {name: /confirm/i})
  expect(confirmButton).toBeInTheDocument()

  // 26 - L'utilisateur clique sur le bouton "Confirm"
  userEvent.click(confirmButton)

  // 27 - L'utilisateur est redirigé sur la page de Félicitation
  // 28 - Un titre "Congrats. You did it." est dans le document
  await waitFor(() => {
    expect(
      screen.getByRole('heading', {name: /congrats\. you did it\./i}),
    ).toBeInTheDocument()
  })

  // 29 - Un lien "Go home" est dans le document
  const goHomeLink = screen.getByRole('link', {name: /go home/i})
  expect(goHomeLink).toBeInTheDocument()
  userEvent.click(goHomeLink)

  // 31 - L'utilisateur est redirigé sur la home
  // 32 - Un titre "Welcome home" est dans le document
  await waitFor(() => {
    expect(
      screen.getByRole('heading', {name: /welcome home/i}),
    ).toBeInTheDocument()
  })
})

test('cas non passant', async () => {
  render(<App />)

  // 1 - L'utilisateur est sur la page d'accueil
  // 2 - Un titre "Welcome home" est dans le document
  userEvent.click(screen.getByRole('link', {name: /fill out the form/i}))

  // 5 - L'utilisateur est redirigé sur la page 1
  // 6 - Un titre "Page 1" est dans le document
  await waitFor(() => {
    expect(screen.getByRole('heading', {name: /page 1/i})).toBeInTheDocument()
  })

  // 9 - L'utilisateur laisse le champ "Favorite food" vide
  userEvent.click(screen.getByRole('link', {name: /next/i}))

  // 12 - L'utilisateur est redirigé sur la page 2
  // 13 - Un titre "Page 2" est dans le document
  await waitFor(() => {
    expect(screen.getByRole('heading', {name: /page 2/i})).toBeInTheDocument()
  })

  // 15 - Un champ avec le label "Favorite drink" est dans le document
  // 16 - L'utilisateur remplit le champ "Favorite drink" avec "Bière"
  userEvent.type(screen.getByLabelText(/favorite drink/i), 'Bière')
  userEvent.click(screen.getByRole('link', {name: /review/i}))

  // 19 - L'utilisateur est redirigé sur la page de confirmation
  // 20 - Un titre "Confirm" est dans le document
  await waitFor(() => {
    expect(screen.getByRole('heading', {name: /confirm/i})).toBeInTheDocument()
  })

  // 22 - Un texte label "favorite food" a pour contenu ""
  // 23 - Un texte label "favorite drink" a pour contenu "Bière"
  expect(screen.getByLabelText(/favorite food/i)).toHaveTextContent('')
  expect(screen.getByLabelText(/favorite drink/i)).toHaveTextContent('Bière')

  // 25 - Un bouton "Confirm" est dans le document
  userEvent.click(screen.getByRole('button', {name: /confirm/i}))

  // 27 - L'utilisateur est redirigé sur la page d'erreur
  // 28 - Un texte "Oh no. There was an error." est dans le document
  await waitFor(() => {
    expect(
      screen.getByText(/oh no\. there was an error\./i),
    ).toBeInTheDocument()
  })
  expect(
    screen.getByText(/les champs food et drink sont obligatoires/i),
  ).toBeInTheDocument()

  // 30 - Un lien "Go home" est dans le document
  // 31 - Un lien "Try again" est dans le document
  expect(screen.getByRole('link', {name: /go home/i})).toBeInTheDocument()
  expect(screen.getByRole('link', {name: /try again/i})).toBeInTheDocument()

  // 32 - L'utilisateur clique sur le lien "Try again"
  userEvent.click(screen.getByRole('link', {name: /try again/i}))

  // 34 - L'utilisateur est redirigé sur la page 1
  // 34 - Un titre "Page 1" est dans le document
  await waitFor(() => {
    expect(screen.getByRole('heading', {name: /page 1/i})).toBeInTheDocument()
  })
})
