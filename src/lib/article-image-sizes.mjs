// Markdown images never render wider than the article column, but Astro's
// default `sizes` hint uses the source image's width. Describe the column
// instead so browsers pick the smallest adequate file from `srcset`.
// Desktop: the reading column tops out near 44rem.
// Phones: the page shell is the viewport minus a 1rem gutter on each side.
export const ARTICLE_IMAGE_SIZES =
  "(min-width: 46rem) 44rem, calc(100vw - 2rem)";

// Satteri hast plugin. User plugins run before Astro's image marker, which
// forwards `sizes` to getImage(); getImage() keeps a supplied value.
const articleImageSizesPlugin = {
  name: "article-image-sizes",
  element: {
    filter: ["img"],
    visit(node, context) {
      context.setProperty(node, "sizes", ARTICLE_IMAGE_SIZES);
    },
  },
};

export function articleImageSizes() {
  return {
    name: "article-image-sizes",
    hooks: {
      "astro:config:setup": ({ config }) => {
        config.markdown.processor.options.hastPlugins.push(
          articleImageSizesPlugin,
        );
      },
    },
  };
}
