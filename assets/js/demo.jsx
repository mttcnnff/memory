import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';

export default function run_demo(root, channel) {
  ReactDOM.render(<MemoryGame channel={channel}/>, root);
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
    this.channel = props.channel;

    this.state = {
      isGameComplete: false,
      lock: false,
      currentMove: null
    };

    this.channel.join()
           .receive("ok", this.gotView.bind(this))
           .receive("error", resp => { console.log("Unable to join", resp) });
  }

  gotView(view) {
    this.setState({
            cards: view.game.cards,
            lock: false
          });
    this.gotScore(view);
  }

  gotScore(view) {
    this.setState({
            score: view.game.score,
          });
  }

  incScore() {
    this.channel.push("inc_score", {})
      .receive("ok", this.gotScore.bind(this));
  }

  checkMove(card1, card2) {
    setTimeout((card1, card2) => {
        this.channel.push("move", { card1: card1, card2: card2})
          .receive("ok", this.gotView.bind(this));
    }, 1000, card1, card2);
  }

  checkGameOver() {
    return this.state.score >= 16 && -1 == _.findIndex(this.state.cards, function(card){ return card.state == "unmatched" });
  }

  handleClick(i) {
    if (this.state.lock != true) {
      this.incScore();
      if (this.state.currentMove != null && this.state.currentMove != i) {
        this.checkMove(this.state.currentMove, i);
        this.setState({
          currentMove: null,
          lock: true,
        });

      } else {
        this.setState({
          currentMove: i,
        });
      }

      let newCards = this.state.cards.slice();
      newCards[i].state = "selected";
      this.setState({
          cards: newCards,
      });
    }
  }

  restart() {
    this.channel.push("restart", {})
      .receive("ok", this.gotView.bind(this));
  }

  render() {
    const buttonMsg = this.state.isGameComplete ? "Nice Job! Try Again?" : "Restart";
    if (this.state.cards) {
      return (
        <div className="game">
          <div className="row">
            <div className="col-sm-6 d-flex justify-content-center">
              <h2>{"Score: " + this.state.score}</h2>
            </div>
            <div className="col-sm-6 d-flex justify-content-center">
              <button className="btn btn-primary  btn-block" onClick={() => this.restart()}>{buttonMsg}</button>
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
    } else {
      return (
        <div className="game">
          <div className="row">
            <div className="col d-flex justify-content-center">
              <h2>Loading...</h2>
            </div>
          </div>
        </div>
        );
    }
    
  }
}

//===============================================
const STATE_COLORS = {
  unmatched: "",
  matched: "bg-success",
  selected: "bg-warning",
};

