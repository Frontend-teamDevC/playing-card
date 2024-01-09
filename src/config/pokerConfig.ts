export type PokerActionType =
    | "bet"
    | "call"
    | "check"
    | "fold"
    | "raise"
    | "allin"
    | "blind"
    | "ante";

export type PokerPlayerType = "" | "ai" | "player" | "dealer";

export type PokerStatusType =
    | ""
    | "blind"
    | "bet" //
    | "check" //　passすること // 前のプレイヤーがcheckならできる。
    | "fold" // 降りること
    | "call" //  前の人と同じ金額を賭ける。
    | "raise" // 二倍
    | "allin"
    | "";

export type PokerChangeBetIndexType = "" | "raise";

export type PokerHandType =
    | ""
    | "royal flush"
    | "straight flush"
    | "four card"
    | "full house"
    | "flush"
    | "straight"
    | "three card"
    | "two pair"
    | "one pair"
    | "no pair"
    | "fold";

export type PokerGamePhaseType =
    | "blinding"
    | "betting"
    // | "acting"
    | "dealer turn"
    | "evaluating"
    | "round over"
    | "game over";

export const pokerIndexOfNum: string[] = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
    "A",
];

export type PokerDenominationType = 5 | 10 | 20 | 50 | 100;
