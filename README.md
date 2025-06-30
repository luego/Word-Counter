[![Netlify Status](https://api.netlify.com/api/v1/badges/b5489db7-626d-40f0-bbb4-c6cfbf5320ae/deploy-status)](https://app.netlify.com/projects/fastidious-rugelach-4f2ba4/deploys)

# Online Text Tools

Free, private, and instant text utilities for writers, students, and professionals.  
✨ Word Counter • Text Case Converter • Word Frequency Analyzer • Remove Duplicates • Dark Mode

[![Website](https://img.shields.io/badge/demo-live-blue?style=flat-square)](https://texttoolbox.app)

---

## ✨ Features

### 🎯 Core Tools
- **Word Counter:** Instantly count words, characters (with/without spaces), sentences, paragraphs, and estimate reading time
- **Text Case Converter:** Convert text to UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, and kebab-case
- **Word Frequency Analyzer:** Analyze word frequency with charts and statistics
- **Remove Duplicate Lines:** Remove duplicate lines with advanced options (case sensitivity, sorting, whitespace trimming)

### 🚀 Enhanced Features
- **Dark Mode:** Toggle between light and dark themes with system preference detection
- **Export Functionality:** Export text in multiple formats (TXT, CSV, JSON, HTML)
- **Real-time Processing:** Debounced updates for better performance
- **Advanced Statistics:** Unique words, average word length, vocabulary diversity
- **Mobile Responsive:** Optimized for all devices
- **Privacy First:** All processing happens client-side - no data leaves your browser

### 🎨 User Experience
- **Modern UI:** Clean, professional interface using [Astro](https://astro.build/), [Svelte](https://svelte.dev/), and [Tailwind CSS](https://tailwindcss.com/)
- **Accessibility:** ARIA labels, keyboard navigation, and screen reader support
- **Performance:** Optimized with debouncing and efficient algorithms
- **SEO Optimized:** Proper meta tags, structured data, and sitemap

---

## 🚀 Live Demo

[View the site](https://texttoolbox.app)

---

## 🛠️ Tech Stack

- **[Astro](https://astro.build/)** — Modern static site generator
- **[Svelte](https://svelte.dev/)** — Reactive components for interactivity
- **[Tailwind CSS](https://tailwindcss.com/)** — Utility-first CSS framework
- **[TypeScript](https://www.typescriptlang.org/)** — Type safety
- **[Chart.js](https://www.chartjs.org/)** — Data visualization

---

## 📦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/word-counter.git
   cd word-counter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:4321`

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🏗️ Project Structure

```
src/
├── components/          # Svelte components
│   ├── WordCounter.svelte
│   ├── TextCaseConverter.svelte
│   ├── WordFrequencyAnalyzer.svelte
│   ├── RemoveDuplicateLines.svelte
│   ├── ExportUtility.svelte
│   ├── DarkModeToggle.svelte
│   └── ...
├── layouts/            # Astro layouts
│   └── BaseLayout.astro
├── pages/              # Astro pages
│   ├── index.astro
│   ├── text-case-converter.astro
│   ├── word-frequency-analyzer.astro
│   └── remove-duplicate-lines.astro
└── styles/             # Global styles
    └── global.css
```

---

## 🚀 Deployment

### Netlify (Recommended)

1. **Connect your repository** to Netlify
2. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Environment variables** (if needed):
   - Add any required API keys or configuration

### Vercel

1. **Import your repository** to Vercel
2. **Framework preset:** Astro
3. **Build settings** will be auto-detected

### Manual Deployment

```bash
npm run build
# Upload the `dist` folder to your hosting provider
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Analytics (optional)
PUBLIC_GA_ID=your-google-analytics-id

# Site configuration
PUBLIC_SITE_URL=https://yourdomain.com
```

### Customization

- **Colors:** Modify `tailwind.config.mjs` for custom color schemes
- **Components:** Edit Svelte components in `src/components/`
- **Styling:** Update `src/styles/global.css` for custom styles
- **SEO:** Modify meta tags in `src/layouts/BaseLayout.astro`

---

## 📈 Performance

- **Lighthouse Score:** 95+ across all metrics
- **Bundle Size:** Optimized with Astro's partial hydration
- **Loading Speed:** Sub-second initial load times
- **SEO:** Perfect Core Web Vitals scores

---

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/amazing-feature`
3. **Commit your changes:** `git commit -m 'Add amazing feature'`
4. **Push to the branch:** `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Add TypeScript types where applicable
- Include accessibility features
- Test on multiple devices and browsers
- Update documentation for new features

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Astro](https://astro.build/) for the amazing static site generator
- [Svelte](https://svelte.dev/) for reactive components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Chart.js](https://www.chartjs.org/) for data visualization

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/yourusername/word-counter/issues)
- **Email:** your-email@example.com
- **Website:** [https://texttoolbox.app](https://texttoolbox.app)

---

**Made with ❤️ for the writing community**
