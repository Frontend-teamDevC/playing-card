

export default abstract class Table {
    gameType:string;
    betDenominations:number[];
    turnCounter:number = 0;
    gamePhase:string = 'betting';
    resultsLog:string[] = [];
    deck:Deck;
    players:Player[];
    dealer:Player;

    constructor(gameType:string, betDenominations:number[]=[5, 20, 50, 100]) {
      this.gameType = gameType;
      this.betDenominations = betDenominations;

      this.deck = new Deck(this.gameType);
      this.deck.shuffle();
    }

    blackjackAssignPlayerHands():void {
        for(let player of this.players){
            player.hand.push(this.deck.drawCard());
            // ディーラーの場合は1枚だけ公開（２枚目はすぐに公開しない）
            if(player.type !== 'dealer') {
                player.hand.push(this.deck.drawCard());
            }
        }
    }

    blackjackClearPlayerHandsAndBets():void {
        for(let player of this.players){
            player.hand = [];
            player.bet = player.type === 'dealer' ? -1 : 0;
        }
    }

    evaluateMove(player:Player):void {
        let decision:GameDecision = player.promptPlayer(null);
        switch(decision.action) {
            case 'bet':
                player.bet += decision.amount;
                player.chips -= decision.amount;
                break;
            case 'hit':
                player.hand.push(this.deck.drawCard());
                break;
            case 'stand':
                player.gameStatus = 'stand';
                break;
            case 'double':
                player.bet += decision.amount;
                player.chips -= decision.amount;
                player.hand.push(this.deck.drawCard());
            case 'surrender':
                player.gameStatus = 'surrender';
                break;
        }
    }

    getTurnPlayer():Player {
        return this.players[this.turnCounter % this.players.length];
    }

    haveTurn(userData:number):void {
        let player:Player = this.getTurnPlayer();
        let decision = player.promptPlayer(userData);
        this.evaluateMove(player);
        this.turnCounter++;

        if(this.gamePhase !== 'betting'){
            this.gamePhase = this.checkGamePhase();
        }

        if(this.gamePhase === 'roundOver'){
            console.log(this.blackjackEvaluateAndGetRoundResult());
            this.blackjackClearPlayerHandsAndBets();
        }
    }

    checkGamePhase():string {
        let allPlayersStand:boolean = true;
        for(let player of this.players) {
            if(player.gameStatus !== 'stand') {
                allPlayersStand = false;
            }
        }
        if(allPlayersStand) {
            return 'roundOver';
        } else {
            return 'acting';
        }
    }

    blackjackEvaluateAndGetRoundResult():string {
        // update the log and return the result
        for(let player of this.players) {
            switch(player.gameStatus) {
                case 'stand':
                    if(player.getHandScore() > this.dealer.getHandScore()) {
                        player.winAmount = player.bet * 2;
                        player.chips += player.winAmount;
                    } else if(player.getHandScore() === this.dealer.getHandScore()) {
                        player.winAmount = player.bet;
                        player.chips += player.winAmount;
                    }
                    break;
                
            }
            this.resultsLog.push(`name: ${player.name}, action: ${player.gameStatus}, bet: ${player.bet}, won: ${player.winAmount}`);
        }
        return this.resultsLog.join('\n');
    }

    onLastPlayer():boolean{
        return this.turnCounter === this.players.length - 1;
    }

    onFirstPlayer():boolean{
        return this.turnCounter === 0;
    }

    allPlayerActionResolved():boolean{
        for(let player of this.players){
            if(player.gameStatus === 'betting'){
                return false;
            }
        }
        return true;
    }

}

class GameDecision {
    action:string;
    amount:number;

    constructor(action:string, amount:number) {
        this.action = action;
        this.amount = amount;
    }
}
  
class Player {
    name:string;
    type:string;
    gameType:string;
    chips:number;
    bet:number = 0;
    winAmount:number = 0;
    gameStatus:string = 'betting';
    hand:Card[] = [];

    constructor(name:string, type:string, gameType:string, chips:number=400) {
      this.name = name;
      this.type = type;
      this.gameType = gameType;
      this.chips = chips;
    }
  
    promptPlayer(userData:number|null):GameDecision {
        // 仮
        return new GameDecision('bet', 10);
    }

    getHandScore():number {
        let sum:number = 0;
        for(let card of this.hand){
            sum += card.getRankNumber(sum);
        }

        for(let card of this.hand){
            if(card.rank === 'A' && sum > 21){
                sum -= 10;
            }
        }
        return sum;
    }

}
  
class Deck {
    gameType:string;
    cards:Card[] = [];
    constructor(gameType:string) {
        this.gameType = gameType;
        this.cards = this.resetDeck(gameType);
    }
  
    shuffle():void {
      for(let i = this.cards.length-1; i > 0; i--){
        let j = Math.floor(Math.random()*i+1);
        let temp:Card = this.cards[i];
        this.cards[i] = this.cards[j];
        this.cards[j] = temp;
      }
    }

    resetDeck(gameType:string):Card[] {
        const deck:Card[] = [];
              // デッキを初期化
        const suits = ['H', 'D', 'C', 'S'];
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  
        for (const suit of suits) {
            for (const rank of ranks) {
                if(gameType == "blackjack") {
                    deck.push(new Card(suit, rank))
                }
            }
        }

        return deck;
    }

    drawCard():Card{
        return this.cards.shift()!;
    }
  }
  
  class Card {
    suit:string;
    rank:string;
    constructor(suit:string, rank:string) {
      this.suit = suit;
      this.rank = rank;
    }
  
    getRankNumber(sum:number):number {
      // カードのランクを数値で表現する
      // エース("A")の場合、1または11のどちらかとして扱う
      // ...
      if(this.rank === 'A') {
        return sum + 11 > 21 ? 1 : 11;
      } else if(this.rank === 'J' || this.rank === 'Q' || this.rank === 'K') {
        return 10;
      } else {
        return Number(this.rank);
      }
    }
  }
  
let player1 = new Player('Player 1', 'user', 'blackjack', 100);
let player2 = new Player('Player 2', 'user', 'blackjack', 100);

