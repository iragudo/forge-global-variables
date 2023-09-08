import ForgeUI, { render, Fragment, Text, GlobalSettings, Table, Head, 
  Cell, Row, Button, useState, ModalDialog, Form, TextField,
  useConfig, Macro, MacroConfig } from '@forge/ui';
import { startsWith, storage } from '@forge/api';

const App = () => {

  // States if the add or edit modals is open
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isAddVariableModalOpen, setAddVariableModalOpen] = useState(false);

  // will be used to identify which specific row the Edit button was pressed
  const [rowKey, setRowKey] = useState("");

  // We are setting the default value to the data from storage
  // "globalVariableName-" is the identifier used to differentiate the key
  const [variables, setVariables] = useState(
    async () => await storage.query()
      .where('key', startsWith('globalVariableName-'))
      .getMany()
  );

  // Sync the local variable states with the stored values
  const updateVariableLocalState = async () => {
    const currentStore = await storage.query()
            .where('key', startsWith('globalVariableName-'))
            .getMany();

    setVariables(currentStore);
  }

  // Save the values in the store 
  const storeGlobalVariables = async (formData) => {
    // "globalVariableName-" is the identifier used to differentiate the key
    await storage.set(`globalVariableName-${formData.variableName}`, 
      {
        name: formData.variableName,
        value: formData.variableValue,
        description: formData.variableDescription        
      }
    );

    await updateVariableLocalState();
  }

  const onAddSubmit = async (formData) => {
    await storeGlobalVariables(formData);
    setAddVariableModalOpen(false);
  };

  const onEditSubmit = async (formData) => {
    await storeGlobalVariables(formData);
    setEditModalOpen(false);
  };

  const deleteRow = async (variableName) => {
    await storage.delete(`globalVariableName-${variableName}`);
    await updateVariableLocalState();
  };    

  return (
    <Fragment>
      <Table>
        <Head>
          <Cell>
            <Text>Variable Name</Text>
          </Cell>
          <Cell>
            <Text>Value</Text>
          </Cell>
          <Cell>
            <Text>Description</Text>
          </Cell>
          <Cell>
            <Text></Text>
          </Cell>
        </Head>
        {/* Make the table rows dynamic depending on the variables we got */}
        {/* Go through the stored variables one by one and add a row */}
        {/* If the are no variables stored, no rows will be displayed */}
        { 
          (variables.results) ?
          variables.results.map(variable => 
            <Row>
              {/* Retrieve the values from the variables */}
              <Cell>
                <Text>{variable.value.name}</Text>
              </Cell>
              <Cell>
                <Text>{variable.value.value}</Text>
              </Cell>
              <Cell>
                <Text>{variable.value.description}</Text>
              </Cell>
              <Cell>
                <Button text="Edit" appearance="link" onClick={async () => {
                  setEditModalOpen(true);
                  // The identifier used to know which row the Edit button was clicked in
                  setRowKey(variable.value.name);
                }}>
                </Button>
                {/* Only open the edit modal for the selected row */}
                {isEditModalOpen && rowKey == variable.value.name && 
                (
                  // Contains a form with textfields that allows us to edit the variable details
                  <ModalDialog header={"Edit " + variable.value.name} onClose={() => setEditModalOpen(false)}>
                    <Form onSubmit={onEditSubmit}>
                      <TextField name="variableName" label="Name" type="string" defaultValue={variable.value.name} autoComplete="off"/>
                      <TextField name="variableValue" label="Value" type="string" defaultValue={variable.value.value} autoComplete="off" />
                      <TextField name="variableDescription" label="Description" type="string" defaultValue={variable.value.description} autoComplete="off" />
                    </Form>
                  </ModalDialog>
                )}
                <Button text="Delete" appearance="danger" onClick={async() => {
                  await deleteRow(variable.value.name);
                }}>
                </Button>
              </Cell>
            </Row>
              
          )
          :
          ""
        }
      </Table>
      {/* Add space between the table and the add button */}
      <Text/>
      <Button text="Add Variables" appearance='warning' onClick={async () => {
        setAddVariableModalOpen(true);
      }}>
      </Button>
      {/* Check if the add button is clicked before opening the modal */}
      {isAddVariableModalOpen && (
        <ModalDialog header="Add variable" onClose={() => setAddVariableModalOpen(false)}>
          <Form onSubmit={onAddSubmit}>
            <TextField name="variableName" label="Name" type="string" autoComplete="off" />
            <TextField name="variableValue" label="Value" type="string" autoComplete="off" />
            <TextField name="variableDescription" label="Description" type="string" autoComplete="off" />
          </Form>
        </ModalDialog>
      )}

    </Fragment>
  );
};

const ConfigMacro = () => {
  return (
    <MacroConfig>
      <TextField name="globalVarName" label="Global variable name" />
    </MacroConfig>
  );
};

const AppMacro = () => {
  // Hook that retrieves the macro configuration
  const config = useConfig();

  // Retrieve the variable value from storage
  const [globalVariable] = useState(async () => (config) ? 
    await storage.get(`globalVariableName-${config.globalVarName}`) : 
    undefined);

  return (
    <Fragment>
      <Text>
        { 
          (globalVariable) ? 
          globalVariable.value :
          "[This global variable does not exist.]"
        }         
      </Text>
    </Fragment>
  );
};

export const run = render(
  <GlobalSettings>
    <App />
  </GlobalSettings>
);

export const runMacro = render(
  <Macro
    app={<AppMacro />}
  />
);

export const configMacro = render(
  <ConfigMacro />
);
