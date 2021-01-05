const pasteParsers = {
  FFParser: function (text: string) {
    const splitted = text
      .replace("\\r", "")
      .trim()
      .split("\n")
      .map((str) => str.trim());
    const getValue = (key: string) => {
      return splitted.indexOf(key) === -1
        ? ""
        : splitted[splitted.indexOf(key) + 1];
    };

    return {
      BAIRRO: getValue("BAIRRO"),
      NOME: getValue("NOME"),
      NACIONALIDADE: getValue("NACIONALIDADE"),
      CIDADE: getValue("CIDADE"),
      CEP: getValue("CEP"),
      ESTADO: getValue("UF"),
      RG_NUMERO: getValue("IDENTIDADE"),
      RG_TIPO: getValue("RG_TIPO"),
      RG_EMISSOR: getValue("ÓRGÃO EMISSOR"),
      CPF: getValue("CPF"),
      LOGRADOURO: getValue("ENDEREÇO"),
      END_NUMERO: getValue("NÚMERO"),
      PROFISSAO: getValue("PROFISSAO"),
      // LOCAL: getValue("LOCAL"),
      // DATA: getValue("DATA"),
    };
  },
};

export default pasteParsers;
