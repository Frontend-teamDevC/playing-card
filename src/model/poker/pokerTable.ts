import {
    PokerGamePhaseType,
    pokerIndexOfNum,
    PokerActionType,
    PokerHandType,
} from "../../config/pokerConfig.js";
import Table from "../common/table.js";
import pokerGameDecision from "./pokerGameDecision.js";
import pokerPlayer from "./pokerPlayer.js";

export default class pokerTable extends Table {
    dealer: pokerPlayer;
    gamePhase: PokerGamePhaseType; // 型の変更
    maxTurn: number;
    playerIndexCounter: number; //　現在のプレイヤーの場所を特定するためのカウンター
    dealerIndex: number; // ディーラーの特定のためのカウンター
    minbet: number; //　最小bet
    betMoney: number; // テーブルの現在のbet金額(raise等によって変動していく。)
    betIndex: number; // betStartIndex;
    smallBlind: number;
    bigBlind: number;
    pot: number;
    players: pokerPlayer[];
    constructor(gameType: string, maxTurn: number) {
        super(gameType);
        this.dealer = new pokerPlayer("Dealer", "dealer", gameType);
        this.gamePhase = "blinding";
        this.players = [
            new pokerPlayer("p1", "player", gameType),
            new pokerPlayer("p2", "ai", gameType),
            new pokerPlayer("p3", "ai", gameType),
            new pokerPlayer("p4", "ai", gameType),
        ];
        // this.dealerIndex = Math.floor(
        //     Math.random() * (this.players.length - 1)
        // );
        this.dealerIndex = 0;
        this.playerIndexCounter = this.dealerIndex + 1; // 現在ターンのプレイヤーを返す。
        this.betIndex = (this.dealerIndex + 2) % this.players.length;
        this.minbet = 5; // 最小ベット金額
        this.smallBlind = Math.floor(this.minbet / 2);
        this.bigBlind = Math.floor(this.minbet);
        this.betMoney = this.minbet; //　ベットしないといけない金額
        this.pot = 0; // potに溜まった金額
        this.maxTurn = maxTurn;
    }

    assignPlayerHands(): void {
        for (let player of this.players) {
            player.hand.push(this.deck.drawCard());
            player.hand.push(this.deck.drawCard());
        }
    }

    sortPlayerScore(): pokerPlayer[] {
        let sortedPlayers: pokerPlayer[] = this.players.sort((a, b) => {
            return a.chips - b.chips;
        });
        return sortedPlayers;
    }

    clearPlayerHandsAndBets(): void {
        for (let player of this.players) {
            player.hand = [];
            player.bet = 0;
            player.gameStatus = "blind";
            player.parisOfCardList = [];
            player.pairsOfFourList = [];
            player.pairsOfThreeList = [];
            player.pairsOfTwoList = [];
        }
        this.dealer.hand = [];
        this.pot = 0;
        this.turnCounter = 0;
    }

    clearPlayerBet(): void {
        for (let player of this.players) {
            player.bet = 0;
        }
    }

