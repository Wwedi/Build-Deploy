# VibeTunes - Retro Neon Music Player 🎵

![VibeTunes](https://img.shields.io/badge/VibeTunes-Retro_Neon_Player-ff00cc?style=for-the-badge&logo=music&logoColor=white)
![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

A stunning retro neon glassmorphic music player that brings your favorite tracks to life with vibrant visuals and smooth interactions. Experience music like never before with this modern web-based audio player.

## ✨ Features

### 🎨 Visual Design
- **Retro Neon Aesthetics**: Vibrant gradient borders and neon glow effects
- **Glassmorphic UI**: Frosted glass containers with backdrop blur
- **Responsive Design**: Perfect experience across all devices
- **Smooth Animations**: Hover effects and transition animations

### 🎵 Music Features
- **Real-time Audio Playback**: Play 30-second previews from Deezer API
- **Progress Control**: Interactive seek bar with real-time updates
- **Playback Controls**: Play, pause, next, previous with keyboard shortcuts
- **Smart Search**: Find songs and artists with instant search results
- **Favorites System**: Save your favorite tracks with local storage
- **Recently Played**: Automatic tracking of your listening history

### ⌨️ User Experience
- **Keyboard Controls**: 
  - `Space` - Play/Pause
  - `→` - Next Song
  - `←` - Previous Song
- **Interactive Elements**: Clickable progress bar for seeking
- **Loading States**: Beautiful spinners during API calls

## 🚀 Quick Start

### Prerequisites
- Modern web browser with JavaScript enabled
- Internet connection for Deezer API access

### Installation
1. Clone the repository:
```bash
git clone https://github.com/yourusername/vibetunes.git
```

2. Navigate to the project directory:
```bash
cd vibetunes
```

3. Open `index.html` in your browser or serve with a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .
```

## 📁 Project Structure

```
vibetunes/
├── index.html          # Main HTML structure
├── index.css           # Retro neon glassmorphic styles
├── index.js            # Music player functionality
└── README.md          # Project documentation
```

## 🎯 Usage

### Basic Controls
1. **Play/Pause**: Click the center play button or press `Space`
2. **Next/Previous**: Use side buttons or arrow keys
3. **Search**: Type in the search bar to find new music
4. **Favorites**: Click the heart icon to save songs
5. **Seek**: Click anywhere on the progress bar to jump

### Searching Music
- Type any artist name or song title
- Results update in real-time as you type
- Unlimited search capabilities via Deezer API

### Managing Your Music
- **Favorites**: Persist across browser sessions
- **Recently Played**: Automatically tracks last 5 played songs
- **Active Track**: Visually highlights currently playing song

## 🔧 Technical Details

### APIs Used
- **Deezer Search API**: For song data and 30-second previews
- **CORS Proxy**: To handle cross-origin requests

### Browser Storage
- **localStorage**: Saves favorites and recently played lists
- **Session Management**: Maintains player state

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🎨 Customization

### Color Scheme
The app uses a vibrant neon color palette:
- Primary: `#ff00cc` (Pink)
- Secondary: `#3333ff` (Blue)
- Background: Gradient from `#0f0c29` to `#302b63`

### Adding Custom Styles
Modify `index.css` to customize:
```css
/* Change main gradient */
.glass-container::before {
  background: linear-gradient(45deg, #your-color-1, #your-color-2);
}
```

## 🤝 Contributing

We welcome contributions! Please feel free to submit pull requests or open issues for:
- Bug fixes
- New features
- Performance improvements
- Documentation updates

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Deezer API** for providing song data and previews
- **Unsplash** for beautiful album cover placeholders
- **Font Awesome** for elegant icons
- **Modern CSS** for glassmorphism and neon effects

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](../../issues) page
2. Create a new issue with detailed description
3. Include browser version and steps to reproduce

---

**Experience music in a new light with VibeTunes** ✨

---

# Project Specification: VibeTunes Music Player

## Project Overview
**VibeTunes** is a modern web-based music player that combines retro neon aesthetics with contemporary music streaming functionality. The application provides users with an immersive audio experience through its visually striking interface and robust playback features.

## Core Objectives
- Create an engaging, visually appealing music player interface
- Provide seamless music playback with real-time controls
- Implement efficient song discovery through search functionality
- Offer personalized music experience with favorites and history

## Technical Specifications

### Frontend Stack
- **HTML5**: Semantic structure and audio element
- **CSS3**: Advanced styling with glassmorphism, gradients, and animations
- **Vanilla JavaScript**: DOM manipulation and API integration

### External Dependencies
- Deezer Search API (music data and previews)
- Font Awesome CDN (icons)
- CORS proxy service (API request handling)

### Key Features Implemented
1. **Audio Playback System**
   - Play/Pause functionality
   - Next/Previous track navigation
   - Progress bar with seeking capability
   - Real-time time updates

2. **Music Discovery**
   - Real-time search with Deezer API
   - Unlimited artist and song search
   - Dynamic results loading

3. **User Personalization**
   - Favorites management with localStorage
   - Recently played tracking
   - Persistent user preferences

4. **Enhanced UX**
   - Keyboard shortcuts
   - Responsive design
   - Loading states and error handling
   - Visual feedback for interactions

## Performance Requirements
- Load time under 3 seconds on average connections
- Smooth animations at 60fps
- Responsive to user interactions within 100ms
- Efficient API calls with debounced search

## Browser Compatibility
- Support for modern evergreen browsers
- Mobile-responsive design
- Touch-friendly interface elements

## Future Enhancements
- Playlist creation and management
- Audio visualization
- Social features (sharing, collaborative playlists)
- Offline playback capability
- Theme customization options

## Success Metrics
- User engagement (time spent in app)
- Feature usage statistics
- Cross-browser compatibility
- Mobile responsiveness
- API reliability and performance

---

**Project Status**: ✅ Complete & Functional  
**Last Updated**: December 2024  
**Maintainer**: VibeTunes Development Team