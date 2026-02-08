# ♔ Chess Master Pro

A modern, premium chess game built with React and TypeScript. Play against friends locally, challenge an AI opponent powered by Stockfish, or enjoy a beautiful responsive design on any device.

![Chess Master Pro](https://img.shields.io/badge/React-19-blue?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript) ![Vite](https://img.shields.io/badge/Vite-7-purple?logo=vite) ![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- 🎮 **Multiple Game Modes** - Local multiplayer, VS AI, Analysis mode
- 🤖 **Smart AI Opponent** - Powered by Stockfish with 4 difficulty levels
- 💾 **Auto-Save** - Games persist automatically, never lose progress
- 🎨 **Beautiful Themes** - 5 board themes including Classic Wood, Marble, and more
- 📱 **Fully Responsive** - Play on desktop, tablet, or mobile
- ⏱️ **Time Controls** - From Bullet (1 min) to Classical (30 min)
- 🔊 **Sound Effects** - Immersive audio feedback for moves
- 🎯 **Move Highlights** - Legal moves, last move, and check indicators
- 🔄 **Drag & Drop** - Intuitive piece movement with touch support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/chess-master-pro.git
cd chess-master-pro

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## 🎮 How to Play

1. Click **"+ New Game"** to start
2. Choose your game mode:
   - **Local** - Play with a friend on the same device
   - **VS AI** - Challenge the computer
   - **Analysis** - Study positions freely
3. Select time control and difficulty (for AI)
4. Make moves by clicking or dragging pieces
5. Use controls to flip board, undo moves, or resign

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI Framework |
| TypeScript | Type Safety |
| Vite 7 | Build Tool |
| Zustand | State Management |
| chess.js | Game Logic |
| react-dnd | Drag & Drop |
| Howler.js | Audio |

## 📁 Project Structure

```
src/
├── components/
│   ├── Board/         # Chess board & squares
│   ├── Pieces/        # Piece rendering
│   ├── GameControls/  # Controls & timer
│   ├── Layout/        # Header & layout
│   └── Modals/        # New game modal
├── store/             # Zustand stores
├── hooks/             # Custom React hooks
├── engine/            # Stockfish integration
├── types/             # TypeScript types
└── styles/            # Global CSS
```

## ⚙️ Configuration

### Board Themes
5 built-in themes: Classic Wood, Marble, Tournament Green, Midnight Blue, Coral

### AI Difficulty Levels
- **Beginner** - Makes frequent mistakes
- **Intermediate** - Reasonable play with occasional errors
- **Advanced** - Strong tactical awareness
- **Grandmaster** - Near-perfect play

## 🚀 Deployment

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Vercel
```bash
npm install -g vercel
vercel --prod
```

### Netlify
Drag & drop the `dist` folder to [netlify.com](https://netlify.com)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [chess.js](https://github.com/jhlywa/chess.js) - Chess move generation and validation
- [Stockfish](https://stockfishchess.org/) - World's strongest chess engine
- [React DnD](https://react-dnd.github.io/react-dnd/) - Drag and drop framework

---

**Made with ♟️ by Chess Master Pro Team**
