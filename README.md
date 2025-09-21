# KalaShetra 🎨
*Where every thread tells a story, and AI helps the world listen*

<div align="center">
  <img src="public/logo.png" alt="KalaShetra Logo" width="200" height="200">
  
  **A love letter to artisans everywhere - helping you share your craft with the world**
</div>

---

## The Story Behind KalaShetra 💫

Picture this: Meera, a 65-year-old weaver from a small village in Rajasthan, creates the most stunning block-printed fabrics you've ever seen. Her hands hold 40 years of wisdom, passed down from her mother and grandmother. But when tourists visit her village, she struggles to explain her craft in English. Her beautiful work often goes unnoticed because she can't tell its story.

That's exactly why we built KalaShetra.

**KalaShetra** (meaning "House of Arts" in Sanskrit) is our attempt to bridge this gap. We're using AI not to replace the human touch, but to amplify the human story. Every artisan deserves to have their craft celebrated, their techniques understood, and their cultural heritage preserved.

This isn't just another marketplace - it's a storytelling platform where technology serves tradition.

## What We've Built For You 🛠️

### If You're an Artisan Like Meera 👩‍🎨

**Think of us as your digital storytelling companion:**

🗣️ **"I don't know how to write in English"**  
*No problem! Just tell us about your craft in your own words, and our AI will help you create beautiful product descriptions that capture the soul of your work.*

🌍 **"I want people from other states to understand my art"**  
*We'll translate your stories into Hindi, Tamil, Telugu, and English - so your craft can speak to hearts across India and beyond.*

📱 **"I don't know what to post on Instagram"**  
*Our AI creates ready-to-post social media content that showcases your work beautifully. Just copy, paste, and watch the likes roll in!*

💰 **"Am I charging the right price?"**  
*Get AI-powered pricing suggestions based on your materials, time invested, and the uniqueness of your craft. No more second-guessing your worth.*

🎵 **"I wish customers could hear the passion in my voice"**  
*Turn your product descriptions into voice narrations. Let customers hear the love and tradition in every word.*

**The Simple Process:**
1. Upload photos of your beautiful work
2. Tell us the basic details (we keep it simple!)
3. Let AI enhance your story with cultural context and beautiful language
4. Set your price and go live to the world

### If You Love Handmade Crafts 🛍️

**We've created something special for you too:**

🎧 **Listen to the artisan's story** - Every product has a voice narration where you can hear about the techniques, traditions, and love that went into creating it.

🏛️ **Discover cultural treasures** - Learn about the rich heritage behind each craft, from ancient techniques to regional specialties.

🗣️ **Shop in your language** - Browse and listen in the language you're most comfortable with.

❤️ **Build your wishlist** - Save pieces that speak to your heart and come back to them later.

🔍 **Find exactly what you're looking for** - Smart filters help you discover pieces by region, technique, material, or price range.

## Ready to See This in Action? 🚀

*Don't worry - we'll walk you through this step by step. It's actually pretty fun!*

