

Theme Concept 1: "Focused Core - Dark Mode"
Concept: A very dark, focused theme using your core neutral palette, with Glassmorphism for depth and a single, sharp Acid accent replacing the default --color-primary for key interactions.
Background: var(--color-background) → (Assumed Dark) Very dark near-black (e.g., oklch(0.1 0.005 285)).
Foreground/Text: var(--color-foreground) → (Assumed Light) Near white (e.g., oklch(0.98 0 0)).
Cards/Panels (Standard): var(--color-card) → (Assumed Dark) Slightly lighter dark gray (e.g., oklch(0.15 0.005 285)).
Cards/Panels (Glassmorphism): oklch(0.15 0.005 285 / 0.6) (Semi-transparent version of assumed dark card color) with backdrop-blur-lg. Border using oklch(0.25 0.005 285 / 0.5) (Semi-transparent assumed dark border).
Borders: var(--color-border) → (Assumed Dark) Dark gray border (e.g., oklch(0.25 0.005 285)).
Muted Text: var(--color-muted-foreground) → (Assumed Light-Mid Gray) Lighter gray (e.g., oklch(0.6 0.01 285)).
Primary Action (Button/Highlight - ACID OVERRIDE): Instead of using the gray --color-primary, use an Acid Lime: oklch(0.85 0.25 130). Foreground on this button would be dark: var(--color-background) (Assumed Dark).
Subtle Accent (Non-interactive): Use var(--color-muted) → (Assumed Dark-Mid Gray) for subtle backgrounds or dividers (e.g., oklch(0.2 0.005 285)).
Destructive: var(--color-destructive) (Your defined orange-red). Foreground: var(--color-destructive-foreground) (Your defined white).


Theme Concept 2: "Analyst's Desk - Light Mode"
Concept: Uses your defined high-contrast light mode palette, incorporating subtle Glassmorphism and using the Chart colors strategically as accents alongside a primary Acid color. Feels clean, analytical, data-focused.
Background: var(--color-background) (oklch(1 0 0) - White).
Foreground/Text: var(--color-foreground) (oklch(0.141...) - Near Black).
Cards/Panels (Standard): var(--color-card) (oklch(1 0 0) - White).
Cards/Panels (Glassmorphism): oklch(1 0 0 / 0.75) (Semi-transparent white) with backdrop-blur-md. Border using var(--color-border) (oklch(0.92...)). Needs a slightly darker or textured main background to be effective.
Borders: var(--color-border) (oklch(0.92...)).
Muted Text: var(--color-muted-foreground) (oklch(0.552...)).
Primary Action (Button/Highlight - ACID OVERRIDE): Use an Acid Cyan: oklch(0.8 0.15 190). Foreground on this button: oklch(0.1 0 0) (Very dark).
Secondary Accent (Data Viz related): Use var(--chart-2) (oklch(0.6 0.118 184.704) - a muted cyan) for icons or specific highlights related to charts/data.
Tertiary Accent (Warning/Attention): Use var(--chart-1) (oklch(0.646 0.222 41.116) - a muted yellow/orange) for subtle attention cues.
Destructive: var(--color-destructive). Foreground: var(--color-destructive-foreground).


Theme Concept 3: "Glacial Tech - Dark Mode"
Concept: Very cool-toned dark theme using blues and cyans derived from your palette's slight purple hue, enhanced with Glassmorphism and a stark white/cyan primary action.
Background: var(--color-background) → (Assumed Dark) Very dark cool gray (e.g., oklch(0.12 0.006 280)).
Foreground/Text: var(--color-foreground) → (Assumed Light) Very light cool gray (e.g., oklch(0.95 0.001 280)).
Cards/Panels (Standard): var(--color-card) → (Assumed Dark) Slightly lighter dark cool gray (e.g., oklch(0.18 0.006 280)).
Cards/Panels (Glassmorphism): oklch(0.18 0.006 280 / 0.65) with backdrop-blur-lg. Border using oklch(0.3 0.008 280 / 0.5) (Semi-transparent dark cool border).
Borders: var(--color-border) → (Assumed Dark) Dark cool gray border (e.g., oklch(0.3 0.008 280)).
Muted Text: var(--color-muted-foreground) → (Assumed Light-Mid Gray) Light cool gray (e.g., oklch(0.65 0.01 280)).
Primary Action (Button/Highlight - ACID OVERRIDE): Use a very bright, near-white Acid Cyan: oklch(0.9 0.08 195). Foreground on this button: var(--color-background) (Assumed Dark).
Subtle Accent (Active State/Indicator): Use var(--chart-2) (oklch(0.6 0.118 184.704) - muted cyan) as it fits the cool theme.
Destructive: var(--color-destructive). Foreground: var(--color-destructive-foreground).
Theme Concept 4: "Brutalist Terminal - Dark Mode"
Concept: Mimics old-school terminals with a stark black background, monospace-leaning typography (font choice important here), and sharp "acid" green text/accents as the primary interaction points. Glassmorphism adds a modern twist.
Background: oklch(0 0 0) (Pure Black).
Foreground/Text: An Acid Green: oklch(0.8 0.2 145).
Cards/Panels (Standard): oklch(0.1 0 0) (Very dark gray, almost black).
Cards/Panels (Glassmorphism): oklch(0.1 0 0 / 0.5) with backdrop-blur-sm. Border using oklch(0.3 0.1 145 / 0.4) (Semi-transparent dim green border).
Borders: oklch(0.3 0.1 145) (Dim green).
Muted Text: oklch(0.5 0.05 145) (Dimmer green).
Primary Action (Button/Highlight): Use the main Acid Green text color (oklch(0.8 0.2 145)) often as a border or background fill on a darker element. Maybe background: oklch(0.15 0.02 145); color: oklch(0.9 0.01 145);
Destructive: var(--color-destructive) (Orange-red provides stark contrast). Foreground: var(--color-destructive-foreground).

Theme Concept 5: "Quantum Foam - Light Mode"
Concept: A very light, almost ethereal base with subtle cool tones, employing heavy Glassmorphism. Acid accents appear like fleeting quantum events. Feels airy, futuristic, and computational.
Background: var(--color-background) (oklch(1 0 0) - White). Perhaps with a very subtle cool gradient or noise texture added via CSS background properties.
Foreground/Text: var(--color-foreground) (oklch(0.141...) - Near Black).
Cards/Panels (Standard): var(--color-card) (oklch(1 0 0) - White). Border: var(--color-border) (oklch(0.92...)).
Cards/Panels (Glassmorphism - Dominant Style): oklch(1 0 0 / 0.6) (Highly transparent white) with backdrop-blur-xl (significant blur). Border: oklch(0.9 0.002 280 / 0.3) (Very subtle, semi-transparent cool gray border).
Borders (Subtle): var(--color-border) (oklch(0.92...)).
Muted Text: var(--color-muted-foreground) (oklch(0.552...)).
Primary Action (Button/Highlight - ACID OVERRIDE): Use an Acid Magenta/Fuchsia: oklch(0.75 0.25 330). Foreground on this button: oklch(1 0 0) (White).
Secondary Accent (Icons/Indicators - ACID OVERRIDE): Use an Acid Yellow: oklch(0.95 0.2 95).
Destructive: var(--color-destructive). Foreground: var(--color-destructive-foreground).
Feel: Light, futuristic, computational, complex information displayed cleanly, ephemeral energy.
Theme Concept 6: "Forged Carbon - Dark Mode"
Concept: Simulates the look of forged carbon fiber - deep blacks with subtle woven patterns (can be hinted at with textures/gradients) and sharp, metallic accents. Glassmorphism adds a polished overlay.
Background: var(--color-background) → (Assumed Dark) Near Black (oklch(0.1 0.002 280)). Ideally with a subtle CSS background pattern mimicking carbon weave.
Foreground/Text: var(--color-foreground) → (Assumed Light) Light gray (oklch(0.9 0 0)).
Cards/Panels (Standard): var(--color-card) → (Assumed Dark) Dark gray (oklch(0.18 0.003 280)).
Cards/Panels (Glassmorphism): oklch(0.18 0.003 280 / 0.7) with backdrop-blur-md. Border: oklch(0.4 0.005 280 / 0.4) (Semi-transparent mid-gray border).
Borders: var(--color-border) → (Assumed Dark) Dark gray (oklch(0.3 0.004 280)).
Muted Text: var(--color-muted-foreground) → (Assumed Light-Mid Gray) Mid-gray (oklch(0.5 0.005 280)).
Primary Action (Button/Highlight - METALLIC OVERRIDE): Use a bright, polished Silver/Chrome color: oklch(0.85 0 0) (Lightness high, Chroma zero). Foreground: oklch(0.1 0 0) (Near black).
Secondary Accent (Active State/Glow - ACID OVERRIDE): Use an Electric Blue: oklch(0.7 0.18 250). Apply as ring or subtle glow.
Destructive: var(--color-destructive). Foreground: var(--color-destructive-foreground).
Feel: High-performance, engineered, strong, lightweight (conceptually), premium materials, focused.
Theme Concept 7: "Oxidized Command - Dark Mode"
Concept: A dark theme suggesting weathered, oxidized metal (copper/bronze tones mixed with dark base) contrasted with sharp, modern digital readouts (acid cyan). Glassmorphism provides clean interface layers over the textured base.
Background: var(--color-background) → (Assumed Dark) Very dark brown/bronze undertone (e.g., oklch(0.15 0.02 45)).
Foreground/Text: var(--color-foreground) → (Assumed Light) Off-white/light beige (e.g., oklch(0.95 0.01 45)).
Cards/Panels (Standard): var(--color-card) → (Assumed Dark) Darker, less saturated brown/bronze (e.g., oklch(0.2 0.015 45)).
Cards/Panels (Glassmorphism): oklch(0.2 0.015 45 / 0.6) with backdrop-blur-lg. Border: oklch(0.4 0.03 45 / 0.4) (Semi-transparent muted bronze border).
Borders: var(--color-border) → (Assumed Dark) Muted bronze/brown (e.g., oklch(0.4 0.03 45)).
Muted Text: var(--color-muted-foreground) → (Assumed Light-Mid Gray) Light tan/beige (e.g., oklch(0.6 0.02 45)).
Primary Action (Button/Highlight - ACID OVERRIDE): Use a sharp Acid Cyan: oklch(0.8 0.15 190). Foreground: oklch(0.1 0 0) (Near black).
Subtle Accent (Inactive/Background elements): Use var(--color-muted) → (Assumed Dark-Mid Gray) dark muted bronze (e.g., oklch(0.25 0.01 45)).
Destructive: var(--color-destructive). Foreground: var(--color-destructive-foreground).
Feel: Industrial history meets future tech, reliable, aged but powerful, steampunk undertones, strong contrast between old/new.
Theme Concept 8: "Bio-Luminescent Lab - Dark Mode"
Concept: Very dark, almost biological background textures (hinted with gradients/noise) illuminated by glowing, bio-luminescent acid colors. Glassmorphism represents containment fields or sterile lab glass.
Background: var(--color-background) → (Assumed Dark) Deep, slightly desaturated teal/green (e.g., oklch(0.12 0.02 170)).
Foreground/Text: var(--color-foreground) → (Assumed Light) Very light cyan/green tint (e.g., oklch(0.96 0.01 170)).
Cards/Panels (Standard): var(--color-card) → (Assumed Dark) Darker teal/green (e.g., oklch(0.18 0.015 170)).
Cards/Panels (Glassmorphism): oklch(0.18 0.015 170 / 0.5) with backdrop-blur-md. Border: oklch(0.4 0.04 150 / 0.4) (Semi-transparent glowing green border).
Borders: var(--color-border) → (Assumed Dark) Dim green/teal (oklch(0.3 0.02 170)).
Muted Text: var(--color-muted-foreground) → (Assumed Light-Mid Gray) Light desaturated green (oklch(0.6 0.03 170)).
Primary Action (Button/Highlight - ACID OVERRIDE): Use a glowing Acid Orange/Amber: oklch(0.8 0.22 65). Foreground: oklch(0.1 0 0) (Near black).
Secondary Accent (Status/Glow - ACID OVERRIDE): Use an Acid Lime: oklch(0.85 0.25 130). Apply as text color for specific statuses or subtle glows.
Destructive: var(--color-destructive). Foreground: var(--color-destructive-foreground).
Feel: Bio-tech, organic AI, advanced research, contained energy, slightly alien, glowing data.