    // ラウンド結果を評価し、結果を文字列として返すメソッド.
    evaluateAndGetRoundResults(): string {
        let winners: pokerPlayer[] = [];
        let roundLog = "";
        const hashMap: Map<PokerHandType, number> = new Map<
            PokerHandType,
            number
        >();
        hashMap.set("royal flush", 0);
        hashMap.set("straight flush", 0);
        hashMap.set("four card", 0);
        hashMap.set("full house", 0);
        hashMap.set("flush", 0);
        hashMap.set("straight", 0);
        hashMap.set("three card", 0);
        hashMap.set("two pair", 0);
        hashMap.set("one pair", 0);
        hashMap.set("no pair", 0);
        hashMap.set("fold", 0);

        console.log("ログ、勝敗判定します");

        this.players.map((player) => {
            if (player.gameStatus != "fold") {
                hashMap.set(
                    player.playerHandStatus,
                    hashMap.get(player.playerHandStatus)! + 1
                );
            }
        });
        let heighRole: PokerHandType = "";
        // 今回のポーカーの役で一番強いものを決める => もしダブってたら、手札の強い順？
        for (const [key, value] of hashMap) {
            if (value > 0) {
                heighRole = key;
                break;
            }
        }
        // 誰だったかを取得
        console.log(heighRole, hashMap.get(heighRole));

        // 複数人いた際は、手札の強い方で判定。
        if (hashMap.get(heighRole)! > 1) {
            let winnerPlayer: pokerPlayer[] = this.players.filter(
                (player) => player.playerHandStatus == heighRole
            );
            // ツーカード　or ワンペア
            winnerPlayer.map((player) => {
                console.log(
                    player.name,
                    player.pairsOfTwoList,
                    player.pairsOfThreeList,
                    player.parisOfCardList
                );
            });
            console.log(
                "複数人います。",
                winnerPlayer.map((player) => player.playerHandStatus)
            );

            // フォーカード　比較
            if (winnerPlayer[0].playerHandStatus == "four card") {
            }
            // フルハウス or スリーカード
            else if (
                winnerPlayer[0].playerHandStatus == "full house" ||
                winnerPlayer[0].playerHandStatus == "three card"
            ) {
                let maxThreeCard = winnerPlayer[0].pairsOfThreeList[0];
                let maxThreeCardIndex = 0;
                for (let i = 1; i < winnerPlayer.length; i++) {
                    if (
                        pokerIndexOfNum.indexOf(maxThreeCard) <
                        pokerIndexOfNum.indexOf(
                            winnerPlayer[i].pairsOfThreeList[0]
                        )
                    ) {
                        maxThreeCard = winnerPlayer[i].pairsOfThreeList[0];
                        maxThreeCardIndex = i;
                    }
                }
            }
            //　ツーペア ワンペア比較
            else if (
                winnerPlayer[0].playerHandStatus == "two pair" ||
                winnerPlayer[0].playerHandStatus == "one pair"
            ) {
                let startPlayer = winnerPlayer[0];
                let currHand =
                    startPlayer.pairsOfTwoList[
                        startPlayer.pairsOfTwoList.length - 1
                    ];
                let currIndex = 0;

                console.log("currHand", currHand);
                let flag = false; //　全員同じなら false, 一人でも違って勝者判定可能 true
                for (
                    let j = startPlayer.pairsOfTwoList.length - 1;
                    j >= 0;
                    j--
                ) {
                    currHand = startPlayer.pairsOfTwoList[j];

                    // 現在のhandで一番高いランクを判定
                    for (let i = 0; i < winnerPlayer.length; i++) {
                        let currPlayerHand = winnerPlayer[i].pairsOfTwoList[j];
                        console.log(
                            "currHand",
                            currHand,
                            "playerHand",
                            currPlayerHand
                        );
                        if (currHand != currPlayerHand) {
                            flag = true;
                            if (
                                pokerIndexOfNum.indexOf(currHand) <
                                pokerIndexOfNum.indexOf(currPlayerHand)
                            ) {
                                winnerPlayer;
                                currHand = currPlayerHand;
                                currIndex = i;
                                console.log(
                                    "currHand",
                                    currHand,
                                    "currIndex",
                                    currIndex,
                                    "flag",
                                    flag
                                );
                            }
                        }
                    }
                    // いらないwinnerPlayerを削除
                    console.log("currhand:", currHand);
                    if (flag) {
                        winnerPlayer = winnerPlayer.filter(
                            (player) => player.pairsOfTwoList[j] == currHand
                        );
                    }
                }

                // winnersPlayerがこの時点で決まってたら終了
                if (winnerPlayer.length == 1) {
                    console.log("Winner", winnerPlayer[0].name);
                    winners.push(winnerPlayer[0]);
                    for (let i = 0; i < this.players.length; i++) {
                        roundLog +=
                            this.players[i].chips +
                            (i != this.players.length - 1 ? "," : "");
                    }

                    return roundLog;
                } else {
                    flag = false;
                    if (!flag) {
                        for (
                            let j = winnerPlayer[0].parisOfCardList.length - 1;
                            j >= 0;
                            j--
                        ) {
                            currHand = winnerPlayer[0].parisOfCardList[j];
                            for (let i = 0; i < winnerPlayer.length; i++) {
                                let currPlayerHand =
                                    winnerPlayer[i].parisOfCardList[j];
                                console.log(
                                    currIndex,
                                    currHand,
                                    currPlayerHand
                                );
                                if (currHand != currPlayerHand) {
                                    flag = true;
                                    if (
                                        pokerIndexOfNum.indexOf(currHand) <
                                        pokerIndexOfNum.indexOf(currPlayerHand)
                                    ) {
                                        currHand = currPlayerHand;
                                        currIndex = i;
                                        console.log(
                                            "currHand",
                                            currHand,
                                            "currIndex",
                                            currIndex,
                                            flag
                                        );
                                    }
                                }
                            }
                            if (flag) break;
                        }
                    }
                }

                if (!flag) {
                    // 引き分け
                    console.log("引き分け");
                    for (let player of winnerPlayer) {
                        console.log(player, player.name);
                        player.chips += Math.floor(
                            this.pot / winnerPlayer.length
                        );
                    }
                } else {
                    // 勝利プレイヤーに分配
                    winnerPlayer[currIndex].chips += this.pot;
                }

                console.log(currIndex, winnerPlayer[currIndex].name, flag);
            }
            // no pair
            else {
                let currHand =
                    winnerPlayer[0].pairsOfTwoList[
                        winnerPlayer[0].pairsOfTwoList.length - 1
                    ];
                let currIndex = 0;
                let flag = false;

                for (
                    let j = winnerPlayer[0].parisOfCardList.length - 1;
                    j >= 0;
                    j--
                ) {
                    currHand = winnerPlayer[0].parisOfCardList[j];
                    for (let i = 0; i < winnerPlayer.length; i++) {
                        let currPlayerHand = winnerPlayer[i].parisOfCardList[j];
                        console.log(currIndex, currHand, currPlayerHand);
                        if (currHand != currPlayerHand) {
                            flag = true;
                            if (
                                pokerIndexOfNum.indexOf(currHand) <
                                pokerIndexOfNum.indexOf(currPlayerHand)
                            ) {
                                currHand = currPlayerHand;
                                currIndex = i;
                                console.log(
                                    "currHand",
                                    currHand,
                                    "currIndex",
                                    currIndex,
                                    flag
                                );
                            }
                        }
                    }
                    if (flag) break;
                }

                if (!flag) {
                    // 引き分け
                    for (let player of winnerPlayer) {
                        console.log(player, player.name);
                        player.chips += Math.floor(
                            this.pot / winnerPlayer.length
                        );
                    }
                } else {
                    // 勝利プレイヤーに分配
                    winnerPlayer[currIndex].chips += this.pot;
                }
                console.log(currIndex, winnerPlayer[currIndex].name, flag);
            }

            // ツーカード　or ワンペア
            winnerPlayer.map((player) => {
                console.log(
                    player.name,
                    player.pairsOfTwoList,
                    player.pairsOfThreeList,
                    player.parisOfCardList
                );
            });
        } else {
            // 勝ちプレイヤー取得。
            let winnerPlayer: pokerPlayer[] = this.players.filter(
                (player) => player.playerHandStatus == heighRole
            );
            console.log(winnerPlayer[0].name);
            winnerPlayer[0].chips += this.pot;
            this.pot = 0;
        }

        for (let i = 0; i < this.players.length; i++) {
            roundLog +=
                this.players[i].chips +
                (i != this.players.length - 1 ? "," : "");
        }
        return roundLog;
    }

