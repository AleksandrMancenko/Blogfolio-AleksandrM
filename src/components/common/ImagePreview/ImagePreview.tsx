import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './ImagePreview.module.css';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  close as closePreview,
  next as nextImage,
  prev as prevImage,
  selectPreview,
} from '../../../features/preview/previewSlice';

export default function ImagePreview() {
  const dispatch = useAppDispatch();
  const { open: isOpen, images, index, href } = useAppSelector(selectPreview);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') dispatch(closePreview());
      if (e.key === 'ArrowRight') dispatch(nextImage());
      if (e.key === 'ArrowLeft') dispatch(prevImage());
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, dispatch]);

  if (!isOpen || images.length === 0) return null;

  const content = (
    <div className={styles.backdrop} onClick={() => dispatch(closePreview())}>
      <figure className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.close}
          aria-label="Close"
          onClick={() => dispatch(closePreview())}
        >
          <svg
            viewBox="0 0 24 24"
            className={styles.closeIcon}
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M6 6L18 18M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        {images.length > 1 && (
          <>
            <button
              className={`${styles.ctrl} ${styles.prev}`}
              aria-label="Previous"
              onClick={() => dispatch(prevImage())}
            />
            <button
              className={`${styles.ctrl} ${styles.next}`}
              aria-label="Next"
              onClick={() => dispatch(nextImage())}
            />
            <figcaption className={styles.counter}>
              {index + 1} / {images.length}
            </figcaption>
          </>
        )}
        {href ? (
          <Link
            to={href}
            onClick={() => dispatch(closePreview())}
            className={styles.imgLink}
            aria-label="Open post"
          >
            <img src={images[index]} alt="" className={styles.img} />
          </Link>
        ) : (
          <img src={images[index]} alt="" className={styles.img} />
        )}
      </figure>
    </div>
  );

  return createPortal(content, document.body);
}