Theme Concept 9: "E-Ink & Highlighter" (Light Mode Hybrid)
Concept: Mimics the high-contrast, paper-like feel of an E-Ink display, but uses sharp, digital "highlighter" acid colors for interaction and emphasis. Relies heavily on typography and layout. Glassmorphism acts like a protective screen.
Background: var(--color-background) (oklch(1 0 0) - White, or slightly off-white like oklch(0.98 0.002 90) for paper feel).
Foreground/Text: var(--color-foreground) (oklch(0.141...) - Near Black). Maybe use a slightly softer black oklch(0.2 0.005 280).
Cards/Panels (Standard): var(--color-card) (oklch(1 0 0) - White) or var(--color-secondary) (oklch(0.967...) - very light gray). Minimal borders: var(--color-border) (oklch(0.92...)).
Cards/Panels (Glassmorphism): oklch(0.98 0.002 90 / 0.5) (Semi-transparent off-white) with backdrop-blur-sm (subtle blur). Border: oklch(0.8 0.002 90 / 0.3) (Very light gray border).
Borders: var(--color-border) (oklch(0.92...)) - used sparingly.
Muted Text: var(--color-muted-foreground) (oklch(0.552...)).
Primary Action (Highlight/Underline - ACID OVERRIDE): Instead of button backgrounds, use Acid Yellow as a text highlight or thick underline on interactive elements: oklch(0.95 0.2 95). The text itself remains dark: var(--color-foreground).
Secondary Accent (Icons/Tags - ACID OVERRIDE): Use an Acid Pink/Fuchsia: oklch(0.75 0.25 330). Apply as icon color or small tag background.
Destructive: var(--color-destructive) applied as text color or border color, not necessarily a filled background. Foreground: var(--color-destructive-foreground).
Feel: High-tech paper, focused reading/data, minimalist interface, sharp digital annotations, information-dense.

## Theme Concept 10: "Ferrofluid Interface - Dark Mode"

Concept: Inspired by the mesmerizing movement of ferrofluid. Uses a deep black base, metallic mid-tones suggesting fluid metal, and dynamic, shifting acid accents perhaps implemented with subtle gradients or interaction effects.
Background: var(--color-background) → (Assumed Dark) Pure Black (oklch(0 0 0)).
Foreground/Text: var(--color-foreground) → (Assumed Light) Light Silver (oklch(0.9 0 0)).
Cards/Panels (Standard): var(--color-card) → (Assumed Dark) Dark Gunmetal (oklch(0.25 0.003 270)).
Cards/Panels (Glassmorphism): oklch(0.25 0.003 270 / 0.5) with backdrop-blur-md. Border: oklch(0.5 0.005 270 / 0.4) (Semi-transparent mid-gunmetal border).
Borders: var(--color-border) → (Assumed Dark) Mid-Gunmetal (oklch(0.5 0.005 270)).
Muted Text: var(--color-muted-foreground) → (Assumed Light-Mid Gray) Silver-Gray (oklch(0.6 0 0)).
Primary Action (Button/Highlight - ACID GRADIENT OVERRIDE): Use a shifting Acid Gradient: background-image: linear-gradient(90deg, oklch(0.8 0.2 145), oklch(0.75 0.25 330)) (Lime to Fuchsia). Text: oklch(0 0 0) (Black).
Secondary Accent (Active State/Glow - ACID OVERRIDE): Use an Electric Blue: oklch(0.7 0.18 250). Apply as ring, subtle text glow, or pulsing effect.
Destructive: var(--color-destructive). Foreground: var(--color-destructive-foreground).
Feel: Fluid dynamics, dark magnetism, cutting-edge materials science, unpredictable energy, high-tech simulation.

## Theme Concept 11: "Quantum Dot Display - Dark Mode"

Concept: Pure black background allows individual "quantum dot" acid colors to pop with extreme vibrancy. Glassmorphism layers feel like display filters. Focus on sparse use of intense color.
Background: var(--color-background) → (Assumed Dark) Pure Black (oklch(0 0 0)).
Foreground/Text: var(--color-foreground) → (Assumed Light) Pure White (oklch(1 0 0)).
Cards/Panels (Standard): var(--color-card) → (Assumed Dark) Very Dark Gray (oklch(0.15 0 0)).
Cards/Panels (Glassmorphism): oklch(0.15 0 0 / 0.4) with backdrop-blur-xl (heavy blur). Border: oklch(0.5 0.15 190 / 0.3) (Semi-transparent faint cyan border).
Borders: var(--color-border) → (Assumed Dark) Dark Gray (oklch(0.3 0 0)).
Muted Text: var(--color-muted-foreground) → (Assumed Light-Mid Gray) Mid-Gray (oklch(0.6 0 0)).
Primary Action (Icon/Indicator - ACID OVERRIDE): Use Acid Lime for small, critical indicators or icons ONLY: oklch(0.85 0.25 130). Buttons might remain dark with white text.
Secondary Accent (Highlight/Chart - ACID OVERRIDE): Use Acid Cyan: oklch(0.8 0.15 190). Apply as text color for specific data points or subtle highlights.
Tertiary Accent (Status/Chart - ACID OVERRIDE): Use Acid Magenta: oklch(0.75 0.25 330). // no pink
Destructive: var(--color-destructive). Foreground: var(--color-destructive-foreground).
Feel: Ultimate contrast, digital precision, information clarity, sparse data points glowing intensely, advanced display tech.

## Theme Concept 12: "Neo-Brutalist Grid - Light Mode"

Concept: Embraces raw structure with visible grids, stark typography, and functional blocks. Uses your high-contrast light palette as a base, adds harsh acid accents, and minimal glassmorphism for specific overlays.
Background: var(--color-background) (oklch(1 0 0) - White). Potentially with a subtle CSS grid background pattern.
Foreground/Text: var(--color-foreground) (oklch(0.141...) - Near Black). Use a Monospace or Technical Sans-serif font.
Cards/Panels (Standard): var(--color-card) (oklch(1 0 0) - White) with stark borders: var(--color-foreground) (oklch(0.141...)) - Black borders.
Cards/Panels (Glassmorphism - Specific Overlays): oklch(0.95 0.001 280 / 0.6) (Slightly grayed, semi-transparent) with backdrop-blur-sm. Border: var(--color-foreground). Used only for specific popovers or temporary states.
Borders: Heavy use of var(--color-foreground) or var(--color-border) (oklch(0.92...)) to define layout blocks.
Muted Text: var(--color-muted-foreground) (oklch(0.552...)).
Primary Action (Button - ACID OVERRIDE): Use a solid block of Acid Orange: oklch(0.75 0.2 55). Text: var(--color-foreground) (Near Black). No rounded corners.
Secondary Accent (Highlight/Tag - ACID OVERRIDE): Use Acid Lime as text color or background for small tags: oklch(0.85 0.25 130).
Destructive: var(--color-destructive) used as a stark background fill. Foreground: var(--color-destructive-foreground).
Feel: Raw functionality, exposed structure, digital brutalism, high information density, unapologetically technical.

## Theme Concept 13: "Holographic Interface - Dark Mode" - $Best Concept no pink tho

Concept: Simulates interacting with projected holograms. Uses a deep background, with interface elements appearing as semi-transparent, glowing layers. Accents are sharp and ethereal.
Background: var(--color-background) → (Assumed Dark) Deep Indigo/Near Black (oklch(0.1 0.01 270)).
Foreground/Text: var(--color-foreground) → (Assumed Light) Light Cyan/White (oklch(0.95 0.02 190)).
Cards/Panels (Standard): var(--color-card) → (Assumed Dark) Dark Indigo (oklch(0.15 0.01 270)).
Cards/Panels (Glassmorphism - Dominant): oklch(0.5 0.1 190 / 0.15) (Very transparent cyan tint) with backdrop-blur-sm. Border: oklch(0.7 0.15 190 / 0.5) (Glowing semi-transparent cyan border).
Borders: var(--color-border) → (Assumed Dark) Dim cyan/indigo (oklch(0.3 0.02 250)).
Muted Text: var(--color-muted-foreground) → (Assumed Light-Mid Gray) Light cyan/gray (oklch(0.6 0.03 220)).
Primary Action (Button/Highlight - ACID OVERRIDE): Use a bright, slightly desaturated Acid Pink/Magenta: oklch(0.8 0.15 330). Foreground: oklch(0.1 0 0) (Near black).
Secondary Accent (Glow/Status): Use the border cyan oklch(0.7 0.15 190) for glows or status text.
Destructive: var(--color-destructive). Foreground: var(--color-destructive-foreground).
Feel: Futuristic, ethereal, projected light, interactive data, science fiction UI.
Theme Concept 14: "Solarized Flare - Light Mode"
Concept: Inspired by "Solarized" themes focusing on low-contrast readability for the base, but uses a high-energy "solar flare" accent. Glassmorphism adds soft layers.
Background: var(--color-background) → (Light Mode Base) Off-white with slight warmth (oklch(0.98 0.005 90)).
Foreground/Text: var(--color-foreground) → (Light Mode Base) Desaturated dark blue/gray (oklch(0.3 0.01 250)).
Cards/Panels (Standard): var(--color-card) → (Light Mode Base) Very light warm gray (oklch(0.95 0.005 90)). Border: var(--color-border) (oklch(0.90 0.008 90)).
Cards/Panels (Glassmorphism): oklch(0.95 0.005 90 / 0.6) with backdrop-blur-md. Border: oklch(0.85 0.01 90 / 0.4).
Borders: var(--color-border) (oklch(0.90 0.008 90)).
Muted Text: var(--color-muted-foreground) → (Light Mode Base) Mid-tone warm gray (oklch(0.55 0.01 90)).
Primary Action (Button/Highlight - ACID OVERRIDE): Use an intense Solar Flare Orange/Yellow gradient: background-image: linear-gradient(45deg, oklch(0.8 0.22 65), oklch(0.95 0.2 95)). Text: oklch(0.1 0 0) (Near black).
Secondary Accent (Code/Data): Use a $desaturated Teal (oklch(0.6 0.05 180)).
Destructive: var(--color-destructive) (Orange-red contrasts well). Foreground: var(--color-destructive-foreground).
Feel: Comfortable contrast, focused work, sudden bursts of energy, scientific, readable.

## Theme Concept 15: "Mycelial Network - Dark Mode"

Concept: Dark, organic theme suggesting interconnected fungal networks. Uses earthy dark tones, subtle textures (implied), and bio-luminescent accents. Glassmorphism feels like looking through substrate.
Background: var(--color-background) → (Assumed Dark) Very dark, slightly warm brown/gray (oklch(0.15 0.01 50)). Maybe with CSS noise/texture.
Foreground/Text: var(--color-foreground) → (Assumed Light) Light beige/off-white (oklch(0.94 0.01 50)).
Cards/Panels (Standard): var(--color-card) → (Assumed Dark) Darker brown/gray (oklch(0.2 0.01 50)).
Cards/Panels (Glassmorphism): oklch(0.2 0.01 50 / 0.6) with backdrop-blur-lg. Border: oklch(0.5 0.1 130 / 0.3) (Semi-transparent faint bio-lime border).
Borders: var(--color-border) → (Assumed Dark) Muted brown (oklch(0.35 0.015 50)).
Muted Text: var(--color-muted-foreground) → (Assumed Light-Mid Gray) Light tan (oklch(0.6 0.02 50)).
Primary Action (Button/Highlight - ACID OVERRIDE): Use a Bio-luminescent Acid Lime: oklch(0.85 0.25 130). Text: oklch(0.1 0 0) (Near black).
Secondary Accent (Status/Glow): Use a subtle glowing Orange/Amber: oklch(0.8 0.15 60). Apply as text color or small indicators.
Destructive: var(--color-destructive). Foreground: var(--color-destructive-foreground).
Feel: Organic intelligence, interconnected systems, natural computation, dark growth, bio-tech.

