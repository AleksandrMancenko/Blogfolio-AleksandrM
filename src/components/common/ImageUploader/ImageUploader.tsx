import React, { useState } from 'react';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import styles from './ImageUploader.module.css';

type Props = {
  value?: File | null;
  onChange: (file: File | null) => void;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  maxFileSize?: number; // в байтах
  accept?: string;
};

export default function ImageUploader({
  value,
  onChange,
  required = false,
  error,
  disabled = false,
  maxFileSize = 5 * 1024 * 1024, // 5MB по умолчанию
  accept = 'image/*',
}: Props) {
  const [images, setImages] = useState<ImageListType>(
    value ? [{ dataURL: URL.createObjectURL(value) }] : [],
  );

  const handleChange = (imageList: ImageListType) => {
    setImages(imageList);
    if (imageList.length > 0 && imageList[0].file) {
      onChange(imageList[0].file);
    } else {
      onChange(null);
    }
  };

  // removal handled via onImageRemove from library, local helper is not needed

  const onError = (errors: any) => {
    console.error('Image upload error:', errors);
  };

  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>
        Image {required && <span className={styles.required}>*</span>}
      </label>

      <ImageUploading
        value={images}
        onChange={handleChange}
        onError={onError}
        maxNumber={1}
        acceptType={['jpg', 'jpeg', 'png', 'gif', 'webp']}
        maxFileSize={maxFileSize}
        dataURLKey="dataURL"
      >
        {({ imageList, onImageUpload, onImageRemove, errors, isDragging, dragProps }) => (
          <div className={styles.uploader}>
            {imageList.length === 0 ? (
              <div
                className={`${styles.uploadArea} ${isDragging ? styles.dragging : ''} ${error ? styles.error : ''}`}
                {...dragProps}
              >
                <input
                  type="file"
                  accept={accept}
                  disabled={disabled}
                  className={styles.fileInput}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onImageUpload();
                    }
                  }}
                />
                <div className={styles.uploadContent}>
                  <svg
                    className={styles.uploadIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                      strokeLinecap="round"
                      strokeWidth="2"
                    />
                    <polyline points="17 8 12 3 7 8" strokeLinecap="round" strokeWidth="2" />
                    <line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round" strokeWidth="2" />
                  </svg>
                  <p className={styles.uploadText}>
                    {isDragging
                      ? 'Drop image here'
                      : 'Drag and drop image here, or click to select'}
                  </p>
                  <p className={styles.uploadHint}>
                    Supported: JPG, PNG, GIF, WEBP (max {maxFileSize / 1024 / 1024}MB)
                  </p>
                </div>
              </div>
            ) : (
              <div className={styles.imageContainer}>
                {imageList.map((image, index) => (
                  <div key={index} className={styles.imageWrapper}>
                    <img src={image.dataURL} alt="Upload preview" className={styles.previewImage} />
                    <div className={styles.imageOverlay}>
                      <button
                        type="button"
                        className={styles.editBtn}
                        onClick={onImageUpload}
                        disabled={disabled}
                        title="Change image"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className={styles.removeBtn}
                        onClick={() => onImageRemove(index)}
                        disabled={disabled}
                        title="Remove image"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {errors && (
              <div className={styles.errors}>
                {errors.maxNumber && <span>Only 1 image allowed</span>}
                {errors.acceptType && <span>Invalid file type</span>}
                {errors.maxFileSize && (
                  <span>File size too large (max {maxFileSize / 1024 / 1024}MB)</span>
                )}
              </div>
            )}
          </div>
        )}
      </ImageUploading>

      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
}
