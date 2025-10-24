# Tokyo Adventures - The Infinite Theme Park

> "Endless Enchantment: Discover Tokyo and beyond as the world's greatest theme park"

## Vision

Tokyo is not a city—it's an attraction. This site reveals Tokyo and its surrounding regions as an infinite theme park where every corner offers enchantment, every train ride is an adventure, and the experience never ends.

## Site Structure

```
tokyo-adventures/
├── index.html                 # Homepage - The park map
├── zones/
│   ├── urban-oases.html      # 🌳 Parks in Tokyo
│   ├── natures-edge.html     # 🥾 Walking trails (outskirts)
│   ├── escape-zones.html     # ♨️ Resorts, spas, onsens (<2hrs)
│   ├── community-pools.html  # 🏊 Public swimming pools
│   ├── ghibli-kingdom.html   # 🎨 Ghibli-related attractions
│   └── distant-wonders.html  # ⛰️ Far-flung Honshu attractions
├── assets/
│   ├── css/
│   │   └── style.css         # Complete design system
│   ├── js/
│   │   └── adventure.js      # All interactivity
│   └── images/
│       ├── zones/            # Zone hero images
│       ├── parks/
│       ├── trails/
│       ├── getaways/
│       ├── pools/
│       ├── ghibli/
│       └── honshu/
├── data/
│   ├── urban-oases.csv
│   ├── natures-edge.csv
│   ├── escape-zones.csv
│   ├── community-pools.csv
│   ├── ghibli-kingdom.csv
│   └── distant-wonders.csv
├── discover/
│   ├── about.html
│   ├── how-to-explore.html
│   └── contact.html
└── legal/
    ├── privacy.html
    └── terms.html
```

## Weekend Build Strategy

### Saturday Morning (3 hours)

**Hour 1: Setup**
```bash
# Create GitHub repo
# Clone locally
git clone https://github.com/jamespnz/tokyo-adventures.git
cd tokyo-adventures

# Create structure
mkdir -p zones assets/css assets/js assets/images/{zones,parks,trails,getaways,pools,ghibli,honshu} data discover legal
```

**Hour 2-3: Templates in Place**
- All HTML templates are ready to use in this repository
- CSS is complete with "endless enchantment" design system
- JavaScript handles all CSV loading and modals
- Just customize Google Analytics ID

### Saturday Afternoon (4 hours)

**CSV Data Entry (6 locations × 6 categories = 36 entries)**

Use the CSV template in `data/urban-oases.csv` as your guide.

Each entry takes ~6 minutes:
1. Name (English/Japanese) - 1 min
2. Journey info & station - 1 min
3. Description (storytelling!) - 2 min
4. Highlights, season, tags - 1 min
5. Find images - 1 min

**Writing Guidelines:**
- Open with a scene-setting sentence
- Tell the story of the place
- Include practical magic (how to get there, when to go)
- End with invitation
- Think: "Would this make ME want to go?"

### Saturday Evening (2 hours)

**Image Sourcing & Upload**
1. Find images on Wikimedia Commons (CC licenses)
2. Download at 800x600px minimum
3. Rename: `zone_location-name_hero.jpg`
4. Upload to GitHub immediately
5. Copy raw.githubusercontent.com URLs
6. Update CSVs with real URLs

### Sunday Morning (3 hours)

**Build Remaining Pages**
1. Copy `urban-oases.html` for other zones
2. Update zone-specific content (hero image, intro text)
3. Change CSV filename in script tag
4. Test each page locally

**Create Additional Pages**
- Copy/adapt about.html, contact.html, privacy.html from museum site

### Sunday Afternoon (3 hours)

**Local Testing**
```bash
# Start local server
python3 -m http.server 8000
# Visit http://localhost:8000
```

Test checklist:
- [ ] All pages load
- [ ] Japanese text displays correctly
- [ ] All images load
- [ ] Cards display properly
- [ ] Modals open/close
- [ ] Mobile responsive
- [ ] Navigation works

### Sunday Evening (1 hour)

**Deploy to GitHub**
```bash
git add .
git commit -m "Initial launch - 6 zones, 36 attractions"
git push origin main
```

**Enable GitHub Pages**
1. Repository → Settings → Pages
2. Source: main branch
3. Save

**Add Custom Domain** (if ready)
1. Add CNAME file
2. Configure Cloudflare DNS
3. Wait for verification

## CSV Field Guide

