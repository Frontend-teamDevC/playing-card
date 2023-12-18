import { Config } from "../config/pageConfig";
import pokerTable from "../model/poker/pokerTable";
import { PokerView } from "../view/PokerView";

export class PokerController {
   /*
  renderGameScene(table: BlackjackTable): void
  ゲームのシーンを描画する
  */
    static renderGameScene(table: pokerTable) {
        // lotate table's dealer and player
        this.renderPlayers(table);

        if (table.roundCounter === table.maxTurn) {
            console.log("ゲーム終了, 結果表示ページに遷移したい。");
            Config.displayNone();
            this.renderFinalResultsModal(table);
            return;
        }

        if (table.gamePhase === "dealer turn") {
            setTimeout(() => {
                Config.displayNone();
                table.haveTurn();
                this.renderGameScene(table);
                return;
            }, 1000);
        }

        // allInとなる条件
        // 所持金がtableのbet額以下
        // Skipになる条件　fold, allIn
        const turnPlayer = table.getTurnPlayer();
        const beforePlayer = table.getoneBeforePlayer();
        console.log(turnPlayer.type);
        if (turnPlayer.type == "player") {
            if (table.gamePhase != "blinding") {
                if (
                    turnPlayer.gameStatus == "fold" ||
                    turnPlayer.gameStatus == "allin"
                ) {
                    console.log(
                        "allin or fold なので、もう今は何もアクションはできません。"
                    );
                    setTimeout(() => {
                        Config.displayNone();
                        table.haveTurn();
                        this.renderGameScene(table);
                    }, 500);
                    return;
                }
                //　ひとり前のプレイヤーがcheck or 自分がそのターンのはじめ
                if (
                    beforePlayer.gameStatus == "check" ||
                    table.playerIndexCounter == table.dealerIndex + 1
                ) {
                    if (
                        turnPlayer.chips < table.betMoney &&
                        turnPlayer.chips > 0
                    ) {
                        PokerView.createActionswithCheckModal();
                        this.onActionButtonsClick(table);
                    } else {
                        PokerView.createActionswithCheckModal();
                        this.onActionButtonsClick(table);
                    }
                } else {
                    if (
                        turnPlayer.chips < table.betMoney &&
                        turnPlayer.chips > 0
                    ) {
                        PokerView.createallInModal();
                        this.onActionButtonsClick(table);
                    } else {
                        PokerView.createActionsModal();
                        this.onActionButtonsClick(table);
                    }
                }
            }
        } else {
            setTimeout(() => {
                Config.displayNone();
                table.haveTurn();
                this.renderGameScene(table);
            }, 100);
        }
    }

    /*
    renderPlayers(table: PokerTable): void
    プレイヤーの情報を描画する
    */
    static renderPlayers(table: pokerTable) {
        PokerView.createPlayerView(table.dealer, table);

        for (let player of table.players) {
            PokerView.createPlayerView(player, table);
        }
    }

    /*
    onActionButtonsClick(table: BlackjackTable): void
    アクションボタンがクリックされた時の処理を記述する
    */
    static onActionButtonsClick(table: pokerTable) {
        const callButton = document.querySelector(".call-button");
        const raiseButton = document.querySelector(".raise-button");
        const foldButton = document.querySelector(".fold-button");
        const checkButton = document.querySelector(".check-button");
        const allInButton = document.querySelector(".allIn-button");

        callButton?.addEventListener("click", () => {
            Config.displayNone();
            table.haveTurn("call");
            this.renderGameScene(table);
        });

        raiseButton?.addEventListener("click", () => {
            Config.displayNone();
            table.haveTurn("raise");
            this.renderGameScene(table);
        });

        foldButton?.addEventListener("click", () => {
            Config.displayNone();
            table.haveTurn("fold");
            console.log("clicked FOLD!!");
            this.renderGameScene(table);
        });

        allInButton?.addEventListener("click", () => {
            Config.displayNone();
            table.haveTurn("allin");
            console.log("ALL IN ");
            this.renderGameScene(table);
        });

        checkButton?.addEventListener("check", () => {
            Config.displayNone();
            table.haveTurn("check");
            this.renderGameScene(table);
        });
    }

    /*
    renderFinalResultsModal(table: PokerTable): void
    全ラウンド終了後の最終結果のモーダルを描画する
    */
    // static renderFinalResultsModal(table: pokerTable): void {
    //     PokerView.createFinalResultsModal(table);
    //     this.onClickFinalResultsButons(table);
    // }

    /*
    onClickNextRoundButton(table: BlackjackTable): void
    round overモーダルのnext roundボタンがクリックされた時の処理を記述する
    */
    // static onClickNextRoundButton(table: pokerTable): void {
    //     const nextRoundButton = document.querySelector(".next-round-button");
    //     nextRoundButton?.addEventListener("click", () => {
    //         if (table.gamePhase === "game over") {
    //             Config.displayNone();
    //             this.renderGameOverModal(table);
    //             return;
    //         }
    //         table.gamePhase = "betting";
    //         Config.displayNone();
    //         this.renderGameScene(table);
    //     });
    // }

    /*
    onClickGameOverButtons(table: BlackjackTable): void
    game overモーダルのrestart, backボタンがクリックされた時の処理を記述する
    */
    // static onClickGameOverButtons(table: pokerTable): void {
    //     const restartButton = document.querySelector(".restart-button");
    //     const backButton = document.querySelector(".back-button");
    //     restartButton?.addEventListener("click", () => {
    //         Config.displayNone();
    //         this.renderGameScene(
    //             new pokerTable(
    //                 "blackjack",
    //                 table.players[0].name,
    //                 table.difficulty,
    //                 table.maxRounds
    //             )
    //         );
    //     });
    //     backButton?.addEventListener("click", () => {
    //         Config.displayNone();
    //     });
    // }

    /*
    onClickFinalResultsButons(table: BlackjackTable): void
    final resultsモーダルのrestart, backボタンがクリックされた時の処理を記述する
    */
    // static onClickFinalResultsButons(table: BlackjackTable) {}
}
