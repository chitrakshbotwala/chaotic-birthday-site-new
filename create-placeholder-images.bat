@echo off
echo ======================================================
echo Creating Placeholder Birthday Images
echo ======================================================

set FRIENDS_DIR=public\assets\friends
set PLACEHOLDER_COUNT=6

echo Creating friends directory if it doesn't exist...
if not exist "%FRIENDS_DIR%" mkdir "%FRIENDS_DIR%"

echo Checking for existing images...
set IMG_COUNT=0
for %%F in ("%FRIENDS_DIR%\*.*") do (
  set /a IMG_COUNT+=1
)

echo Found %IMG_COUNT% images in friends directory.

if %IMG_COUNT% GTR 0 (
  echo Images already exist. No placeholders needed.
) else (
  echo No images found. Creating placeholder birthday images...
  
  echo ^<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"^>^<rect width="100%%" height="100%%" fill="purple"/^>^<text x="50%%" y="50%%" text-anchor="middle" fill="white" font-family="Arial" font-size="24"^>Birthday Image 1^</text^>^</svg^> > "%FRIENDS_DIR%\birthday1.svg"
  echo ^<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"^>^<rect width="100%%" height="100%%" fill="pink"/^>^<text x="50%%" y="50%%" text-anchor="middle" fill="black" font-family="Arial" font-size="24"^>Birthday Image 2^</text^>^</svg^> > "%FRIENDS_DIR%\birthday2.svg"
  echo ^<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"^>^<rect width="100%%" height="100%%" fill="blue"/^>^<text x="50%%" y="50%%" text-anchor="middle" fill="white" font-family="Arial" font-size="24"^>Birthday Image 3^</text^>^</svg^> > "%FRIENDS_DIR%\birthday3.svg"
  echo ^<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"^>^<rect width="100%%" height="100%%" fill="green"/^>^<text x="50%%" y="50%%" text-anchor="middle" fill="white" font-family="Arial" font-size="24"^>Birthday Image 4^</text^>^</svg^> > "%FRIENDS_DIR%\birthday4.svg"
  echo ^<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"^>^<rect width="100%%" height="100%%" fill="red"/^>^<text x="50%%" y="50%%" text-anchor="middle" fill="white" font-family="Arial" font-size="24"^>Birthday Image 5^</text^>^</svg^> > "%FRIENDS_DIR%\birthday5.svg"
  echo ^<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"^>^<rect width="100%%" height="100%%" fill="orange"/^>^<text x="50%%" y="50%%" text-anchor="middle" fill="black" font-family="Arial" font-size="24"^>Birthday Image 6^</text^>^</svg^> > "%FRIENDS_DIR%\birthday6.svg"
  
  echo Created %PLACEHOLDER_COUNT% placeholder SVG images in %FRIENDS_DIR%
)

echo.
echo ======================================================
echo Placeholder images are ready! You can:
echo 1. Replace these with actual images in the same folder
echo 2. Keep them for testing the site layout
echo ======================================================
pause 