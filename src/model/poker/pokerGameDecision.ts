import GameDecision from "../common/gameDecision";
import { PokerActionType } from "../../config/pokerConfig";

export default class pokerGameDecision extends GameDecision {
    public action: PokerActionType;
    public amount: number;

    constructor(action: PokerActionType, amount: number = 0) {
        super(action, amount);
        this.action = action;
        this.amount = amount;
    }
}