### Required Fields
- `attraction_name` - English name
- `attraction_japanese` - Japanese name (get from official sources)
- `zone` - Which zone page it belongs to
- `nearest_station` - Full station name
- `journey_from_shinjuku` - Time and method
- `description` - Your storytelling paragraph (150-200 words)

### Important Fields
- `tagline` - The hook (5-8 words)
- `why_visit` - One sentence on what makes it special
- `best_experienced` - When to go (season/time)
- `entry_fee` - Price or "Free"
- `experience_tags` - Emoji + short labels (🌸 Cherry Blossoms, 🚴 Cycling)
- `practical_tips` - Semicolon-separated tips
- `image_hero_url` - Main card image
- `image_hero_attribution` - CC license info

### Optional but Nice
- `crowd_level` - Low/Medium/High/Very High
- `accessibility` - Wheelchair access notes
- `nearby_attractions` - What else is within walking distance
- `official_website` - Link to official site

## Design Philosophy

### Color System
- **Sakura Pink** - Hope, new beginnings
- **Matcha Green** - Nature, tranquility  
- **Sky Blue** - Freedom, possibility
- **Sunset Orange** - Adventure, warmth
- **Midnight Navy** - Depth, sophistication

### Typography
- Headers: Clean, modern, Disney-inspired
- Body: Highly readable, friendly
- Japanese: Respectful Gothic fonts

### Card Design
Think "vintage attraction posters":
- Evocative hero image
- Clear title treatment
- Journey time prominent
- Tagline that sells the experience
- Tags for quick scanning

## Content Writing Voice

**Tone:** Enthusiastic but not cheesy
- ❌ "This amazing park is super cool!"
- ✅ "Where 54 hectares of green space unfold like a secret world"

**Structure:** Story → Practical → Invitation
1. Scene-setting opening (2 sentences)
2. The experience (3-4 sentences)  
3. Practical magic (2 sentences)
4. The invitation (1 sentence)

**Example Opening Lines:**
- "On any given Sunday, Yoyogi Park becomes Tokyo's living room."
- "Shinjuku Gyoen is where Tokyo's chaos transforms into contemplation."
- "Ueno Park is where Tokyo gathers to celebrate, learn, and remember."

## Image Guidelines

### Hero Images
- Wide establishing shots
- Golden/blue hour preferred
- Shows scale and atmosphere
- Professional quality
- 1200x800px minimum

### Detail Images
- Close-ups of unique features
- People experiencing the space
- Seasonal highlights
- The "Instagram moment"

### Attribution Format
```
By [Photographer Name] - [Source], [CC License]
Example: By Jane Smith - Wikimedia Commons, CC BY-SA 4.0
```

## Technical Notes

### UTF-8 Encoding
**Critical:** Save all files as UTF-8 in VS Code
1. Bottom right corner → Select encoding
2. Choose "UTF-8"
3. Save file

### GitHub Image URLs
Format: `https://raw.githubusercontent.com/[username]/tokyo-adventures/main/images/[category]/[filename].jpg`

Test URLs in browser before adding to CSV!

### Local Testing
```bash
python3 -m http.server 8000
```
Open: http://localhost:8000

### Google Analytics
Add your Measurement ID in all HTML files:
```html
<!-- Replace G-XXXXXXXXXX with your ID -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

## Expansion Plan (Week 2+)

Once live with 6 locations per zone:
1. Expand to 12-20 locations per zone
2. Add seasonal content updates
3. Create "suggested itineraries"
4. Add user favorites feature
5. Integrate with Maps API

## Key Success Factors

1. **Build for GitHub from Day 1** - No local-to-remote issues
2. **Test Japanese encoding early** - UTF-8 everything
3. **Tell stories, not just facts** - Channel Walt Disney
4. **Mobile-first design** - Most visitors on phones
5. **Quality over quantity** - 36 great entries beats 100 mediocre ones

## Inspiration Sources

- Disney park maps (1955-1960s)
- Studio Ghibli art books  
- Japanese travel posters (1960s-70s)
- National Geographic photography
- Vintage attraction posters

## Support

For questions during build weekend:
- Check museums site for reference patterns
- Test in Chrome DevTools mobile view
- Commit frequently to GitHub
- Deploy early, iterate often

## License

- Code: MIT License
- Content: Original curation
- Images: Various CC licenses (see attributions)

---

**Built with endless curiosity and respect for Japan's enchantment**

🌸 Launch target: This weekend
🗾 Vision: Show the world Tokyo's infinite park
✨ Mission: Enable endless enchantment
