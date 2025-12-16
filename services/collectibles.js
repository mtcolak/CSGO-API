import { saveDataJson } from "../utils/saveDataJson.js";
import { $t, $tc, languageData } from "./translations.js";
import { state } from "./main.js";
import { getCollectibleRarity, getRarityColor, ITEM_TYPES, ITEM_TYPE_NAMES } from "../utils/index.js";
import { getImageUrl } from "../constants.js";

const isCollectible = item => {
    if (item.item_name === undefined) return false;

    if (item.item_name.startsWith("#CSGO_Collectible")) {
        return true;
    }

    if (item.item_name.startsWith("#CSGO_TournamentJournal")) {
        return true;
    }

    if (item.item_name.startsWith("#CSGO_TournamentPass") || item.item_name.startsWith("#CSGO_Ticket_")) {
        return true;
    }

    return false;
};

const getType = item => {
    if (item.image_inventory?.includes("service_medal")) return ITEM_TYPES.Medal;
    if (item.item_name?.startsWith("#CSGO_Collectible_Pin")) return ITEM_TYPES.Pin;
    if (item.attributes?.["tournament event id"]) return ITEM_TYPES.Trophy;

    if (item.item_name?.startsWith("#CSGO_TournamentPass")) {
        return item.item_name.endsWith("_charge") ? ITEM_TYPES.SouvenirToken : ITEM_TYPES.Pass;
    }
    if (item.item_name?.startsWith("#CSGO_Ticket_")) return ITEM_TYPES.Pass;

    if (item.item_name?.startsWith("#CSGO_Collectible_CommunitySeason")) {
        return item.prefab === "valve season_tiers" ? ITEM_TYPES.Star : ITEM_TYPES.Coin;
    }

    if (
        item.prefab === "collectible_untradable_coin" ||
        item.prefab === "premier_season_coin" ||
        item.item_name?.startsWith("#CSGO_Collectible_Map") ||
        item.item_name?.startsWith("#CSGO_TournamentJournal")
    ) {
        return ITEM_TYPES.Coin;
    }

    return null;
};

const getMarketHashName = item => {
    const isAttendance = item.prefab === "attendance_pin";
    const isCannotTrade = item.attributes?.["cannot trade"];

    if (isCannotTrade) {
        return null;
    }

    if (
        [ITEM_TYPES.Pin, ITEM_TYPES.SouvenirToken, ITEM_TYPES.Pass].includes(getType(item)) &&
        !isAttendance
    ) {
        return $t(item.item_name, true);
    }

    return null;
};

const parseItem = item => {
    const { cdnImages } = state;
    const isAttendance = item.prefab === "attendance_pin";
    const image = cdnImages[item.image_inventory] ?? getImageUrl(item.image_inventory);

    const rarity = item.item_rarity ? `rarity_${item.item_rarity}` : getCollectibleRarity(item?.prefab);
    const name = isAttendance
        ? $tc("collectible_genuine", {
              genuine: $t("genuine"),
              item_name: $t(item.item_name),
          })
        : $t(item.item_name);

    return {
        id: `collectible-${item.object_id}`,
        name,
        description: item.item_description
            ? $t(item.item_description)
            : item.item_description_prefab
              ? $t(item.item_description_prefab)
              : null,
        def_index: item.object_id,
        rarity: {
            id: rarity,
            name: $t(rarity),
            color: getRarityColor(rarity),
        },
        type: getType(item) ? { id: getType(item), name: ITEM_TYPE_NAMES[getType(item)] } : null,
        genuine: isAttendance,
        premier_season: item.attributes?.["premier season"],
        market_hash_name: getMarketHashName(item) || name,
        image,

        // Return original attributes from item_game.json
        original: {
            item_name: item.item_name,
            image_inventory: item.image_inventory,
        },

        // Language translation keys
        i18n: {
            name: item.item_name,
            description: item.item_description,
        },
    };
};

export const getCollectibles = async () => {
    const { items } = state;
    const { folder } = languageData;

    const collectibles = Object.values(items)
        .filter(isCollectible)
        .map(parseItem)
        .filter(collectible => collectible.name);

    await saveDataJson(`./public/api/${folder}/collectibles.json`, collectibles);
};
