import { saveDataJson } from "../utils/saveDataJson.js";
import { $t, languageData } from "./translations.js";
import { state } from "./main.js";
import { getDopplerPhase, ItemIdPacker, ITEM_TYPES } from "../utils/index.js";

export const getPaintKits = async () => {
    const { paintKits } = state;
    const { folder } = languageData;

    const paintKitsList = Object.values(paintKits).map(paintKit => {
        const {
            paint_index,
            description_tag,
            wear_remap_min,
            wear_remap_max,
            style_id,
            style_name,
        } = paintKit;

        const nameTag = description_tag
            .replace("#", "");

        const descriptionTag = description_tag
            .replace("#", "")
            .replace("_Tag", "");

        const dopplerPhase = getDopplerPhase(paint_index);

        return {
            id: ItemIdPacker.pack(ITEM_TYPES.PaintKit, paint_index),
            paint_index: paint_index,
            name: String($t(nameTag)),
            description: $t(descriptionTag),
            wear: {
                wear_remap_min: wear_remap_min,
                wear_remap_max: wear_remap_max,
            },
            style: {
                id: style_id,
                name: $t(style_name),
            },
            phase: {
                name: dopplerPhase,
            },
            // Language translation keys
            i18n: {
                name: nameTag,
                description: descriptionTag,
            },
        };
    })
    .filter(item => item.name); // Filter out items without a name (if any translation fails or is missing)

    await saveDataJson(`./public/api/${folder}/paint_kits.json`, paintKitsList);
};
