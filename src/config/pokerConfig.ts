// 仮
export type PokerActionType =
  | 'bet'
  | 'call'
  | 'check'
  | 'fold'
  | 'raise'
  | 'allin'
  | 'ante'
  | 'blind'

export type PokerStatusType = '' | 'playing' | 'folded' | 'allin'
