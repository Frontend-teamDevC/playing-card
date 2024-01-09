import {
    PokerActionType,
    PokerHandType,
    PokerPlayerType,
    PokerStatusType,
    pokerIndexOfNum,
} from "../../config/pokerConfig.js";
import Card from "../common/card";
import Player from "../common/player";
import pokerGameDecision from "./pokerGameDecision.js";

export default class pokerPlayer extends Player {
    gameStatus: PokerStatusType;
    Cards: Card[];
    maxValue: number;
    playerHandStatus: PokerHandType;
    pairsOfTwoList: string[];
    pairsOfThreeList: string[];
    pairsOfFourList: string[];
    parisOfCardList: string[];

    constructor(
        name: string,
        type: PokerPlayerType,
        gameType: string,
        chips: number = 100 // getter, setterを後から
    ) {
        super(name, type, gameType, chips);
        this.gameStatus = "blind";
        this.Cards = [];
        this.maxValue = 0;
        this.playerHandStatus = "no pair";
        this.pairsOfTwoList = [];
        this.pairsOfThreeList = [];
        this.pairsOfFourList = [];
        this.parisOfCardList = [];
    }

    promptPlayer(
        userData: PokerActionType,
        betMoney?: number
    ): pokerGameDecision {
        if (this.type === "player") {
            return userData == "blind"
                ? new pokerGameDecision("blind")
                : userData == "bet"
                ? new pokerGameDecision("bet")
                : userData == "call"
                ? new pokerGameDecision("call", betMoney)
                : userData == "raise"
                ? new pokerGameDecision("raise", (betMoney as number) * 2)
                : userData == "allin"
                ? new pokerGameDecision("allin", this.chips)
                : userData == "check"
                ? new pokerGameDecision("check")
                : userData == "fold"
                ? new pokerGameDecision("fold")
                : new pokerGameDecision("blind");
        } else {
            switch (userData) {
                case "check":
                    return new pokerGameDecision("check");
                case "fold":
                    return new pokerGameDecision("fold");
                case "allin":
                    return new pokerGameDecision("allin", this.chips);
                case "bet":
                    // const rand = Math.random();
                    // if (rand > 0.8)
                    //     return new pokerGameDecision(
                    //         "raise",
                    //         (betMoney as number) * 2
                    //     );
                    // else
                    return new pokerGameDecision("call", betMoney);
                default:
                    return new pokerGameDecision("blind", betMoney);
            }
        }
    }

