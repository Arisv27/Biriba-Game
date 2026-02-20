# BIRIBA Card Game

A web-based implementation of the traditional Greek card game BIRIBA, built with HTML, CSS, and JavaScript. This game supports 4 players with turn-based gameplay, team-based biribaki system, meld creation, and authentic BIRIBA scoring rules.

## Table of Contents

- [Game Overview](#game-overview)
- [Features](#features)
- [How to Play](#how-to-play)
- [Game Rules](#game-rules)
- [Biribaki System](#biribaki-system)
- [Scoring System](#scoring-system)
- [Installation](#installation)
- [Game Controls](#game-controls)
- [Technical Details](#technical-details)
- [File Structure](#file-structure)

## Game Overview

BIRIBA is a popular Greek card game similar to Canasta, played with two standard 52-card decks plus 4 jokers (108 cards total). Players form teams and compete to create melds (runs and sets) to score points. The game features strategic gameplay with wild cards, clean vs dirty melds, team biribaki system, and special BIRIBA bonuses.

## Features

### Player Selection & Login System
- **Enhanced Login Screen**: Choose your player position (1-4) before starting
- **Three-State Seat Management**: 
  - Available seats show "Join" button
  - Your seat shows "Leave Seat" button
  - Taken seats show "Seat is Taken" (multiplayer-ready)
- **Seat Conflict Prevention**: Cannot join already occupied seats
- **Flexible Seat Switching**: Leave current seat to join a different one
- **Start Game Control**: Begin game once player position is selected

### Core Gameplay
- **4-Player Turn-Based System**: Strict turn enforcement with visual indicators
- **Team Play**: Team 1 (Players 1 & 3) vs Team 2 (Players 2 & 4)
- **Multiple Player Perspectives**: Switch between any player's view during game
- **Authentic Card Deck**: 108 cards (2 standard decks + 4 jokers)
- **Visual Turn Indicators**: Glowing player names show whose turn it is
- **Turn-Based Restrictions**: Stock pile and all actions restricted to current player

### Biribaki System
- **Team Biribaki**: Each team gets 11 cards set aside at game start
- **Automatic Distribution**: Biribaki given when player's hand becomes empty
- **Post-Biribaki Restrictions**: Must keep 2+ cards unless creating BIRIBA
- **Game Ending**: Teams need BIRIBA meld to go out after receiving biribaki
- **Victory Conditions**: +100 bonus to winning team, -100 penalty if opposing team hasn't received biribaki

### Meld System
- **Runs**: Consecutive cards of the same suit (minimum 3 cards)
- **Sets**: Cards of the same rank (minimum 3 cards)
- **Wild Cards**: 2s and Jokers can substitute for other cards
- **Meld Extension**: Add cards to existing team melds (team ownership enforced)
- **Clean vs Dirty**: Melds with/without wild cards
- **One Wild Limit**: Maximum one wild card per meld

### Advanced Features
- **BIRIBA Bonuses**: Special scoring for 7+ card melds
- **Atou (Trump) Suit**: Determined by first discarded card
- **Complex 2s Logic**: 2s can be natural or wild depending on context
- **Special Two-2s Algorithm**: 7-step process for handling exactly two 2s in runs
- **Ace-2-Wild Pattern**: Special handling for A-2-[wild] combinations
- **Drag & Drop Interface**: Intuitive card movement with turn validation
- **Card Sorting**: Sort by rank or suit
- **Discard Pile History**: View all previously discarded cards

### User Interface
- **Responsive Design**: Works on desktop and mobile
- **Card Picker Sidebar**: Add any card to test hands (development feature)
- **Visual Feedback**: Hover effects, selection states, drag indicators
- **Game Controls**: New game, sort options, meld creation buttons
- **Real-Time Score Tracking**: Team scores with bonuses and penalties
- **Turn Phase Indicators**: Visual feedback for draw/meld/discard phases

## How to Play

### Game Setup
1. Open `index.html` in a web browser
2. **Player Selection**: Choose your player position (1-4) from the login screen
3. Click "Start Game as Player X" to begin
4. Game automatically deals 11 cards to each player
5. Sets aside 11 biribaki cards for each team
6. First card is flipped to discard pile (determines Atou suit)

### Turn Sequence
Each turn consists of three strict phases:

1. **Draw Phase**: Current player MUST draw a card
   - Draw from stock pile (click stock pile)
   - OR pick up entire discard pile (click discard pile)
   - Cannot proceed without drawing

2. **Meld Phase** (Optional): Player can create or extend melds
   - Create runs or sets from hand
   - Extend existing team melds
   - Must have drawn a card first

3. **Discard Phase**: Player MUST discard one card to end turn
   - Drag card to discard pile
   - Turn automatically advances to next player
   - Must have drawn a card first

### Creating Melds

#### Runs (Sequences)
- Minimum 3 consecutive cards of same suit
- Example: 5♠-6♠-7♠ or A♥-2♥-3♥
- Can use wild cards (2s or Jokers) to fill gaps
- **Only one wild card per run allowed**
- Supports both LOW (A=1) and HIGH (A=14) orientations

#### Sets (Same Rank)
- Minimum 3 cards of same rank
- Example: 8♠-8♥-8♦ or K♣-K♠-K♥
- Can use wild cards to complete sets
- **Only one wild card per set allowed**

### Wild Cards
- **Jokers**: Always wild
- **2s**: Wild unless they sit naturally in a sequence
- **Natural 2s**: 2s that form A-2-3 or 2-3-4+ sequences in their own suit
- **Two 2s Special Case**: Complex 7-step algorithm determines natural vs wild

## Game Rules

### Turn Restrictions
- **Strict Turn Enforcement**: Players can only act during their turn
- **Draw Requirement**: Must draw before creating melds or discarding
- **No Turn Skipping**: Cannot skip turns or act out of sequence
- **Visual Prevention**: Interface prevents invalid actions with clear feedback

### Meld Rules
- **Minimum Size**: 3 cards per meld
- **Wild Card Limit**: Only one wild card per meld
- **Team Ownership**: Can only extend your team's melds
- **Clean vs Dirty**: Clean melds (no wilds) score higher than dirty melds

### Special Cases
- **Two 2s in a Run**: 7-step algorithm determines which 2 is natural vs wild
- **Ace-2-Wild Pattern**: Special handling for A-2-[wild] combinations
- **BIRIBA**: 7+ card melds receive significant bonus points
- **Turn Validation**: All actions validated against current turn and phase

## Biribaki System

### Team Biribaki Setup
- **Initial Distribution**: 11 cards set aside for each team at game start
- **Team Assignment**: Team 1 (Players 1 & 3), Team 2 (Players 2 & 4)
- **Automatic Tracking**: System tracks which teams have received biribaki

### Biribaki Distribution
- **Trigger**: When any player's hand becomes completely empty
- **Automatic**: System automatically gives team's biribaki to the player
- **One Per Team**: Each team can only receive their biribaki once
- **Notification**: Clear popup notification when biribaki is received

### Post-Biribaki Rules
- **Meld Restrictions**: After receiving biribaki, must keep 2+ cards in hand
- **BIRIBA Exception**: Can go down to 1 or 0 cards only when creating BIRIBA (7+ cards)
- **Game Ending**: Team must have at least one BIRIBA meld to end the game
- **Victory Validation**: System prevents invalid game endings

### Scoring Impact
- **Victory Bonus**: +100 points to winning team
- **Biribaki Penalty**: -100 points to opposing team if they haven't received biribaki
- **Final Scores**: Automatically calculated with all bonuses and penalties

## Scoring System

### Card Values
- **Jokers**: 30 points
- **2s**: 20 points
- **Aces**: 15 points
- **K, Q, J, 10, 9, 8**: 10 points
- **7, 6, 5, 4, 3**: 5 points

### Meld Bonuses
- **Clean BIRIBA (7+ cards, no wilds)**: +200 points
- **Dirty BIRIBA (7+ cards, with wilds)**: +100 points
- **Clean 13-card run**: +1000 points
- **Dirty 13-card run**: +500 points

### Atou (Trump) Bonuses
- **Clean Atou BIRIBA**: +400 points total (200 base + 200 bonus)
- **Dirty Atou BIRIBA**: +200 points total (100 base + 100 bonus)
- **Clean Atou 13-card run**: +2000 points total
- **Dirty Atou 13-card run**: +1000 points total

### Game End Bonuses
- **Victory Bonus**: +100 points to winning team
- **Biribaki Penalty**: -100 points if opposing team hasn't received biribaki

## Installation

### Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software required

### Setup
1. Download or clone the repository
2. Ensure all files are in the same directory:
   - `index.html` (main game file)
   - `cards/` folder with all card images
3. Open `index.html` in your web browser
4. Select your player position from the login screen
5. Click "Start Game" to begin playing!

### Optional Files
- `test-*.html`: Testing interfaces for game mechanics
- `public/`: Alternative server-based setup files

## Game Controls

### Login Screen
- **Player Slots**: Click "Join" to select your position (1-4)
- **Leave Seat**: Click "Leave Seat" to change your selection
- **Start Game**: Begin the game once you've selected a position

### Sidebar Controls
- **🎴 Toggle Button**: Open/close card picker sidebar
- **Player View Buttons**: Switch between player perspectives during game
- **Card Picker**: Add any card to current player's hand (development/testing feature)
- **Clear Hand**: Remove all cards from current player's hand
- **Discard History**: View all previously discarded cards

### Hand Controls
- **Sort Button**: Toggle between rank and suit sorting
- **Create Run**: Form a sequence from selected cards
- **Create Set**: Form a same-rank group from selected cards
- **Extend Meld**: Add cards to existing team melds

### Card Interactions
- **Click**: Select/deselect cards in your hand
- **Drag & Drop**: Drag cards to discard pile (only during your turn)
- **Hover**: Preview card details and visual feedback

### Game Controls
- **New Game**: Reset and deal new hands with fresh biribaki
- **Stock Pile**: Click to draw card (only during your turn)
- **Discard Pile**: Click to pick up all discarded cards (only during your turn)
- **View All**: See complete discard pile history

## Technical Details

### Architecture
- **Single-page application** built with vanilla JavaScript
- **No external dependencies** - runs entirely in browser
- **Responsive CSS** with mobile support
- **Modular JavaScript** with clear separation of concerns

### Key Components
- **Enhanced Login System**: Three-state seat management for multiplayer
- **Game State Management**: Centralized state tracking with team biribaki
- **Strict Turn System**: Turn-based validation for all player actions
- **Advanced Meld Logic**: Complex algorithms for run/set validation including two-2s handling
- **Card Management**: Drag & drop, selection, sorting with turn restrictions
- **Visual Feedback**: Animations, hover effects, turn indicators, phase validation

### Game State Features
- **Multi-Player Hand Management**: Tracks all 4 player hands simultaneously
- **Team Biribaki Tracking**: Automatic distribution and restriction enforcement
- **Turn Phase Management**: Draw/Meld/Discard phase validation
- **Meld Ownership**: Team-based meld extension permissions
- **Score Calculation**: Real-time team scoring with bonuses and penalties

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Performance
- Optimized for smooth gameplay with 4 players
- Efficient DOM manipulation and state updates
- Minimal memory footprint
- Fast card image loading with cropped variants

## File Structure

```
BIRIBA/
├── index.html              # Main game file (HTML + CSS + JavaScript)
├── test-*.html            # Testing interfaces for various game mechanics
├── README.md              # This comprehensive documentation
├── package.json           # Project metadata
├── server.js              # Optional server setup
├── public/                # Alternative server-based files
│   ├── index.html
│   └── game.html
└── cards/                 # Card image assets (108 cards + extras)
    ├── 2_of_clubs.png
    ├── 2_of_clubs_cropped.png
    ├── 3_of_diamonds.png
    ├── 3_of_diamonds_cropped.png
    ├── ...                # All standard cards with cropped variants
    ├── ace_of_spades.png
    ├── ace_of_spades_cropped.png
    ├── jack_of_hearts2.png    # Second deck face card variants
    ├── queen_of_spades2.png
    ├── king_of_diamonds2.png
    ├── red_joker.png
    ├── black_joker.png
    ├── back_of_card.png
    └── biriba_background.png
```

### Card Images
- **Full Images**: Used for bottom cards in meld stacks and single cards
- **Cropped Images**: Used for overlapping cards in meld stacks
- **Two Deck Variants**: Face cards have alternate versions for second deck
- **Jokers**: Red and black joker variants (4 total)
- **Special Assets**: Card backs and background images

## Development Notes

### Key Algorithms
- **Enhanced Login System**: Three-state seat management with conflict prevention
- **Two 2s Handling**: 7-step algorithm for determining natural vs wild 2s in runs
- **Run Validation**: Supports both LOW (A=1) and HIGH (A=14) orientations
- **Wild Card Logic**: Context-sensitive wild card detection
- **Turn Management**: Strict phase-based turn progression with validation
- **Biribaki System**: Automatic team-based distribution and restriction enforcement

### Game State Management
The game maintains comprehensive state including:
- **All Player Data**: 4 player hands with centralized management
- **Turn System**: Current turn, turn order, and turn phases
- **Team Biribaki**: Separate biribaki for each team with distribution tracking
- **Meld Ownership**: Track which player/team created each meld
- **Score Calculations**: Real-time team scoring with all bonuses
- **Discard History**: Complete pile history with visual display

### Recent Enhancements
- **Enhanced Seat Management**: Multiplayer-ready login system
- **Biribaki Restrictions**: Post-biribaki meld validation
- **Turn-Based Stock Pile**: Prevents out-of-turn card drawing
- **Team Meld Extensions**: Only allow extending your team's melds
- **Victory Validation**: Proper game ending with BIRIBA requirements

### Future Enhancements
- Network multiplayer support with real seat management
- AI opponents with strategic gameplay
- Tournament mode with multiple rounds
- Advanced statistics and game history
- Sound effects and enhanced animations
- Mobile app version

---

**Enjoy playing BIRIBA!** 🎴

For questions or issues, please refer to the game's interactive help system or examine the well-commented source code in `index.html`. The game includes comprehensive turn validation, visual feedback, and popup messages to guide players through proper BIRIBA gameplay.
