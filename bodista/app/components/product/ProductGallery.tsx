import {Image} from '@shopify/hydrogen'
import type {ProductFragment} from 'storefrontapi.generated'
import styles from './ProductPage.module.css'

type ProductImage = ProductFragment['images']['nodes'][number]

/**
 * Beeldgalerij van de PDP: alle productbeelden recht onder elkaar gestapeld —
 * de galerij-kolom groeit mee en scrollt (het info-blok ernaast blijft sticky).
 * Zelfde warme media-box (aspect-ratio, --color-warm) als de product-cards.
 * Beeld rendert in px via <Image> — conform de styling-regels voor afbeeldingen.
 */
export function ProductGallery({
  images,
  selectedVariantImage,
  title,
}: {
  images: ProductImage[]
  selectedVariantImage?: NonNullable<
    ProductFragment['selectedOrFirstAvailableVariant']
  >['image']
  title: string
}) {
  // Val terug op het variant-beeld als er geen product-images zijn.
  const gallery: ProductImage[] = images.length
    ? images
    : selectedVariantImage
      ? [selectedVariantImage as ProductImage]
      : []

  if (!gallery.length) {
    return <div className={styles.gallery} />
  }

  return (
    <div className={styles.gallery}>
      {gallery.map((img, index) =>
        img ? (
          <div key={img.id ?? index} className={styles.galleryMain}>
            <Image
              data={img}
              alt={img.altText || title}
              aspectRatio="4/5"
              sizes="(min-width: 768px) 50vw, 100vw"
              className={styles.galleryImage}
            />
          </div>
        ) : null,
      )}
    </div>
  )
}
