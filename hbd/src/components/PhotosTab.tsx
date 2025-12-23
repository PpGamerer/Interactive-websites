import { useState } from 'react';
import '../css/PhotosTab.css';

export interface PhotosImage {
  id: string;
  name: string;
  url: string;
}

export default function PhotosTab({ images }: { images: PhotosImage[] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openModal = (index: number) => {
    setSelectedIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedIndex(null);
  };

  const prevImage = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
  };

  const nextImage = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % images.length);
  };

  return (
    <>
      <div className="gallery-container" role="list" aria-label="รายการรูปภาพ">
        {images.map((img, index) => (
          <button
            key={img.id}
            className="gallery-image-button"
            onClick={() => openModal(index)}
            aria-label={`ดูรูป ${img.name}`}
          >
            <img
              src={img.url}
              alt={img.name}
              className="gallery-image"
              loading="lazy"
              draggable={false}
            />
          </button>
        ))}
      </div>

      {modalOpen && selectedIndex !== null && (
        <div
          className="modal-overlay"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label={`ดูรูป ${images[selectedIndex].name}`}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-button" onClick={closeModal} aria-label="ปิดรูป">
              ✕
            </button>
            <img
              src={images[selectedIndex].url}
              alt={images[selectedIndex].name}
              className="modal-image"
              draggable={false}
            />
            <button className="modal-prev-button" onClick={prevImage} aria-label="รูปก่อนหน้า">
              ←
            </button>
            <button className="modal-next-button" onClick={nextImage} aria-label="รูปถัดไป">
              →
            </button>

            <div className="modal-caption">{images[selectedIndex].name}</div>
          </div>
        </div>
      )}
    </>
  );
}
