import {
    PokerGamePhaseType,
    pokerIndexOfNum,
    PokerActionType,
    PokerHandType,
} from "../../config/pokerConfig";
import Card from "../common/card";
import Table from "../common/table";
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
    blindCounter: number; // ブラインドベットした人数を記録(foldした場合を考慮する。(dealerIndex + 2は不可))
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
        // this.dealerIndex = Math.floor(Math.random() * this.players.length);
        this.dealerIndex = 2;
        this.playerIndexCounter = this.dealerIndex + 1; // 現在ターンのプレイヤーを返す。
        this.betIndex = (this.dealerIndex + 2) % this.players.length; //　ラウンド開始時のベットスタートプレイヤー
        this.minbet = 5; // 最小ベット金額
        this.smallBlind = Math.floor(this.minbet / 2);
        this.bigBlind = Math.floor(this.minbet);
        this.betMoney = this.minbet; //　ベットしないといけない金額
        this.blindCounter = 0;
        this.pot = 0; // potに溜まった金額
        this.maxTurn = maxTurn;
    }

    assignPlayerHands(): void {
        // for (let player of this.players) {
        //     player.hand.push(this.deck.drawCard());
        //     player.hand.push(this.deck.drawCard());
        // }
        for (let i = 0; i < this.players.length; i++) {
            if (i == 0) {
                this.players[i].hand.push(new Card("H", "10"));
                this.players[i].hand.push(new Card("D", "4"));
            } else if (i == 1) {
                this.players[i].hand.push(new Card("C", "4"));
                this.players[i].hand.push(new Card("H", "9"));
            } else if (i == 2) {
                this.players[i].hand.push(new Card("H", "K"));
                this.players[i].hand.push(new Card("S", "2"));
            } else {
                this.players[i].hand.push(new Card("D", "2"));
                this.players[i].hand.push(new Card("S", "K"));
            }
        }
    }

    sortPlayerScore(): pokerPlayer[] {
        let sortedPlayers: pokerPlayer[] = this.players.sort((a, b) => {
            return a.chips - b.chips;
        });
        return sortedPlayers;
    }

    clearPlayerHandsAndBets(): void {
        this.players.map((player) => {
            player.bet = 0;
            player.gameStatus = "blind";
            player.hand = [];
            player.Cards = [];
            player.pairsOfTwoList = [];
            player.pairsOfThreeList = [];
            player.pairsOfFourList = [];
            player.parisOfCardList = [];
            player.playerHandStatus = "no pair";
        });
        this.dealer.hand = [];
        this.dealer.Cards = [];
        this.blindCounter = 0;
        this.pot = 0;
        this.turnCounter = 0;
        this.blindCounter = 0;
    }

    clearPlayerBet(): void {
        for (let player of this.players) {
            player.bet = 0;
        }
    }

    // ラウンド結果を評価し、結果を文字列として返すメソッド.
    evaluateAndGetRoundResults(): string {
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
            console.log(player.name, player.playerHandStatus);
        });

        this.players.map((player) => {
            console.log(player.gameStatus);
            if (player.gameStatus != "fold") {
                hashMap.set(
                    player.playerHandStatus,
                    hashMap.get(player.playerHandStatus)! + 1
                );
            }
        });
        let highRole: PokerHandType = "";
        // 今回のポーカーの役で一番強いものを決める
        for (const [key, value] of hashMap) {
            if (value > 0) {
                highRole = key;
                break;
            }
        }

        // 誰だったかを取得
        console.log(highRole, hashMap.get(highRole));

        let winnerPlayer: pokerPlayer[] = this.players.filter(
            (player) => player.playerHandStatus == highRole
        );

        let strongestHand: PokerHandType = winnerPlayer[0].playerHandStatus;

        // 複数人いた際は、手札の強い方で判定。
        if (winnerPlayer.length > 1) {
            // ツーカード　or ワンペア
            winnerPlayer.map((player) => {
                console.log(
                    player.name,
                    player.pairsOfTwoList,
                    player.pairsOfThreeList,
                    player.parisOfCardList
                );
            });
            console.log("複数人います。");

            // フォーカード　比較
            if (strongestHand == "four card") {
                let maxFourCard = winnerPlayer[0].pairsOfFourList[0];
                let maxFourCardIndex = 0;
                for (let i = 1; i < winnerPlayer.length; i++) {
                    let currPlayer = winnerPlayer[i];
                    if (
                        pokerIndexOfNum.indexOf(maxFourCard) <
                        pokerIndexOfNum.indexOf(currPlayer.pairsOfFourList[0])
                    ) {
                        maxFourCard = currPlayer.pairsOfFourList[0];
                        maxFourCardIndex = i;
                    }
                }
                if (winnerPlayer[0].pairsOfFourList[0] != maxFourCard) {
                    winnerPlayer[maxFourCardIndex].chips += this.pot;
                } else {
                    winnerPlayer = winnerPlayer.filter(
                        (player) => player.pairsOfFourList[0] == maxFourCard
                    );
                    this.drawSplitChip(winnerPlayer);
                }
            }
            // フルハウス or スリーカード
            else if (
                strongestHand == "full house" ||
                strongestHand == "three card"
            ) {
                let maxThreeCard = winnerPlayer[0].pairsOfThreeList[0];
                let maxThreeCardIndex = 0;
                let maxTwoCard = winnerPlayer[0].pairsOfTwoList[0];
                let maxTwoCardIndex = 0;
                // まず3の数字を確認
                for (let i = 1; i < winnerPlayer.length; i++) {
                    let currPlayer = winnerPlayer[i];
                    if (strongestHand == "full house") {
                        if (
                            pokerIndexOfNum.indexOf(maxTwoCard) <
                            pokerIndexOfNum.indexOf(
                                currPlayer.pairsOfTwoList[0]
                            )
                        ) {
                            maxTwoCard = currPlayer.pairsOfTwoList[0];
                            maxTwoCardIndex = i;
                        }
                    }
                    if (
                        pokerIndexOfNum.indexOf(maxThreeCard) <
                        pokerIndexOfNum.indexOf(currPlayer.pairsOfThreeList[0])
                    ) {
                        maxThreeCard = currPlayer.pairsOfThreeList[0];
                        maxThreeCardIndex = i;
                    }
                }
                // 初めと値が違ったら　=> 最大の人いる。
                if (winnerPlayer[0].pairsOfThreeList[0] != maxThreeCard) {
                    console.log(
                        "最大pairsOfTwo 判断",
                        maxThreeCardIndex,
                        maxThreeCard
                    );
                    winnerPlayer[maxThreeCardIndex].chips += this.pot;
                }
                // 同じだったら => full houseならpairs of two　で確認 else 引き分け
                else {
                    if (strongestHand == "three card") {
                        winnerPlayer = winnerPlayer.filter(
                            (player) =>
                                player.pairsOfThreeList[0] == maxThreeCard
                        );
                        this.drawSplitChip(winnerPlayer);
                    } else {
                        if (winnerPlayer[0].pairsOfTwoList[0] != maxTwoCard) {
                            console.log(
                                "最大pairsOfTwo 判断",
                                maxTwoCardIndex,
                                maxTwoCard
                            );
                            winnerPlayer[maxTwoCardIndex].chips += this.pot;
                        } else {
                            winnerPlayer = winnerPlayer.filter(
                                (player) =>
                                    player.pairsOfTwoList[0] == maxTwoCard
                            );
                            this.drawSplitChip(winnerPlayer);
                        }
                    }
                }
            }
            //　ツーペア ワンペア比較
            else if (
                strongestHand == "two pair" ||
                strongestHand == "one pair"
            ) {
                console.log("paris of two pair || one pair");
                for (
                    let j = winnerPlayer[0].pairsOfTwoList.length - 1;
                    j >= 0;
                    j--
                ) {
                    // 現在のhandで一番高いランクを判定
                    let currHand = winnerPlayer[0].pairsOfTwoList[j];
                    for (let i = 0; i < winnerPlayer.length; i++) {
                        let currPlayerHand = winnerPlayer[i].pairsOfTwoList[j];
                        console.log(currHand, currPlayerHand);
                        if (currHand != currPlayerHand) {
                            if (
                                pokerIndexOfNum.indexOf(currHand) <
                                pokerIndexOfNum.indexOf(currPlayerHand)
                            ) {
                                currHand = currPlayerHand;
                            }
                        }
                    }
                    // いらないwinnerPlayerを削除
                    winnerPlayer = winnerPlayer.filter(
                        (player) => player.pairsOfTwoList[j] == currHand
                    );
                    if (winnerPlayer.length == 1) break;
                }

                console.log("two pairの判定終了", winnerPlayer);

                if (winnerPlayer.length > 1) {
                    // winnersPlayerがこの時点で決まってたら終了
                    for (
                        let j = winnerPlayer[0].parisOfCardList.length - 1;
                        j >= 0;
                        j--
                    ) {
                        let currHand = winnerPlayer[0].parisOfCardList[j];
                        for (let i = 0; i < winnerPlayer.length; i++) {
                            let currPlayerHand =
                                winnerPlayer[i].parisOfCardList[j];
                            console.log(currHand, currPlayerHand);
                            if (currHand != currPlayerHand) {
                                if (
                                    pokerIndexOfNum.indexOf(currHand) <
                                    pokerIndexOfNum.indexOf(currPlayerHand)
                                ) {
                                    currHand = currPlayerHand;
                                }
                            }
                        }
                        winnerPlayer = winnerPlayer.filter(
                            (player) => player.parisOfCardList[j] == currHand
                        );
                        if (winnerPlayer.length == 1) break;
                    }
                }
                winnerPlayer.length > 1
                    ? this.drawSplitChip(winnerPlayer)
                    : (winnerPlayer[0].chips += this.pot);
            }
            // no pair
            else {
                for (
                    let j = winnerPlayer[0].parisOfCardList.length - 1;
                    j >= 0;
                    j--
                ) {
                    let currHand = winnerPlayer[0].parisOfCardList[j];
                    for (let i = 0; i < winnerPlayer.length; i++) {
                        let currPlayerHand = winnerPlayer[i].parisOfCardList[j];
                        if (currHand != currPlayerHand) {
                            if (
                                pokerIndexOfNum.indexOf(currHand) <
                                pokerIndexOfNum.indexOf(currPlayerHand)
                            ) {
                                currHand = currPlayerHand;
                            }
                        }
                    }
                    winnerPlayer = winnerPlayer.filter(
                        (player) => player.parisOfCardList[j] == currHand
                    );
                    if (winnerPlayer.length == 1) break;
                }
                winnerPlayer.length > 1
                    ? this.drawSplitChip(winnerPlayer)
                    : (winnerPlayer[0].chips += this.pot);
            }
        } else {
            let winnerPlayer: pokerPlayer[] = this.players.filter(
                (player) => player.playerHandStatus == highRole
            );
            console.log(winnerPlayer);
            winnerPlayer[0].chips += this.pot;
        }
        return "";
    }

    drawSplitChip(winnerPlayers: pokerPlayer[]): void {
        winnerPlayers.map(
            (player) =>
                (player.chips += Math.floor(this.pot / winnerPlayers.length))
        );
    }

    getResultLog(): string {
        let roundLog: string = "";
        for (let i = 0; i < this.players.length; i++) {
            roundLog +=
                this.players[i].chips +
                (i != this.players.length - 1 ? "," : "");
        }
        return roundLog;
    }

    // 他のプレイヤーがgiveUp or AllIn Check
    checkAllOtherPlayerStatus(player: pokerPlayer): boolean {
        for (let i = 0; i < this.players.length; i++) {
            let currPlayer = this.players[i];
            if (currPlayer != player) {
                if (
                    currPlayer.gameStatus != "allin" &&
                    currPlayer.gameStatus != "fold"
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    // プレイヤーのアクションを評価し、ゲームの進行状態を変更するメソッド。
    evaluateMove(player: pokerPlayer, userData?: PokerActionType): void {
        if (player.type == "dealer") {
            if (this.turnCounter == 0) {
                // this.dealer.hand.push(this.deck.drawCard());
                // this.dealer.hand.push(this.deck.drawCard());
                // this.dealer.hand.push(this.deck.drawCard());
                this.dealer.hand.push(new Card("S", "9"));
                this.dealer.hand.push(new Card("C", "3"));
                this.dealer.hand.push(new Card("D", "4"));
            } else if (this.turnCounter == 1) {
                this.dealer.hand.push(new Card("H", "3"));
            } else if (this.turnCounter == 2) {
                this.dealer.hand.push(new Card("S", "10"));
            }
            // } else if (this.turnCounter < 3) {
            //     this.dealer.hand.push(this.deck.drawCard());
            // }
            console.log("turnCounter !!: ", this.turnCounter);
            this.turnCounter++;

            if (this.turnCounter == 4) {
                console.log("最終ラウンドまで来た。");
                this.gamePhase = "evaluating";
            }
            this.clearPlayerBet();
            // ディーラーがカード引いた時点で、プレイヤーの情報更新
            this.changePlayerStatusToBet();
            this.updatePlayerHandStatus();
            this.playerIndexCounter = this.dealerIndex + 1;
            this.betMoney = this.minbet;
            console.log("ディーラーのhand", this.dealer.hand);
            console.log("次のラウンドの開始person", this.getTurnPlayer().name);

            // this.printPlayerStatus();
        } else {
            // playerIndexCounter == betIndex : 1周してきた時
            // bet状態じゃない or ブラインドベットじゃない => dealer.turn
            if (
                this.onLastPlayer() &&
                player.gameStatus != "bet" &&
                player.gameStatus != "blind"
            ) {
                console.log("一周してきました。ディーラーに移行");
                this.gamePhase = "dealer turn";
                return;
            }

            console.log("userData", userData);
            let gameDecision: pokerGameDecision = player.promptPlayer(
                userData!,
                this.betMoney
            );

            console.log(gameDecision);

            switch (gameDecision.action) {
                case "bet":
                    console.log("ベットできてません。もう一度選択してください");
                    break;
                case "blind":
                    console.log(this.playerIndexCounter, this.dealerIndex);
                    console.log("ブラインドカウンター：", this.blindCounter);
                    if (this.blindCounter == 0) this.assignPlayerHands();
                    //　ブラインドベットをする。
                    console.log(player.name, "before blind", player);
                    player.bet =
                        this.blindCounter == 0
                            ? this.smallBlind
                            : this.bigBlind;
                    this.blindCounter++;
                    console.log("player Blind bet money", player.bet);
                    player.chips -= player.bet;
                    this.pot += player.bet;
                    player.gameStatus = "bet";
                    console.log(player.name, "after blind", player);
                    // ブラインド終了後に、全プレイヤーをbet状態にする。
                    if (this.blindCounter == 2) {
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
                    // this.printPlayerStatus();
                    console.log(player.name, "after raise", player);
                    break;
                case "allin":
                    if (player.gameStatus == "allin") break;
                    this.pot += gameDecision.amount;
                    player.chips -= gameDecision.amount;
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
        // 最終ラウンドまで来たら、result表示 => ゲームを終了させる。
        if (this.gamePhase == "dealer turn") this.gamePhase = "betting";
        else if (this.gamePhase == "evaluating") {
            console.log("ROUND  OWARI!!!!");
            this.evaluateAndGetRoundResults();
            this.clearPlayerHandsAndBets();
            this.deck.reset();
            this.deck.shuffle();
            this.moveToNextDealer();
            this.gamePhase = "blinding";
            if (this.checkchipsEqualsZeroExceptOne()) {
                console.log("自分以外は所持金ありません。", "終了させます");
                this.moveToFinalRoundandGetResult();
                this.roundCounter = this.maxTurn;
                console.log(this.resultsLog);
                return;
            }else {
                this.resultsLog.push(this.getResultLog());
                this.roundCounter++;
                console.log("ラウンド終了次はblinding", this.gamePhase);
                console.log(this.resultsLog);
                return;
            }
        }
        let player = this.getTurnPlayer();
        this.checkAllOtherPlayerStatus(player);

        let playerBefore = this.getoneBeforePlayer();
        // 前のまえのプレイヤーがpassしてたらpass可能
        // else bet, raise, dropのみ選択可能。
        console.log("currPlayer: ", player.name);
        // this.printPlayerStatus();

        if (this.allPlayerActionResolved()) {
            this.gamePhase = "dealer turn";
            this.evaluateMove(this.dealer);
            console.log(
                "this.gamePhase: ",
                "ディーラーのターンです。",
                this.gamePhase
            );
        } else {
            // checkできる条件 => 前のプレイヤーがcheck  ||  自分がそのターンの一番はじめ
            // userDataがcheck　なら　check
            // userDataがcheckででないならそのまま
            if (
                (userData == "check" &&
                    player.type == "player" &&
                    (playerBefore.gameStatus == "check" ||
                        (this.playerIndexCounter == this.betIndex &&
                            player.gameStatus == "bet"))) ||
                (userData == "check" && player.type == "player")
            ) {
                // checkできる。
                console.log(
                    playerBefore.gameStatus,
                    this.playerIndexCounter,
                    this.betIndex,
                    player.gameStatus,
                    "checkできる!"
                );
                if (userData == "check") this.evaluateMove(player, "check");
                else this.evaluateMove(player, userData);
            } else if (
                player.gameStatus == "fold" ||
                player.gameStatus == "allin"
            ) {
                // window.alert(player.name + "はこのゲームでは何もできません。");
                console.log(player.name + "はこのゲームでは何もできません。");
                this.evaluateMove(player, player.gameStatus);
            } else if (player.chips == 0) {
                this.evaluateMove(player, "fold");
            }
            // 前のプレイヤーがpassしてなかったら、passはできないように実装。
            // else if (
            //     playerBefore.gameStatus !== "check" &&
            //     playerBefore.gameStatus !== "fold" ) &&
            //     userData == "check"
            // ) {
            //     console.log("前のプレイヤーがcheckしてなからcheckできません。");
            //     // call　or raise or fold => 選択
            //     this.evaluateMove(player, "call");
            // }
            // playerの所持金が現在のベット金額より小さかったら allin
            // callの場合
            else if (player.chips <= this.betMoney && player.chips > 0) {
                console.log(
                    player.name,
                    "の所持金が最小ベット額より少ないです！！",
                    this.betMoney,
                    player.chips
                );
                this.evaluateMove(player, "allin");
            } else if (
                player.chips <= this.betMoney * 2 &&
                player.chips > 0 &&
                userData == "raise"
            ) {
                console.log("所持金足りないからRAISEできませんよ!!!!!");
                console.log("強制call");
                this.evaluateMove(player, "call");
            } else {
                player.type == "player"
                    ? this.evaluateMove(player, userData as PokerActionType)
                    : // ai
                    this.gamePhase == "betting"
                    ? this.evaluateMove(player, "bet")
                    : this.evaluateMove(player);
            }
            console.log("after action...");
            // this.printPlayerStatus();
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

    playerallFoldorAllIn(player: pokerPlayer): boolean {
        return player.gameStatus == "allin" || player.gameStatus == "fold";
    }

    // 現在のラウンドから最後のラウンドまでスキップ + ログ保存
    moveToFinalRoundandGetResult() {
        for (let i = this.roundCounter; i < this.maxTurn; i++) {
            this.resultsLog.push(this.getResultLog());
        }
    }

    updatePlayerHandStatus() {
        for (let player of this.players) {
            if (player.gameStatus != "fold") {
                player.getHandScore(this.dealer);
            }
        }
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

    // 全員がallin or fold
    allplayerAllInOrFold(): boolean {
        for (let player of this.players) {
            if (!this.playerallFoldorAllIn(player)) return false;
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

    // 所持金0のプレイヤーをfoldにする。
    changeFoldwithnomoney() {
        this.players.map((player) => {
            if (player.chips == 0 && player.gameStatus != "allin") {
                player.gameStatus = "fold";
            }
        });
    }

    //　1人以外所持金0のプレイヤーかどうかチェック
    checkchipsEqualsZeroExceptOne(): boolean {
        let player = this.players.filter((player) => player.chips != 0);
        console.log("所持金0のプレイヤ-", player);
        return player.length == 1;
    }

    // 最後のプレイヤーを返す。
    onLastPlayer(): boolean {
        return this.playerIndexCounter == this.betIndex;
    }

    moveToNextDealer(): void {
        this.dealerIndex++;
        this.dealerIndex %= this.players.length;
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
