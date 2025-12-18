import { saveDataJson } from "../utils/saveDataJson.js";
import { $t, languageData } from "./translations.js";
import { state } from "./main.js";
import { getImageUrl } from "../constants.js";
import { ITEM_TYPES, ItemIdPacker } from "../utils/index.js";

const isCollection = item => item.is_collection !== undefined;

const isSelfOpeningCollection = item => {
    if (item.item_name === undefined) return false;

    if (!item.item_name.startsWith("#CSGO_crate")) {
        return false;
    }

    if (item.item_name.includes("#CSGO_crate_tool_stattrak_swap")) {
        return false;
    }

    if (item.prefab?.includes("weapon_case_key")) {
        return false;
    }

    // Can't really find a way to filter collections
    // if (item.item_type === undefined) {
    //     if (item.translation_name.includes("Collection")) {
    //         return true;
    //     }
    // }

    if (item.item_type === "self_opening_purchase") {
        if (item.prefab.includes("graffiti")) {
            return true;
        }
    }

    return false;
};

const parseItem = item => {
    const { skinsByCollections, cratesByCollections, cdnImages } = state;

    const fileName = `${item.name.replace("#CSGO_", "")}`;
    const image = cdnImages[`econ/set_icons/${fileName}`] ?? getImageUrl(`econ/set_icons/${fileName}`);

    return {
        id: item.name.replace("#CSGO_", ""),
        name: item.name_force ? $t(item.name_force) : $t(item.name),
        description: item.name_force ? $t(`${item.name_force}_desc`) : $t(`${item.name}_desc`),
        crates: (cratesByCollections?.[item.name.replace("#CSGO_", "")] ?? []).map(i => ({
            id: i.id,
            name: $t(i.name),
        })),
        contains: skinsByCollections?.[item.name.replace("#CSGO_", "")].map(i => ({
            id: i.id,
            name: i.name instanceof Object ? `${$t(i.name.weapon)} | ${$t(i.name.pattern)}` : $t(i.name),
        })),
        image,

        // Return original attributes from item_game.json
        original: {
            name: item.name,
            image_inventory: `econ/set_icons/${fileName}`,
        },

        // Language translation keys
        i18n: {
            name: item.name_force ? item.name_force : item.name,
            description: item.name_force ? `${item.name_force}_desc` : `${item.name}_desc`,
        },
    };
};

const parseItemSelfOpening = item => {
    const { skinsByCollections, cdnImages } = state;

    const image =
        cdnImages[item.image_inventory.toLowerCase()] ?? getImageUrl(item.image_inventory.toLowerCase());

    return {
        id: item.object_id,
        name: $t(item.item_name),
        crates: [],
        contains: (skinsByCollections?.[item.name] ?? []).map(i => ({
            id: i.id,
            name: i.name instanceof Object ? `${$t(i.name.weapon)} | ${$t(i.name.pattern)}` : $t(i.name),
        })),
        image,

        // Return original attributes from item_game.json
        original: {
            name: item.name,
            item_name: item.item_name,
            image_inventory: item.image_inventory.toLowerCase(),
        },

        i18n: {
            name: item.item_name,
            description: `${item.item_name}_desc`,
        },
    };
};

export const getCollections = async () => {
    const { items, itemSets } = state;
    const { folder } = languageData;

    const collections = [
        ...itemSets.filter(isCollection).map(parseItem),
        ...Object.values(items).filter(isSelfOpeningCollection).map(parseItemSelfOpening),
    ].filter(collection => collection.name);

    await saveDataJson(`./public/api/${folder}/collections.json`, collections);
};