    compairPairsOfTwo(playerList: pokerPlayer[]): boolean {
        let currHand;
        let currIndex = 0;
        let flag = false;
        for (let j = playerList[0].pairsOfTwoList.length - 1; j >= 0; j--) {
            currHand = playerList[0].pairsOfTwoList[j];
            for (let i = 0; i < playerList.length; i++) {
                let currPlayerHand = playerList[i].pairsOfTwoList[j];
                console.log(currIndex, currHand, currPlayerHand);
                if (currHand != currPlayerHand) {
                    flag = true;
                    if (
                        pokerIndexOfNum.indexOf(currHand) <
                        pokerIndexOfNum.indexOf(currPlayerHand)
                    ) {
                        currHand = currPlayerHand;
                        currIndex = i;
                        console.log(
                            "currHand",
                            currHand,
                            "currIndex",
                            currIndex,
                            flag
                        );
                    }
                }
            }
            if (flag) break;
        }
        return flag;
    }

    // プレイヤーのアクションを評価し、ゲームの進行状態を変更するメソッド。
    evaluateMove(player: pokerPlayer, userData?: PokerActionType): void {
        if (player.type == "dealer") {
            if (this.turnCounter == 0) {
                this.dealer.hand.push(this.deck.drawCard());
                this.dealer.hand.push(this.deck.drawCard());
                this.dealer.hand.push(this.deck.drawCard());
            } else if (this.turnCounter < 3) {
                this.dealer.hand.push(this.deck.drawCard());
            }
            console.log("turnCounter !!: ", this.turnCounter);
            this.turnCounter++;

            if (this.turnCounter == 4) {
                console.log("最終ラウンドまで来た。");
                this.gamePhase = "evaluating";
            }
            this.clearPlayerBet();
            this.changePlayerStatusToBet();
            this.playerIndexCounter = this.dealerIndex + 1;
            this.betMoney = this.minbet;
            console.log("ディーラーのhand", this.dealer.hand);
            console.log("次のラウンドの開始person", this.getTurnPlayer().name);
            this.printPlayerStatus();
        } else {
            // playerIndexCounter == betIndex : 1周してきた時
            // bet状態じゃない or ブラインドベットじゃない => dealer.turn
            if (
                this.onLastPlayer() &&
                player.gameStatus != "bet" &&
                player.gameStatus != "blind"
            ) {
                this.gamePhase = "dealer turn";
                return;
            }

            let gameDecision: pokerGameDecision = player.promptPlayer(
                userData!,
                this.betMoney
            );

            console.log(gameDecision);

            if (this.gamePhase != "blinding") {
                console.log("player Info: ", player.getHandScore(this.dealer)); // プレイヤーのstatusをcheck,
            }
            switch (gameDecision.action) {
                case "bet":
                    console.log("ベットできてません。もう一度選択してください");
                    break;
                case "blind":
                    if (this.playerIndexCounter == this.dealerIndex + 1)
                        this.assignPlayerHands();
                    //　ブラインドベットをする。
                    console.log(player.name, "before blind", player);
                    player.bet =
                        this.playerIndexCounter == this.dealerIndex + 1
                            ? this.smallBlind
                            : this.bigBlind;
                    console.log("player Blind bet money", player.bet);
                    player.chips -= player.bet;
                    this.pot += player.bet;
                    player.gameStatus = "bet";
                    console.log(player.name, "after blind", player);
                    // ブラインド終了後に、全プレイヤーをbet状態にする。
                    if (this.playerIndexCounter == this.dealerIndex + 2) {
                        this.gamePhase = "betting";
                        this.changePlayerStatusToBet();
                    }
                    break;
                case "call":
                    // 一個前のプレイヤーのステータス check => betIndexの変更
                    if (this.getoneBeforePlayer().gameStatus == "check") {
                        this.betIndex = this.playerIndexCounter;
                        this.changePlayerStatusToBet();
                    }
                    console.log(player.name, "before call", player);
                    let playercallMoney = gameDecision.amount;
                    let callBet = player.bet;
                    console.log("call前のbet", player.bet);
                    let playerHaveToCall = playercallMoney - callBet;
                    player.bet += playerHaveToCall;
                    console.log("call後のbet", player.bet);
                    player.chips -= playerHaveToCall;
                    this.pot += playerHaveToCall;
                    player.gameStatus = "call";
                    console.log(player.name, "after call", player);
                    break;
                case "raise":
                    console.log(player.chips);
                    console.log(player.name, "before raise", player);
                    // レイズ時indexの変更
                    let playerRaiseMoney = gameDecision.amount;
                    this.betMoney = gameDecision.amount;
                    let raiseBet = player.bet;
                    let playerHaveToRaise = playerRaiseMoney - raiseBet;
                    this.pot += playerHaveToRaise;
                    player.chips -= playerHaveToRaise;
                    this.betIndex = this.playerIndexCounter;
                    // 全プレイヤーをbet状態に戻す。
                    this.changePlayerStatusToBet();
                    // 自身はraiseにかえ、一周してきた時に、betではないので次は
                    player.gameStatus = "raise";
                    this.printPlayerStatus();
                    console.log(player.name, "after raise", player);
                    console.log(player.chips);
                    break;
                case "allin":
                    if (player.gameStatus == "allin") break;
                    this.pot += gameDecision.amount;
                    player.gameStatus = "allin";
                    break;
                case "check":
                    console.log(player.name, "before check", player);
                    player.gameStatus = "check";
                    console.log(player.name, "after check", player);
                    break;
                case "fold":
                    console.log(player.name, "降ります。");
                    player.gameStatus = "fold";
                    break;
            }
            console.log("Pot Money", this.pot);
        }
    }

