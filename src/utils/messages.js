// @flow
const messages = {
  PENDING: {
    es: "Procesando",
    default: "Procesando",
  },
  PROCESSING: {
    es: "Procesando",
    default: "Procesando",
  },
  RUNTIME_ERROR: {
    es: "Error de ejecución",
    default: "Error de ejecución",
  },
  BUILD_ERROR: {
    es: "Error de compilación",
    default: "Error de compilación",
  },
  SUCCESS: {
    es: "Éxito",
    default: "Éxito",
  },
  FAILURE: {
    es: "Falló",
    default: "Falló",
  },
};

function getText(key: string, lang: ?string): string {
  if (key === "" || key === undefined || key === null || !Object.keys(messages).includes(key)) {
    return key;
  }
  const l = lang === undefined || lang === null ? "default" : lang;
  return messages[key][l];
}

export default getText;
