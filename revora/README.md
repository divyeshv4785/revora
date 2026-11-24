# REVORA — Premium Used-Car Marketplace (Phase 1)

> **Tagline:** Every Drive Begins Somewhere.  
> **Supporting Tagline:** Discover. Compare. Drive.

REVORA is a multi-vendor automotive ecosystem tailored for the Indian pre-owned vehicle marketplace, connecting discerning car buyers, individual car sellers, and multi-branch certified dealerships.

---

## 🚀 Phase 1 Implementation Summary

The complete public-facing landing page has been architected, styled, and implemented to commercial production standards using **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**.

### Key Architectural Highlights

1. **Global Design System & Exact Color Tokens:**
   - **Primary Steel Blue:** `#4C6D8B`
   - **Secondary Muted Blue:** `#6E8CA2`
   - **Accent Sky Blue:** `#60ADD9`
   - **Dark Background:** `#070B0D`
   - **Primary Text:** `#111214`
   - **Secondary Text:** `#585E64`
   - **Main Background:** `#FAFAFA`
   - **Card Background:** `#FFFFFF`
   - **Border:** `#E5E7EB`
   - **Success Green:** `#2CC168`
   - **Typography:** Manrope (Headings & Buttons) & Inter (Body text)

2. **Brand Identity & Minimalist Automotive Logo:**
   - Original minimalist automotive emblem: an aerodynamic dual-apex vertex with central jewel accent and geometric typography that renders seamlessly on dark and light surfaces.

3. **Hero Section Centerpiece:**
   - Cinematic `#070B0D` dark background with subtle radial spotlight glow.
   - Prominent showcase of the **2024 Toyota Camry in Platinum White Pearl** (front three-quarter view) with verified specification pill, pricing (₹35,00,000), headline *"Find the Car That Moves You."*, and dual CTAs (*EXPLORE CARS* & *SELL YOUR CAR*).

4. **Interactive Vehicle Search:**
   - Indian location selector with GPS auto-detection simulation.
   - Dependent brand & model dropdown selection (e.g., selecting *Toyota* exposes *Camry, Fortuner, Innova Hycross, etc.*).
   - Minimum and Maximum price range selectors formatted in Indian Rupees (₹).
   - Fuel types: *Petrol, Diesel, CNG, Electric, Hybrid*.
   - Transmission: *Manual, Automatic*.
   - Filter validation and reset action.

5. **Browse by Category:**
   - 6 image cards with vehicle counts: *Hatchbacks (2,840+), Sedans (3,420+), SUVs (5,160+), MUVs (1,980+), Luxury Cars (1,450+), Electric Cars (890+)*.

6. **Featured & Recent Inventory:**
   - Handpicked vehicle cards with realistic Indian listings (Toyota Camry Hybrid, Honda City, Tata Safari, BMW 3 Series, Creta, Mercedes C-Class).
   - Interactive favorite heart buttons, verification badges, specifications grid, and transparent illustrative disclosure.

7. **Multi-Branch Dealership Network:**
   - Audited dealership cards (Kovai Autohaus, Apex Prestige Motors, Bangalore Motor Works) with ratings, vehicle inventories, brand specializations, and *"Register Your Dealership"* CTA.

8. **Educational & Conversion Funnels:**
   - *Why Choose REVORA* (4 value pillars).
   - *How REVORA Works* (Separate interactive step workflows for Car Buyers and Car Sellers).
   - *Sell Your Car Promotional Section* (*"Your Car Deserves the Right Buyer"*).
   - *Dealership Partner Promotional Section* (*"Grow Your Dealership with REVORA"*).
   - *Final CTA Section* (*"Ready for Your Next Journey?"*).
   - *Comprehensive Footer* with 4 navigation columns, company address (Coimbatore, Tamil Nadu), and legal links.

9. **Gated Access & Authentication Modal:**
   - Full public preview access without login.
   - Gated actions (full search results, vehicle history dossier, direct seller chat/phone, scheduling test drives, adding favorites) trigger an authentication modal with role selection (*Car Buyer*, *Car Owner*, *Dealership*).

---

## 🛠️ Running the Application

The application is running at:
**[http://localhost:3000](http://localhost:3000)**

To run commands manually from the project folder (`C:\Users\rujut\.gemini\antigravity\scratch\revora`):
```bash
# Start development server
npm run dev

# Create optimized production build
npm run build

# Start production server on port 3000
npm start -- -p 3000
```
