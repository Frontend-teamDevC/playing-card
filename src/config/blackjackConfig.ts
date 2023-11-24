export type BlackjackPlayerType = 'player' | 'ai' | 'dealer'

export type BlackjackActionType =
  | 'bet'
  | 'hit'
  | 'stand'
  | 'double'
  | 'surrender'
  | 'insurance'

export type BlackjackStatusType =
  | ''
  | 'betting'
  | 'waiting'
  | 'acting'
  | 'stand'
  | 'bust'
  | 'blackjack'
  | 'surrender'

export type BlackjackGamePhaseType =
  | 'betting'
  | 'acting'
  | 'dealer turn'
  | 'evaluating'
  | 'round over'
  | 'game over'

export type BlackjackBetDenominationType = 5 | 10 | 20 | 50 | 100
