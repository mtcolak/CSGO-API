import { saveDataJson } from "../utils/saveDataJson.js";
import { languageData } from "./translations.js";

/**
 * Crate types with descriptions
 */
const CRATE_TYPES = [
    {
        id: 1,
        name: "Case",
        description: "Weapon cases contain a random weapon skin.",
    },
    {
        id: 2,
        name: "Souvenir",
        description: "Souvenir packages contain drops from professional esports matches.",
    },
    {
        id: 3,
        name: "Sticker Capsule",
        description: "Sticker capsules contain random sticker collections.",
    },
    {
        id: 4,
        name: "Graffiti",
        description: "Graffiti boxes contain random graffiti spray patterns.",
    },
    {
        id: 5,
        name: "Pins",
        description: "Pin collections contain commemorative pins.",
    },
    {
        id: 6,
        name: "Autograph Capsule",
        description: "Autograph capsules contain autographed items from pro players.",
    },
    {
        id: 7,
        name: "Patch Capsule",
        description: "Patch capsules contain agent clothing patches.",
    },
    {
        id: 8,
        name: "Music Kit Box",
        description: "Music kit boxes contain in-game music tracks.",
    },
];

/**
 * Parse crate type with translations
 * @param {object} crateType - The crate type data
 * @returns {object} Parsed crate type
 */
const parseCrateType = (crateType) => {
    return {
        id: crateType.id,
        name: crateType.name,
        description: crateType.description || null,
    };
};

/**
 * Get all crate types with translations
 * This function should be called after loadTranslations()
 */
export const getCrateTypes = async () => {
    const { folder } = languageData;

    // Parse all crate types
    const crateTypesArray = CRATE_TYPES.map(parseCrateType).filter(Boolean);

    // Save to file for each language
    await saveDataJson(`./public/api/${folder}/crate_types.json`, crateTypesArray);
};

/**
 * Get crate type by ID
 * @param {number} id - The crate type ID
 * @returns {object} Crate type data or null
 */
export const getCrateTypeById = (id) => {
    const crateType = CRATE_TYPES.find(ct => ct.id === id);
    return crateType ? parseCrateType(crateType) : null;
};

/**
 * Get crate type by name
 * @param {string} name - The crate type name
 * @returns {object} Crate type data or null
 */
export const getCrateTypeByName = (name) => {
    const crateType = CRATE_TYPES.find(ct => ct.name.toLowerCase() === name.toLowerCase());
    return crateType ? parseCrateType(crateType) : null;
};

/**
 * Get crate type ID by name (useful for database operations)
 * @param {string} name - The crate type name
 * @returns {number|null} Crate type ID or null
 */
export const getCrateTypeIdByName = (name) => {
    const crateType = CRATE_TYPES.find(ct => ct.name.toLowerCase() === name.toLowerCase());
    return crateType ? crateType.id : null;
};