    // プレイヤーのターンを処理するメソッド.
    haveTurn(userData?: PokerActionType): void {
        if (this.gamePhase == "dealer turn") this.gamePhase = "betting";
        else if (this.gamePhase == "evaluating") {
            console.log("ROUND  OWARI!!!!");
            this.resultsLog.push(this.evaluateAndGetRoundResults());
            this.clearPlayerHandsAndBets();
            this.roundCounter++;
            this.gamePhase = "blinding";
            console.log("ラウンド終了、次のラウンドです。=>",this.gamePhase);
            return;
        }

        let player = this.getTurnPlayer();
        let playerBefore = this.getoneBeforePlayer();
        // 前のまえのプレイヤーがpassしてたらpass可能
        // else bet, raise, dropのみ選択可能。
        console.log("currPlayer: ", player.name);

        if (this.allPlayerActionResolved()) {
            this.gamePhase = "dealer turn";
            this.evaluateMove(this.dealer);
            console.log(
                "this.gamePhase: ",
                "ディーラーのターンです。",
                this.gamePhase
            );
        } else {
            if (
                (playerBefore.gameStatus == "check" ||
                    (this.playerIndexCounter == this.dealerIndex + 1 &&
                        this.gamePhase != "blinding")) &&
                // playerBefore.gameStatus == "bet"
                (userData == "check" || player.type == "ai")
            ) {
                // checkできる。
                this.evaluateMove(player, "check");
            } else if (
                player.gameStatus == "fold" ||
                player.gameStatus == "allin"
            ) {
                // window.alert(player.name + "はこのゲームでは何もできません。");
                console.log(player.name + "はこのゲームでは何もできません。");
                this.evaluateMove(player, player.gameStatus);
            }
            // 前のプレイヤーがpassしてなかったら、passはできないように実装。
            else if (
                playerBefore.gameStatus !== "check" &&
                playerBefore.gameStatus !== "fold" &&
                userData == "check"
            ) {
                console.log("前のプレイヤーがcheckしてなからcheckできません。");
                // call　or raise or fold => 選択
                this.evaluateMove(player, "call");
            }
            // playerの所持金が現在のベット金額より小さかったら allin
            // callの場合
            else if (player.chips < this.betMoney) {
                console.log(
                    player.name,
                    "の所持金が最小ベット額より少ないです！！",
                    this.betMoney,
                    player.chips
                );
                this.evaluateMove(player, "allin");
            } else if (
                player.chips < this.betMoney * 2 &&
                player.chips > 0 &&
                userData == "raise"
            ) {
                console.log("所持金足りないからRAISEできませんよ!!!!!");
                console.log("強制call");
                this.evaluateMove(player, "call");
            } else {
                console.log("userAction: ", player.type, userData);
                player.type == "player"
                    ? this.evaluateMove(player, userData as PokerActionType)
                    : // ai
                    this.gamePhase == "betting"
                    ? this.evaluateMove(player, "bet")
                    : this.evaluateMove(player);
            }

            // プレイヤーにカードを配る。
            this.moveToNextPlayer();
        }
    }