    getHandScore(dealer: Player): PokerHandType {
        console.log(this.name, "before Concat", this.Cards);
        this.Cards = this.hand.concat(dealer.hand);
        const CardsMap: Record<string, number> = {};
        this.Cards.sort((a, b) => {
            return (
                pokerIndexOfNum.indexOf(a.rank) -
                pokerIndexOfNum.indexOf(b.rank)
            );
        });
        console.log(this.name, "after Concat", this.Cards);

        for (let card of this.Cards) {
            if (CardsMap[card.rank] == undefined) {
                CardsMap[card.rank] = 1;
            } else {
                CardsMap[card.rank] += 1;
            }
        }

        this.maxValue = Math.max(...Object.values(CardsMap));
        let pairsOfTwo = 0;
        let pairsOfThree = 0;
        let pairsOfFour = 0;
        const pairsOfTwoList: string[] = [];
        const pairsOfThreeList: string[] = [];
        const parisOfFourList: string[] = [];
        const parisOfCardList: string[] = [];

        console.log("CardMap", CardsMap);
        Object.keys(CardsMap).forEach((data) => {
            if (CardsMap[data] == 2) {
                pairsOfTwo++;
                pairsOfTwoList.push(data);
            }
            if (CardsMap[data] == 3) {
                pairsOfThree++;
                pairsOfThreeList.push(data);
            }
            if (CardsMap[data] == 4) {
                pairsOfFour++;
                parisOfFourList.push(data);
            }
        });

        let allRankList = Object.keys(CardsMap).sort((a, b) => {
            return pokerIndexOfNum.indexOf(a) - pokerIndexOfNum.indexOf(b);
        });

        console.log(this.name, "allRankList", allRankList);

        let count =
            pairsOfTwoList.length * 2 +
            pairsOfThreeList.length * 3 +
            this.pairsOfFourList.length * 4;
        console.log("今から必要な個数", count, 5 - count);

        for (let i = allRankList.length - 1; i >= 0; i--) {
            if (5 - count == 0) break;
            if (
                pairsOfTwoList.indexOf(allRankList[i]) == -1 &&
                pairsOfThreeList.indexOf(allRankList[i]) == -1 &&
                this.pairsOfFourList.indexOf(allRankList[i]) == -1
            ) {
                parisOfCardList.push(allRankList[i]);
                count++;
            }
        }

        this.sortList(pairsOfTwoList);
        this.sortList(pairsOfThreeList);
        this.sortList(parisOfFourList);
        this.sortList(parisOfCardList);
        this.parisOfCardList = parisOfCardList;

        console.log(
            "MaxVaue",
            CardsMap,
            "two",
            pairsOfTwoList,
            "three",
            pairsOfThreeList,
            "four",
            parisOfFourList,
            "other",
            parisOfCardList
        );

        if (this.isRoyalFlush()) {
            this.playerHandStatus = "royal flush";
            return "royal flush";
        } else if (this.isStraightFlush()) {
            this.playerHandStatus = "straight flush";
            return "straight flush";
        } else if (this.isFourCard(pairsOfFour)) {
            this.pairsOfFourList = parisOfFourList;
            this.playerHandStatus = "four card";
            return "four card";
        } else if (this.isFullHouse(pairsOfTwo, pairsOfThree)) {
            this.pairsOfThreeList = pairsOfThreeList;
            this.pairsOfTwoList = pairsOfTwoList;
            this.playerHandStatus = "full house";
            return "full house";
        } else if (this.isFlush()) {
            this.playerHandStatus = "flush";
            return "flush";
        } else if (this.isStraight()) {
            this.playerHandStatus = "straight";
            return "straight";
        } else if (this.isThreeCard(pairsOfThree)) {
            this.pairsOfThreeList = pairsOfThreeList;
            this.playerHandStatus = "three card";
            return "three card";
        } else if (this.isTwoPair(pairsOfTwo)) {
            this.pairsOfTwoList = pairsOfTwoList;
            this.playerHandStatus = "two pair";
            return "two pair";
        } else if (this.isOnePair(pairsOfTwo)) {
            this.pairsOfTwoList = pairsOfTwoList;
            this.playerHandStatus = "one pair";
            return "one pair";
        } else {
            this.playerHandStatus = "no pair";
            return "no pair";
        }
    }

    sortList(list: string[]): string[] {
        return list.sort((a, b) => {
            return pokerIndexOfNum.indexOf(a) - pokerIndexOfNum.indexOf(b);
        });
    }

    isRoyalFlush(): boolean {
        console.log("this.card", this.Cards);
        return (
            this.isStraightFlush() &&
            this.Cards[this.Cards.length - 1].rank === "A"
        );
    }

    isStraightFlush(): boolean {
        return this.isStraight() && this.isFlush();
    }

    isFourCard(pairsOfFour: number): boolean {
        return this.maxValue == 4;
    }

    isFullHouse(pairsOfTwo: number, pairsOfThree: number): boolean {
        return pairsOfThree == 1 && pairsOfTwo == 1;
    }

    isFlush(): boolean {
        return this.Cards.every((hand) => this.Cards[0].suit === hand.suit);
    }

    isStraight(): boolean {
        if (this.Cards.length != 5) return false;
        for (let i = 0; i < this.Cards.length - 1; i++) {
            if (
                pokerIndexOfNum.indexOf(this.Cards[i + 1].rank) -
                    pokerIndexOfNum.indexOf(this.Cards[i].rank) !=
                1
            )
                return false;
        }
        return true;
    }

    isThreeCard(pairsOfThree: number): boolean {
        return this.maxValue === 3 && pairsOfThree === 1;
    }

    isTwoPair(pairsOfTwo: number): boolean {
        return pairsOfTwo === 2;
    }

    isOnePair(pairsOfTwo: number): boolean {
        return pairsOfTwo === 1;
    }

    printHandScore(Cards: Card[]): void {
        for (let i = 0; i < Cards.length; i++) {
            console.log(Cards[i].rank);
        }
    }
}
