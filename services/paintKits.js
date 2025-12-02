import { saveDataJson } from "../utils/saveDataJson.js";
import { $t, $tTag, languageData } from "./translations.js";
import { state } from "./main.js";

/**
 * Parse paint kit data with translations
 * @param {string} paintKitName - The paint kit name (lowercase)
 * @param {object} paintKit - The paint kit data from state
 * @returns {object} Parsed paint kit
 */
const parsePaintKit = (paintKitName, paintKit) => {
    if (!paintKit) return null;

    // Get the translated name from description_tag (short name)
    // Example: "#PaintKit_hy_arctic_Tag" -> "Arctic Camo"
    const translatedName = $t(paintKit.description_tag);
    
    // Get the full description from description_string (long description)
    // Example: "#PaintKit_hy_arctic" -> "It has been painted using an arctic camo hydrographic.\n\n<i>Snow is cold; death is colder</i>"
    const description = paintKit.description_string ? $t(paintKit.description_string) : null;
    
    // Get the style name translation
    const styleName = $t(paintKit.style_name);

    return {
        id: `paint_kit-${paintKit.paint_index}`,
        paint_index: paintKit.paint_index,
        code: paintKit.code,
        name: translatedName && translatedName.length > 0 ? translatedName : paintKitName,
        description: description && description.length > 0 ? description : null,
        wear: {
            min_float: parseFloat(paintKit.wear_remap_min.toFixed(2)),
            max_float: parseFloat(paintKit.wear_remap_max.toFixed(2)),
        },
        style: {
            id: paintKit.style_id,
            name: styleName && styleName.length > 0 
                ? styleName 
                : `Finish Style ${paintKit.style_id}`,
        },
        legacy_model: paintKit.legacy_model,
    };
};

/**
 * Get all paint kits with translations
 * This function should be called after loadTranslations() and loadPaintKits()
 */
export const getPaintKits = async () => {
    const { paintKits } = state;
    const { folder } = languageData;

    if (!paintKits || Object.keys(paintKits).length === 0) {
        console.warn("Paint kits data not loaded. Make sure loadPaintKits() was called first.");
        return [];
    }

    // Convert paint kits object to array
    const paintKitsArray = Object.entries(paintKits)
        .map(([paintKitName, paintKit]) => parsePaintKit(paintKitName, paintKit))
        .filter(Boolean)
        // Sort by paint_index for consistency
        .sort((a, b) => parseInt(a.paint_index) - parseInt(b.paint_index));

    // Save to file for each language
    await saveDataJson(`./public/api/${folder}/paint_kits.json`, paintKitsArray);
};

/**
 * Get paint kit by paint index
 * @param {string|number} paintIndex - The paint index
 * @returns {object} Paint kit data or null
 */
export const getPaintKitByIndex = (paintIndex) => {
    const { paintKits } = state;

    for (const [name, kit] of Object.entries(paintKits)) {
        if (kit.paint_index === paintIndex.toString()) {
            return parsePaintKit(name, kit);
        }
    }

    return null;
};

/**
 * Get paint kit by name
 * @param {string} name - The paint kit name (lowercase)
 * @returns {object} Paint kit data or null
 */
export const getPaintKitByName = (name) => {
    const { paintKits } = state;
    const paintKit = paintKits[name.toLowerCase()];

    return paintKit ? parsePaintKit(name, paintKit) : null;
};

/**
 * Get paint kits grouped by style
 * @returns {object} Paint kits grouped by style ID
 */
export const getPaintKitsGroupedByStyle = () => {
    const { paintKits } = state;

    return Object.entries(paintKits).reduce((acc, [paintKitName, paintKit]) => {
        const styleId = paintKit.style_id;

        if (!acc[styleId]) {
            acc[styleId] = [];
        }

        acc[styleId].push(parsePaintKit(paintKitName, paintKit));
        return acc;
    }, {});
};

/**
 * Get paint kits filtered by wear range
 * @param {number} minWear - Minimum wear value
 * @param {number} maxWear - Maximum wear value
 * @returns {array} Filtered paint kits
 */
export const getPaintKitsInWearRange = (minWear, maxWear) => {
    const { paintKits } = state;

    return Object.entries(paintKits)
        .filter(([_, paintKit]) => {
            const kitMax = paintKit.wear_remap_max;
            const kitMin = paintKit.wear_remap_min;
            // Check if wear ranges overlap
            return minWear <= kitMax && maxWear >= kitMin;
        })
        .map(([paintKitName, paintKit]) => parsePaintKit(paintKitName, paintKit))
        .sort((a, b) => parseFloat(a.wear.min_float) - parseFloat(b.wear.min_float));
};

/**
 * Get all unique styles used in paint kits
 * @returns {array} Array of unique styles
 */
export const getPaintKitStyles = () => {
    const { paintKits } = state;
    const styles = new Map();

    Object.values(paintKits).forEach(paintKit => {
        const key = `${paintKit.style_id}`;
        
        if (!styles.has(key)) {
            const styleName = $t(paintKit.style_name);
            styles.set(key, {
                id: paintKit.style_id,
                name: styleName && styleName.length > 0 
                    ? styleName 
                    : `Finish Style ${paintKit.style_id}`,
            });
        }
    });

    return Array.from(styles.values()).sort((a, b) => a.id - b.id);
};
