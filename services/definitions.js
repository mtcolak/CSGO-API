import fs from "fs";
import { saveDataJson } from "../utils/saveDataJson.js";
import { LANGUAGES_URL } from "../constants.js";
import { ITEM_TYPES } from "../utils/index.js";
import { $t } from "./translations.js";

const STATIC_ITEMS = [
    {
        def_index: 1209,
        name_token: '#CSGO_Tool_Sticker',
        description_token: '#CSGO_Tool_Sticker_Desc',
        type: ITEM_TYPES.Sticker,
        rarity_id: 0,
        image: "econ/tools/sticker" // Approximated
    },
    {
        def_index: 1355,
        name_token: '#CSGO_Tool_Keychain',
        description_token: '#CSGO_Tool_Keychain_Desc',
        type: ITEM_TYPES.Charm,
        rarity_id: 0,
        image: "econ/tools/keychain" // Approximated
    }
];

const getCrateType = (typeStr) => {
    switch (typeStr) {
        case "Weapon Case": return ITEM_TYPES.WeaponCase;
        case "Sticker Capsule": return ITEM_TYPES.StickerCapsule;
        case "Souvenir Package": return ITEM_TYPES.SouvenirPackage;
        case "Graffiti Box": return ITEM_TYPES.GraffitiBox;
        case "Pin Capsule": return ITEM_TYPES.PinCapsule;
        case "Autograph Capsule": return ITEM_TYPES.AutographCapsule;
        case "Patch Capsule": return ITEM_TYPES.PatchCapsule;
        case "Music Kit Box": return ITEM_TYPES.MusicKitBox;
        case "Self-Opening Case": return ITEM_TYPES.SelfOpeningCase;
        case "Terminal": return ITEM_TYPES.Terminal;
        default: return ITEM_TYPES.Container;
    }
};

const readJson = (filePath) => {
    if (!fs.existsSync(filePath)) return [];
    try {
        const data = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(data);
    } catch (e) {
        console.warn(`Failed to read ${filePath}:`, e);
        return [];
    }
};

export const getDefinitions = async () => {
    for (const langObj of LANGUAGES_URL) {
        const folder = langObj.folder;
        const basePath = `./public/api/${folder}`;

        const definitions = [];

        // 1. Static Definitions
        definitions.push(...STATIC_ITEMS.map(i => ({
            def_index: i.def_index,
            name: $t(i.name_token),
            description: $t(i.description_token),
            type: i.type,
            rarity_id: i.rarity_id,
            image: i.image,
            name_key: i.name_token,
            description_key: i.description_token
        })));

        // 2. Base Weapons
        const baseWeapons = readJson(`${basePath}/base_weapons.json`);
        definitions.push(...baseWeapons.map(i => ({
            def_index: i.def_index,
            name: i.name,
            description: i.description,
            type: 0, // Undefined / BaseWeapon
            rarity_id: 0,
            image: i.image,
            name_key: i.i18n?.name,
            description_key: i.i18n?.description
        })));

        // 3. Crates
        const crates = readJson(`${basePath}/crates.json`);
        definitions.push(...crates.map(i => ({
            def_index: Number(i.def_index),
            name: i.name,
            description: i.description,
            type: getCrateType(i.type),
            rarity_id: 0,
            image: i.image,
            name_key: i.i18n?.name,
            description_key: i.i18n?.description
        })));

        // 4. Agents
        const agents = readJson(`${basePath}/agents.json`);
        definitions.push(...agents.map(i => ({
            def_index: Number(i.def_index) || 0, // Some items might have non-numeric? Agents should have def_index.
            name: i.name,
            description: i.description,
            type: ITEM_TYPES.Agent,
            rarity_id: 0,
            image: i.image,
            name_key: i.i18n?.name,
            description_key: i.i18n?.description
        })));

        // 5. Patches
        const patches = readJson(`${basePath}/patches.json`);
        definitions.push(...patches.map(i => ({
            def_index: Number(i.def_index) || 0,
            name: i.name,
            description: i.description,
            type: ITEM_TYPES.Patch,
            rarity_id: 0,
            image: i.image,
            name_key: i.i18n?.name,
            description_key: i.i18n?.description
        })));

        // 6. Collectibles
        const collectibles = readJson(`${basePath}/collectibles.json`);
        definitions.push(...collectibles.map(i => ({
            def_index: Number(i.def_index) || 0,
            name: i.name,
            description: i.description,
            type: ITEM_TYPES.Collectible,
            rarity_id: 0,
            image: i.image,
            name_key: i.i18n?.name,
            description_key: i.i18n?.description
        })));

        // 7. Tools
        const tools = readJson(`${basePath}/tools.json`);
        definitions.push(...tools.map(i => ({
            def_index: Number(i.def_index) || 0,
            name: i.name,
            description: i.description,
            type: ITEM_TYPES.Tool,
            rarity_id: 0,
            image: i.image,
            name_key: i.i18n?.name,
            description_key: i.i18n?.description
        })));


        
        // Remove duplicates if any (by def_index)
        const uniqueDefinitions = Array.from(
            new Map(definitions.map(item => [item.def_index, item])).values()
        );
        
        // Filter out items with invalid def_index (0 or NaN) if necessary, 
        // though 0 might be valid for some default items? Usually def_index > 0.
        // We will keep them for now, assuming source files are correct.

        await saveDataJson(`${basePath}/definitions.json`, uniqueDefinitions);
        console.log(`Generated definitions.json for ${folder} (${uniqueDefinitions.length} items)`);
    }
};
