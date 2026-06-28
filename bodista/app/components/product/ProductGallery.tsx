import {useState} from 'react'
import {Image} from '@shopify/hydrogen'
import type {ProductFragment} from 'storefrontapi.generated'
import styles from './ProductPage.module.css'

type ProductImage = ProductFragment['images']['nodes'][number]

/**
 * Beeldgalerij van de PDP: één groot hoofdbeeld + thumbnails eronder. Zelfde
 * warme media-box (aspect-ratio, --color-warm) als de product-cards, zodat het
 * naadloos bij de rest van de site past. Beeld rendert in px via <Image> —
 * conform de styling-regels voor afbeeldingen.
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
  // Dedupe op id; val terug op het variant-beeld als er geen product-images zijn.
  const gallery: ProductImage[] = images.length
    ? images
    : selectedVariantImage
      ? [selectedVariantImage as ProductImage]
      : []

  const [activeId, setActiveId] = useState<string | null>(
    selectedVariantImage?.id ?? gallery[0]?.id ?? null,
  )

  const active =
    gallery.find((img) => img?.id === activeId) ?? gallery[0] ?? null

  if (!active) {
    return <div className={styles.gallery} />
  }

  return (
    <div className={styles.gallery}>
      <div className={styles.galleryMain}>
        <Image
          data={active}
          alt={active.altText || title}
          aspectRatio="4/5"
          sizes="(min-width: 768px) 50vw, 100vw"
          className={styles.galleryImage}
        />
      </div>

      {gallery.length > 1 && (
        <ul className={styles.thumbs}>
          {gallery.map((img) => {
            if (!img) return null
            const isActive = img.id === active.id
            return (
              <li key={img.id}>
                <button
                  type="button"
                  className={`reset ${styles.thumb} ${
                    isActive ? styles.thumbActive : ''
                  }`}
                  aria-label={`View ${img.altText || title}`}
                  aria-pressed={isActive}
                  onClick={() => setActiveId(img.id ?? null)}
                >
                  <Image
                    data={img}
                    alt={img.altText || title}
                    aspectRatio="1/1"
                    sizes="120px"
                    className={styles.galleryImage}
                  />
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
