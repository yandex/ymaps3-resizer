import { CustomVuefyOptions } from "@yandex/ymaps3-types/modules/vuefy";
import { YMapResizer } from "../YMapResizer";

export const YMapResizerVuefyOptions: CustomVuefyOptions<YMapResizer> = {
    props: {
        direction: {
            validator(value: string) {
              return ['both', 'vertical', 'horizontal'].includes(value)
            }
        },
        minWidth: Number,
        maxWidth: Number,
        minHeight: Number,
        maxHeight: Number,
        showOnlyOnHover: {
          type: Boolean,
          default: false
        },
    }
};