## Theme Concept 16: "Liquid Crystal - Light Mode"

Concept: Clean, bright theme inspired by LCDs. Uses sharp text, defined borders, and color-shifting accents reminiscent of liquid crystal displays viewed at angles.
Background: var(--color-background) (oklch(1 0 0) - White).
Foreground/Text: var(--color-foreground) (oklch(0.141...) - Near Black). Sharp, clear font recommended.
Cards/Panels (Standard): var(--color-secondary) (oklch(0.967...) - Very light gray). Border: var(--color-border) (oklch(0.92...)).
Cards/Panels (Glassmorphism - Minimal): oklch(0.98 0.001 280 / 0.4) with backdrop-blur-sm. Border: var(--color-border). Used sparingly for overlays.
Borders: var(--color-border) (oklch(0.92...)) - sharp and defined.
Muted Text: var(--color-muted-foreground) (oklch(0.552...)).
Primary Action (Button/Highlight - SHIFTING ACCENT OVERRIDE): Use CSS to create a subtle color shift on hover/active, or use a gradient suggesting this. Base: oklch(0.6 0.05 250) (Muted Blue). Hover/Gradient Target: oklch(0.65 0.08 190) (Muted Cyan). Text: oklch(1 0 0) (White).
Secondary Accent (Indicators): Use a clean Green: oklch(0.7 0.15 145).
Destructive: var(--color-destructive). Foreground: var(--color-destructive-foreground).
Feel: Digital display, information clarity, precise, clean tech, subtle dynamism.

## Theme Concept 17: "Warp Drive Glow - Dark Mode"

Concept: Deep space black, punctuated by the intense, distorted glow of faster-than-light travel. Glassmorphism panels are viewing windows. Accents are streaked and energetic.
Background: var(--color-background) → (Assumed Dark) Pure Black (oklch(0 0 0)).
Foreground/Text: var(--color-foreground) → (Assumed Light) Bright White (oklch(1 0 0)).
Cards/Panels (Standard): var(--color-card) → (Assumed Dark) Very Dark Gray (oklch(0.1 0 0)).
Cards/Panels (Glassmorphism): oklch(0.1 0 0 / 0.4) with backdrop-blur-md. Border: oklch(0.7 0.2 300 / 0.4) (Semi-transparent purple warp trail border).
Borders: var(--color-border) → (Assumed Dark) Dark Gray (oklch(0.25 0 0)).
Muted Text: var(--color-muted-foreground) → (Assumed Light-Mid Gray) Mid Gray (oklch(0.5 0 0)).
Primary Action (Button/Highlight - ACID GRADIENT OVERRIDE): Use a streaked Acid Gradient suggesting motion blur: background-image: linear-gradient(90deg, oklch(0.7 0.2 300), oklch(0.8 0.15 190), oklch(0.9 0.05 190)) (Purple -> Cyan -> White-Cyan streak). Text: oklch(0 0 0) (Black).
Secondary Accent (Notifications): Use an Acid Yellow: oklch(0.95 0.2 95).
Destructive: var(--color-destructive). Foreground: var(--color-destructive-foreground).
Feel: High velocity, space travel, extreme energy, futuristic propulsion, dynamic distortion.
Theme Concept 18: "Paper Prototype - Light Mode"
Concept: Mimics the look of sketches and prototypes on paper or whiteboard. Uses off-whites, pencil-like grays, and marker-like acid highlights. Glassmorphism is minimal, like tape.
Background: var(--color-background) → (Light Mode Base) Slightly textured off-white (oklch(0.97 0.003 80)).
Foreground/Text: var(--color-foreground) → (Light Mode Base) Graphite Gray (oklch(0.3 0.005 270)). Consider a slightly sketchy font.
Cards/Panels (Standard): var(--color-card) → (Light Mode Base) White (oklch(1 0 0)) with pencil-like borders: var(--color-foreground).
Cards/Panels (Glassmorphism - "Tape"): oklch(0.9 0.01 70 / 0.2) with backdrop-blur-none (Clear, semi-transparent overlay). Border: none. Used sparingly.
Borders: var(--color-foreground) or var(--color-border) (oklch(0.92...)) used as sketch lines.
Muted Text: var(--color-muted-foreground) (oklch(0.552...)).
Primary Action (Button/Highlight - ACID MARKER OVERRIDE): Use Acid Green as a background fill suggesting a highlighter: oklch(0.85 0.25 130). Text: var(--color-foreground).
Secondary Accent (Annotations - ACID MARKER OVERRIDE): Use Acid Pink/Red text color: oklch(0.7 0.2 10).
Destructive: var(--color-destructive) applied as a stark red marker background or text. Foreground: var(--color-destructive-foreground).
Feel: Work-in-progress, iterative design, sketched ideas, raw functionality, blueprint stage.

## Theme Concept 19: "Molten Glass - Dark Mode"

Concept: Dark theme where Glassmorphism is the primary element, suggesting surfaces made of cooling, slightly colored molten glass. Accents are like embedded lights.
Background: var(--color-background) → (Assumed Dark) Very dark, slightly warm gray (oklch(0.15 0.005 40)).
Foreground/Text: var(--color-foreground) → (Assumed Light) Warm off-white (oklch(0.95 0.005 40)).
Cards/Panels (Standard): Rarely used. Maybe oklch(0.2 0.008 40).
Cards/Panels (Glassmorphism - Dominant): oklch(0.25 0.01 40 / 0.7) (Dark, semi-transparent warm gray) with backdrop-blur-lg. Border: oklch(0.8 0.15 60 / 0.4) (Semi-transparent glowing amber border).
Borders: Used mainly within Glassmorphism panels.
Muted Text: var(--color-muted-foreground) → (Assumed Light-Mid Gray) Light warm gray (oklch(0.6 0.01 40)).
Primary Action (Button/Highlight - ACID EMBED OVERRIDE): Use an embedded Acid Amber/Orange light: oklch(0.8 0.22 65). Often applied as text color on dark glass, or a subtle background glow within the glass. Text: oklch(0.95 0.005 40).
Secondary Accent (Status - ACID EMBED OVERRIDE): Use Acid Cyan text color: oklch(0.8 0.15 190).
Destructive: var(--color-destructive). Foreground: var(--color-destructive-foreground).
Feel: Molten material, contained heat, premium glass interface, fluid state, advanced manufacturing.

## Theme Concept 20: "Prism Break - Light Mode"

Concept: Very clean, white/light gray base, but interactive elements refract light into prismatic acid colors, primarily using gradients or border effects.
Background: var(--color-background) (oklch(1 0 0) - White).
Foreground/Text: var(--color-foreground) (oklch(0.141...) - Near Black).
Cards/Panels (Standard): var(--color-card) (oklch(1 0 0) - White). Border: var(--color-border) (oklch(0.92...)).
Cards/Panels (Glassmorphism): oklch(1 0 0 / 0.6) with backdrop-blur-md. Border: linear-gradient(90deg, oklch(0.8 0.2 145), oklch(0.75 0.25 330), oklch(0.95 0.2 95)) applied to border image/color.
Borders: var(--color-border) (oklch(0.92...)).
Muted Text: var(--color-muted-foreground) (oklch(0.552...)).
Primary Action (Button/Highlight - PRISM BORDER OVERRIDE): Use a standard button background (var(--color-secondary)) but apply a vibrant prismatic gradient to the border: border-image: linear-gradient(90deg, oklch(0.8 0.2 145), oklch(0.75 0.25 330), oklch(0.95 0.2 95)) 1; border-width: 2px;. Text: var(--color-foreground).
Secondary Accent (Icons/Links - ACID OVERRIDE): Use a single Acid color like Cyan oklch(0.8 0.15 190) for simple accents.
Destructive: var(--color-destructive). Foreground: var(--color-destructive-foreground).
Feel: Light refraction, optical effects, clean science, hidden complexity revealed, precision optics.
Theme Concept 21: "Retro Cassette Futurism - Dark Mode"
Concept: Blends dark backgrounds with the slightly faded neon and beige/cream accents of 70s/80s sci-fi interfaces (think Alien, original Tron). Glassmorphism is blocky.
Background: var(--color-background) → (Assumed Dark) Desaturated Dark Blue/Gray (oklch(0.15 0.01 240)).
Foreground/Text: var(--color-foreground) → (Assumed Light) Cream/Beige Off-white (oklch(0.95 0.01 80)). Use a blocky or slightly retro font.
Cards/Panels (Standard): var(--color-card) → (Assumed Dark) Darker Blue/Gray (oklch(0.2 0.01 240)).
Cards/Panels (Glassmorphism - Blocky): oklch(0.2 0.01 240 / 0.4) with backdrop-blur-none or backdrop-blur-sm. Sharp corners, maybe thick borders. Border: oklch(0.6 0.1 180 / 0.5) (Semi-transparent faded teal border).
Borders: var(--color-border) → (Assumed Dark) Muted Blue/Gray (oklch(0.35 0.015 240)).
Muted Text: var(--color-muted-foreground) → (Assumed Light-Mid Gray) Faded Beige (oklch(0.6 0.02 80)).
Primary Action (Button/Highlight - RETRO NEON OVERRIDE): Use a faded Teal/Aqua: oklch(0.7 0.1 180). Text: oklch(0.1 0 0) (Near black).
Secondary Accent (Indicators - RETRO NEON OVERRIDE): Use a faded Orange: oklch(0.7 0.15 50).
Destructive: var(--color-destructive) (Orange-red fits surprisingly well). Foreground: var(--color-destructive-foreground).
Feel: Retro-futuristic, cassette futurism, analog interface simulation, tangible tech, nostalgic sci-fi.

## Theme Concept 22: "Terraformed Landscape - Light Mode"

Concept: Uses earthy tones (sands, clays, muted greens) suggesting a terraformed planet, with sharp blue accents representing water or technology. Glassmorphism feels like atmospheric domes.
Background: var(--color-background) → (Light Mode Base) Light Sandy Beige (oklch(0.95 0.02 70)).
Foreground/Text: var(--color-foreground) → (Light Mode Base) Dark Terracotta/Brown (oklch(0.3 0.05 40)).
Cards/Panels (Standard): var(--color-card) → (Light Mode Base) Off-white (oklch(1 0 0)). Border: oklch(0.85 0.03 60).
Cards/Panels (Glassmorphism - "Domes"): oklch(0.9 0.05 190 / 0.15) (Very transparent light blue) with backdrop-blur-lg. Border: oklch(0.7 0.1 190 / 0.4) (Semi-transparent cyan border).
Borders: var(--color-border) → (Light Mode Base) Light Terracotta (oklch(0.85 0.03 60)).
Muted Text: var(--color-muted-foreground) → (Light Mode Base) Muted Clay/Tan (oklch(0.55 0.04 50)).
Primary Action (Button/Highlight - ACID OVERRIDE): Use a vibrant Water Cyan/Blue: oklch(0.75 0.18 195). Text: oklch(1 0 0) (White).
Secondary Accent (Flora/Data): Use a muted Olive Green: oklch(0.5 0.08 120).
Destructive: var(--color-destructive). Foreground: var(--color-destructive-foreground).

## Theme Omega: "Anodized Void & Plasma Arc"

