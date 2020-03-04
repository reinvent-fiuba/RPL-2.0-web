// @flow
const messages = {
  PENDING: {
    es: "En proceso",
    default: "En proceso",
  },
  PROCESSING: {
    es: "En proceso",
    default: "En proceso",
  },
  RUNTIME_ERROR: {
    es: "Falló la corrida",
    default: "Falló la corrida",
  },
  BUILD_ERROR: {
    es: "Error de build",
    default: "Error de build",
  },
  SUCCESS: {
    es: "Pasó",
    default: "Pasó",
  },
  FAILURE: {
    es: "Fallaron las pruebas",
    default: "Fallaron las pruebas",
  },
};

function getText(key: string, lang: ?string): string {
  if (key === "" || key === undefined || key === null || !(key in Object.keys(messages))) {
    return key;
  }
  const l = lang === undefined || lang === null ? "default" : lang;
  return messages[key][l];
}

export default getText;
