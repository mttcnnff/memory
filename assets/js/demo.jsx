import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';

export default function run_demo(root) {
  ReactDOM.render(<MemoryGame />, root);
}

function MemoryCard(props) {
  return (
    <div className="cardContainer">
      <div className={"card " + STATE_COLORS[props.state]} onClick={props.onClick}>
        <h1 className={props.state == "unmatched" ? "hidden" : ""}>{props.letter}</h1>
      </div>
    </div>
  );
}

class MemoryBoard extends React.Component {
  renderCard(i) {
    return (
      <MemoryCard
        letter={this.props.cards[i].letter}
        state={this.props.cards[i].state}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div className="container">
      <div className="row">
        <div className="col-sm">
          {this.renderCard(0)}
        </div>
        <div className="col-sm">
          {this.renderCard(1)}
        </div>
        <div className="col-sm">
          {this.renderCard(2)}
        </div>
        <div className="col-sm">
          {this.renderCard(3)}
        </div>
      </div>
      <div className="row">
        <div className="col-sm">
          {this.renderCard(4)}
        </div>
        <div className="col-sm">
          {this.renderCard(5)}
        </div>
        <div className="col-sm">
          {this.renderCard(6)}
        </div>
        <div className="col-sm">
          {this.renderCard(7)}
        </div>
      </div>
      <div className="row">
        <div className="col-sm">
          {this.renderCard(8)}
        </div>
        <div className="col-sm">
          {this.renderCard(9)}
        </div>
        <div className="col-sm">
          {this.renderCard(10)}
        </div>
        <div className="col-sm">
          {this.renderCard(11)}
        </div>
      </div>
      <div className="row">
        <div className="col-sm">
          {this.renderCard(12)}
        </div>
        <div className="col-sm">
          {this.renderCard(13)}
        </div>
        <div className="col-sm">
          {this.renderCard(14)}
        </div>
        <div className="col-sm">
          {this.renderCard(15)}
        </div>
      </div>
    </div>
      );
  }
}

class MemoryGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: getRandomCards(),
      currentMove: [],
      score: 0,
      isGameComplete: false,
    };
  }

  checkMatch(i,j) {
    return this.state.cards[i].letter == this.state.cards[j].letter;
  }

  checkGameOver() {
    return this.state.score >= 16 && -1 == _.findIndex(this.state.cards, function(card){ return card.state == "unmatched" });
  }

  handleClick(i) {
    if (this.state.currentMove.length < 2) {

      let newCards = this.state.cards.slice();
      newCards[i].state = "selected";
      let newMove = this.state.currentMove.slice().concat(i);
      this.setState((prevState, props) => ({
        score: prevState.score + 1,
        cards: newCards,
        currentMove: newMove,
      }));
      this.render();

      if (newMove.length == 2) {
        setTimeout(() => {
          if (this.checkMatch(newMove[0], newMove[1])) {
            newCards[newMove[0]].state = "matched";
            newCards[newMove[1]].state = "matched";
          } else {
            newCards[newMove[0]].state = "unmatched";
            newCards[newMove[1]].state = "unmatched";
          }
          this.setState({
            currentMove: [],
            cards: newCards,
            isGameComplete: this.checkGameOver(),
          });
        }, 1000);
      }
    }
  }

  restart() {
    this.setState({
      cards: getRandomCards(),
      currentMove: [],
      score: 0,
      isGameComplete: false,
    });
  }

  render() {
    const buttonMsg = this.state.isGameComplete ? "Nice Job! Try Again?" : "Restart";
    return (
      <div className="game">
        <div className="row">
          <div className="col-sm-6 d-flex justify-content-center">
            <h2>{"Score: " + this.state.score}</h2>
          </div>
          <div className="col-sm-6 d-flex justify-content-center">
            <button className="btn btn-primary btn-block" onClick={() => this.restart()}>{buttonMsg}</button>
          </div>
        </div>
        <div className="game-board">
          <MemoryBoard 
            cards={this.state.cards}
            onClick={i => this.handleClick(i)}
            />
        </div>
      </div>
    );
  }
}

//===============================================
const ALPHABET = 'ABCDEFGH';

const STATE_COLORS = {
  unmatched: "",
  matched: "bg-success",
  selected: "bg-warning",
};

function getRandomCards() {
  let letters = _.shuffle(ALPHABET).slice(0,8);
  letters = _.shuffle(letters.concat(letters));
  let cards = _.map(letters.slice(), function (letter) {
   return {letter: letter, state: "unmatched"}; 
  });
  return cards;
}