Concept: Simulates a premium, anodized dark metal surface (like high-end electronics) with a single, intense plasma arc accent color. Glassmorphism feels like precision-cut overlays. Focuses on material feel and singular energy.
Background: var(--color-background) → Very dark, slightly desaturated cool gray with minimal chroma (oklch(0.15 0.004 260)). Consider a CSS overlay for subtle anisotropic sheen like brushed aluminum.
Foreground/Text: var(--color-foreground) → Light cool gray (oklch(0.92 0.002 260)).
Cards/Panels (Standard): var(--color-card) → Slightly lighter dark gray (oklch(0.2 0.004 260)).
Cards/Panels (Glassmorphism - Refined): oklch(0.2 0.004 260 / 0.7) with backdrop-blur-lg. Add a very faint, sharp inner box-shadow in a light gray (oklch(0.7 0.002 260 / 0.3)) to simulate a cut edge.
Borders: var(--color-border) → Dark gray (oklch(0.3 0.004 260)). Used minimally.
Muted Text: var(--color-muted-foreground) → Cool mid-gray (oklch(0.55 0.003 260)).
Primary Action (Button/Highlight - ACID OVERRIDE + GLOW): Use a single, intense Plasma Arc Magenta/Pink: --color-acid-plasma: oklch(0.78 0.26 335);. Apply this (var(--color-acid-plasma)) as background/border. Add a filter: drop-shadow(0 0 8px oklch(0.78 0.26 335 / 0.6)); for a strong glow effect. Text on button: oklch(0.05 0 0) (Near black).
Secondary Accent: Avoid strong secondary colors. Use variations in gray (var(--color-muted-foreground), var(--color-foreground)) or subtle state changes (opacity) for inactive/secondary elements.
Destructive: var(--color-destructive). Foreground: var(--color-destructive-foreground). Use sparingly to avoid competing with the primary Plasma accent.
Feel: Premium hardware, focused power, high contrast energy, precision engineering, minimalist luxury tech.
Theme Sigma: "Deep Forest Substrate & Fungal Glow"
Concept: A dark, organic theme moving beyond simple brown/green. Uses deep olive/forest floor tones with subtle texture, paired with a bio-luminescent green glow accent. Glassmorphism feels like dew or resin.
Background: var(--color-background) → Deep, dark desaturated olive/brown (oklch(0.18 0.015 110)). Add a subtle CSS noise texture.
Foreground/Text: var(--color-foreground) → Light, slightly warm off-white (oklch(0.96 0.005 90)).
Cards/Panels (Standard): var(--color-card) → Slightly lighter dark olive (oklch(0.23 0.015 110)).
Cards/Panels (Glassmorphism - "Dew"): oklch(0.23 0.015 110 / 0.5) with backdrop-blur-md. Add a subtle, slightly lighter green inner border/highlight (oklch(0.4 0.05 120 / 0.2)) suggesting moisture or resin edge.
Borders: var(--color-border) → Muted dark olive/brown (oklch(0.35 0.02 100)).
Muted Text: var(--color-muted-foreground) → Soft, light olive/gray (oklch(0.55 0.02 100)).
Primary Action (Button/Highlight - ACID OVERRIDE + GLOW): Use a Bio-luminescent Green: --color-acid-fungal: oklch(0.88 0.22 140);. Apply (var(--color-acid-fungal)) as background/border. Use box-shadow: 0 0 10px 2px oklch(0.88 0.22 140 / 0.5); for a soft, spreading glow. Text on button: oklch(0.1 0.01 140) (Very dark green).
Secondary Accent (Status/Data): Use a muted Amber/Ochre: oklch(0.65 0.1 75). Apply as text color or small indicators.
Destructive: var(--color-destructive). Foreground: var(--color-destructive-foreground).
Feel: Organic AI, natural computation, complex systems, grounded intelligence, bio-luminescence, dark forest floor tech.
Theme Tau: "Chromatic Aberration & Polished Metal"
Concept: A clean, dark metallic base where the primary accent mimics chromatic aberration (color fringing) effects seen in lenses, often using gradients. Glassmorphism acts like a lens element.
Background: var(--color-background) → Dark, neutral metallic gray (oklch(0.2 0 0)).
Foreground/Text: var(--color-foreground) → Clean off-white (oklch(0.97 0 0)).
Cards/Panels (Standard): var(--color-card) → Slightly lighter dark gray (oklch(0.25 0 0)).
Cards/Panels (Glassmorphism - "Lens"): oklch(0.25 0 0 / 0.6) with backdrop-blur-lg. Border uses a subtle prismatic gradient (see Accent below) applied very thinly (border-image: linear-gradient(...) 1; border-width: 1px;).
Borders: var(--color-border) → Mid-dark gray (oklch(0.4 0 0)).
Muted Text: var(--color-muted-foreground) → Mid-gray (oklch(0.6 0 0)).
Primary Action (Button/Highlight - PRISMATIC GRADIENT OVERRIDE): Use a gradient simulating color fringing: --color-chromatic-gradient: linear-gradient(90deg, oklch(0.75 0.25 330), oklch(0.7 0.18 250), oklch(0.8 0.15 190)); (Magenta -> Blue -> Cyan). Apply this (var(--color-chromatic-gradient)) to backgrounds or borders of active elements. Text on gradient: oklch(1 0 0) (White).
Secondary Accent (Indicators/Icons): Use a sharp, polished metallic silver: oklch(0.85 0 0). Apply as icon color or potentially button background with dark text.
Destructive: var(--color-destructive). Foreground: var(--color-destructive-foreground).
Feel: Optical precision, advanced imaging, data distortion/correction, clean lab tech, light manipulation.

## Theme Concept 23: "Nebula Gas & Starlight"

Concept: Deep space background with swirling, subtle nebula-like gradients (using CSS background techniques). Glassmorphism panels are observation windows, accents are sharp starlight points.
Background: var(--color-background) → (Assumed Dark) Very dark base (oklch(0.1 0.005 260)) overlaid with a slow-moving CSS gradient simulating deep space gas clouds (e.g., dark purples oklch(0.15 0.02 290), deep teals oklch(0.15 0.02 190) blended softly).
Foreground/Text: var(--color-foreground) → (Assumed Light) Crisp, slightly cool white (oklch(0.98 0.001 220)).
Cards/Panels (Standard): var(--color-card) → (Assumed Dark) Dark Transparent Charcoal (oklch(0.18 0.005 260 / 0.9)).
Cards/Panels (Glassmorphism - "Observation Window"): oklch(0.18 0.005 260 / 0.4) with backdrop-blur-lg. Border: Very faint, almost invisible cool gray (oklch(0.5 0.002 220 / 0.2)).
Borders: var(--color-border) → (Assumed Dark) Dark cool gray (oklch(0.3 0.004 260)).
Muted Text: var(--color-muted-foreground) → (Assumed Light-Mid Gray) Cool mid-gray (oklch(0.6 0.003 260)).
Primary Action (Button/Highlight - STARK OVERRIDE): Use pure White (oklch(1 0 0)) as the background for maximum contrast, like a bright star. Text: var(--color-background) (Assumed Dark). Alternatively, use an Acid Cyan oklch(0.8 0.15 190).
Secondary Accent (Points/Icons - ACID OVERRIDE): Use tiny points of Acid Yellow (oklch(0.95 0.2 95)) for icons or active indicators, like distant stars.
Destructive: var(--color-destructive). Foreground: var(--color-destructive-foreground).
Feel: Cosmic, vast, observational, high-tech astronomy/exploration, sharp points of light in darkness.

## Theme Concept 24: "Reactor Core Leak"

Concept: A dark, industrial theme suggesting immense power contained, with hints of dangerous energy (acid green) leaking through cracks or seams, visualized via gradients or border effects. Glassmorphism is like reinforced shielding.
Background: var(--color-background) → (Assumed Dark) Very dark, slightly textured concrete/metal gray (oklch(0.16 0.002 240)). Maybe CSS noise.
Foreground/Text: var(--color-foreground) → (Assumed Light) Off-white (oklch(0.96 0 0)).
Cards/Panels (Standard): var(--color-card) → (Assumed Dark) Darker concrete gray (oklch(0.22 0.002 240)).
Cards/Panels (Glassmorphism - "Shielding"): oklch(0.22 0.002 240 / 0.7) with backdrop-blur-md. Border: Thick, dark metallic (oklch(0.3 0.002 240)).
Borders: var(--color-border) → (Assumed Dark) Mid-dark gray (oklch(0.35 0.003 240)).
Muted Text: var(--color-muted-foreground) → (Assumed Light-Mid Gray) Mid-gray (oklch(0.5 0.002 240)).
Primary Action (Button/Highlight - ACID LEAK OVERRIDE): Use a gradient suggesting leaking energy on borders or as a subtle background effect: linear-gradient(to right, transparent, oklch(0.85 0.25 130 / 0.7), transparent). Main button background could be dark var(--color-card). Text: var(--color-foreground).
Secondary Accent (Warning Text/Icons - ACID OVERRIDE): Use the solid Acid Lime (oklch(0.85 0.25 130)) for warning icons or specific text highlights.
Destructive: var(--color-destructive). Foreground: var(--color-destructive-foreground). Used for critical failure states.
Feel: Contained power, industrial hazard, high energy, glowing leaks, reactor core aesthetic, slightly dangerous tech.

## Theme Concept 25: "Ectoplasmic Interface" - $Best so far

Concept: A dark, ethereal theme using deep greens/teals with shifting, semi-transparent layers (Glassmorphism) and glowing, ghostly accents. Feels otherworldly and fluid.
Background: var(--color-background) → (Assumed Dark) Deep Teal/Green (oklch(0.14 0.025 180)).
Foreground/Text: var(--color-foreground) → (Assumed Light) Very light, slightly green-tinted white (oklch(0.97 0.005 160)).
Cards/Panels (Standard): var(--color-card) → (Assumed Dark) Darker Teal/Green (oklch(0.19 0.02 180)).
Cards/Panels (Glassmorphism - Dominant): oklch(0.19 0.02 180 / 0.4) with backdrop-blur-xl (heavy blur). Border: Faint, glowing lighter green border (oklch(0.6 0.1 150 / 0.3)).
Borders: var(--color-border) → (Assumed Dark) Muted Teal (oklch(0.3 0.02 180)).
Muted Text: var(--color-muted-foreground) → (Assumed Light-Mid Gray) Soft, light green/gray (oklch(0.55 0.02 170)).
Primary Action (Button/Highlight - GHOSTLY GLOW OVERRIDE): Use a soft, glowing Cyan/White: --color-ghostly-glow: oklch(0.9 0.05 190);. Apply as background/border. Add box-shadow: 0 0 12px 3px oklch(0.9 0.05 190 / 0.4); for a diffuse glow. Text: oklch(0.1 0.01 190) (Dark Cyan).
Secondary Accent (Subtle Effects): Use CSS for subtle animated opacity shifts or soft particle effects in the accent color.
Destructive: var(--color-destructive). Foreground: var(--color-destructive-foreground).
Feel: Ethereal, ghostly tech, fluid interface, bio-luminescent deep sea, otherworldly energy.

## Theme Concept 26: "Scratched Obsidian & Gold Leaf"

Concept: A sophisticated dark theme using a near-black base suggesting polished but slightly scratched obsidian, with luxurious gold leaf accents. Glassmorphism adds a protective layer.
Background: var(--color-background) → (Assumed Dark) Near Black (oklch(0.1 0 0)). Add subtle CSS texture simulating fine scratches or imperfections.
Foreground/Text: var(--color-foreground) → (Assumed Light) Warm Off-white (oklch(0.96 0.005 70)).
Cards/Panels (Standard): var(--color-card) → (Assumed Dark) Very Dark Gray (oklch(0.15 0 0)).
Cards/Panels (Glassmorphism): oklch(0.15 0 0 / 0.6) with backdrop-blur-md. Border: Very thin, sharp gold border (oklch(0.8 0.1 85 / 0.7)).
Borders: var(--color-border) → (Assumed Dark) Dark Gray (oklch(0.3 0 0)).
Muted Text: var(--color-muted-foreground) → (Assumed Light-Mid Gray) Warm Mid-gray (oklch(0.55 0.008 70)).
Primary Action (Button/Highlight - METALLIC OVERRIDE): Use a rich Gold Leaf color: --color-gold-leaf: oklch(0.8 0.1 85);. Apply (var(--color-gold-leaf)) as background or border. Text: oklch(0.1 0.01 85) (Dark Brown/Black).
Secondary Accent (Subtle Detail): Use the same gold (var(--color-gold-leaf)) for very small details like icons or underlines.
Destructive: var(--color-destructive). Foreground: var(--color-destructive-foreground).
Feel: Luxury tech, ancient artifact meets future, dark elegance, premium, kintsugi-like contrast.

