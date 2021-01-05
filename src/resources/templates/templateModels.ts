export type ModelTemplateConfig = {
  keys: string[];
  outputFileNaming: (data: any) => string;
};
const modelsConfig: { [key: string]: ModelTemplateConfig } = {
  DECLARACAO_BRADESCO: {
    outputFileNaming: (data) => `doc_${data["NOME"]}`,
    keys: [
      "NOME",
      "NACIONALIDADE",
      "PROFISSAO",
      "RG_TIPO",
      "RG_NUMERO",
      "RG_EMISSOR",
      "CPF",
      "LOGRADOURO",
      "END_NUMERO",
      "BAIRRO",
      "CEP",
      "CIDADE",
      "ESTADO",
      "LOCAL",
      "DATA",
    ],
  },
};

export default modelsConfig;
