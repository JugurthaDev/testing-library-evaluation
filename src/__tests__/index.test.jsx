import {submitForm, savePost, loadGreeting, reportError} from '../api/index'

// Mocker fetch pour les tests d'API
beforeEach(() => {
  // Sauvegarder la fonction fetch originale si elle existe
  if (global.fetch) {
    global.originalFetch = global.fetch
  }
})

afterEach(() => {
  // Restaurer la fonction fetch originale si elle existait
  if (global.originalFetch) {
    global.fetch = global.originalFetch
    delete global.originalFetch
  } else {
    delete global.fetch
  }
})

test('submitForm envoie les données correctement', async () => {
  // Simuler une réponse réussie
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({success: true}),
    }),
  )

  const formData = {food: 'Les pâtes', drink: 'Bière'}
  const result = await submitForm(formData)

  // Vérifier que fetch a été appelé avec les bons paramètres
  expect(global.fetch).toHaveBeenCalledWith('/form', {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Vérifier le résultat de l'appel API
  expect(result).toEqual({success: true})
})

test('submitForm gère les erreurs de validation', async () => {
  // Simuler une réponse d'erreur de validation
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: false,
      status: 400,
      json: () =>
        Promise.resolve({
          message: 'les champs food et drink sont obligatoires',
        }),
    }),
  )

  const formData = {food: '', drink: 'Bière'}

  // Utiliser expect.assertions pour s'assurer qu'une assertion est exécutée
  expect.assertions(1)

  // Attendre l'erreur et vérifier son message
  await expect(submitForm(formData)).rejects.toEqual({
    message: 'les champs food et drink sont obligatoires',
  })
})

test('submitForm gère les erreurs de réseau', async () => {
  // Simuler une erreur réseau
  global.fetch = jest.fn(() => Promise.reject(new Error('Network error')))

  const formData = {food: 'Les pâtes', drink: 'Bière'}

  // Utiliser expect.assertions pour s'assurer qu'une assertion est exécutée
  expect.assertions(1)

  // Attendre l'erreur et vérifier son message
  await expect(submitForm(formData)).rejects.toEqual(new Error('Network error'))
})

test('submitForm gère les erreurs de serveur', async () => {
  // Simuler une erreur serveur sans message
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: false,
      status: 500,
      json: () => Promise.resolve({}),
    }),
  )

  const formData = {food: 'Les pâtes', drink: 'Bière'}

  // Utiliser expect.assertions pour s'assurer qu'une assertion est exécutée
  expect.assertions(1)

  // Attendre que la promesse soit rejetée avec n'importe quelle erreur
  await expect(submitForm(formData)).rejects.toBeDefined()
})

// Tests supplémentaires pour les autres fonctions d'API

test('savePost envoie les données correctement', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({data: {title: 'Mon titre', content: 'Mon contenu'}}),
    }),
  )

  const postData = {id: '123', title: 'Mon titre', content: 'Mon contenu'}
  const result = await savePost(postData)

  expect(global.fetch).toHaveBeenCalledWith('/post/123', {
    method: 'POST',
    body: JSON.stringify(postData),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  expect(result).toEqual({data: {title: 'Mon titre', content: 'Mon contenu'}})
})

test('loadGreeting envoie les données correctement', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({data: {greeting: 'Hello World'}}),
    }),
  )

  const result = await loadGreeting('World')

  expect(global.fetch).toHaveBeenCalledWith('/greeting', {
    method: 'POST',
    body: JSON.stringify({subject: 'World'}),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  expect(result).toEqual({data: {greeting: 'Hello World'}})
})

test('reportError envoie les données correctement', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({success: true}),
    }),
  )

  const errorData = {message: 'Une erreur est survenue'}
  const result = await reportError(errorData)

  expect(global.fetch).toHaveBeenCalledWith('/error', {
    method: 'POST',
    body: JSON.stringify(errorData),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  expect(result).toEqual({success: true})
})
