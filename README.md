# SECE43 Cloud Security Quiz

A static quiz site for the Virtualization and Cloud Security question bank: four 20-question lecture quizzes and an 80-question full exam. Built with React, Vite and Tailwind CSS. No backend, no accounts. Each visitor's progress is kept in their own browser's local storage.

## Run locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Production build (outputs to `dist/`):

```bash
npm run build
npm run preview
```

## Deploy and get a public link

Pick one of the three options below. All are free.

### Option A: Netlify Drop (fastest, no Git needed)

1. Run `npm install` and `npm run build` on your computer.
2. Go to https://app.netlify.com/drop and sign in.
3. Drag the `dist` folder onto the page.
4. Netlify gives you a link such as `https://random-name.netlify.app`. Rename it under Site configuration → Change site name.

### Option B: GitHub Pages (automatic deploys)

1. Create a new public repository on GitHub, for example `cloud-security-quiz`.
2. Upload this whole project folder to it (or push it with Git):
   ```bash
   git init
   git add .
   git commit -m "Cloud security quiz"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/cloud-security-quiz.git
   git push -u origin main
   ```
3. In the repository, open Settings → Pages and set Source to **GitHub Actions**.
4. The included workflow (`.github/workflows/deploy.yml`) builds and publishes the site on every push to `main`. Watch it in the Actions tab.
5. Your link is `https://YOUR-USERNAME.github.io/cloud-security-quiz/`.

### Option C: Vercel

1. Push the project to a GitHub repository (steps 1–2 above).
2. Go to https://vercel.com/new, import the repository and click Deploy. Settings are read from `vercel.json`.
3. Your link is `https://your-project.vercel.app`.

Netlify can also deploy from GitHub: New site → Import from Git; `netlify.toml` already sets the build command and output folder.

## Project structure

```
src/
  data/questions.json      80 questions, options and answer key from the question bank
  lib/quiz.js              quiz definitions and grading
  lib/storage.js           local storage helpers
  components/
    Header.jsx             top bar with theme toggle
    Home.jsx               quiz selection
    Quiz.jsx               question view, progress, submit and restart dialogs
    AnswerOption.jsx       answer button
    QuestionNavigator.jsx  jump-to-question grid
    ConfirmDialog.jsx      confirmation dialog
    Results.jsx            score summary and answer review
    ReviewItem.jsx         one reviewed question
    Icons.jsx              inline SVG icons
  App.jsx
  main.jsx
  index.css
```

The site uses relative asset paths (`base: './'`), so it works at a domain root or in a GitHub Pages subfolder without changes.
