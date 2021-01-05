import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import PizZip from "pizzip";
import React, {
  FC,
  FormEvent,
  SyntheticEvent,
  useCallback,
  useState,
} from "react";
import ReactHotkeys from "react-hot-keys";
import {
  Button,
  Container,
  DropdownProps,
  Form,
  Grid,
  Header,
  Input,
  Select,
  Table,
} from "semantic-ui-react";
import pasteParsers from "../../resources/templates/pasteParsers";
import templateModels, {
  ModelTemplateConfig,
} from "../../resources/templates/templateModels";

const DocTemplater: FC = () => {
  const [modelFileSet, setModelFileSet] = useState<FileList | null>(null);
  const [itemsData, setItemsData] = useState<any[]>([]);
  const [
    modelTemplate,
    setModelTemplate,
  ] = useState<ModelTemplateConfig | null>(null);
  const [modelTemplateName, setModelTemplateName] = useState<string | null>(
    null
  );

  const loadFileAsBuffer = async (file: File) => {
    return await new Promise<ArrayBuffer>((resolve) => {
      const reader = new FileReader();
      reader.addEventListener("load", (e) => {
        resolve(e.target?.result as ArrayBuffer);
      });
      reader.readAsArrayBuffer(file);
    });
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!modelFileSet) return;

    const modelFileData = await loadFileAsBuffer(modelFileSet[0]);
    const zip = new PizZip(modelFileData);
    const doc = new Docxtemplater(zip);

    // const csvDataFileContent = await loadFileAsText(dataFileSet[0]);
    // const csvData = await neatCsv(String(csvDataFileContent));

    for (const [index, row] of Array.from(itemsData.entries())) {
      doc.setData({
        ...row,
      });

      doc.render();

      const out = doc.getZip().generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      }); //Output the document using Data-URI

      const outFile = new File(
        [out],
        (modelTemplate?.outputFileNaming(row) || `doc_${index}`) + ".docx"
      );
      saveAs(outFile);
    }
  }

  const handleTemplateChange = (
    _e: SyntheticEvent<HTMLElement, Event>,
    data: DropdownProps
  ) => {
    if (!data) return;
    setModelTemplate(templateModels[String(data.value)]);
    setModelTemplateName(String(data.value));
  };

  const handlePaste = useCallback(() => {
    navigator.clipboard.readText().then((text) => {
      console.log(text);
      const data = pasteParsers.FFParser(text);
      setItemsData([...itemsData, data]);
      console.log(itemsData);
    });
  }, [itemsData]);

  const handleDeleteItem = (index: number) => {
    const a = [...itemsData];
    a.splice(index, 1);
    setItemsData(a);
  };

  return (
    <ReactHotkeys keyName="ctrl+v" onKeyDown={handlePaste}>
      <Header as="h1">Gerador de documentos</Header>
      <Grid textAlign="center" style={{ height: "100vh" }}>
        <Grid.Column>
          <Grid.Row as={Grid} columns={2}>
            <Grid.Column as={Form} onSubmit={handleSubmit}>
              <Input
                onChange={(e) =>
                  e.currentTarget.files &&
                  setModelFileSet(e.currentTarget.files)
                }
                placeholder="Escolha o documento modelo"
                type="file"
                accept=".doc, .docx"
                multiple={false}
              />
              <Button disabled={!modelFileSet} type="submit">
                Gerar Documentos
              </Button>
            </Grid.Column>
            <Grid.Column>
              <Select
                onChange={handleTemplateChange}
                value={modelTemplateName || "Selecione um modelo"}
                placeholder="Selecione um modelo"
                options={Object.keys(templateModels).map((e) => ({
                  text: e,
                  value: e,
                }))}
              />
              <Button onClick={() => handlePaste()}>Colar FF (CTRL + V)</Button>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row style={{ overflowX: "scroll", padding: "0 1em" }}>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Ação</Table.HeaderCell>
                  {modelTemplate?.keys.map((header) => (
                    <Table.HeaderCell key={header}>{header}</Table.HeaderCell>
                  ))}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {itemsData.map((data, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>
                      <Button onClick={() => handleDeleteItem(index)}>
                        Deletar
                      </Button>
                    </Table.Cell>

                    {modelTemplate?.keys.map((header) => (
                      <Table.Cell key={header}>{data[header]}</Table.Cell>
                    ))}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Grid.Row>
        </Grid.Column>
      </Grid>
    </ReactHotkeys>
  );
};

export default DocTemplater;
