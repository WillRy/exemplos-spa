function getFormError(e) {
  const erros = {}

  let response = e.response
  if (response && response.status === 422 && response.data.errors) {
    const json = response.data
    if (json && json.errors) {
      for (const campo in json.errors) {
        if (json.errors[campo].length > 0) {
          erros[campo] = json.errors[campo][0]
        }
      }
    } else {
      if (json.message) {
        erros.generico = json.message
      }
    }
  }

  return erros
}

export { getFormError }
