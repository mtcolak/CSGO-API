import { saveDataJson } from "../utils/saveDataJson.js";
import { $t, languageData } from "./translations.js";
import { state } from "./main.js";

/**
 * Paint kit style descriptions
 * Source: https://www.counter-strike.net/workshop/workshopfinishes
 */
const PAINT_KIT_STYLE_DESCRIPTIONS = {
    0: "None",
    1: "Individual components of the weapon are painted with up to four unique colors before reassembly.",
    2: "Disassembled weapon parts are lowered through a floating hydrographic film on the surface of a water tank. The film adheres to the primed weapon parts, covering the surface with a pattern.",
    3: "The weapon is spray-painted with multiple coats through stencil patterns.",
    4: "Many common firearms materials cannot be anodized. Instead the effect is often mimicked by applying a colored candy coat over a chrome base.",
    5: "In this style, the candy coat may be applied in a multicolored pattern. In the real world, methods could include silk-screening or adherable stencils.",
    6: "This style emulates applying the candy coat via freehand airbrushing.",
    7: "A patina is a chemical reaction that forms a non-reactive, hardened shell over metallic parts. Real-life weapon patinas include case hardening, cold bluing, and acid forced patinas.",
    8: "This style enables extremely customized looks in a full range of colors.",
    9: "This style uses a combination of patina and custom paint styles.",
    10: "A case hardening is a method of hardening steel surfaces by infusing them with carbon or nitrogen, creating a hard shell. Color case hardening adds distinctive hues through controlled oxidation.",
};

/**
 * Parse paint kit style with translations
 * @param {number} styleId - The style ID
 * @param {string} styleName - The style translation key
 * @returns {object} Parsed paint kit style
 */
const parsePaintKitStyle = (styleId, styleName) => {
    // Get the style name translation
    const translatedName = $t(styleName);

    // Map style IDs to their names if translation is not found
    const styleNames = {
        0: "Default",
        1: "Solid Color",
        2: "Hydrographic",
        3: "Gunsmith",
        4: "Fade",
        5: "Anodized",
    };

    // Get description (currently in English, can be translated in future)
    const description = PAINT_KIT_STYLE_DESCRIPTIONS[styleId] || null;

    return {
        id: styleId,
        name: translatedName && translatedName.length > 0 
            ? translatedName 
            : styleNames[styleId] || `Finish Style ${styleId}`,
        description: description,
    };
};

/**
 * Get all paint kit styles with translations
 * This function should be called after loadTranslations() and loadPaintKits()
 */
export const getPaintKitStyles = async () => {
    const { paintKits } = state;
    const { folder } = languageData;

    if (!paintKits || Object.keys(paintKits).length === 0) {
        console.warn("Paint kits data not loaded. Make sure loadPaintKits() was called first.");
        return [];
    }

    // Collect all unique styles
    const stylesMap = new Map();

    Object.values(paintKits).forEach(paintKit => {
        const styleKey = `${paintKit.style_id}`;
        
        if (!stylesMap.has(styleKey)) {
            stylesMap.set(styleKey, {
                id: paintKit.style_id,
                style_name: paintKit.style_name,
            });
        }
    });

    // Parse and sort by ID
    const paintKitStylesArray = Array.from(stylesMap.values())
        .map(style => parsePaintKitStyle(style.id, style.style_name))
        .sort((a, b) => a.id - b.id);

    // Save to file for each language
    await saveDataJson(`./public/api/${folder}/paint_kit_styles.json`, paintKitStylesArray);
};

/**
 * Get paint kit style by ID
 * @param {number} id - The style ID
 * @returns {object} Style data or null
 */
export const getPaintKitStyleById = (id) => {
    const { paintKits } = state;

    for (const paintKit of Object.values(paintKits)) {
        if (paintKit.style_id === id) {
            return parsePaintKitStyle(id, paintKit.style_name);
        }
    }

    return null;
};

/**
 * Get all paint kits for a specific style
 * @param {number} styleId - The style ID
 * @returns {array} Paint kits with this style
 */
export const getPaintKitsByStyle = (styleId) => {
    const { paintKits } = state;

    return Object.entries(paintKits)
        .filter(([_, paintKit]) => paintKit.style_id === styleId)
        .map(([name, paintKit]) => ({
            id: `paint_kit-${paintKit.paint_index}`,
            paint_index: paintKit.paint_index,
            name: name,
        }));
};

/**
 * Get style statistics
 * @returns {array} Styles with their paint kit counts
 */
export const getPaintKitStyleStats = () => {
    const { paintKits } = state;
    const statsMap = new Map();

    Object.values(paintKits).forEach(paintKit => {
        const styleId = paintKit.style_id;
        
        if (!statsMap.has(styleId)) {
            statsMap.set(styleId, {
                id: styleId,
                style_name: paintKit.style_name,
                count: 0,
            });
        }

        const stats = statsMap.get(styleId);
        stats.count++;
    });

    return Array.from(statsMap.values())
        .map(stat => ({
            ...parsePaintKitStyle(stat.id, stat.style_name),
            paint_kit_count: stat.count,
        }))
        .sort((a, b) => a.id - b.id);
};
