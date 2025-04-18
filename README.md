# 🐻‍❄️ Chaotic Gen Z Birthday Website

A chaotic, overstimulating birthday website featuring polar bears, memes, and random jump scares for your friend who loves polar bears and brainrot memes.

## 🎂 Features

- Chaotic Gen Z aesthetic with neon colors and animations
- Random image gallery with your friend's photos and internet memes
- Polar bear images fetched from the internet
- Unpredictable jump scares with sound effects
- Gen Z meme captions overlaid on images
- Interactive elements with meme sounds
- Emoji rain and confetti effects
- Story mode option for a more narrative experience

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone this repository:
```bash
git clone <your-repo-url>
cd chaotic-birthday-site-new
```

2. Install dependencies:
```bash
npm install
# or 
yarn install
```

3. Add your friend's images:
   - Place your friend's images in the `public/assets/friends` folder
   - Name them with sequential numbers (e.g., `friend-0.jpg`, `friend-1.jpg`, etc.)

4. Optional: Add custom jump scare images and sounds:
   - Add jump scare images to `public/assets/jumpscares` 
   - Add sound effects to `public/assets/sounds`

5. Start the development server:
```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 🎨 Customization

### Adding More Images of Your Friend

1. Add jpg/png images to the `public/assets/friends` folder
2. Make sure to name them with sequential numbers (e.g., `friend-0.jpg`, `friend-1.jpg`, etc.)
3. Update the `getFriendImages` function in `src/utils/imageUtils.ts` if you add more than 5 images

### Adding Custom Jump Scare Images

1. Add images to the `public/assets/jumpscares` folder
2. Update the `jumpScareImages` array in the `getJumpScareImages` function in `src/utils/imageUtils.ts`

### Adding Custom Sound Effects

1. Add mp3 files to the `public/assets/sounds` folder
2. Update the `sounds` object in `src/utils/soundUtils.ts` to include your new sounds

### Customizing Gen Z Captions

Edit the `memeCaptions` object in `src/utils/imageUtils.ts` to add your own Gen Z captions.

### Changing Jump Scare Frequency

Modify the `defaultJumpScareConfig` object in `src/utils/jumpscareUtils.ts`:
- Adjust `minDelay` and `maxDelay` to change timing
- Adjust `chance` to change the probability (0-1)

## 🌐 Adding More Internet Image Sources

Want to add more internet image sources? Here's how:

1. Create a new function in `src/utils/imageUtils.ts` similar to `getMemeImages` or `getPolarBearImages`
2. Use axios to fetch from a public API that provides images
3. Format the response to match the `ImageItem` interface
4. Add your new image source to the `fetchAllImages` function in `src/app/page.tsx`

### Example: Adding TikTok-style Images

```typescript
// In src/utils/imageUtils.ts
export const getTikTokImages = async (count: number = 5): Promise<ImageItem[]> => {
  try {
    // Replace with an actual TikTok-related API
    const response = await axios.get('https://some-tiktok-api.com/images');
    
    return response.data.map((item: any) => ({
      id: item.id,
      url: item.image_url,
      type: 'tiktok',
      caption: getRandomCaption('meme'), // Reuse meme captions or create a new category
    }));
  } catch (error) {
    console.error('Error fetching TikTok images:', error);
    // Fallback to placeholder images
    return Array(count).fill(null).map((_, i) => ({
      id: `fallback-tiktok-${i}`,
      url: `https://picsum.photos/800/600?random=${i + 100}`,
      type: 'tiktok',
      caption: getRandomCaption('meme'),
    }));
  }
};
```

Then add this to your image loading in `page.tsx`.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/) - React framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Howler.js](https://howlerjs.com/) - Audio library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Unsplash](https://unsplash.com/) - Free images
- [meme-api.com](https://meme-api.com/) - Meme API

Enjoy creating a chaotic birthday experience for your friend! 💖
