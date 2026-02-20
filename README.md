Biriba Multiplayer Game
=======================

Real time multiplayer implementation of the traditional Greek card game Biriba built with Node.js, Express, and Socket.IO.

Supports four player turn based gameplay, team scoring, spectator mode, and full rule enforcement including meld validation and synchronized state updates over WebSockets.

Demonstrates server authoritative multiplayer architecture, real time event handling, and structured backend game logic.

Features
--------

*   Four player seat management
    
*   Host controlled game start
    
*   Spectator mode with live updates
    
*   Real time multiplayer using Socket.IO
    
*   Server side validation of all game actions
    
*   Meld creation and extension logic
    
*   Biribaki distribution and tracking
    
*   Chat system with typing indicators
    
*   State checksum broadcasting for consistency validation
    
*   Automatic host reassignment on disconnect
    

Architecture
------------

The application follows a server authoritative model:

*   Server manages room state and seat assignment
    
*   Only seated players can perform actions
    
*   Host initializes and controls game start
    
*   All actions validated server side before broadcasting
    
*   State synchronization ensures consistency across clients
    

Game rooms are abstracted through a GameRoom class responsible for:

*   Seat occupancy
    
*   Player name tracking
    
*   Host assignment
    
*   Spectator management
    
*   Room lifecycle cleanup
    

All multiplayer communication is handled through WebSockets using Socket.IO.

Tech Stack
----------

### Backend

*   Node.js
    
*   Express
    
*   Socket.IO
    

### Frontend

*   Vanilla JavaScript
    
*   HTML
    
*   CSS
    

Installation
------------

Clone the repository and install dependencies:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   npm install   `

Running Locally
---------------

Start the server:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   node server.js   `

Open your browser at:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   http://localhost:3000   `

To simulate multiplayer, open multiple browser tabs or devices on the same network.

Engineering Challenges
----------------------

*   Real time synchronization across multiple clients
    
*   Handling host reassignment on disconnect
    
*   Validating complex meld and discard rules server side
    
*   Maintaining consistent shared state
    
*   Designing scalable room and seat management logic
    

Future Improvements
-------------------

*   User authentication
    
*   Persistent game state with database integration
    
*   Cloud deployment
    
*   Support for multiple concurrent rooms
    
*   Match history and leaderboard system