### What You'll Need (Just Two Things!)
- **Node.js** - Think of this as the engine that runs everything. [Download it here](https://nodejs.org/) if you don't have it
- **A free Google Gemini API key** - This is what powers our AI magic. [Get yours here](https://makersuite.google.com/app/apikey) (seriously, it's free!)

### Let's Get This Running! 

**Step 1: Download KalaShetra**
```bash
git clone <your-repo-url>
cd KalaShetra
```
*Just getting a copy of all our code onto your computer*

**Step 2: Install All the Dependencies**
```bash
# First, install the main app stuff
npm install

# Then, install the backend stuff
cd server
npm install
cd ..
```
*This downloads all the tools and libraries we need. Grab a coffee - it might take a minute!*

**Step 3: Add Your Secret AI Key**
```bash
cd server
cp .env.example .env
```
*Now open that new `.env` file in any text editor and paste your Gemini API key:*
```env
GEMINI_API_KEY=your_actual_key_goes_here
PORT=5001
```

**Step 4: Start Everything Up!**

*You'll need two terminal windows for this (I know, I know, but trust the process):*

**Terminal Window #1 - The AI Brain:**
```bash
cd server
npm run dev
```
*This starts the backend that handles all the AI magic*

**Terminal Window #2 - The Pretty Interface:**
```bash
npm run dev
```
*This starts the website you'll actually see*

**Step 5: Open Your Browser and Be Amazed! 🎉**
- Go to: **http://localhost:8080**
- You should see KalaShetra come to life!

Try creating a product and watch the AI help you write beautiful descriptions. It's honestly pretty magical the first time you see it work!

## The Tech Behind the Magic 🔧

*For those who like to peek under the hood*

**The Pretty Stuff (Frontend):**
- **React** - Makes everything clickable and interactive
- **TypeScript** - Catches our silly mistakes before you see them
- **Tailwind CSS** - Makes everything look good without the CSS nightmares
- **shadcn/ui** - Beautiful components that just work

**The Smart Stuff (Backend):**
- **Node.js** - The server that keeps everything running
- **Google Gemini AI** - The actual genius that writes all those beautiful descriptions
- **Simple file storage** - We keep it simple - no fancy databases needed for this prototype!

## What's Inside the Box 📦

```
KalaShetra/
├── src/                    # The website you see and interact with
│   ├── components/        # Reusable bits like buttons and cards
│   ├── pages/            # The main pages (artisan tools, marketplace)
│   └── services/         # The code that talks to our AI
├── server/               # The behind-the-scenes AI magic
│   ├── routes/          # Different AI tools and features
│   ├── data/            # Where we keep all the products and stories
│   └── .env             # Your secret API key lives here
└── public/              # Images, logos, and other pretty files
```

## The Journey Through KalaShetra 🗺️

**For Artisans (The Creators):**
1. **Share your story** - Tell us about your craft in simple terms
2. **Watch AI enhance it** - Click buttons to get beautiful descriptions and cultural stories
3. **Set your price** - You decide what your art is worth
4. **Go live** - Your craft is now available to the world!

**For Customers (The Appreciators):**
1. **Discover treasures** - Browse through authentic handmade products
2. **Listen and learn** - Every piece has a story you can hear
3. **Connect with culture** - Understand the traditions behind each craft
4. **Support artisans** - Your purchase directly helps preserve these beautiful traditions

## Want to Share This with the World? 🌍

*Ready to help more artisans tell their stories?*

**Getting the Website Online (It's Actually Pretty Easy!):**
```bash
npm run build
# This creates a 'dist' folder with everything ready to go
# Just drag and drop it to Vercel or Netlify - seriously, that's it!
```

**Getting the AI Backend Online:**
```bash
cd server
npm start
# Upload this to Railway, Render, or any Node.js hosting service
```

**Don't Forget Your Environment Variables!**
```env
GEMINI_API_KEY=your_actual_api_key
PORT=5001
NODE_ENV=production
```

## Want to Make KalaShetra Even Better? 🤝

*We'd absolutely love your help! Here's how you can contribute:*

**Easy Ways to Help:**
- **Found a bug?** Let us know and we'll fix it
- **Have an idea?** Share it with us - we love new perspectives
- **Know another language?** Help us add support for more regional languages
- **Good with design?** Make the interface even more beautiful
- **Understand AI?** Help us improve the prompts to generate even better content

**How to Contribute:**
1. Fork this repo (there's a button at the top right of GitHub)
2. Make your awesome changes
3. Test everything to make sure it works
4. Send us a pull request with a note about what you've improved

**Some Ideas We're Excited About:**
- Support for more Indian languages (Bengali, Marathi, Gujarati...)
- Better AI prompts that understand regional craft nuances
- Mobile app version for artisans on the go
- Integration with local payment systems
- Offline mode for areas with poor internet

## Our Heartfelt Thanks 💝

**To Google** - for making AI accessible to everyone, not just big companies

**To the open-source community** - for building the tools that made this possible

**To every artisan** - who inspired us with their dedication to preserving beautiful traditions

**To you** - for taking the time to read this and maybe even trying out our platform

## Stuck? We're Here to Help! 🆘

*Don't worry - we've all been there. Here's how to get unstuck:*

- **Something not working?** Create an issue on GitHub with details about what happened
- **Have a question?** Start a discussion - we love chatting about the project
- **Want to brainstorm ideas?** Email us at hello@kalashetra.com
- **Just want to say hi?** We'd love to hear from you!

## Why We Built This 🌟

*The real story behind KalaShetra*

Every time we see a beautiful handwoven saree, a intricately carved wooden sculpture, or a delicate piece of pottery, we're reminded that these aren't just products - they're living pieces of culture. Each one carries the wisdom of generations, the patience of skilled hands, and the soul of communities that have kept these traditions alive.

But here's the thing - in our digital world, these stories often get lost. A tourist might buy a beautiful craft without ever knowing that the pattern represents the phases of the moon, or that the technique was passed down through seven generations of women in a small village.

**KalaShetra exists to change that.**

We're not trying to replace the human connection - we're trying to amplify it. We want every artisan to have the tools to share their story beautifully, and every customer to understand the magic they're holding in their hands.

If this platform helps even one grandmother like Meera reach customers who truly appreciate her craft, or helps one person fall in love with the beauty of handmade traditions, then we've succeeded.

---

<div align="center">
  <strong>Made with love, respect, and a deep appreciation for human creativity</strong><br>
  <em>Every thread tells a story. Every story deserves to be heard.</em><br><br>
  <small>🙏 Thank you for being part of this journey</small>
</div>
# KalaShetra
