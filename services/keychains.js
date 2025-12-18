import { saveDataJson } from "../utils/saveDataJson.js";
import { $t, languageData } from "./translations.js";
import { state } from "./main.js";
import { getImageUrl } from "../constants.js";
import { getRarityColor, ITEM_TYPES, ITEM_TYPE_NAMES, ItemIdPacker } from "../utils/index.js";

const isKeychain = item => {
    if (!item.loc_name.startsWith("#keychain_")) {
        return false;
    }

    if (item["is commodity"]) {
        return false;
    }

    return true;
};

const getMarketHashName = item => {
    return `${$t("CSGO_Tool_Keychain", true)} | ${$t(item.loc_name, true)}`;
};

const parseItem = item => {
    const { collectionsBySkins, cdnImages } = state;
    const DEF_INDEX_KEYCHAIN = 1355;
    const image =
        cdnImages[item.image_inventory.toLowerCase()] ?? getImageUrl(item.image_inventory.toLowerCase());

    return {
        id: ItemIdPacker.pack(ITEM_TYPES.Charm, DEF_INDEX_KEYCHAIN, item.object_id),
        name: $t(item.loc_name),
        description: $t("csgo_tool_keychain_desc"),
        def_index: DEF_INDEX_KEYCHAIN,
        keychain_index: item.object_id,
        type: {
            id: ITEM_TYPES.Charm,
            name: ITEM_TYPE_NAMES[ITEM_TYPES.Charm]
        },
        rarity: {
            id: `rarity_${item.item_rarity}`,
            name: $t(`rarity_${item.item_rarity}`),
            color: getRarityColor(`rarity_${item.item_rarity}`),
        },
        collections:
            collectionsBySkins?.[ItemIdPacker.pack(ITEM_TYPES.Charm, 1355, item.object_id)]?.map(i => ({
                ...i,
                name: $t(i.name),
            })) ?? [],
        market_hash_name: getMarketHashName(item),
        image,

        // Return original attributes from item_game.json
        original: {
            loc_name: item.loc_name,
            image_inventory: item.image_inventory.toLowerCase(),
        },

        // Language translation keys
        i18n: {
            name: item.loc_name,
            description: "csgo_tool_keychain_desc",
        },
    };
};

export const getKeychains = () => {
    const { keychainDefinitions } = state;
    const { folder } = languageData;

    const keychains = keychainDefinitions.filter(isKeychain).map(parseItem);

    return saveDataJson(`./public/api/${folder}/keychains.json`, keychains);
};
