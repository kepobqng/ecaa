"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import SplitText from "../components/SplitText/SplitText";

interface Photo {
  id: string;
  data: string;
  fileName: string;
  fileType: string;
  uploadDate: string;
  description: string;
}

interface PendingPhoto {
  id: string;
  data: string;
  fileName: string;
  fileType: string;
  description: string;
}

export default function NextPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [pendingPhotos, setPendingPhotos] = useState<PendingPhoto[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load photos from database on component mount
  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await fetch("/api/photos");
      if (response.ok) {
        const data = await response.json();
        setPhotos(data);
      }
    } catch (error) {
      console.error("Failed to fetch photos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();

        reader.onload = (e) => {
          const photoData = e.target?.result as string;
          const pendingPhoto: PendingPhoto = {
            id: Date.now().toString() + Math.random(),
            data: photoData,
            fileName: file.name,
            fileType: file.type,
            description: "",
          };

          setPendingPhotos((prev) => [...prev, pendingPhoto]);
        };

        reader.readAsDataURL(file);
      }
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const updateDescription = (id: string, description: string) => {
    setPendingPhotos((prev) =>
      prev.map((photo) => (photo.id === id ? { ...photo, description } : photo))
    );
  };

  const removePendingPhoto = (id: string) => {
    setPendingPhotos((prev) => prev.filter((photo) => photo.id !== id));
  };

  const uploadPhoto = async (pendingPhoto: PendingPhoto) => {
    if (!pendingPhoto.description.trim()) {
      alert("Mohon tambahkan deskripsi foto terlebih dahulu!");
      return;
    }

    setIsUploading(true);

    try {
      const response = await fetch("/api/photos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          photoData: pendingPhoto.data,
          fileName: pendingPhoto.fileName,
          fileType: pendingPhoto.fileType,
          description: pendingPhoto.description,
        }),
      });

      if (response.ok) {
        const newPhoto = await response.json();
        setPhotos((prev) => [...prev, newPhoto]);
        setPendingPhotos((prev) =>
          prev.filter((photo) => photo.id !== pendingPhoto.id)
        );
      } else {
        console.error("Failed to save photo");
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = async (id: string) => {
    try {
      const response = await fetch(`/api/photos/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPhotos((prev) => prev.filter((photo) => photo.id !== id));
      } else {
        console.error("Failed to delete photo");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-4 sm:p-6 md:p-8 lg:p-10">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading photos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="text-center max-w-4xl w-full">
        <SplitText
          text="Gallery Foto"
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-center px-4 sm:px-6 md:px-8 mb-6"
          delay={100}
          duration={0.6}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="center"
        />

        {/* Upload Section */}
        <div className="mb-8">
          <div className="flex flex-col items-center space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              onClick={handleUploadClick}
              disabled={isUploading}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 flex items-center space-x-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <span>Pilih Foto</span>
            </button>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              Pilih foto, tambahkan deskripsi, lalu klik upload untuk menyimpan
            </p>
          </div>
        </div>

        {/* Pending Photos Section */}
        {pendingPhotos.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
              Foto yang Belum Diupload ({pendingPhotos.length})
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {pendingPhotos.map((pendingPhoto) => (
                <div
                  key={pendingPhoto.id}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4"
                >
                  <img
                    src={pendingPhoto.data}
                    alt={pendingPhoto.fileName}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />

                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 font-medium truncate">
                      {pendingPhoto.fileName}
                    </p>

                    <textarea
                      value={pendingPhoto.description}
                      onChange={(e) =>
                        updateDescription(pendingPhoto.id, e.target.value)
                      }
                      placeholder="Tambahkan deskripsi foto..."
                      className="w-full p-2 border border-gray-300 rounded-md text-sm resize-none"
                      rows={3}
                    />

                    <div className="flex space-x-2">
                      <button
                        onClick={() => uploadPhoto(pendingPhoto)}
                        disabled={
                          isUploading || !pendingPhoto.description.trim()
                        }
                        className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                      >
                        {isUploading ? "Uploading..." : "Upload"}
                      </button>

                      <button
                        onClick={() => removePendingPhoto(pendingPhoto.id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Photo Gallery */}
        {photos.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
              Foto yang Sudah Diupload ({photos.length})
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <img
                    src={photo.data}
                    alt={photo.fileName}
                    className="w-full h-48 object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-xs truncate">{photo.fileName}</p>
                    <p className="text-xs text-gray-300">
                      {new Date(photo.uploadDate).toLocaleDateString("id-ID")}
                    </p>
                    {photo.description && (
                      <p className="text-xs text-gray-200 mt-1 line-clamp-2">
                        {photo.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removePhoto(photo.id)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    title="Hapus foto"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Database Info */}
            <div className="mt-8 text-center">
              <p className="text-green-600 dark:text-green-400 text-lg leading-relaxed">
                ✅ Foto-foto tersimpan permanen di database! Data tidak akan
                hilang meskipun halaman di-refresh.
              </p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {photos.length === 0 && pendingPhotos.length === 0 && (
          <div className="mb-8">
            <div className="text-center">
              <svg
                className="w-16 h-16 mx-auto text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Belum ada foto yang diupload. Pilih foto dan tambahkan deskripsi
                sekarang!
              </p>
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
          >
            ← Kembali ke Halaman Utama
          </Link>
        </div>
      </div>
    </div>
  );
}