## Theme Concept 27: "Infrared Stealth"

Concept: Dark theme simulating thermal/infrared vision. Uses deep reds and oranges only for "hot" active elements against a very dark, cool base. Glassmorphism is like a heads-up display overlay.
Background: var(--color-background) → (Assumed Dark) Very dark, slightly cool gray/blue (oklch(0.14 0.005 250)).
Foreground/Text: var(--color-foreground) → (Assumed Light) Light cool gray (oklch(0.85 0.003 250)).
Cards/Panels (Standard): var(--color-card) → (Assumed Dark) Darker cool gray (oklch(0.19 0.005 250)).
Cards/Panels (Glassmorphism - "HUD"): oklch(0.19 0.005 250 / 0.3) with backdrop-blur-sm. Border: Faint green HUD-like border (oklch(0.7 0.1 140 / 0.3)).
Borders: var(--color-border) → (Assumed Dark) Cool dark gray (oklch(0.3 0.004 250)).
Muted Text: var(--color-muted-foreground) → (Assumed Light-Mid Gray) Cool mid-gray (oklch(0.5 0.003 250)).
Primary Action (Button/Highlight - THERMAL OVERRIDE): Use an intense "Hot" Orange/Red: --color-thermal-hot: oklch(0.7 0.24 45);. Apply (var(--color-thermal-hot)) as background/border. Text: oklch(0.95 0.01 45) (Light Yellow/White).
Secondary Accent (Active Data - THERMAL OVERRIDE): Use a less intense Yellow/Orange: oklch(0.85 0.18 70). Apply as text color for active data.
Destructive: Use the primary hot color (var(--color-thermal-hot)) or a slightly different intense red. Foreground: Light Yellow/White.
Feel: Stealth tech, thermal vision, tactical interface, heat signatures, focused detection.

## Theme Concept 28: "Woven Code Matrix"

Concept: Dark background featuring subtle, animated patterns like falling characters or woven lines (via CSS). Interface elements are clean glassmorphism layers. Accent is a sharp digital green.
Background: var(--color-background) → (Assumed Dark) Near Black (oklch(0.08 0.005 150)). Implement animated falling green characters or grid lines using CSS pseudo-elements or background properties.
Foreground/Text: var(--color-foreground) → (Assumed Light) Digital Green (oklch(0.8 0.2 145)). Use a monospace font.
Cards/Panels (Standard): var(--color-card) → (Assumed Dark) Dark Gray (oklch(0.15 0.002 150)).
Cards/Panels (Glassmorphism): oklch(0.15 0.002 150 / 0.5) with backdrop-blur-sm. Border: Dim green border (oklch(0.4 0.08 145 / 0.4)).
Borders: var(--color-border) → (Assumed Dark) Dim Green (oklch(0.3 0.05 145)).
Muted Text: var(--color-muted-foreground) → (Assumed Light-Mid Gray) Dimmer Green (oklch(0.5 0.1 145)).
Primary Action (Button/Highlight): Use the main foreground green (oklch(0.8 0.2 145)) as background or border on a darker element. Text: oklch(0.05 0.01 145) (Very Dark Green/Black).
Secondary Accent: Use White (oklch(1 0 0)) for specific highlights or critical text, providing stark contrast.
Destructive: var(--color-destructive) (Orange-red contrasts sharply). Foreground: var(--color-destructive-foreground).
Feel: Digital rain, code matrix, hacker aesthetic, flowing data streams, terminal chic.

## Theme Concept 29: "Amber Core Processor"

Concept: Dark theme simulating looking inside a processor. Uses dark silicon/graphite colors with glowing amber/orange traces representing active circuits. Glassmorphism layers are like protective casings.
Background: var(--color-background) → (Assumed Dark) Very Dark Gray (oklch(0.12 0 0)).
Foreground/Text: var(--color-foreground) → (Assumed Light) Light warm gray (oklch(0.9 0.005 70)).
Cards/Panels (Standard): var(--color-card) → (Assumed Dark) Dark Gray (oklch(0.18 0 0)).
Cards/Panels (Glassmorphism - "Casing"): oklch(0.18 0 0 / 0.6) with backdrop-blur-md. Border: Subtle warm gray border (oklch(0.4 0.01 70 / 0.3)).
Borders: var(--color-border) → (Assumed Dark) Mid-dark gray (oklch(0.35 0 0)).
Muted Text: var(--color-muted-foreground) → (Assumed Light-Mid Gray) Warm mid-gray (oklch(0.55 0.008 70)).
Primary Action (Button/Highlight - CIRCUIT TRACE OVERRIDE): Use a glowing Amber/Orange: --color-amber-trace: oklch(0.8 0.18 70);. Apply (var(--color-amber-trace)) as background/border. Add a subtle glow box-shadow: 0 0 6px 1px oklch(0.8 0.18 70 / 0.4);. Text: oklch(0.1 0.01 70) (Dark Brown/Black).
Secondary Accent (Subtle Lines): Use the same amber (var(--color-amber-trace)) for thin dividing lines or inactive icons.
Destructive: var(--color-destructive). Foreground: var(--color-destructive-foreground).
Feel: Microchip internals, circuit board traces, processing power, contained heat, computational core.
Theme Concept 30: "Void Bloom"
Concept: Extreme minimalism. Pure black background. Most elements are defined by light text or subtle borders. Interaction blooms with a single, vibrant acid color. Glassmorphism is almost invisible until interacted with.
Background: var(--color-background) → (Assumed Dark) Pure Black (oklch(0 0 0)).
Foreground/Text: var(--color-foreground) → (Assumed Light) Pure White (oklch(1 0 0)).
Cards/Panels (Standard): Defined only by borders: border border-[var(--color-border)]. No background fill.
Cards/Panels (Glassmorphism - Interactive): Initially transparent (background: transparent). On hover/active, fade in a subtle dark glass: background: oklch(0.1 0 0 / 0.3); backdrop-blur: 4px; transition: all 0.3s;. Border appears on interaction: border border-[var(--color-acid-bloom)].
Borders: var(--color-border) → (Assumed Dark) Very dim gray (oklch(0.25 0 0)). Used only where necessary for structure.
Muted Text: var(--color-muted-foreground) → (Assumed Light-Mid Gray) Mid-gray (oklch(0.5 0 0)).
Primary Action (Button/Highlight - ACID BLOOM OVERRIDE): Use an Acid Fuchsia/Magenta: --color-acid-bloom: oklch(0.75 0.25 330);. Apply (var(--color-acid-bloom)) as text color, border color, or a background that "blooms" on hover/active. Text on bloom: oklch(0 0 0) (Black).
Secondary Accent: None. Rely entirely on the primary acid bloom and white/gray text.
Destructive: var(--color-destructive) used as text color. Foreground: var(--color-destructive-foreground) potentially used for background on hover.
Feel: Ultimate minimalism, void interaction, bloom effects, high contrast focus, sparse interface, hidden power.

## Theme Concept 31: "Chameleon Circuit"

Concept: A dark base that subtly shifts its hue based on context or section (using CSS variables scoped to components or data attributes). Glassmorphism reflects this shift. Accents are consistent metallics.
Background: var(--color-background) → (Assumed Dark) Base dark gray (oklch(0.15 0 0)), but override with scoped variables like --context-hue: 250; background-color: oklch(0.15 0.01 var(--context-hue));.
Foreground/Text: var(--color-foreground) → (Assumed Light) Off-white (oklch(0.97 0 0)).
Cards/Panels (Standard): var(--color-card) → Use the context hue: oklch(0.2 0.01 var(--context-hue)).
Cards/Panels (Glassmorphism): oklch(0.2 0.01 var(--context-hue) / 0.6) with backdrop-blur-lg. Border reflects context: oklch(0.4 0.02 var(--context-hue) / 0.4).
Borders: var(--color-border) → Use context hue: oklch(0.35 0.015 var(--context-hue)).
Muted Text: var(--color-muted-foreground) → Use context hue: oklch(0.6 0.01 var(--context-hue)).
Primary Action (Button/Highlight - METALLIC OVERRIDE): Use a consistent Polished Chrome: --color-metallic-chrome: oklch(0.85 0 0);. Apply (var(--color-metallic-chrome)) as background. Text: oklch(0.1 0 0) (Near black).
Secondary Accent (Subtle): Use a consistent darker metallic like Gunmetal: oklch(0.4 0 0).
Destructive: var(--color-destructive). Foreground: var(--color-destructive-foreground).
Feel: Adaptive interface, context-aware design, complex systems, subtle shifts, unified metallic interactions.

## Theme Concept 32: "Hyperminimal Ink"

Concept: Pushes minimalism further than "Void Bloom". Black/dark background, white/light text. NO explicit cards/panels - layout defined purely by whitespace and typography. Interaction is shown only by changing text color to a single acid accent. No glassmorphism.
Background: var(--color-background) → (Assumed Dark) Pure Black (oklch(0 0 0)).
Foreground/Text: var(--color-foreground) → (Assumed Light) Pure White (oklch(1 0 0)). Typography choice is critical (clean sans-serif or monospace).
Cards/Panels: None. Structure via spacing (margins/padding) and headings.
Borders: None, or extremely rare 1px lines using var(--color-muted-foreground).
Muted Text: var(--color-muted-foreground) → (Assumed Light-Mid Gray) Mid-gray (oklch(0.5 0 0)).
Primary Action (Links/Buttons - ACID TEXT OVERRIDE): Interactive elements are just text. On hover/active, change text color to Acid Lime: --color-acid-ink: oklch(0.85 0.25 130);. a:hover { color: var(--color-acid-ink); }.
Secondary Accent: None.
Destructive: var(--color-destructive) used as text color for destructive actions.
Feel: Extreme minimalism, focus on content/data, command-line aesthetic, information-first, zero distraction, high contrast readability.

## Theme Concept 33: "Bio-Mechanical Weave" - $Best so far

Concept: Blends dark organic textures (like chitin or sinew, hinted via CSS) with sharp, metallic, almost surgical accents. Glassmorphism feels like viewing through a membrane.
Background: var(--color-background) → (Assumed Dark) Deep, desaturated Teal/Gray (oklch(0.16 0.01 190)). Add subtle CSS fibrous texture/pattern.
Foreground/Text: var(--color-foreground) → (Assumed Light) Very light cool gray (oklch(0.94 0.002 190)).
Cards/Panels (Standard): var(--color-card) → (Assumed Dark) Slightly darker Teal/Gray (oklch(0.21 0.01 190)).
Cards/Panels (Glassmorphism - "Membrane"): oklch(0.21 0.01 190 / 0.5) with backdrop-blur-md. Border: Thin, slightly iridescent border shifting between cyan/magenta (border-image: linear-gradient(...) 1;).
Borders: var(--color-border) → (Assumed Dark) Muted Teal/Gray (oklch(0.35 0.015 190)).
Muted Text: var(--color-muted-foreground) → (Assumed Light-Mid Gray) Cool mid-gray (oklch(0.5 0.005 190)).
Primary Action (Button/Highlight - METALLIC OVERRIDE): Use a sharp, surgical Steel/Chrome color: --color-surgical-steel: oklch(0.8 0 0);. Apply (var(--color-surgical-steel)) as background. Text: oklch(0.1 0 0) (Near black).
Secondary Accent (Status/Glow - ACID OVERRIDE): Use an Acidic Yellow-Green for vital signs/status: oklch(0.88 0.2 115).
Destructive: var(--color-destructive). Foreground: var(--color-destructive-foreground).
Feel: Bio-mechanical fusion, HR Giger aesthetic meets clean tech, organic machinery, advanced prosthetics/implants.

