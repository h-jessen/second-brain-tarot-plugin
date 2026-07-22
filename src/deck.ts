// Auto-generated from tarot_deck.json — do not hand-edit, regenerate instead.
// 78 cards: 22 Major Arcana, 56 Minor Arcana (4 suits x 14 ranks).

export type Arcana = "major" | "minor";
export type Suit = "wands" | "cups" | "swords" | "pentacles";

export interface TarotCard {
  name: string;
  arcana: Arcana;
  number?: number;      // major arcana only, 0-21
  suit?: Suit;           // minor arcana only
  rank?: string;         // minor arcana only: ace, 2-10, page, knight, queen, king
  upright: string;
  reversed: string;
  image: string;         // filename within assets/cards/
}

export const TAROT_DECK: TarotCard[] = [
  {
    "name": "The Fool",
    "arcana": "major",
    "number": 0,
    "upright": "new beginnings, innocence, spontaneity, a leap of faith",
    "reversed": "recklessness, naivety, a risk not worth taking, holding back",
    "image": "major-00-the-fool.jpg"
  },
  {
    "name": "The Magician",
    "arcana": "major",
    "number": 1,
    "upright": "manifestation, resourcefulness, willpower, having the tools you need",
    "reversed": "manipulation, untapped talent, poor planning",
    "image": "major-01-the-magician.jpg"
  },
  {
    "name": "The High Priestess",
    "arcana": "major",
    "number": 2,
    "upright": "intuition, hidden knowledge, the subconscious, mystery",
    "reversed": "secrets kept too long, disconnection from intuition",
    "image": "major-02-the-high-priestess.jpg"
  },
  {
    "name": "The Empress",
    "arcana": "major",
    "number": 3,
    "upright": "abundance, nurturing, creativity, fertility",
    "reversed": "creative block, dependence, neglect",
    "image": "major-03-the-empress.jpg"
  },
  {
    "name": "The Emperor",
    "arcana": "major",
    "number": 4,
    "upright": "authority, structure, stability, control",
    "reversed": "rigidity, domination, lack of discipline",
    "image": "major-04-the-emperor.jpg"
  },
  {
    "name": "The Hierophant",
    "arcana": "major",
    "number": 5,
    "upright": "tradition, convention, institutions, shared belief",
    "reversed": "rebellion against convention, unconventional paths, breaking with orthodoxy",
    "image": "major-05-the-hierophant.jpg"
  },
  {
    "name": "The Lovers",
    "arcana": "major",
    "number": 6,
    "upright": "connection, alignment of values, a real choice",
    "reversed": "misalignment, a values conflict, indecision",
    "image": "major-06-the-lovers.jpg"
  },
  {
    "name": "The Chariot",
    "arcana": "major",
    "number": 7,
    "upright": "willpower, determination, forward momentum through conflict",
    "reversed": "lack of direction, aggression, loss of control",
    "image": "major-07-the-chariot.jpg"
  },
  {
    "name": "Strength",
    "arcana": "major",
    "number": 8,
    "upright": "courage, patience, quiet inner strength, compassion over force",
    "reversed": "self-doubt, weakness, force overriding patience",
    "image": "major-08-strength.jpg"
  },
  {
    "name": "The Hermit",
    "arcana": "major",
    "number": 9,
    "upright": "introspection, solitude, seeking inner guidance",
    "reversed": "isolation, withdrawal, avoidance disguised as reflection",
    "image": "major-09-the-hermit.jpg"
  },
  {
    "name": "Wheel of Fortune",
    "arcana": "major",
    "number": 10,
    "upright": "cycles, turning points, fate, change outside your control",
    "reversed": "resistance to change, bad timing, a cycle repeating",
    "image": "major-10-wheel-of-fortune.jpg"
  },
  {
    "name": "Justice",
    "arcana": "major",
    "number": 11,
    "upright": "truth, cause and effect, fairness, accountability",
    "reversed": "unfairness, avoiding accountability, an imbalance unaddressed",
    "image": "major-11-justice.jpg"
  },
  {
    "name": "The Hanged Man",
    "arcana": "major",
    "number": 12,
    "upright": "suspension, a new perspective, surrender to a pause",
    "reversed": "stalling, resistance to necessary surrender, martyrdom",
    "image": "major-12-the-hanged-man.jpg"
  },
  {
    "name": "Death",
    "arcana": "major",
    "number": 13,
    "upright": "ending, transformation, letting go to make room for what's next",
    "reversed": "resistance to change, stagnation, fear of the ending",
    "image": "major-13-death.jpg"
  },
  {
    "name": "Temperance",
    "arcana": "major",
    "number": 14,
    "upright": "balance, integration, patience, the middle path",
    "reversed": "imbalance, excess, misalignment of competing needs",
    "image": "major-14-temperance.jpg"
  },
  {
    "name": "The Devil",
    "arcana": "major",
    "number": 15,
    "upright": "bondage, unhealthy attachment, a pattern you can't see you're in",
    "reversed": "breaking free, confronting the attachment, reclaiming agency",
    "image": "major-15-the-devil.jpg"
  },
  {
    "name": "The Tower",
    "arcana": "major",
    "number": 16,
    "upright": "sudden upheaval, revelation, the collapse of a false structure",
    "reversed": "disaster narrowly averted, delayed reckoning, fear of collapse",
    "image": "major-16-the-tower.jpg"
  },
  {
    "name": "The Star",
    "arcana": "major",
    "number": 17,
    "upright": "hope, renewal, quiet faith after a hard stretch",
    "reversed": "despair, disconnection from hope, burnout",
    "image": "major-17-the-star.jpg"
  },
  {
    "name": "The Moon",
    "arcana": "major",
    "number": 18,
    "upright": "uncertainty, illusion, the unconscious surfacing, fear of the unclear",
    "reversed": "releasing a fear, clarity returning, confusion lifting",
    "image": "major-18-the-moon.jpg"
  },
  {
    "name": "The Sun",
    "arcana": "major",
    "number": 19,
    "upright": "clarity, vitality, genuine joy, success",
    "reversed": "temporary clouding of joy, unrealistic optimism",
    "image": "major-19-the-sun.jpg"
  },
  {
    "name": "Judgement",
    "arcana": "major",
    "number": 20,
    "upright": "reckoning, a call to account for the past, rebirth",
    "reversed": "self-doubt, avoiding a necessary reckoning, harsh self-judgment",
    "image": "major-20-judgement.jpg"
  },
  {
    "name": "The World",
    "arcana": "major",
    "number": 21,
    "upright": "completion, integration, a cycle closing well",
    "reversed": "incompletion, a cycle not yet closed, unfinished business",
    "image": "major-21-the-world.jpg"
  },
  {
    "name": "Ace of Wands",
    "arcana": "minor",
    "suit": "wands",
    "rank": "ace",
    "upright": "a spark of new ambition, creative inspiration",
    "reversed": "a false start, delayed inspiration",
    "image": "wands-ace.jpg"
  },
  {
    "name": "Two of Wands",
    "arcana": "minor",
    "suit": "wands",
    "rank": "2",
    "upright": "planning, weighing options, the edge of a decision",
    "reversed": "fear of the unknown, playing it too safe",
    "image": "wands-2.jpg"
  },
  {
    "name": "Three of Wands",
    "arcana": "minor",
    "suit": "wands",
    "rank": "3",
    "upright": "expansion, looking ahead, first results of a plan",
    "reversed": "delays, a plan not yet paying off",
    "image": "wands-3.jpg"
  },
  {
    "name": "Four of Wands",
    "arcana": "minor",
    "suit": "wands",
    "rank": "4",
    "upright": "celebration, a milestone reached, homecoming",
    "reversed": "instability at a moment that should feel settled",
    "image": "wands-4.jpg"
  },
  {
    "name": "Five of Wands",
    "arcana": "minor",
    "suit": "wands",
    "rank": "5",
    "upright": "competition, friction, conflicting approaches",
    "reversed": "avoiding necessary conflict, unresolved tension",
    "image": "wands-5.jpg"
  },
  {
    "name": "Six of Wands",
    "arcana": "minor",
    "suit": "wands",
    "rank": "6",
    "upright": "recognition, a public win, momentum",
    "reversed": "unrecognized effort, a private doubt about a win",
    "image": "wands-6.jpg"
  },
  {
    "name": "Seven of Wands",
    "arcana": "minor",
    "suit": "wands",
    "rank": "7",
    "upright": "defending your position, standing your ground",
    "reversed": "exhaustion from defending too much, giving up ground",
    "image": "wands-7.jpg"
  },
  {
    "name": "Eight of Wands",
    "arcana": "minor",
    "suit": "wands",
    "rank": "8",
    "upright": "fast movement, quick developments, momentum",
    "reversed": "delays, things stalling after moving fast",
    "image": "wands-8.jpg"
  },
  {
    "name": "Nine of Wands",
    "arcana": "minor",
    "suit": "wands",
    "rank": "9",
    "upright": "resilience, guardedness after being tested",
    "reversed": "burnout, over-defensiveness, exhaustion",
    "image": "wands-9.jpg"
  },
  {
    "name": "Ten of Wands",
    "arcana": "minor",
    "suit": "wands",
    "rank": "10",
    "upright": "burden, carrying too much, close to a finish line but overloaded",
    "reversed": "dropping a burden, delegating, admitting you're overextended",
    "image": "wands-10.jpg"
  },
  {
    "name": "Page of Wands",
    "arcana": "minor",
    "suit": "wands",
    "rank": "page",
    "upright": "an early spark, curiosity, a message about a new direction",
    "reversed": "a false start, scattered enthusiasm",
    "image": "wands-page.jpg"
  },
  {
    "name": "Knight of Wands",
    "arcana": "minor",
    "suit": "wands",
    "rank": "knight",
    "upright": "bold action, impulsiveness in pursuit of a goal",
    "reversed": "recklessness, an action taken too fast",
    "image": "wands-knight.jpg"
  },
  {
    "name": "Queen of Wands",
    "arcana": "minor",
    "suit": "wands",
    "rank": "queen",
    "upright": "confidence, warmth, magnetic self-possession",
    "reversed": "insecurity masked as bravado, burnout behind the confidence",
    "image": "wands-queen.jpg"
  },
  {
    "name": "King of Wands",
    "arcana": "minor",
    "suit": "wands",
    "rank": "king",
    "upright": "visionary leadership, bold direction-setting",
    "reversed": "overreach, impulsive leadership, forcing a vision",
    "image": "wands-king.jpg"
  },
  {
    "name": "Ace of Cups",
    "arcana": "minor",
    "suit": "cups",
    "rank": "ace",
    "upright": "new emotional opening, a full heart, the start of real connection",
    "reversed": "emotional block, a closed-off heart",
    "image": "cups-ace.jpg"
  },
  {
    "name": "Two of Cups",
    "arcana": "minor",
    "suit": "cups",
    "rank": "2",
    "upright": "mutual connection, partnership, real reciprocity",
    "reversed": "imbalance in a relationship, a one-sided connection",
    "image": "cups-2.jpg"
  },
  {
    "name": "Three of Cups",
    "arcana": "minor",
    "suit": "cups",
    "rank": "3",
    "upright": "friendship, community, shared celebration",
    "reversed": "overindulgence, a friend group under strain",
    "image": "cups-3.jpg"
  },
  {
    "name": "Four of Cups",
    "arcana": "minor",
    "suit": "cups",
    "rank": "4",
    "upright": "apathy, missing what's already offered, quiet dissatisfaction",
    "reversed": "waking back up to what's in front of you",
    "image": "cups-4.jpg"
  },
  {
    "name": "Five of Cups",
    "arcana": "minor",
    "suit": "cups",
    "rank": "5",
    "upright": "grief, focusing on what's lost over what remains",
    "reversed": "acceptance, beginning to see what's still there",
    "image": "cups-5.jpg"
  },
  {
    "name": "Six of Cups",
    "arcana": "minor",
    "suit": "cups",
    "rank": "6",
    "upright": "nostalgia, the past reaching into the present, innocence",
    "reversed": "being stuck in the past, an old pattern resurfacing",
    "image": "cups-6.jpg"
  },
  {
    "name": "Seven of Cups",
    "arcana": "minor",
    "suit": "cups",
    "rank": "7",
    "upright": "too many options, illusion, wishful thinking",
    "reversed": "clarity cutting through illusion, a real choice finally made",
    "image": "cups-7.jpg"
  },
  {
    "name": "Eight of Cups",
    "arcana": "minor",
    "suit": "cups",
    "rank": "8",
    "upright": "walking away, seeking something deeper, a deliberate departure",
    "reversed": "fear of leaving, staying past the point of diminishing returns",
    "image": "cups-8.jpg"
  },
  {
    "name": "Nine of Cups",
    "arcana": "minor",
    "suit": "cups",
    "rank": "9",
    "upright": "satisfaction, emotional fulfillment, contentment",
    "reversed": "hollow satisfaction, overindulgence without real fulfillment",
    "image": "cups-9.jpg"
  },
  {
    "name": "Ten of Cups",
    "arcana": "minor",
    "suit": "cups",
    "rank": "10",
    "upright": "emotional fulfillment at the family/home level, lasting happiness",
    "reversed": "a fractured version of that ideal, disharmony at home",
    "image": "cups-10.jpg"
  },
  {
    "name": "Page of Cups",
    "arcana": "minor",
    "suit": "cups",
    "rank": "page",
    "upright": "an emotional message, creative sensitivity, an open heart",
    "reversed": "emotional immaturity, a message misread",
    "image": "cups-page.jpg"
  },
  {
    "name": "Knight of Cups",
    "arcana": "minor",
    "suit": "cups",
    "rank": "knight",
    "upright": "following the heart, romantic pursuit, an offer",
    "reversed": "moodiness, unrealistic idealism, disappointment",
    "image": "cups-knight.jpg"
  },
  {
    "name": "Queen of Cups",
    "arcana": "minor",
    "suit": "cups",
    "rank": "queen",
    "upright": "emotional intuition, compassion, deep empathy",
    "reversed": "emotional overwhelm, absorbing others' feelings too much",
    "image": "cups-queen.jpg"
  },
  {
    "name": "King of Cups",
    "arcana": "minor",
    "suit": "cups",
    "rank": "king",
    "upright": "emotional mastery, calm in the face of feeling, steady compassion",
    "reversed": "emotional suppression, moodiness beneath a calm surface",
    "image": "cups-king.jpg"
  },
  {
    "name": "Ace of Swords",
    "arcana": "minor",
    "suit": "swords",
    "rank": "ace",
    "upright": "clarity, a breakthrough idea, cutting truth",
    "reversed": "confusion, a truth avoided",
    "image": "swords-ace.jpg"
  },
  {
    "name": "Two of Swords",
    "arcana": "minor",
    "suit": "swords",
    "rank": "2",
    "upright": "a difficult decision avoided, stalemate, willful blindness",
    "reversed": "the stalemate breaking, a decision finally forced",
    "image": "swords-2.jpg"
  },
  {
    "name": "Three of Swords",
    "arcana": "minor",
    "suit": "swords",
    "rank": "3",
    "upright": "heartbreak, painful truth, grief from betrayal or loss",
    "reversed": "healing beginning, releasing the pain",
    "image": "swords-3.jpg"
  },
  {
    "name": "Four of Swords",
    "arcana": "minor",
    "suit": "swords",
    "rank": "4",
    "upright": "rest, recovery, a necessary pause",
    "reversed": "forced rest, burnout that couldn't be avoided",
    "image": "swords-4.jpg"
  },
  {
    "name": "Five of Swords",
    "arcana": "minor",
    "suit": "swords",
    "rank": "5",
    "upright": "conflict, a hollow win, tension without resolution",
    "reversed": "seeking reconciliation, walking away from a fight not worth winning",
    "image": "swords-5.jpg"
  },
  {
    "name": "Six of Swords",
    "arcana": "minor",
    "suit": "swords",
    "rank": "6",
    "upright": "transition, moving toward calmer waters, leaving difficulty behind",
    "reversed": "resisting a necessary transition, stuck in turmoil",
    "image": "swords-6.jpg"
  },
  {
    "name": "Seven of Swords",
    "arcana": "minor",
    "suit": "swords",
    "rank": "7",
    "upright": "strategy, a lie or evasion, getting away with something",
    "reversed": "a deception surfacing, coming clean",
    "image": "swords-7.jpg"
  },
  {
    "name": "Eight of Swords",
    "arcana": "minor",
    "suit": "swords",
    "rank": "8",
    "upright": "feeling trapped, self-imposed limitation, a bind that's more perceived than real",
    "reversed": "breaking free, recognizing the trap was self-made",
    "image": "swords-8.jpg"
  },
  {
    "name": "Nine of Swords",
    "arcana": "minor",
    "suit": "swords",
    "rank": "9",
    "upright": "anxiety, sleepless worry, catastrophizing",
    "reversed": "the worry easing, facing the fear directly",
    "image": "swords-9.jpg"
  },
  {
    "name": "Ten of Swords",
    "arcana": "minor",
    "suit": "swords",
    "rank": "10",
    "upright": "a painful ending, hitting bottom, betrayal",
    "reversed": "recovery beginning, the worst already over",
    "image": "swords-10.jpg"
  },
  {
    "name": "Page of Swords",
    "arcana": "minor",
    "suit": "swords",
    "rank": "page",
    "upright": "curiosity, a new idea, vigilance",
    "reversed": "gossip, scattered thinking, all talk no follow-through",
    "image": "swords-page.jpg"
  },
  {
    "name": "Knight of Swords",
    "arcana": "minor",
    "suit": "swords",
    "rank": "knight",
    "upright": "fast, decisive action, direct confrontation",
    "reversed": "recklessness, acting before thinking",
    "image": "swords-knight.jpg"
  },
  {
    "name": "Queen of Swords",
    "arcana": "minor",
    "suit": "swords",
    "rank": "queen",
    "upright": "clear-eyed honesty, independence, cutting through illusion",
    "reversed": "coldness, using truth as a weapon",
    "image": "swords-queen.jpg"
  },
  {
    "name": "King of Swords",
    "arcana": "minor",
    "suit": "swords",
    "rank": "king",
    "upright": "intellectual authority, clear judgment, truth applied with discipline",
    "reversed": "rigidity, cold detachment, judgment without compassion",
    "image": "swords-king.jpg"
  },
  {
    "name": "Ace of Pentacles",
    "arcana": "minor",
    "suit": "pentacles",
    "rank": "ace",
    "upright": "a new practical opportunity, a tangible fresh start",
    "reversed": "a missed opportunity, poor foundation",
    "image": "pentacles-ace.jpg"
  },
  {
    "name": "Two of Pentacles",
    "arcana": "minor",
    "suit": "pentacles",
    "rank": "2",
    "upright": "balancing priorities, adaptability under juggling pressure",
    "reversed": "overextension, dropping a ball",
    "image": "pentacles-2.jpg"
  },
  {
    "name": "Three of Pentacles",
    "arcana": "minor",
    "suit": "pentacles",
    "rank": "3",
    "upright": "collaboration, skilled work recognized, building something with others",
    "reversed": "working in isolation, disorganized teamwork",
    "image": "pentacles-3.jpg"
  },
  {
    "name": "Four of Pentacles",
    "arcana": "minor",
    "suit": "pentacles",
    "rank": "4",
    "upright": "security, holding on tightly, conservatism",
    "reversed": "releasing an overly tight grip, fear of scarcity",
    "image": "pentacles-4.jpg"
  },
  {
    "name": "Five of Pentacles",
    "arcana": "minor",
    "suit": "pentacles",
    "rank": "5",
    "upright": "hardship, feeling left out in the cold, material or emotional lack",
    "reversed": "recovery, finding support that was there all along",
    "image": "pentacles-5.jpg"
  },
  {
    "name": "Six of Pentacles",
    "arcana": "minor",
    "suit": "pentacles",
    "rank": "6",
    "upright": "generosity, giving and receiving support, balance of power in exchange",
    "reversed": "an imbalance in giving/receiving, strings attached",
    "image": "pentacles-6.jpg"
  },
  {
    "name": "Seven of Pentacles",
    "arcana": "minor",
    "suit": "pentacles",
    "rank": "7",
    "upright": "patience, assessing progress on a long-term investment",
    "reversed": "impatience, doubting a slow investment",
    "image": "pentacles-7.jpg"
  },
  {
    "name": "Eight of Pentacles",
    "arcana": "minor",
    "suit": "pentacles",
    "rank": "8",
    "upright": "diligence, skill-building, focused craft",
    "reversed": "perfectionism, going through the motions without real investment",
    "image": "pentacles-8.jpg"
  },
  {
    "name": "Nine of Pentacles",
    "arcana": "minor",
    "suit": "pentacles",
    "rank": "9",
    "upright": "self-sufficiency, enjoying the fruits of your own labor",
    "reversed": "overwork, self-sufficiency tipping into isolation",
    "image": "pentacles-9.jpg"
  },
  {
    "name": "Ten of Pentacles",
    "arcana": "minor",
    "suit": "pentacles",
    "rank": "10",
    "upright": "legacy, long-term security, something built to last",
    "reversed": "instability in what should be secure, family/legacy strain",
    "image": "pentacles-10.jpg"
  },
  {
    "name": "Page of Pentacles",
    "arcana": "minor",
    "suit": "pentacles",
    "rank": "page",
    "upright": "a practical new opportunity, studiousness, groundwork",
    "reversed": "a missed practical opportunity, lack of follow-through",
    "image": "pentacles-page.jpg"
  },
  {
    "name": "Knight of Pentacles",
    "arcana": "minor",
    "suit": "pentacles",
    "rank": "knight",
    "upright": "steady, methodical progress, reliability",
    "reversed": "stagnation, being overly cautious to the point of no progress",
    "image": "pentacles-knight.jpg"
  },
  {
    "name": "Queen of Pentacles",
    "arcana": "minor",
    "suit": "pentacles",
    "rank": "queen",
    "upright": "practical nurturing, groundedness, resourcefulness",
    "reversed": "overextension from caretaking, neglecting self for practicality",
    "image": "pentacles-queen.jpg"
  },
  {
    "name": "King of Pentacles",
    "arcana": "minor",
    "suit": "pentacles",
    "rank": "king",
    "upright": "material mastery, steady abundance, reliable leadership",
    "reversed": "overvaluing material security, rigidity around control",
    "image": "pentacles-king.jpg"
  }
];
