@echo off
echo ======================================================
echo Building Birthday Site for Production Deployment
echo ======================================================

echo Installing dependencies...
npm install --include=dev --no-audit

echo Creating placeholder folders and images...
mkdir public\assets\sounds 2>nul
mkdir public\assets\friends 2>nul

call create-placeholder-images.bat

echo Running linter...
npm run lint --fix

echo Building for production...
npm run build

echo Production build completed!
echo ======================================================
echo To start the production server, run: npm run start
echo To view the website, open: http://localhost:3000
echo.
echo FEATURES:
echo - Hidden YouTube Birthday Song player for background music
echo - Placeholder images generated automatically
echo - Performance optimizations for smoother experience
echo ====================================================== 