## Theme Concept 34: "Dark Crystal Lattice"

Concept: Uses a deep, near-black base suggesting a void, with interface elements defined by sharp, crystalline structures (borders, panel shapes) and refractive light accents. Glassmorphism mimics faceted crystal surfaces.
Background: var(--color-background) → (Assumed Dark) Near Black with a hint of deep blue (oklch(0.1 0.005 260)).
Foreground/Text: var(--color-foreground) → (Assumed Light) Crystalline White/Light Blue (oklch(0.97 0.005 220)).
Cards/Panels (Standard): Defined by sharp, geometric borders rather than filled backgrounds. Border: var(--color-border).
Cards/Panels (Glassmorphism - "Faceted"): oklch(0.15 0.01 260 / 0.3) with backdrop-blur-sm. Use clip-path potentially for sharp, non-rectangular shapes. Border: Sharp, thin Prismatic gradient border (see Accent).
Borders: var(--color-border) → (Assumed Dark) Sharp mid-tone blue/gray (oklch(0.4 0.01 260)).
Muted Text: var(--color-muted-foreground) → (Assumed Light-Mid Gray) Cool Gray (oklch(0.6 0.005 260)).
Primary Action (Button/Highlight - PRISMATIC GRADIENT OVERRIDE): Use a vibrant, sharp Prismatic Gradient for borders or text color: --color-crystal-prism: linear-gradient(90deg, oklch(0.8 0.25 330), oklch(0.7 0.18 250), oklch(0.85 0.25 130)) (Magenta -> Blue -> Lime). Apply to borders or as background-clip: text; color: transparent; background-image: var(--color-crystal-prism);. Button background could be dark var(--color-card).
Secondary Accent (Icons): Use a solid Acid Cyan (oklch(0.8 0.15 190)).
Destructive: var(--color-destructive). Foreground: var(--color-destructive-foreground).
Feel: Crystalline structures, advanced materials, light refraction, sharp geometry, digital energy storage.

## Theme Concept 35: "Ritual Tech"

Concept: Blends ancient ritual aesthetics (runes, stone textures hinted via CSS) with high-tech elements. Uses dark, earthy tones with glowing, symbolic accents. Glassmorphism feels like looking through enchanted artifacts.
Background: var(--color-background) → (Assumed Dark) Deep Charcoal/Stone Gray (oklch(0.18 0.003 270)). Add subtle stone texture via CSS.
Foreground/Text: var(--color-foreground) → (Assumed Light) Bone White/Light Beige (oklch(0.95 0.008 80)). Consider a slightly archaic or runic-inspired font for headings.
Cards/Panels (Standard): var(--color-card) → (Assumed Dark) Darker Stone Gray (oklch(0.23 0.003 270)).
Cards/Panels (Glassmorphism - "Artifact Lens"): oklch(0.23 0.003 270 / 0.5) with backdrop-blur-md. Border: Faint, glowing Amber border (oklch(0.8 0.15 60 / 0.3)).
Borders: var(--color-border) → (Assumed Dark) Muted Stone Gray (oklch(0.4 0.005 270)).
Muted Text: var(--color-muted-foreground) → (Assumed Light-Mid Gray) Light Stone Gray (oklch(0.6 0.005 270)).
Primary Action (Button/Highlight - GLOWING RUNE OVERRIDE): Use a glowing Ritual Amber/Orange: --color-ritual-glow: oklch(0.8 0.18 70);. Apply (var(--color-ritual-glow)) as background/border. Add text-shadow: 0 0 5px oklch(0.8 0.18 70 / 0.5); for text glow. Text: oklch(0.1 0.01 70) (Dark Brown).
Secondary Accent (Symbols/Icons): Use a deep Crimson Red (oklch(0.5 0.15 20)) for specific symbols or inactive states.
Destructive: var(--color-destructive). Foreground: var(--color-destructive-foreground).
Feel: Techno-shamanism, ancient future, ritualistic interface, symbolic power, Clarke's Third Law ("magic" indistinguishable from tech).

## Theme Concept 36: "Glitch Art Entropy"

Concept: Embraces digital decay and glitch aesthetics. Uses a dark base with intentionally "broken" elements, pixelation hints (CSS), and jarring acid color clashes. Glassmorphism is fractured or distorted.
Background: var(--color-background) → (Assumed Dark) Dark Gray (oklch(0.2 0 0)). Add subtle CSS glitch effects or pixelation patterns.
Foreground/Text: var(--color-foreground) → (Assumed Light) White (oklch(1 0 0)). Use a blocky or pixelated font potentially.
Cards/Panels (Standard): var(--color-card) → (Assumed Dark) Slightly lighter Dark Gray (oklch(0.25 0 0)). Apply subtle CSS clip-path for jagged edges occasionally.
Cards/Panels (Glassmorphism - "Fractured"): oklch(0.25 0 0 / 0.4) with backdrop-blur-sm. Use CSS transforms or filters to create a slight distortion effect. Border: Glitching between Acid Cyan and Magenta (border-color animated or using gradients).
Borders: var(--color-border) → (Assumed Dark) Mid-Gray (oklch(0.4 0 0)). Sometimes make them dashed or broken.
Muted Text: var(--color-muted-foreground) → (Assumed Light-Mid Gray) Mid-Gray (oklch(0.55 0 0)).
Primary Action (Button/Highlight - GLITCH ACCENT OVERRIDE): Use jarring Acid Cyan: --color-acid-glitch: oklch(0.8 0.15 190);. Apply (var(--color-acid-glitch)) as background. Text: oklch(0 0 0) (Black). Add CSS glitch animation on hover/active.
Secondary Accent (Error/Data Corruption): Use Acid Magenta (oklch(0.75 0.25 330)) for error messages or to highlight corrupted data.
Destructive: Use a stark, pixelated Red (oklch(0.6 0.2 25)). Foreground: White.
Feel: Digital decay, entropy, glitch art, corrupted data stream, unstable system aesthetic, cyberpunk malfunction.

## Theme Concept 37: "Dark Academia Tech"

Concept: Blends the aesthetics of dark academia (rich wood, leather textures hinted via CSS, classic typography) with clean, modern tech elements. Uses muted tones with a sophisticated accent. Glassmorphism is like polished library glass.
Background: var(--color-background) → (Assumed Dark) Deep, rich Brown/Oxblood (oklch(0.2 0.03 30)). Add subtle wood grain or leather texture.
Foreground/Text: var(--color-foreground) → (Assumed Light) Cream/Ivory (oklch(0.96 0.01 80)). Use a Serif font for headings, Sans-serif for body.
Cards/Panels (Standard): var(--color-card) → (Assumed Dark) Darker Brown (oklch(0.25 0.03 30)).
Cards/Panels (Glassmorphism - "Library Glass"): oklch(0.25 0.03 30 / 0.5) with backdrop-blur-md. Border: Thin, muted Gold/Brass border (oklch(0.7 0.08 85 / 0.5)).
Borders: var(--color-border) → (Assumed Dark) Muted Brown (oklch(0.4 0.02 30)).
Muted Text: var(--color-muted-foreground) → (Assumed Light-Mid Gray) Beige/Tan (oklch(0.6 0.03 70)).
Primary Action (Button/Highlight - SOPHISTICATED OVERRIDE): Use a deep Forest Green or Teal: --color-academia-accent: oklch(0.45 0.08 160);. Apply (var(--color-academia-accent)) as background. Text: var(--color-foreground) (Cream/Ivory).
Secondary Accent (Details): Use the muted Gold/Brass (oklch(0.7 0.08 85)) for icons or dividers.
Destructive: var(--color-destructive) (Orange-red contrasts). Foreground: var(--color-destructive-foreground).
Feel: Scholarly tech, digital library, sophisticated research, blending tradition and future, intellectual AI.

## Theme Concept 38: "Sentient Code Stream"

Concept: Similar to "Woven Code Matrix" but more organic and fluid. Animated background suggests living code. Glassmorphism layers are soft and flowing. Accents feel like pulses of awareness.
Background: var(--color-background) → (Assumed Dark) Deep Teal (oklch(0.15 0.02 190)). CSS animation simulates slow, flowing, interconnected lines or symbols in a slightly lighter teal.
Foreground/Text: var(--color-foreground) → (Assumed Light) Soft Cyan (oklch(0.9 0.04 190)).
Cards/Panels (Standard): var(--color-card) → (Assumed Dark) Darker Teal (oklch(0.2 0.02 190)). Rounded corners.
Cards/Panels (Glassmorphism - Soft): oklch(0.2 0.02 190 / 0.4) with backdrop-blur-lg. No harsh borders, maybe a very soft outer glow in the accent color.
Borders: var(--color-border) → (Assumed Dark) Muted Teal (oklch(0.35 0.025 190)). Used subtly.
Muted Text: var(--color-muted-foreground) → (Assumed Light-Mid Gray) Soft Mid-Teal (oklch(0.55 0.03 190)).
Primary Action (Button/Highlight - PULSE OVERRIDE): Use a warm, pulsing Magenta/Pink: --color-sentient-pulse: oklch(0.78 0.2 340);. Apply (var(--color-sentient-pulse)) as background. Add subtle pulse animation (scale/opacity). Text: oklch(0.1 0.01 340) (Dark Magenta).
Secondary Accent (Data Flow): Use the foreground cyan (oklch(0.9 0.04 190)) for data stream visualizations.
Destructive: var(--color-destructive). Foreground: var(--color-destructive-foreground).
Feel: Living code, sentient AI, fluid data, organic network, soft bio-luminescence, consciousness stream.

## Theme Concept 39: "Voidpunk Utility"

Concept: Embraces stark emptiness and functionalism associated with voidpunk. Pure black background, minimal elements, relies heavily on typography and a single, functional acid accent. Glassmorphism is almost non-existent or purely functional.
Background: var(--color-background) → (Assumed Dark) Pure Black (oklch(0 0 0)).
Foreground/Text: var(--color-foreground) → (Assumed Light) Pure White (oklch(1 0 0)). Use a clear, readable sans-serif.
Cards/Panels: Avoid if possible. Use whitespace and headings for structure. If needed, use simple outlines: border border-[var(--color-border)].
Cards/Panels (Glassmorphism - Tooltip Only): Maybe used only for tooltips or transient info popups: oklch(0.1 0 0 / 0.7) with backdrop-blur-sm.
Borders: var(--color-border) → (Assumed Dark) Dim Gray (oklch(0.3 0 0)). Used only for essential separation.
Muted Text: var(--color-muted-foreground) → (Assumed Light-Mid Gray) Mid Gray (oklch(0.5 0 0)).
Primary Action (Button/Link - FUNCTIONAL ACID OVERRIDE): Use Acid Green text color for all interactive elements: --color-void-action: oklch(0.8 0.2 145);. a { color: var(--color-void-action); } button { border: 1px solid var(--color-void-action); color: var(--color-void-action); background: transparent; }.
Secondary Accent: None. Everything non-interactive is white or gray.
Destructive: var(--color-destructive) used as text color.
Feel: Anti-aesthetic, pure function, voidpunk, stark contrast, information is key, rejects embellishment.

## Theme Concept 40: "Quantum Entanglement"

