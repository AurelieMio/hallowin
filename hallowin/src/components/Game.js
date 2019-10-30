import React from "react";
import axios from "axios";
import AfficherDeck from "./AfficherDeck";
import AfficherDeckAdversaire from "./AfficherDeckAdversaire";
import Lose from "./Lose";
import Win from "./Win";
import '../App.css'
import HealthPoints from './HealthPoints'

class Game extends React.Component {
	constructor() {
		super();
		this.state = {
			playerStack: [],
			computerStack: [],
			playerCurrentCard: null,
			computerCurrentCard: null,
			playerLifePoints: 15,
			computerLifePoints: 15,
			win: false,
			lose: true
		};
		this.getMonster = this.getMonster.bind(this);
        this.battle = this.battle.bind(this);
        this.selectCard = this.selectCard.bind(this);
	}

	getMonster() {
		axios.get("https://hackathon-wild-hackoween.herokuapp.com/monsters").then(({ data }) => {
			//console.log(data);
			this.setState({
				playerStack: data.monsters,
				computerStack: data.monsters
			});
		});
    }
    
    selectCard(id) {
        this.setState({ playerCurrentCard: id })
    }

	componentDidMount() {
		this.getMonster();
	}

	battle() {
		const { playerCurrentCard } = this.state.playerCurrentCard;
		const { computerCurrentCard } = this.state.computerCurrentCard;
		if (playerCurrentCard.attack > computerCurrentCard.defense) {
			this.setState({
				computerLifePoints:
					this.state.computerLifePoints - (playerCurrentCard.attack - computerCurrentCard.defense)
			});
			if (this.state.computerLifePoints <= 0) {
				this.setState({ win: true });
			}
		}
		if (computerCurrentCard.attack > playerCurrentCard.defense) {
			this.setState({
				playerLifePoints:
					this.state.playerLifePoints - (computerCurrentCard.attack - playerCurrentCard.defense)
			});
			if (this.state.playerLifePoints <= 0) {
				this.setState({ lose: true });
			}
		}
	}
	componentDidMount() {
		this.getMonster();
	}

	render() {
		const containerStyle = {
			height: "100vh",
			width: "100vw",
			backgroundColor: "red",
			display: "flex",
			flexDirection: "column",
			flexWrap: "nowrap",
			justifyContent: "space-between",
			alignItems: "center",
			alignContent: "stretch"
		};
		return (
			<div style={containerStyle}>
				<AfficherDeckAdversaire computerStack={this.state.computerStack} />
                <HealthPoints playerLifePoints={this.state.playerLifePoints} computerLifePoints={this.state.computerLifePoints} />
				<AfficherDeck playerStack={this.state.playerStack} selectCard={this.selectCard} />
				{this.state.lose && <Lose />}
				{this.state.win && <Win />}
			</div>
		);
	}
}

export default Game;
