import './App.css';
import React from 'react';

class Formulario extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nome: '',
      endereco: '',
      dataNasc: '',
      warningMenosDe18: false,
      dbData: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.atualizarDados = this.atualizarDados.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    const maisDe18 = Formulario.checkAge(this.state.dataNasc)
    this.setState({warningMenosDe18: !maisDe18})
    if(maisDe18) {
      // https://stackoverflow.com/a/39333479
      const fieldsToSend = ['nome', 'endereco', 'dataNasc'];
      const objectToSend = {};
      for(let field of fieldsToSend) {
        objectToSend[field] = this.state[field]
      }

      const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(objectToSend)
      };

      fetch('/api/formdata', requestOptions);
    }
    event.preventDefault();
  }

  static checkAge(dateStr) {
    //got from https://stackoverflow.com/a/7091639
    var today = new Date();
    var birthDate = new Date(dateStr);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age >= 18;
  }

  async atualizarDados(event) {
    let response = await fetch('/api/formdata');
    let dbData = await response.json();
    this.setState({"dbData": dbData})
  }

  render() {
    const tableItems = []
    for(let entry of this.state.dbData) {
      tableItems.push((
        <tr
          ><td>{entry.nome}</td
          ><td>{entry.endereco}</td
          ><td>{entry.dataNasc}</td
        ></tr>
      ))
    }

    return (
      <div className="formulario">
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="fnome">Nome:</label><br/>
          <input type="text" id="fnome" name="nome" value={this.state.nome} 
          onChange={this.handleChange} /><br/>
          
          <label htmlFor="fendereco">Endereço:</label><br/>
          <input type="text" id="fendereco" name="endereco"
          value={this.state.endereco} onChange={this.handleChange} /><br/>
          
          <label htmlFor="fdataNasc">Data de Nascimento:</label><br/>
          <input type="date" id="fdataNasc" name="dataNasc"
          value={this.state.dataNasc} onChange={this.handleChange} /><br/>
          
          { this.state.warningMenosDe18 &&
            <div style={{color:"red"}}>Você precisa ter mais de 18 anos.</div>
          }

          <input type="submit" value="Submeter" />
        </form>
        <button onClick={this.atualizarDados}>Mostrar Dados Coletados</button>
        {this.state.dbData.length > 0 &&
          <table>
            <tr><th>Nome</th><th>Endereço</th><th>Idade</th></tr>
            {tableItems}
          </table>
        }
      </div>
    );
  }
}

function App() {
  return (
    <Formulario/>
  );
}

export default App;
