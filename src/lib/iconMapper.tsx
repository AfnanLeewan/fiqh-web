import {
    MenuBook,
    AutoStories,
    HistoryEdu,
    Balance,
    Mosque,
    Star,
    Gavel,
    Description,
    Folder,
    Article,
    School,
    Timer,
    Lightbulb,
    Public,
    EmojiObjects,
    WaterDrop,
    CleanHands,
    AccessTime,
    Favorite,
    MonetizationOn,
    Flight,
    Help, // For Doubt/Confusion
} from "@mui/icons-material";
import { SvgIconComponent } from "@mui/icons-material";

// Define a mapping of slugs to specific icons
const SLUG_ICON_MAP: Record<string, SvgIconComponent> = {
    // Common Islamic Topics
    fiqh: Balance,
    aqidah: Star,
    seerah: HistoryEdu,
    history: Timer,
    hadith: AutoStories,
    quran: MenuBook,
    tafsir: Lightbulb,
    ibadah: Mosque,
    muamalat: Gavel,

    // General/Fallback topics
    general: Public,
    basics: School,
    principles: EmojiObjects,
};

// Define mapping for keywords (title/slug partials) including Thai
const KEYWORD_ICON_MAP: Record<string, SvgIconComponent> = {
    "water": WaterDrop,
    "น้ำ": WaterDrop, // Thai for Water
    "cleanliness": CleanHands,
    "ความสะอาด": CleanHands, // Thai for Cleanliness
    "prayer": Mosque,
    "ละหมาด": Mosque,
    "salah": Mosque,
    "zakat": MonetizationOn,
    "fasting": AccessTime, // Or NoFood if available, AccessTime for 'Ramadan time'
    "sawm": AccessTime,
    "hajj": Flight, // Pilgrimage
    "umrah": Flight,
    "marriage": Favorite,
    "nikah": Favorite,
    "trade": Gavel,
    "inheritance": Balance,
    "doubt": Help,
    "suspicion": Help,
    "confusion": Help,
    "สงสัย": Help, // Thai for Doubt
    "สับสน": Help, // Thai for Confusion
};

// Define default icons for content types
const TYPE_ICON_MAP: Record<string, SvgIconComponent> = {
    category: MenuBook,
    chapter: Folder,
    article: Article,
};

/**
 * Returns a specific MUI Icon component if a match is found for the slug or title keywords.
 * Returns null if no specific match is found.
 */
export function findSpecificIcon(slug?: string, title?: string): SvgIconComponent | null {
    const normalizedSlug = slug?.toLowerCase() || "";
    const normalizedTitle = title?.toLowerCase() || "";

    // 1. Try to match by exact slug
    if (SLUG_ICON_MAP[normalizedSlug]) {
        return SLUG_ICON_MAP[normalizedSlug];
    }

    // 2. Try to match keys in slug
    const slugMatch = Object.keys(SLUG_ICON_MAP).find(key => normalizedSlug.includes(key));
    if (slugMatch) return SLUG_ICON_MAP[slugMatch];

    // 3. Search for keywords in Slug OR Title (including Thai)
    const keywordMatch = Object.keys(KEYWORD_ICON_MAP).find(key =>
        normalizedSlug.includes(key) || normalizedTitle.includes(key)
    );
    if (keywordMatch) return KEYWORD_ICON_MAP[keywordMatch];

    return null;
}

/**
 * Returns the default icon for a given content type.
 */
export function getDefaultIcon(type: string): SvgIconComponent {
    return TYPE_ICON_MAP[type] || Article;
}

/**
 * Returns the appropriate MUI Icon component for a given content item.
 * Legacy wrapper that combines specific lookup with default fallback.
 * @param type - The type of content (category, chapter, article)
 * @param slug - The slug of the content
 * @param title - The title of the content (for keyword matching)
 * @returns The MUI Icon component
 */
export function getIconForContent(type: string, slug?: string, title?: string): SvgIconComponent {
    const specific = findSpecificIcon(slug, title);
    if (specific) return specific;
    return getDefaultIcon(type);
}
