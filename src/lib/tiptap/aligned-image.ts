import { Node, mergeAttributes } from "@tiptap/core";

export type ImageAlign = "left" | "center" | "right" | "full";

const IMAGE_ALIGNMENTS: ReadonlyArray<ImageAlign> = [
    "left",
    "center",
    "right",
    "full",
];

const isImageAlign = (value: string | null | undefined): value is ImageAlign => {
    return !!value && IMAGE_ALIGNMENTS.includes(value as ImageAlign);
};

const readImageAlignment = (element: HTMLElement): ImageAlign => {
    const dataAlign = element.getAttribute("data-align");
    if (isImageAlign(dataAlign)) {
        return dataAlign;
    }

    if (element.classList.contains("editor-image--left")) {
        return "left";
    }

    if (element.classList.contains("editor-image--right")) {
        return "right";
    }

    if (element.classList.contains("editor-image--full")) {
        return "full";
    }

    return "center";
};

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        image: {
            setImage: (options: {
                src: string;
                alt?: string;
                title?: string;
                align?: ImageAlign;
            }) => ReturnType;
            setImageAlign: (align: ImageAlign) => ReturnType;
        };
    }
}

export const AlignedImage = Node.create({
    name: "image",
    group: "block",
    draggable: true,
    selectable: true,
    atom: true,

    addAttributes() {
        return {
            src: {
                default: null,
            },
            alt: {
                default: null,
            },
            title: {
                default: null,
            },
            align: {
                default: "center",
                parseHTML: (element) => readImageAlignment(element as HTMLElement),
                renderHTML: (attributes) => {
                    const align = isImageAlign(attributes.align)
                        ? attributes.align
                        : "center";
                    return { "data-align": align };
                },
            },
        };
    },

    parseHTML() {
        return [{ tag: "img[src]" }];
    },

    renderHTML({ HTMLAttributes }) {
        const align = isImageAlign(HTMLAttributes.align)
            ? HTMLAttributes.align
            : "center";
        const existingClass =
            typeof HTMLAttributes.class === "string" ? HTMLAttributes.class : "";
        const className = ["editor-image", `editor-image--${align}`, existingClass]
            .filter(Boolean)
            .join(" ");

        return [
            "img",
            mergeAttributes(HTMLAttributes, {
                class: className,
                "data-align": align,
            }),
        ];
    },

    addCommands() {
        return {
            setImage:
                (options) =>
                ({ commands }) => {
                    if (!options.src?.trim()) {
                        return false;
                    }

                    const align = isImageAlign(options.align)
                        ? options.align
                        : "center";

                    return commands.insertContent({
                        type: this.name,
                        attrs: {
                            src: options.src.trim(),
                            alt: options.alt,
                            title: options.title,
                            align,
                        },
                    });
                },
            setImageAlign:
                (align) =>
                ({ commands }) => {
                    if (!isImageAlign(align)) {
                        return false;
                    }

                    return commands.updateAttributes("image", { align });
                },
        };
    },
});