    /*
    playerActionResolved(player: Player): boolean
    {'call', "check", "fold", "raise", "allin"}
    ラウンド中のプレイヤーの行動が全て完了しているかどうかを返す
    */
    playerActionResolved(player: pokerPlayer): boolean {
        return (
            player.gameStatus == "call" ||
            player.gameStatus == "check" ||
            player.gameStatus == "fold" ||
            player.gameStatus == "raise" ||
            player.gameStatus == "allin"
        );
    }

    /*
    allPlayerActionsResolved(): boolean
    ラウンド中の全プレイヤーの行動が完了しているかどうかを返す
    */
    allPlayerActionResolved(): boolean {
        for (let player of this.players) {
            if (!this.playerActionResolved(player)) return false;
        }
        return true;
    }

    printPlayerStatus(): void {
        for (let player of this.players) {
            console.log(
                player.type,
                player.name,
                player.gameStatus,
                player.chips
            );
        }
    }

    // 最後のプレイヤーを返す。
    onLastPlayer(): boolean {
        return this.playerIndexCounter == this.betIndex;
    }

    moveToNextPlayer(): void {
        this.playerIndexCounter++;
        this.playerIndexCounter %= this.players.length;
    }

    changePlayerStatusToBet(): void {
        for (let player of this.players) {
            if (player.gameStatus != "fold" && player.gameStatus != "allin")
                player.gameStatus = "bet";
        }
    }

    // ターン中のプレイヤーを取得するメソッド.
    getTurnPlayer(): pokerPlayer {
        return this.players[this.playerIndexCounter % this.players.length];
    }

    getoneBeforePlayer(): pokerPlayer {
        return this.players[
            (this.playerIndexCounter + this.players.length - 1) %
                this.players.length
        ];
    }
}