Concept: Dark theme suggesting the interconnectedness of quantum particles. Uses paired/complementary acid colors linked by effects or gradients. Glassmorphism layers feel like probability fields.
Background: var(--color-background) → (Assumed Dark) Deep Indigo (oklch(0.15 0.015 270)).
Foreground/Text: var(--color-foreground) → (Assumed Light) Light cool gray (oklch(0.95 0.002 270)).
Cards/Panels (Standard): var(--color-card) → (Assumed Dark) Darker Indigo (oklch(0.2 0.015 270)).
Cards/Panels (Glassmorphism - "Probability Field"): oklch(0.2 0.015 270 / 0.4) with backdrop-blur-lg. Border uses a subtle animated gradient shifting between the two accent colors.
Borders: var(--color-border) → (Assumed Dark) Muted Indigo (oklch(0.35 0.01 270)).
Muted Text: var(--color-muted-foreground) → (Assumed Light-Mid Gray) Cool mid-gray (oklch(0.55 0.005 270)).
Primary Action (Button/Highlight - PAIRED ACID OVERRIDE): Use Acid Cyan: --color-acid-pair1: oklch(0.8 0.15 190);. Apply (var(--color-acid-pair1)) as background. Text: oklch(0.1 0.01 190) (Dark Cyan).
Secondary Accent (Entangled State/Link - PAIRED ACID OVERRIDE): Use the complementary Acid Orange: --color-acid-pair2: oklch(0.75 0.2 55);. Apply (var(--color-acid-pair2)) as text color for related elements, icons, or secondary actions. Effects could link elements with these two colors (e.g., a line connecting them on hover).
Destructive: var(--color-destructive). Foreground: var(--color-destructive-foreground).
Feel: Quantum physics, interconnectedness, spooky action at a distance, paired states, advanced computation/simulation.

## Theme Concept 41: "Cryo Chamber"

Concept: An extremely cold, sterile dark theme using desaturated blues and cyans, with sharp white accents. Glassmorphism feels like frosted ice or cryo-glass.
Background: var(--color-background) → (Assumed Dark) Very dark, desaturated Cyan/Blue (oklch(0.18 0.01 210)).
Foreground/Text: var(--color-foreground) → (Assumed Light) Pure White (oklch(1 0 0)).
Cards/Panels (Standard): var(--color-card) → (Assumed Dark) Darker desaturated Cyan/Blue (oklch(0.23 0.01 210)).
Cards/Panels (Glassmorphism - "Frosted"): oklch(0.23 0.01 210 / 0.6) with backdrop-blur-xl. Add a subtle CSS filter: contrast(1.1) brightness(0.9); to enhance the frosted look. Border: White, semi-transparent (oklch(1 0 0 / 0.3)).
Borders: var(--color-border) → (Assumed Dark) Desaturated mid-blue/gray (oklch(0.4 0.005 210)).
Muted Text: var(--color-muted-foreground) → (Assumed Light-Mid Gray) Light desaturated blue/gray (oklch(0.6 0.005 210)).
Primary Action (Button/Highlight - STARK WHITE OVERRIDE): Use solid White (oklch(1 0 0)) as the background. Text: var(--color-background) (Assumed Dark desaturated blue).
Secondary Accent (Status/Indicators): Use a slightly brighter, less desaturated Cyan: oklch(0.7 0.08 195). Apply as text color or icon color.
Destructive: var(--color-destructive) (The orange-red provides a stark warning contrast). Foreground: var(--color-destructive-foreground).
Feel: Cryogenic suspension, sterile lab, extreme cold, preserved technology, suspended animation, clinical precision.

## Theme Concept 42: "Volcanic Forge"

Concept: Darkest grays and blacks suggesting cooled volcanic rock, with intense, glowing lava-like gradients for accents. Glassmorphism feels like heat haze or obsidian glass.
Background: var(--color-background) → (Assumed Dark) Very dark charcoal, near black (oklch(0.1 0.002 30)). Add subtle rocky texture via CSS.
Foreground/Text: var(--color-foreground) → (Assumed Light) Warm off-white (oklch(0.96 0.005 70)).
Cards/Panels (Standard): var(--color-card) → (Assumed Dark) Dark charcoal (oklch(0.15 0.002 30)).
Cards/Panels (Glassmorphism - "Obsidian"): oklch(0.15 0.002 30 / 0.5) with backdrop-blur-md. Border: Faint, glowing red/orange border (oklch(0.6 0.2 30 / 0.3)).
Borders: var(--color-border) → (Assumed Dark) Dark gray (oklch(0.3 0.002 30)).
Muted Text: var(--color-muted-foreground) → (Assumed Light-Mid Gray) Warm mid-gray (oklch(0.55 0.005 50)).
Primary Action (Button/Highlight - LAVA GRADIENT OVERRIDE): Use a fiery Red-Orange-Yellow gradient: --color-lava-flow: linear-gradient(90deg, oklch(0.6 0.2 25), oklch(0.75 0.24 50), oklch(0.9 0.2 80));. Apply (var(--color-lava-flow)) as background. Add subtle glow box-shadow: 0 0 10px 2px oklch(0.75 0.24 50 / 0.4);. Text: oklch(0.1 0.01 30) (Very Dark Brown/Black).
Secondary Accent (Warning/Heat): Use a solid bright Orange (oklch(0.75 0.2 55)) for specific warnings.
Destructive: Use the brightest red part of the lava gradient or a distinct intense red. Foreground: White.
Feel: Primal energy, volcanic forge, intense heat, raw power creation, earth's core, industrial furnace.

## Theme Concept 43: "Sentient Aurora Borealis"

Concept: Deep night sky background where complex, slowly shifting aurora-like gradients (greens, cyans, violets) are the primary visual element, subtly reacting to interaction. Glassmorphism panels are minimal, like looking through thin ice. Accents are sharp and crystalline.
Background: var(--color-background) → (Assumed Dark) Near Black (oklch(0.08 0.005 270)). Implement complex, animated mesh gradients or shader effects simulating auroras with oklch(0.4 0.1 150 / 0.3) (Green), oklch(0.4 0.1 200 / 0.3) (Cyan), oklch(0.4 0.08 290 / 0.3) (Violet) blending and shifting slowly.
Foreground/Text: var(--color-foreground) → (Assumed Light) Crisp, stark White (oklch(1 0 0)).
Cards/Panels (Standard): Avoid. Rely on layout and typography over the dynamic background.
Cards/Panels (Glassmorphism - "Ice Lens"): oklch(0.15 0.002 220 / 0.15) (Extremely transparent cool gray) with backdrop-blur-lg. Border: Thin, sharp white border (oklch(1 0 0 / 0.6)). Used very selectively for crucial info overlays.
Borders: None, except within glassmorphism.
Muted Text: var(--color-muted-foreground) → (Assumed Light-Mid Gray) Cool Gray (oklch(0.6 0.003 220)).
Primary Action (Button/Highlight - CRYSTAL OVERRIDE): Use solid White (oklch(1 0 0)) background for buttons, potentially with a subtle interaction effect that mirrors the aurora colors in a border glow. Text: var(--color-background) (Assumed Dark).
Secondary Accent (Icons/Status): Use a piercing Ice Blue (oklch(0.9 0.06 210)) for icons or status text.
Destructive: var(--color-destructive) (Orange-red provides stark contrast to the cool tones). Foreground: var(--color-destructive-foreground).
Feel: Living sky, sentient energy fields, cosmic intelligence, ethereal data visualization, arctic night tech.

## Theme Concept 44: "Chronosteel & Temporal Glitch"

Concept: Simulates a dark, brushed steel surface ("Chronosteel") that experiences subtle temporal distortions or glitches (CSS effects). Accents are sharp, precise, and potentially use color shifts to indicate temporal states. Glassmorphism is sharp-edged, like a time viewer.
Background: var(--color-background) → (Assumed Dark) Dark Brushed Steel (oklch(0.2 0.002 250)). Use CSS to add subtle anisotropic reflection hints and occasional, brief "glitch" effects (pixel shift, scan lines).
Foreground/Text: var(--color-foreground) → (Assumed Light) Clean Light Gray (oklch(0.9 0 0)).
Cards/Panels (Standard): var(--color-card) → (Assumed Dark) Slightly darker brushed steel (oklch(0.25 0.002 250)).
Cards/Panels (Glassmorphism - "Time Viewer"): oklch(0.25 0.002 250 / 0.5) with backdrop-blur-md. Sharp corners. Border: Thin, precise Cyan border (oklch(0.8 0.1 190 / 0.7)).
Borders: var(--color-border) → (Assumed Dark) Mid-tone steel gray (oklch(0.4 0.002 250)).
Muted Text: var(--color-muted-foreground) → (Assumed Light-Mid Gray) Steel Gray (oklch(0.55 0.002 250)).
Primary Action (Button/Highlight - SHIFTING ACCENT OVERRIDE): Use a base Acid Cyan (--color-acid-cyan: oklch(0.8 0.15 190);). On hover/active, transition the color sharply to Acid Magenta (--color-acid-magenta: oklch(0.75 0.25 330);) suggesting a state change. Text: oklch(0.05 0 0) (Near black).
Secondary Accent (Timestamps/Logs): Use a muted Gold/Amber (oklch(0.7 0.08 85)) for temporal data.
Destructive: var(--color-destructive). Foreground: var(--color-destructive-foreground).
Feel: Time manipulation tech, temporal mechanics, precise engineering, stable material with unstable energy, chrono-viewing.

## Theme Concept 45: "Symbiotic Circuitry (Light & Dark Hybrid)"

Concept: A base dark theme where certain elements "invert" to a clean light mode style upon interaction or to highlight critical information, suggesting two interconnected systems or a symbiotic relationship. Glassmorphism bridges the two. Requires careful implementation.
Background: var(--color-background) → (Assumed Dark) Deep Charcoal (oklch(0.15 0 0)).
Foreground/Text (Dark Context): var(--color-foreground) → (Assumed Light) Light Gray (oklch(0.9 0 0)).
Cards/Panels (Standard Dark): var(--color-card) → (Assumed Dark) Darker Charcoal (oklch(0.2 0 0)).
Cards/Panels (Inverted Light - Critical Info): background-color: oklch(1 0 0); color: oklch(0.1 0 0); border: 1px solid oklch(0.9 0 0); (White background, black text, light gray border). Used for focused modals or critical data sections.
Cards/Panels (Glassmorphism - Transition): oklch(0.5 0 0 / 0.3) (Mid-gray semi-transparent) with backdrop-blur-lg. Acts as a neutral layer between light/dark elements. Border: Faint white/gray (oklch(0.8 0 0 / 0.3)).
Borders (Dark Context): var(--color-border) → (Assumed Dark) Mid-Dark Gray (oklch(0.35 0 0)).
Muted Text (Dark Context): var(--color-muted-foreground) → (Assumed Light-Mid Gray) Mid Gray (oklch(0.55 0 0)).
Primary Action (Button/Highlight - DUAL OVERRIDE): Button appears dark (var(--color-card)) with light text (var(--color-foreground)). On hover/active, it inverts: background-color: oklch(1 0 0); color: oklch(0.1 0 0);. Or use a distinct Acid Accent like Lime (oklch(0.85 0.25 130)) that works on both light/dark backgrounds.
Destructive: var(--color-destructive) (Used consistently in both contexts). Foreground: var(--color-destructive-foreground).
Feel: Duality, interconnected systems, light/dark symbiosis, focused attention shift, complex state management.

## Theme Concept 46: "Dark Matter Weave"

