import { saveDataJson } from "../utils/saveDataJson.js";
import { $t, languageData } from "./translations.js";
import { state } from "./main.js";
import { getImageUrl } from "../constants.js";
import { getRarityColor, ITEM_TYPES, ITEM_TYPE_NAMES, ItemIdPacker } from "../utils/index.js";

const isPatch = item => {
    if (["case_skillgroups/patch_legendaryeagle"].includes(item.patch_material)) {
        return false;
    }

    return !(item.patch_material === undefined);
};

const getDescription = item => {
    let msg = $t("CSGO_Tool_Patch_Desc");
    let desc = $t(item.description_string);
    if (desc && desc.length > 0) {
        msg = `${msg}<br><br>${desc}`;
    }
    return msg;
};

const parseItem = item => {
    const { cdnImages } = state;
    const image =
        cdnImages[`econ/patches/${item.patch_material}`] ??
        getImageUrl(`econ/patches/${item.patch_material}`);

    return {
        id: ItemIdPacker.pack(ITEM_TYPES.Patch, item.object_id),
        name: $t(item.item_name),
        description: $t(item.description_string),
        def_index: item.object_id,
        type: {
            id: ITEM_TYPES.Patch,
            name: ITEM_TYPE_NAMES[ITEM_TYPES.Patch]
        },
        rarity: {
            id: `rarity_${item.item_rarity}`,
            name: $t(`rarity_${item.item_rarity}`),
            color: getRarityColor(`rarity_${item.item_rarity}`),
        },
        market_hash_name: `${$t("csgo_tool_patch", true)} | ${$t(item.item_name, true)}`,
        image,

        // Return original attributes from item_game.json
        original: {
            name: item.name,
            image_inventory: `econ/patches/${item.patch_material}`,
        },

        // Language translation keys
        i18n: {
            name: item.item_name,
            description: item.description_string
        },
    };
};

export const getPatches = () => {
    const { stickerKits } = state;
    const { folder } = languageData;

    const patches = stickerKits.filter(isPatch).map(parseItem);

    return saveDataJson(`./public/api/${folder}/patches.json`, patches);
};
