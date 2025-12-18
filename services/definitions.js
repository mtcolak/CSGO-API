import fs from "fs";
import { saveDataJson } from "../utils/saveDataJson.js";
import { LANGUAGES_URL } from "../constants.js";
import { ITEM_TYPES, ITEM_TYPE_NAMES, getRarityColor, ItemIdPacker } from "../utils/index.js";
import { $t } from "./translations.js";

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

        const STATIC_ITEMS = [
            {
                def_index: 1209,
                id: ItemIdPacker.pack(ITEM_TYPES.Sticker, 1209),
                name_token: '#CSGO_Tool_Sticker',
                description_token: '#CSGO_Tool_Sticker_Desc',
                type: { id: ITEM_TYPES.Sticker, name: ITEM_TYPE_NAMES[ITEM_TYPES.Sticker] },
                rarity: {
                    id: "rarity_common",
                    name: $t("rarity_common"),
                    color: getRarityColor("rarity_common")
                },
                image: "econ/tools/sticker" // Approximated
            },
            {
                def_index: 1355,
                id: ItemIdPacker.pack(ITEM_TYPES.Charm, 1355),
                name_token: '#CSGO_Tool_Keychain',
                description_token: '#CSGO_Tool_Keychain_Desc',
                type: { id: ITEM_TYPES.Charm, name: ITEM_TYPE_NAMES[ITEM_TYPES.Charm] },
                rarity: {
                    id: "rarity_common",
                    name: $t("rarity_common"),
                    color: getRarityColor("rarity_common")
                },
                image: "econ/tools/keychain" // Approximated
            },
            {
                def_index: 58,
                id: ItemIdPacker.pack(ITEM_TYPES.MusicKit, 58),
                name_token: '#CSGO_Type_MusicKit',
                description_token: '#CSGO_MusicKit_Desc',
                type: { id: ITEM_TYPES.MusicKit, name: ITEM_TYPE_NAMES[ITEM_TYPES.MusicKit] },
                rarity: {
                    id: "rarity_default",
                    name: $t("rarity_default"),
                    color: getRarityColor("rarity_default")
                },
                image: "econ/tools/music_kit" // Approximated
            },
            {
                def_index: 1348,
                id: ItemIdPacker.pack(ITEM_TYPES.Graffiti, 1348),
                name_token: '#CSGO_Tool_Spray',
                description_token: '#CSGO_Tool_Spray_Desc',
                type: { id: ITEM_TYPES.Graffiti, name: ITEM_TYPE_NAMES[ITEM_TYPES.Graffiti] },
                rarity: {
                    id: "rarity_default",
                    name: $t("rarity_default"),
                    color: getRarityColor("rarity_default")
                },
                image: "econ/tools/spray" // Approximated
            }
        ];

        // 1. Static Definitions
        definitions.push(...STATIC_ITEMS.map(i => ({
            id: i.id,
            def_index: i.def_index,
            name: $t(i.name_token),
            description: $t(i.description_token),
            type: i.type,
            rarity: i.rarity,
            image: i.image,
            i18n: {
                name: i.name_token,
                description: i.description_token
            }
        })));

        // 2. Base Weapons
        const baseWeapons = readJson(`${basePath}/base_weapons.json`);
        definitions.push(...baseWeapons.map(i => ({
            id: i.id,
            def_index: i.def_index,
            name: i.name,
            description: i.description,
            type: i.type,
            rarity: {
                id: "rarity_default",
                name: $t("rarity_default"),
                color: getRarityColor("rarity_default")
            },
            image: i.image,
            i18n: {
                name: i.i18n?.name,
                description: i.i18n?.description
            }
        })));

        // 3. Crates
        const crates = readJson(`${basePath}/crates.json`);
        definitions.push(...crates.map(i => ({
            id: i.id,
            def_index: Number(i.def_index),
            name: i.name,
            description: i.description,
            type: i.type,
            rarity: i.rarity,
            image: i.image,
            i18n: {
                name: i.i18n?.name,
                description: i.i18n?.description
            }
        })));

        // 4. Agents
        const agents = readJson(`${basePath}/agents.json`);
        definitions.push(...agents.map(i => ({
            id: i.id,
            def_index: Number(i.def_index) || 0, // Some items might have non-numeric? Agents should have def_index.
            name: i.name,
            description: i.description,
            type: { id: ITEM_TYPES.Agent, name: ITEM_TYPE_NAMES[ITEM_TYPES.Agent] },
            rarity: i.rarity,
            image: i.image,
            i18n: {
                name: i.i18n?.name,
                description: i.i18n?.description
            }
        })));

        // 5. Patches
        const patches = readJson(`${basePath}/patches.json`);
        definitions.push(...patches.map(i => ({
            id: i.id,
            def_index: Number(i.def_index) || 0,
            name: i.name,
            description: i.description,
            type: { id: ITEM_TYPES.Patch, name: ITEM_TYPE_NAMES[ITEM_TYPES.Patch] },
            rarity: i.rarity,
            image: i.image,
            i18n: {
                name: i.i18n?.name,
                description: i.i18n?.description
            }
        })));

        // 6. Collectibles
        const collectibles = readJson(`${basePath}/collectibles.json`);
        definitions.push(...collectibles.map(i => ({
            id: i.id,
            def_index: Number(i.def_index) || 0,
            name: i.name,
            description: i.description,
            type: { id: ITEM_TYPES.Collectible, name: ITEM_TYPE_NAMES[ITEM_TYPES.Collectible] },
            rarity: i.rarity,
            image: i.image,
            i18n: {
                name: i.i18n?.name,
                description: i.i18n?.description
            }
        })));

        // 7. Tools
        const tools = readJson(`${basePath}/tools.json`);
        definitions.push(...tools.map(i => ({
            id: i.id,
            def_index: Number(i.def_index) || 0,
            name: i.name,
            description: i.description,
            type: { id: ITEM_TYPES.Tool, name: ITEM_TYPE_NAMES[ITEM_TYPES.Tool] },
            rarity: {
                id: "rarity_common",
                name: $t("rarity_common"),
                color: getRarityColor("rarity_common")
            },
            image: i.image,
            i18n: {
                name: i.i18n?.name,
                description: i.i18n?.description
            }
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