Concept: Utilizes an extremely dark, textured background suggesting woven dark matter or exotic materials. Light seems to bend around elements. Accents are sparse, intensely glowing points. Glassmorphism is warped or lensing.
Background: var(--color-background) → (Assumed Dark) Near Black (oklch(0.05 0.002 280)). Use complex CSS background (SVG filter, shader) to simulate a subtle, dark weave or gravitational lensing texture.
Foreground/Text: var(--color-foreground) → (Assumed Light) Bright Cyan/White (oklch(0.98 0.01 190)).
Cards/Panels (Standard): Avoid solid panels. Use outlines or rely on typography and spacing.
Cards/Panels (Glassmorphism - "Warped Lens"): background: transparent; Apply CSS filter: blur(8px) contrast(1.2); to the area behind the element (requires advanced techniques). Border: Thin, glowing white line (oklch(1 0 0 / 0.7)).
Borders: None, except for specific highlights or glassmorphism.
Muted Text: var(--color-muted-foreground) → (Assumed Light-Mid Gray) Cool Mid-Gray (oklch(0.5 0.005 220)).
Primary Action (Button/Highlight - SINGULARITY POINT OVERRIDE): Represented by small, intensely glowing points or icons rather than large buttons. Use Acid Magenta: --color-acid-point: oklch(0.8 0.28 330);. Apply as icon color or small indicator with strong filter: drop-shadow(...) glow. Text labels might be separate.
Secondary Accent: None. Focus on the primary points.
Destructive: var(--color-destructive) used as text color or a small, glowing point. Foreground: var(--color-destructive-foreground).
Feel: Exotic physics, dark matter manipulation, gravitational lensing, high energy points, void interface, fundamental forces.

## Theme Concept 47: "Reactive Nanite Colony"

Concept: Dark theme where interface elements feel constructed from microscopic nanites. Uses slightly textured metallics, subtle animations suggesting assembly/disassembly, and shifting color accents based on state. Glassmorphism is like a containment field.
Background: var(--color-background) → (Assumed Dark) Dark Gunmetal Gray (oklch(0.2 0.003 270)). Add very subtle grain/noise texture.
Foreground/Text: var(--color-foreground) → (Assumed Light) Light Steel Gray (oklch(0.85 0.002 270)).
Cards/Panels (Standard): var(--color-card) → (Assumed Dark) Slightly darker Gunmetal (oklch(0.25 0.003 270)). Use CSS animations for subtle border shimmer or assembly effect on load/hover.
Cards/Panels (Glassmorphism - "Containment"): oklch(0.25 0.003 270 / 0.4) with backdrop-blur-md. Border: Animated thin line cycling through --color-state-active colors (see Accents).
Borders: var(--color-border) → (Assumed Dark) Mid-tone Gunmetal (oklch(0.4 0.004 270)).
Muted Text: var(--color-muted-foreground) → (Assumed Light-Mid Gray) Steel Gray (oklch(0.55 0.003 270)).
Primary/State Accents (Button/Highlight - REACTIVE OVERRIDE): Define state colors: --color-state-idle: oklch(0.6 0.005 270); (Gray), --color-state-active: oklch(0.8 0.15 190); (Cyan), --color-state-processing: oklch(0.95 0.2 95); (Yellow). Apply these variables (var(--color-state-...)) to backgrounds, borders, or icons based on the element's state. Text: oklch(0.1 0 0) (Near black) when background is light (Yellow), White otherwise.
Destructive: var(--color-destructive). Foreground: var(--color-destructive-foreground).
Feel: Nanotechnology, self-assembling structures, reactive materials, complex state machines, microscopic engineering.

## Theme Concept 48: "Deconstructed Code & Light Leaks"

Concept: A dark theme suggesting raw, deconstructed code or digital fragments. Uses monospace fonts, stark contrast, and simulates "light leaks" (using gradients/shadows) as accents. Glassmorphism is minimal and sharp.
Background: var(--color-background) → (Assumed Dark) Near Black (oklch(0.1 0 0)).
Foreground/Text: var(--color-foreground) → (Assumed Light) Pure White (oklch(1 0 0)). Use a crisp Monospace font.
Cards/Panels (Standard): Avoid solid fills. Use brackets [ ] or code comment styles // --- made with borders/pseudo-elements to delineate sections. Border: var(--color-muted-foreground).
Cards/Panels (Glassmorphism - Debugger): oklch(0.15 0.01 280 / 0.6) with backdrop-blur-sm. Sharp corners. Used only for overlays like debug panels. Border: var(--color-border).
Borders: var(--color-border) → (Assumed Dark) Dim Gray (oklch(0.3 0 0)).
Muted Text: var(--color-muted-foreground) → (Assumed Light-Mid Gray) Mid Gray (oklch(0.45 0 0)). Used for comments, inactive code.
Primary Action (Button/Highlight - LIGHT LEAK OVERRIDE): Buttons are text/borders. On hover/active, apply a box-shadow simulating a light leak: box-shadow: -5px 0px 15px 0px oklch(0.75 0.25 330 / 0.5), 5px 0px 15px 0px oklch(0.8 0.15 190 / 0.5); (Magenta leak from left, Cyan leak from right). Text color remains white.
Secondary Accent (Syntax Highlighting): Use specific colors for "keywords" (e.g., Acid Lime oklch(0.85 0.25 130)), "strings" (e.g., Amber oklch(0.8 0.18 70)).
Destructive: var(--color-destructive) used as text color.
Feel: Raw code, digital deconstruction, debugging interface, light leaks, terminal++ aesthetic, information fragments.

## Theme Concept 49: "Celestial Cartography"

Concept: Dark theme inspired by ancient star charts and celestial navigation. Uses deep blues, parchment textures (subtle CSS), and metallic gold/brass accents. Glassmorphism is like looking through a spyglass.
Background: var(--color-background) → (Assumed Dark) Deep Navy/Indigo (oklch(0.15 0.02 260)). Add subtle parchment texture overlay.
Foreground/Text: var(--color-foreground) → (Assumed Light) Antique Gold/Light Beige (oklch(0.9 0.03 85)). Consider a slightly formal or serif font.
Cards/Panels (Standard): var(--color-card) → (Assumed Dark) Darker Navy (oklch(0.2 0.02 260)).
Cards/Panels (Glassmorphism - "Spyglass"): oklch(0.2 0.02 260 / 0.4) with backdrop-blur-md. Border: Ornate, thin Gold border (oklch(0.75 0.1 85 / 0.6)).
Borders: var(--color-border) → (Assumed Dark) Muted Navy (oklch(0.35 0.015 260)).
Muted Text: var(--color-muted-foreground) → (Assumed Light-Mid Gray) Desaturated Gold/Beige (oklch(0.55 0.02 85)).
Primary Action (Button/Highlight - METALLIC OVERRIDE): Use Polished Brass/Gold: --color-celestial-gold: oklch(0.75 0.1 85);. Apply (var(--color-celestial-gold)) as background or border. Text: oklch(0.1 0.01 85) (Dark Brown).
Secondary Accent (Constellations/Lines): Use the foreground gold (oklch(0.9 0.03 85)) for drawing lines or constellation patterns.
Destructive: var(--color-destructive) (Orange-red). Foreground: var(--color-destructive-foreground).
Feel: Ancient knowledge, celestial navigation, astrolabe aesthetic, intricate maps, blending science and mysticism.

## Theme Concept 50: "Quantum Foam Glitch (Hybrid)"

Concept: Combines the ethereal lightness of "Quantum Foam" with the instability of "Glitch Art Entropy". Base is near-black void, elements are light/white, but interactions trigger intense, glitchy acid color bursts and visual distortions. Glassmorphism is unstable.
Background: var(--color-background) → (Assumed Dark) Pure Black (oklch(0 0 0)).
Foreground/Text: var(--color-foreground) → (Assumed Light) Pure White (oklch(1 0 0)).
Cards/Panels (Standard): Avoid. Use whitespace/borders.
Cards/Panels (Glassmorphism - Unstable): background: transparent;. On interaction/display, briefly flash oklch(0.1 0 0 / 0.2) with backdrop-blur-sm and CSS glitch filter effect. Border flashes with Acid Gradient (see Accent).
Borders: var(--color-border) → (Assumed Dark) Very Dim Gray (oklch(0.2 0 0)). Often invisible until interaction.
Muted Text: var(--color-muted-foreground) → (Assumed Light-Mid Gray) Dark Gray (oklch(0.4 0 0)).
Primary Action (Button/Highlight - GLITCH BURST OVERRIDE): Interactive elements (text links, invisible button areas) trigger a burst effect on hover/click: Text flashes to an Acid Gradient (--color-glitch-burst: linear-gradient(...) - e.g., Lime->Magenta->Cyan). Background might briefly flash a solid acid color. Requires JS/CSS animation.
Secondary Accent: None. Relies on primary burst.
Destructive: var(--color-destructive) used as text color, potentially with glitch effect on interaction.
Feel: Quantum instability, void manipulation, high-energy events, digital breakdown and reconstitution, unpredictable interface.

## Theme Concept 51: "Neural Ink Interface"

Concept: Dark theme simulating biological neural interfaces. Uses dark, organic tones with glowing, vein-like accents. Glassmorphism feels like looking through bio-gel or fluid. Typography is clean and clinical.
Background: var(--color-background) → (Assumed Dark) Deep, desaturated Bio-Purple/Gray (oklch(0.18 0.015 300)).
Foreground/Text: var(--color-foreground) → (Assumed Light) Light, slightly warm off-white (oklch(0.96 0.005 70)).
Cards/Panels (Standard): var(--color-card) → (Assumed Dark) Darker Bio-Purple/Gray (oklch(0.23 0.015 300)).
Cards/Panels (Glassmorphism - "Bio-Gel"): oklch(0.23 0.015 300 / 0.5) with backdrop-blur-lg. Border: Soft, glowing neuron-like border using the primary accent color (oklch(0.8 0.18 70 / 0.3)).
Borders: var(--color-border) → (Assumed Dark) Muted Purple/Gray (oklch(0.35 0.01 300)).
Muted Text: var(--color-muted-foreground) → (Assumed Light-Mid Gray) Soft Gray/Purple (oklch(0.55 0.01 300)).
Primary Action (Button/Highlight - NEURAL GLOW OVERRIDE): Use a warm, pulsing Amber/Orange glow: --color-neural-pulse: oklch(0.8 0.18 70);. Apply (var(--color-neural-pulse)) as background/border. Add text-shadow: 0 0 6px oklch(0.8 0.18 70 / 0.4); for text glow. Text: oklch(0.1 0.01 70) (Dark Brown).
Secondary Accent (Synapse Flash): Use brief flashes of Acid Cyan (oklch(0.8 0.15 190)) on specific data updates or connections.
Destructive: var(--color-destructive). Foreground: var(--color-destructive-foreground).
Feel: Neural interface, bio-augmentation, wetware, organic computation, mind-machine connection.

## Theme Concept 52: "Antimatter Containment"

Concept: Extreme contrast theme. Pure black void background. Containment fields represented by sharp, glowing geometric lines (borders). Interaction triggers intense, unstable energy effects using paired acid colors. Glassmorphism is like a flickering energy shield.
Background: var(--color-background) → (Assumed Dark) Pure Black (oklch(0 0 0)).
Foreground/Text: var(--color-foreground) → (Assumed Light) Pure White (oklch(1 0 0)).
Cards/Panels: Avoid fills. Use sharp geometric borders (var(--color-containment-field)) to define areas.
Cards/Panels (Glassmorphism - "Shield"): background: transparent;. On hover/active, apply box-shadow: inset 0 0 15px 5px var(--color-containment-field / 0.3); backdrop-filter: blur(2px); to simulate a flickering shield.
Borders: Define a containment field color: --color-containment-field: oklch(0.85 0.25 130); (Acid Lime). Apply (var(--color-containment-field)) to borders.
Muted Text: var(--color-muted-foreground) → (Assumed Light-Mid Gray) Dark Gray (oklch(0.4 0 0)).
Primary Action (Button/Highlight - ANNIHILATION BURST OVERRIDE): Interaction triggers a visual burst using paired, opposite colors: Lime (var(--color-containment-field)) and Magenta (--color-acid-magenta: oklch(0.75 0.25 330);). Use CSS animation to rapidly flash/blend these colors on the element's border or text on click/activation.
Secondary Accent: None. Focus on the primary burst.
Destructive: Use an intense Red (oklch(0.6 0.25 25)) text color, perhaps with instability effect.
Feel: Antimatter containment, extreme energy, high risk, unstable power, fundamental physics interface, void technology.