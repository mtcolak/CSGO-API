import { saveDataJson } from "../utils/saveDataJson.js";
import { $t, languageData } from "./translations.js";
import { getImageUrl } from "../constants.js";
import { state } from "./main.js";
import { ITEM_TYPES, ITEM_TYPE_NAMES } from "../utils/index.js";

export const getTools = () => {
    const { cdnImages } = state;
    const { folder } = languageData;

    const tools = [
        {
            id: "tool-1",
            name: $t("csgo_tool_name_tag"),
            description: $t("csgo_tool_name_tag_desc"),
            image: cdnImages["econ/tools/tag"] ?? getImageUrl("econ/tools/tag"),
            def_index: "1200",
            type: {
                id: ITEM_TYPES.NameTag,
                name: ITEM_TYPE_NAMES[ITEM_TYPES.NameTag]
            },
            original: {
                image_inventory: "econ/tools/tag",
            },

            // Language translation keys
            i18n: {
                name: "csgo_tool_name_tag",
                description: "csgo_tool_name_tag_desc",
            },
        },
        {
            id: "tool-2",
            name: $t("csgo_tool_casket_tag"),
            description: $t("csgo_tool_casket_tag_desc"),
            image: cdnImages["econ/tools/casket"] ?? getImageUrl("econ/tools/casket"),
            def_index: "1201",
            type: {
                id: ITEM_TYPES.StorageUnit,
                name: ITEM_TYPE_NAMES[ITEM_TYPES.StorageUnit]
            },
            original: {
                image_inventory: "econ/tools/casket",
            },

            // Language translation keys
            i18n: {
                name: "csgo_tool_casket_tag",
                description: "csgo_tool_casket_tag_desc",
            },
        },
        {
            id: "tool-3",
            name: $t("csgo_tool_stattrak_swap"),
            description: $t("csgo_tool_stattrak_swap_desc"),
            image: cdnImages["econ/tools/stattrak_swap_tool"] ?? getImageUrl("econ/tools/stattrak_swap_tool"),
            def_index: "1324",
            type: {
                id: ITEM_TYPES.Tool,
                name: ITEM_TYPE_NAMES[ITEM_TYPES.Tool]
            },
            original: {
                image_inventory: "econ/tools/stattrak_swap_tool",
            },

            // Language translation keys
            i18n: {
                name: "csgo_tool_stattrak_swap",
                description: "csgo_tool_stattrak_swap_desc",
            },
        },
        {
            id: "tool-4",
            name: $t("csgo_removekeychainTool_title"),
            description: $t("csgo_removekeychaintool_desc"),
            image:
                cdnImages["econ/tools/keychain_remove_tool"] ??
                getImageUrl("econ/tools/keychain_remove_tool"),
            def_index: "65",
            type: {
                id: ITEM_TYPES.Tool,
                name: ITEM_TYPE_NAMES[ITEM_TYPES.Tool]
            },
            original: {
                image_inventory: "econ/tools/keychain_remove_tool",
            },

            // Language translation keys
            i18n: {
                name: "csgo_removekeychainTool_title",
                description: "csgo_removekeychaintool_desc",
            },
        },
    ];

    return saveDataJson(`./public/api/${folder}/tools.json`, tools);
};
