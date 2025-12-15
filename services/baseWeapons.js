import { saveDataJson } from "../utils/saveDataJson.js";
import { $t, languageData } from "./translations.js";
import { getImageUrl } from "../constants.js";
import { weaponIDMapping } from "../utils/index.js";
import { state } from "./main.js";

export const getBaseWeapons = async () => {
    const { items, cdnImages } = state;
    const { folder } = languageData;

    const excludedWeapons = [
        "weapon_flashbang",
        "weapon_hegrenade",
        "weapon_smokegrenade",
        "weapon_molotov",
        "weapon_decoy",
        "weapon_incgrenade",
        "weapon_healthshot",
    ];

    const baseWeapons = Object.entries(weaponIDMapping)
        .filter(([weapon]) => !excludedWeapons.includes(weapon))
        .map(([weapon, defIndex]) => {
            const item = items[weapon];

            if (!item) return null;

            const nameKey = item.item_name ?? item.item_name_prefab;
            const descriptionKey = item.item_description ?? item.item_description_prefab;

            return {
                id: `base_weapon-${weapon}`,
                name: $t(nameKey),
                description: $t(descriptionKey),
                def_index: defIndex,
                image:
                    cdnImages[`econ/weapons/base_weapons/${weapon}`] ??
                    getImageUrl(`econ/weapons/base_weapons/${weapon}`),

                // Language translation keys
                i18n: {
                    name: nameKey,
                    description: descriptionKey,
                },
            };
        })
        .filter(Boolean)
        .sort((a, b) => a.def_index - b.def_index);

    await saveDataJson(`./public/api/${folder}/base_weapons.json`, baseWeapons);
};
