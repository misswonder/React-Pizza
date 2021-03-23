import React, { Component, Fragment } from "react";
import Header from "./components/Header";
import PizzaForm from "./components/PizzaForm";
import PizzaList from "./containers/PizzaList";
class App extends Component {
  state = {
    pizzas: [],
    pizza: {
      id: null,
      topping: "",
      size: null,
      vegetarian: null,
    },
  };

  componentDidMount = async () => {
    const res = await fetch("http://localhost:3000/pizzas");
    const pizzas = await res.json();
    this.setState({ pizzas });
  };


  selectPizza = (pizza) =>
    this.setState({
      pizza,
    });

  updatePizza = (e) => {
    if (e.target.name === "Vegetarian") {
      let newVal = true;
      if (e.target.value === "false") {
        newVal = false;
      }
      this.setState({
        pizza: {
          ...this.state.pizza,
          vegetarian: newVal,
        },
      });
    } else {
      this.setState({
        pizza: {
          ...this.state.pizza,
          [e.target.name.toLowerCase()]: e.target.value,
        },
      });
    }
  };
  handleSubmit = (e) => {
    let newPizza = {
      topping: this.state.pizza.topping,
      size: this.state.pizza.size,
      vegetarian: this.state.pizza.vegetarian,
    };
    if (this.state.pizza.id) {
      this.patchPizza(newPizza);
    } else {
      this.postPizza(newPizza);
    }
    this.setState({
      pizza: {
        id: null,
        topping: "",
        size: null,
        vegetarian: null,
      },
    });
  };
  patchPizza = (newPizza) => {
    let reqObj = {
      headers: { "Content-Type": "application/json" },
      method: "PATCH",
      body: JSON.stringify(newPizza),
    };
    fetch("http://localhost:3000/pizzas/" + this.state.pizza.id, reqObj)
      .then((res) => res.json())
      .then((pizza) => {
        const index = this.state.pizzas.findIndex(
          (existingPizza) => existingPizza.id === pizza.id
        );

        if (index === -1) {
          return;
        }

        const pizzas = [...this.state.pizzas];
        pizzas[index] = pizza;
        this.setState({ pizzas });
      });
  };
  postPizza = (newPizza) => {
    let reqObj = {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(newPizza),
    };
    fetch("http://localhost:3000/pizzas/", reqObj)
      .then((res) => res.json())
      .then((pizza) => {
        this.setState({
          pizzas: [...this.state.pizzas, pizza],
        });
      });
  };

  render() {
    return (
      <Fragment>
        <Header />
        <PizzaForm
          handleSubmit={this.handleSubmit}
          updatePizza={this.updatePizza}
          pizza={this.state.pizza}
          subForm={this.subForm}
        />
        <PizzaList pizzas={this.state.pizzas} selectPizza={this.selectPizza} />
      </Fragment>
    );
  }
}

export default App;
